import { Router } from "express";
import { listModels, downloadModel, getModel } from "../models/index.js";
import { getLlama, LlamaChatSession } from "node-llama-cpp";
export const ChatRouter = Router();
const modelCache = new Map();
ChatRouter.get("/models", (_req, res) => {
    try {
        const models = listModels();
        res.json(models);
    }
    catch (error) {
        console.error("Error listing models:", error);
        res.status(500).json({ error: "Error al listar modelos" });
    }
});
ChatRouter.post("/models/:id/download", async (req, res) => {
    const { id } = req.params;
    try {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Access-Control-Allow-Origin", "*");
        const model = await downloadModel(id, (progress) => {
            res.write(`data: ${JSON.stringify({ type: "progress", progress: Math.round(progress) })}\n\n`);
        });
        res.write(`data: ${JSON.stringify({ type: "complete", model })}\n\n`);
        res.end();
    }
    catch (error) {
        console.error(`Error downloading model ${id}:`, error);
        if (!res.headersSent) {
            res.status(500).json({ error: error?.message || 'Error desconocido' });
        }
        else {
            res.write(`data: ${JSON.stringify({ type: "error", error: error?.message || 'Error desconocido' })}\n\n`);
            res.end();
        }
    }
});
async function loadModel(modelId) {
    if (modelCache.has(modelId)) {
        console.log(`Usando modelo ${modelId} desde cache`);
        return modelCache.get(modelId);
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
            contextSize: 4096,
        });
        const session = new LlamaChatSession({
            contextSequence: context.getSequence(),
        });
        const result = { model, context, session };
        modelCache.set(modelId, result);
        console.log(`Modelo ${modelId} cargado exitosamente`);
        return result;
    }
    catch (error) {
        console.error(`Error cargando modelo ${modelId}:`, error);
        throw new Error(`Error al cargar modelo: ${error?.message || 'Error desconocido'}`);
    }
}
async function createSessionWithSystemPrompt(model, context, systemPrompt) {
    const sequence = context.getSequence();
    const session = new LlamaChatSession({
        contextSequence: sequence,
        systemPrompt: systemPrompt
    });
    return session;
}
ChatRouter.post("/", async (req, res) => {
    try {
        const { modelAlias, systemPrompt, initialPrompts, topK, temperature } = req.body;
        console.log(`[Chat] Iniciando chat con modelo: ${modelAlias}`);
        console.log(`[Chat] System prompt: ${systemPrompt ? systemPrompt.substring(0, 100) + '...' : 'No definido'}`);
        console.log(`[Chat] Historial: ${initialPrompts ? initialPrompts.length : 0} mensajes`);
        console.log(`[Chat] Parámetros: topK=${topK}, temperature=${temperature}`);
        console.log('🛰️  Payload final:', JSON.stringify(req.body, null, 2));
        if (!modelAlias || !systemPrompt || !Array.isArray(initialPrompts)) {
            return res.status(400).json({
                error: "Se requieren modelAlias, systemPrompt e initialPrompts"
            });
        }
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
        const { model } = await loadModel(modelAlias);
        const context = await model.createContext({
            contextSize: 4096,
        });
        const session = new LlamaChatSession({
            contextSequence: context.getSequence(),
            systemPrompt: systemPrompt
        });
        const previousMessages = initialPrompts.slice(0, -1);
        for (const message of previousMessages) {
            if (message.role === 'user') {
                await session.prompt(message.content, {
                    maxTokens: 1,
                    onTextChunk: () => { }
                });
            }
        }
        const lastMessage = initialPrompts[initialPrompts.length - 1];
        if (!lastMessage || lastMessage.role !== "user") {
            return res.status(400).json({ error: "El último mensaje debe ser del usuario" });
        }
        console.log(`[Chat] Generando respuesta para: "${lastMessage.content.substring(0, 100)}..."`);
        const response = await session.prompt(lastMessage.content, {
            temperature: temperature || 0.7,
            topK: topK || 40,
            maxTokens: 2048,
            onTextChunk: (chunk) => {
                res.write(`data: ${JSON.stringify({ token: chunk })}\n\n`);
            },
        });
        console.log(`[Chat] Respuesta completada`);
        res.write("data: [DONE]\n\n");
        res.end();
    }
    catch (error) {
        console.error("[Chat] Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: error?.message || 'Error desconocido' });
        }
        else {
            res.write(`event: error\ndata: ${JSON.stringify({ error: error?.message || 'Error desconocido' })}\n\n`);
            res.end();
        }
    }
});
ChatRouter.get("/model/:id/status", (req, res) => {
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
ChatRouter.delete("/model/:id/unload", async (req, res) => {
    const { id } = req.params;
    if (modelCache.has(id)) {
        const { model, context } = modelCache.get(id);
        await context.dispose();
        await model.dispose();
        modelCache.delete(id);
        console.log(`Modelo ${id} descargado de memoria`);
        res.json({ message: `Modelo ${id} descargado de memoria` });
    }
    else {
        res.status(404).json({ error: "Modelo no está cargado en memoria" });
    }
});
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
