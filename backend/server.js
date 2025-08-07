import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://tu-portfolio.com'],
  credentials: true
}));
app.use(express.json());

// Variable global para el modelo (se cargará cuando esté disponible)
let llama = null;
let isModelLoading = false;
let modelError = null;

// Función para cargar el modelo (simulada por ahora)
async function loadModel() {
  if (isModelLoading || llama) return;
  
  isModelLoading = true;
  console.log('🔄 Intentando cargar modelo LLM...');
  
  try {
    // Por ahora simulamos la carga del modelo
    // En una implementación real, aquí cargarías node-llama-cpp
    /*
    const { LlamaCpp } = await import('node-llama-cpp');
    const modelPath = join(__dirname, 'models', 'llama-7b-q4_0.gguf');
    
    if (!existsSync(modelPath)) {
      throw new Error(`Modelo no encontrado en: ${modelPath}`);
    }
    
    llama = new LlamaCpp({
      modelPath,
      contextSize: 2048,
      seed: 42
    });
    
    await llama.init();
    */
    
    // Simulación de carga exitosa
    await new Promise(resolve => setTimeout(resolve, 2000));
    llama = { ready: true }; // Mock del modelo
    
    console.log('✅ Modelo LLM cargado exitosamente');
  } catch (error) {
    console.error('❌ Error cargando modelo:', error.message);
    modelError = error.message;
  } finally {
    isModelLoading = false;
  }
}

// Función para generar respuesta (simulada)
async function generateResponse(history, res) {
  console.log('🤖 [Backend] Generating response for history:', history.length, 'messages');
  
  // Obtener el último mensaje del usuario
  const lastUserMessage = history.filter(msg => msg.role === 'user').pop();
  const userText = lastUserMessage?.content || '';
  console.log('💬 [Backend] User message:', userText);
  
  // Simulamos una respuesta de Clippy basada en el mensaje del usuario
  let response;
  if (userText.toLowerCase().includes('hola') || userText.toLowerCase().includes('hello')) {
    response = '¡Hola! Soy Clippy, tu asistente virtual. ¿En qué puedo ayudarte hoy?';
  } else if (userText.toLowerCase().includes('quien eres') || userText.toLowerCase().includes('who are you')) {
    response = 'Soy Clippy, el famoso asistente de Microsoft Office. Estoy aquí para ayudarte con cualquier tarea.';
  } else if (userText.toLowerCase().includes('llama')) {
    response = 'No, no soy Llama. Soy Clippy, tu asistente de confianza desde los días de Office 97.';
  } else {
    response = `Entiendo que me preguntas sobre "${userText}". Como Clippy, estoy aquí para ayudarte con documentos, hojas de cálculo y más. ¿Hay algo específico en lo que pueda asistirte?`;
  }
  
  console.log('📝 [Backend] Generated response:', response);
  const words = response.split(' ');
  console.log('🔤 [Backend] Splitting into', words.length, 'tokens');
  
  // Enviamos cada palabra como un token separado
  for (let i = 0; i < words.length; i++) {
    const token = i === words.length - 1 ? words[i] : words[i] + ' ';
    
    console.log('📤 [Backend] Sending token:', token);
    // Enviamos el token via SSE
    res.write(`data: ${JSON.stringify({ token })}\n\n`);
    
    // Pequeña pausa para simular el streaming
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }
  
  console.log('✅ [Backend] Response completed, sending done event');
  // Señal de finalización
  res.write('event: done\ndata: {}\n\n');
}

// Endpoint principal de chat con streaming
app.post('/api/chat', async (req, res) => {
  console.log('🚀 [Backend] Received chat request');
  
  try {
    const { modelAlias, systemPrompt, initialPrompts, topK, temperature } = req.body;
    console.log('📋 [Backend] Request body:', { 
      modelAlias, 
      systemPrompt: systemPrompt?.substring(0, 50) + '...', 
      initialPromptsLength: initialPrompts?.length,
      topK,
      temperature
    });
    
    if (!modelAlias || !systemPrompt || !Array.isArray(initialPrompts)) {
      console.error('❌ [Backend] Invalid LlmOptions format');
      return res.status(400).json({ error: 'Se requieren modelAlias, systemPrompt e initialPrompts' });
    }
    
    // Construir el historial completo incluyendo el system prompt
    const history = [
      { role: 'system', content: systemPrompt },
      ...initialPrompts
    ];
    
    // Configurar headers para Server-Sent Events
    console.log('📡 [Backend] Setting SSE headers');
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });
    
    // Verificar si el modelo está disponible (simulado)
    if (!llama && !isModelLoading) {
      console.log('🔄 [Backend] Starting model loading simulation');
      loadModel(); // Iniciar carga si no está en proceso
    }
    
    // Para la simulación, asumimos que el modelo está siempre disponible
    console.log('✅ [Backend] Model ready, starting response generation');
    
    // Generar y enviar respuesta
    await generateResponse(history, res);
    
    console.log('🏁 [Backend] Response stream completed');
    res.end();
    
  } catch (error) {
    console.error('❌ [Backend] Error in /api/chat:', error);
    
    if (!res.headersSent) {
      console.log('📤 [Backend] Sending JSON error response');
      res.status(500).json({ error: error.message });
    } else {
      console.log('📤 [Backend] Sending SSE error event');
      res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
      res.end();
    }
  }
});

// Endpoint de estado del modelo
app.get('/api/model/status', (req, res) => {
  res.json({
    loaded: !!llama,
    loading: isModelLoading,
    error: modelError
  });
});

// Endpoints para compatibilidad con el frontend
app.get('/api/state', (req, res) => {
  res.json({
    settings: {
      selectedModel: 'clippy-llm',
      systemPrompt: 'Eres Clippy, el asistente amigable de Microsoft Office.',
      disableAutoUpdate: false
    },
    models: {
      'clippy-llm': {
        name: 'Clippy LLM',
        size: 1000000,
        company: 'Local',
        description: 'Modelo local de Clippy',
        downloaded: true,
        imported: true
      }
    }
  });
});

app.post('/api/state/:key', (req, res) => {
  // Simular actualización de estado
  res.json({ success: true });
});

app.get('/api/debug', (req, res) => {
  res.json({
    enableDragDebug: false,
    debugMode: false
  });
});

app.post('/api/debug/:key', (req, res) => {
  // Simular actualización de debug
  res.json({ success: true });
});

app.get('/api/chats', (req, res) => {
  res.json({});
});

app.get('/api/chats/:id', (req, res) => {
  res.json({
    chat: { id: req.params.id, createdAt: Date.now(), updatedAt: Date.now(), preview: 'Chat' },
    messages: []
  });
});

app.post('/api/chats/:id', (req, res) => {
  res.json({ success: true });
});

app.delete('/api/chats/:id', (req, res) => {
  res.json({ success: true });
});

app.delete('/api/chats', (req, res) => {
  res.json({ success: true });
});

app.get('/api/app/versions', (req, res) => {
  res.json({
    clippy: '1.0.0',
    electron: undefined,
    nodeLlamaCpp: '3.0.0'
  });
});

app.post('/api/app/check-updates', (req, res) => {
  res.json({ success: true });
});

app.post('/api/view/:view', (req, res) => {
  res.json({ success: true });
});

app.post('/api/models/:name', (req, res) => {
  res.json({ success: true });
});

app.delete('/api/models/:name', (req, res) => {
  res.json({ success: true });
});

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    model: {
      loaded: !!llama,
      loading: isModelLoading,
      error: modelError
    }
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor LLM ejecutándose en http://localhost:${port}`);
  console.log(`📡 Endpoint de chat: http://localhost:${port}/api/chat`);
  console.log(`🔍 Estado del modelo: http://localhost:${port}/api/model/status`);
  
  // Intentar cargar el modelo al iniciar
  loadModel();
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servidor...');
  process.exit(0);
});