import express from "express";
import cors from "cors";
import { ChatRouter } from "./llm/chat-router.js";
import { listModels } from "./models/index.js";
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Clippy LLM Server'
    });
});
app.use('/api/chat', ChatRouter);
app.get('/api/models', (req, res) => {
    try {
        const models = listModels();
        res.json(models);
    }
    catch (error) {
        console.error('Error listing models:', error);
        res.status(500).json({ error: error?.message || 'Error al listar modelos' });
    }
});
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Clippy LLM Server',
        version: '1.0.0',
        description: 'Servidor HTTP para inferencia LLM con node-llama-cpp',
        features: [
            'Descarga automática de modelos GGUF',
            'Streaming de tokens en tiempo real',
            'Gestión de memoria de modelos',
            'Compatible con interfaz LlmOptions'
        ],
        endpoints: {
            chat: '/api/chat',
            models: '/api/models',
            health: '/health',
            state: '/api/state',
            debug: '/api/debug'
        }
    });
});
app.get('/api/state', (req, res) => {
    res.json({
        initialized: true,
        serverRunning: true,
        timestamp: new Date().toISOString()
    });
});
app.get('/api/debug', (req, res) => {
    res.json({
        debug: true,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    });
});
app.get('/api/state', (req, res) => {
    res.json({
        initialized: true,
        serverRunning: true,
        timestamp: new Date().toISOString()
    });
});
app.get('/api/debug', (req, res) => {
    res.json({
        debug: true,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    });
});
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    if (!res.headersSent) {
        res.status(500).json({
            error: 'Error interno del servidor',
            message: process.env.NODE_ENV === 'development' ? error?.message : undefined
        });
    }
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        path: req.originalUrl
    });
});
app.listen(PORT, () => {
    console.log('🚀 Clippy LLM Server iniciado');
    console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🔗 API disponible en http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log('📋 Modelos disponibles:');
    try {
        const models = listModels();
        models.forEach(model => {
            const status = model.downloaded ? '✅ Descargado' : '⬇️  Disponible para descarga';
            console.log(`   - ${model.name} (${model.id}) - ${status}`);
        });
    }
    catch (error) {
        console.error('   Error al cargar lista de modelos:', error);
    }
    console.log('\n🎯 Para usar con tu frontend:');
    console.log('   1. Cambia REACT_APP_API_ROOT=http://localhost:5001');
    console.log('   2. Reinicia tu frontend');
    console.log('   3. ¡Disfruta del chat con LLM real!');
});
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
