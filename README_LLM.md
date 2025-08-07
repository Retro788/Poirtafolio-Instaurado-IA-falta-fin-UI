# Clippy LLM Integration

## 🎯 Objetivo

Este proyecto integra un servidor LLM local con la interfaz de Clippy, permitiendo conversaciones en tiempo real con streaming de tokens, exactamente como el Clippy original de Microsoft Office.

## 🏗️ Arquitectura

### Frontend (React)
- **UI de Clippy**: Mantiene toda la interfaz visual original
- **ChatContext**: Maneja el estado de mensajes y streaming
- **clippyWebApi.ts**: Capa de servicios que conecta con el backend
- **Streaming en tiempo real**: Usa Server-Sent Events (SSE) para recibir tokens

### Backend (Node.js + Express)
- **Servidor HTTP**: Puerto 4000 por defecto
- **Endpoint /api/chat**: Streaming de respuestas con SSE
- **Compatibilidad**: Endpoints stub para todas las funciones del frontend
- **Preparado para LLM real**: Estructura lista para integrar node-llama-cpp

## 🚀 Instalación y Uso

### 1. Configurar el Backend

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

El servidor estará disponible en `http://localhost:4000`

### 2. Configurar el Frontend

```bash
# En el directorio raíz del proyecto
# El archivo .env ya está configurado con:
# REACT_APP_API_ROOT=http://localhost:4000

# Instalar dependencias (si no están instaladas)
npm install

# Iniciar servidor de desarrollo
npm start
```

El frontend estará disponible en `http://localhost:3000`

## 🔧 Configuración

### Variables de Entorno

- **REACT_APP_API_ROOT**: URL del backend LLM (default: `http://localhost:4000`)
- **PORT**: Puerto del backend (default: `4000`)

### Archivos Clave

- **`.env`**: Configuración del frontend
- **`backend/server.js`**: Servidor principal con endpoints
- **`src/components/applications/Clippy/api/clippyWebApi.ts`**: Cliente API con streaming
- **`src/components/applications/Clippy/contexts/ChatContext.tsx`**: Lógica de chat

## 💬 Funcionalidades

### ✅ Implementado

- **Streaming de tokens en tiempo real**: Los mensajes aparecen palabra por palabra
- **Interfaz completa de Clippy**: Todas las animaciones y UI original
- **Manejo de errores**: Fallback a respuestas locales si el servidor no está disponible
- **Estados de conversación**: Thinking, responding, idle con animaciones correspondientes
- **Historial de chats**: Persistencia local de conversaciones
- **Abort de requests**: Cancelación de respuestas en progreso

### 🔄 Preparado para Expansión

- **Integración con LLM real**: Estructura lista para node-llama-cpp
- **Modelos cuantizados**: Soporte para archivos .gguf
- **Configuración de modelos**: UI para seleccionar y descargar modelos
- **Parámetros de generación**: Temperature, max_tokens, etc.

## 🧪 Testing

### Probar el Streaming

1. Abrir `http://localhost:3000`
2. Hacer clic en Clippy para abrir el chat
3. Escribir un mensaje y presionar Enter
4. Observar cómo la respuesta aparece token por token

### Endpoints de Prueba

```bash
# Estado del modelo
curl http://localhost:4000/api/model/status

# Salud del servidor
curl http://localhost:4000/api/health

# Test de chat (POST)
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"history":[{"role":"user","content":"Hola Clippy"}]}'
```

## 🔮 Próximos Pasos

### Para Integrar un LLM Real

1. **Descargar un modelo cuantizado** (ej: Llama-7B-Q4_0.gguf)
2. **Crear directorio models** en backend/
3. **Descomentar código de node-llama-cpp** en server.js
4. **Configurar ruta del modelo** en la función loadModel()

### Ejemplo de Integración Real

```javascript
// En server.js, reemplazar la simulación:
const { LlamaCpp } = await import('node-llama-cpp');
const modelPath = join(__dirname, 'models', 'llama-7b-q4_0.gguf');

llama = new LlamaCpp({
  modelPath,
  contextSize: 2048,
  seed: 42
});

await llama.init();
```

## 📝 Notas Técnicas

- **SSE vs WebSockets**: Se usa SSE por simplicidad y compatibilidad nativa
- **Fallback graceful**: Si el backend no está disponible, usa respuestas stub
- **Timeout de 30s**: Las requests se cancelan automáticamente
- **CORS habilitado**: Permite conexiones desde localhost:3000
- **Manejo de memoria**: El modelo se carga una vez al iniciar el servidor

## 🐛 Troubleshooting

### El frontend no se conecta al backend
- Verificar que el backend esté corriendo en puerto 4000
- Revisar la variable REACT_APP_API_ROOT en .env
- Reiniciar el servidor de desarrollo de React

### Errores de CORS
- El backend ya tiene CORS habilitado
- Verificar que las URLs coincidan exactamente

### Streaming no funciona
- Verificar que el navegador soporte Server-Sent Events
- Revisar la consola del navegador para errores
- Probar el endpoint /api/chat directamente con curl

---

¡Disfruta chateando con Clippy! 📎✨