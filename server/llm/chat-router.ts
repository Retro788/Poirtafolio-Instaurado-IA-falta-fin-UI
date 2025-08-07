import { Router, Request, Response } from "express";
import { listModels, downloadModel, getModel } from "../models/index.js";
import { getLlama, LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import path from "path";

export const ChatRouter = Router();

// Cache de modelos cargados
const modelCache = new Map<string, { model: LlamaModel; context: LlamaContext; session: LlamaChatSession }>();

// Interfaz para las opciones del LLM (compatible con tu UI)
export interface LlmOptions {
  modelAlias: string;
  systemPrompt: string;
  initialPrompts: { role: "user" | "assistant"; content: string }[];
  topK: number;
  temperature: number;
}

// Listar modelos disponibles
ChatRouter.get("/models", (_req: Request, res: Response) => {
  try {
    const models = listModels();
    res.json(models);
  } catch (error) {
    console.error("Error listing models:", error);
    res.status(500).json({ error: "Error al listar modelos" });
  }
});

// Descargar un modelo específico
ChatRouter.post("/models/:id/download", async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Configurar SSE para progreso de descarga
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    const model = await downloadModel(id, (progress) => {
      res.write(`data: ${JSON.stringify({ type: "progress", progress: Math.round(progress) })}\n\n`);
    });
    
    res.write(`data: ${JSON.stringify({ type: "complete", model })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error(`Error downloading model ${id}:`, error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || 'Error desconocido' });
    } else {
      res.write(`data: ${JSON.stringify({ type: "error", error: error?.message || 'Error desconocido' })}\n\n`);
      res.end();
    }
  }
});

// Cargar modelo en memoria
async function loadModel(modelId: string): Promise<{ model: LlamaModel; context: LlamaContext; session: LlamaChatSession }> {
  // Verificar cache
  if (modelCache.has(modelId)) {
    console.log(`Usando modelo ${modelId} desde cache`);
    return modelCache.get(modelId)!;
  }
  
  const modelMeta = getModel(modelId);
  if (!modelMeta || !modelMeta.localPath) {
    throw new Error(`Modelo ${modelId} no encontrado o no descargado`);
  }
  
  console.log(`Cargando modelo ${modelId} desde ${modelMeta.localPath}`);
  
  try {
    const llama = await getLlama();
    
    const model = await llama.loadModel({
      modelPath: modelMeta.localPath,
    });
    
    const context = await model.createContext({
      contextSize: 4096, // Ajustable según necesidades
    });
    
    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    });
    
    const result = { model, context, session };
    modelCache.set(modelId, result);
    
    console.log(`Modelo ${modelId} cargado exitosamente`);
    return result;
  } catch (error: any) {
    console.error(`Error cargando modelo ${modelId}:`, error);
    throw new Error(`Error al cargar modelo: ${error?.message || 'Error desconocido'}`);
  }
}

// Función para crear una nueva sesión con system prompt
async function createSessionWithSystemPrompt(model: LlamaModel, context: LlamaContext, systemPrompt: string): Promise<LlamaChatSession> {
  // Crear una nueva secuencia para esta sesión
  const sequence = context.getSequence();
  const session = new LlamaChatSession({
    contextSequence: sequence,
    systemPrompt: systemPrompt
  });
  return session;
}

// Endpoint principal de chat con streaming
ChatRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { modelAlias, systemPrompt, initialPrompts, topK, temperature } = req.body as LlmOptions;
    
    console.log(`[Chat] Iniciando chat con modelo: ${modelAlias}`);
    console.log(`[Chat] System prompt: ${systemPrompt ? systemPrompt.substring(0, 100) + '...' : 'No definido'}`);
    console.log(`[Chat] Historial: ${initialPrompts ? initialPrompts.length : 0} mensajes`);
    console.log(`[Chat] Parámetros: topK=${topK}, temperature=${temperature}`);
    
    if (!modelAlias || !systemPrompt || !Array.isArray(initialPrompts)) {
      return res.status(400).json({ 
        error: "Se requieren modelAlias, systemPrompt e initialPrompts" 
      });
    }
    
    // Configurar headers para Server-Sent Events
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    
    // Cargar modelo
    const { model } = await loadModel(modelAlias);
    
    // Crear un nuevo contexto para este request
    const context = await model.createContext({
      contextSize: 4096,
    });
    
    // Crear una nueva sesión con system prompt
    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
      systemPrompt: systemPrompt
    });
    
    // Procesar historial de mensajes (excluyendo el último)
    const previousMessages = initialPrompts.slice(0, -1);
    for (const msg of previousMessages) {
      if (msg.role === 'user') {
        // Agregar mensaje del usuario al historial
        await session.prompt(msg.content, { maxTokens: 1 });
      }
    }
    
    // Obtener el último mensaje del usuario
    const lastMessage = initialPrompts[initialPrompts.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return res.status(400).json({ error: "El último mensaje debe ser del usuario" });
    }
    
    console.log(`[Chat] Generando respuesta para: "${lastMessage.content.substring(0, 100)}..."`);
    
    // Generar respuesta con streaming
    const response = await session.prompt(lastMessage.content, {
      temperature: temperature || 0.7,
      topK: topK || 40,
      maxTokens: 2048,
      onTextChunk: (chunk) => {
        // Enviar cada token via SSE
        res.write(`data: ${JSON.stringify({ token: chunk })}\n\n`);
      },
    });
    
    console.log(`[Chat] Respuesta completada`);
    res.write("data: [DONE]\n\n");
    res.end();
    
  } catch (error: any) {
    console.error("[Chat] Error:", error);
    
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || 'Error desconocido' });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: error?.message || 'Error desconocido' })}\n\n`);
      res.end();
    }
  }
});

// Endpoint para obtener estado del modelo
ChatRouter.get("/model/:id/status", (req: Request, res: Response) => {
  const { id } = req.params;
  const model = getModel(id);
  
  if (!model) {
    return res.status(404).json({ error: "Modelo no encontrado" });
  }
  
  const isLoaded = modelCache.has(id);
  
  res.json({
    ...model,
    isLoaded,
    memoryUsage: isLoaded ? "Cargado en memoria" : "No cargado"
  });
});

// Endpoint para descargar modelo de memoria
ChatRouter.delete("/model/:id/unload", async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (modelCache.has(id)) {
    const { model, context } = modelCache.get(id)!;
    
    // Limpiar recursos
    await context.dispose();
    await model.dispose();
    
    modelCache.delete(id);
    
    console.log(`Modelo ${id} descargado de memoria`);
    res.json({ message: `Modelo ${id} descargado de memoria` });
  } else {
    res.status(404).json({ error: "Modelo no está cargado en memoria" });
  }
});

// Limpiar recursos al cerrar
process.on('SIGINT', async () => {
  console.log('Limpiando modelos cargados...');
  for (const [id, { model, context }] of modelCache.entries()) {
    console.log(`Descargando modelo ${id}`);
    await context.dispose();
    await model.dispose();
  }
  modelCache.clear();
  process.exit(0);
});