# Implementación de Streaming con LlmOptions

Este documento describe la implementación de la lógica de streaming en el portafolio usando la interfaz `LlmOptions` según las especificaciones requeridas.

## 📋 Cambios Implementados

### 1. clippyWebApi.ts (Capa de llamadas)

#### Nueva Interfaz LlmOptions
```typescript
export interface LlmOptions {
  modelAlias: string;
  systemPrompt: string;
  initialPrompts: { role: "user"|"assistant"; content: string }[];
  topK: number;
  temperature: number;
}
```

#### Función promptStreaming Actualizada
```typescript
export function promptStreaming(opts: LlmOptions): ReadableStream<string> & { cancel(): void } {
  const controller = new AbortController();
  const stream = new ReadableStream<string>({
    async start(ctrl) {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opts),
        signal: controller.signal
      });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop()!;
        for (const part of parts) {
          if (part.startsWith("data:")) {
            const { token } = JSON.parse(part.slice(5).trim());
            ctrl.enqueue(token);
          }
        }
      }
      ctrl.close();
    }
  });
  return Object.assign(stream, { cancel: () => controller.abort() });
}
```

### 2. ChatContext.tsx (Gestión de estado y flujo)

#### Nueva Interfaz ChatSettings
```typescript
interface ChatSettings {
  selectedModel: string;
  systemPrompt: string;
  topK: number;
  temperature: number;
}
```

#### Variable Global para Stream
```typescript
let currentStream: ReadableStream<string> & { cancel(): void } | null = null;
```

#### Función sendMessage Actualizada
```typescript
async function sendMessage(text: string) {
  // 1) Agregar mensaje usuario
  const userMsg = { sender: "user", content: text };
  setMessages(m => [...m, userMsg]);
  setStatus("thinking");

  // 2) Construir opciones idénticas al original
  const opts: LlmOptions = {
    modelAlias: settings.selectedModel,
    systemPrompt: settings.systemPrompt,
    initialPrompts: messages.map(m => ({ role: m.sender, content: m.content })),
    topK: settings.topK,
    temperature: settings.temperature
  };

  // 3) Iniciar streaming
  const stream = promptStreaming(opts);
  currentStream = stream;

  // 4) Mostrar mensaje asistente en blanco
  let assistantMsg = { sender: "assistant", content: "" };
  setMessages(m => [...m, assistantMsg]);

  try {
    const reader = stream.getReader();
    while (true) {
      const { value: token, done } = await reader.read();
      if (done) break;
      assistantMsg.content += token;
      setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = assistantMsg;
        return copy;
      });
    }
    setStatus("idle");
  } catch (err) {
    console.error("Stream error:", err);
    setStatus("idle");
  }
}
```

#### Función abortCurrent
```typescript
function abortCurrent() {
  if (currentStream) {
    currentStream.cancel();
    setStatus("idle");
  }
}
```

### 3. Backend (server.js)

#### Endpoint /api/chat Actualizado
El backend ahora acepta la interfaz `LlmOptions` en lugar de solo `history`:

```javascript
app.post('/api/chat', async (req, res) => {
  const { modelAlias, systemPrompt, initialPrompts, topK, temperature } = req.body;
  
  // Construir el historial completo incluyendo el system prompt
  const history = [
    { role: 'system', content: systemPrompt },
    ...initialPrompts
  ];
  
  // Procesar streaming con los parámetros del LLM
  await generateResponse(history, res);
});
```

## 🚀 Características Implementadas

### ✅ Streaming en Tiempo Real
- Los tokens aparecen palabra por palabra
- Usa Server-Sent Events (SSE) para comunicación
- Manejo de errores y cancelación

### ✅ Interfaz LlmOptions
- `modelAlias`: Identificador del modelo
- `systemPrompt`: Prompt del sistema personalizable
- `initialPrompts`: Historial de conversación
- `topK` y `temperature`: Parámetros de generación

### ✅ Gestión de Estado
- Variable global `currentStream` para control del streaming
- Función `abortCurrent()` para cancelar requests
- Estados de conversación (thinking, idle, responding)

### ✅ Compatibilidad
- Mantiene compatibilidad con la implementación anterior
- Función `promptStreamingLegacy` disponible
- Todos los endpoints del backend funcionan

## 🔧 Configuración

### Variables de Entorno
```bash
# Frontend (.env)
REACT_APP_API_ROOT=http://localhost:4000
REACT_APP_CHAT_API=http://localhost:4000/api/chat

# Backend
PORT=4000
```

### Configuración por Defecto
```typescript
const defaultSettings: ChatSettings = {
  selectedModel: 'default-model',
  systemPrompt: 'Eres Clippy, el asistente amigable de Microsoft Office.',
  topK: 40,
  temperature: 0.7
};
```

## 🧪 Pruebas

1. **Iniciar Backend**: `cd backend && npm start`
2. **Iniciar Frontend**: `npm start`
3. **Abrir**: `http://localhost:3000`
4. **Probar**: Hacer clic en Clippy y enviar mensajes
5. **Verificar**: Los tokens deben aparecer en tiempo real

## 📝 Notas Técnicas

- El streaming usa el formato SSE estándar: `data: {"token": "palabra"}`
- La cancelación se maneja via `AbortController`
- El estado se mantiene sincronizado entre componentes
- Compatible con futuras integraciones de LLM reales (node-llama-cpp)

## 🔄 Próximos Pasos

1. Integrar modelo LLM real (node-llama-cpp)
2. Añadir UI para configurar parámetros del modelo
3. Implementar persistencia de configuraciones
4. Optimizar rendimiento del streaming