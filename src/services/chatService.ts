export async function listModels(): Promise<Array<{ id: string; name: string }>> {
  const resp = await fetch("http://localhost:5001/api/models");
  return resp.json();
}

export function streamChat(
  modelId: string,
  messages: { role: string; content: string }[],
  onToken: (tok: string) => void
): EventSource {
  const es = new EventSource(
    `http://localhost:5001/api/chat/stream?` +
    new URLSearchParams({
      modelId,
      messages: JSON.stringify(messages),
      temperature: "0.7",
    })
  );
  es.onmessage = evt => {
    const data = JSON.parse(evt.data);
    if (data.token === "[DONE]") {
      es.close();
    } else {
      onToken(data.token);
    }
  };
  es.onerror = () => es.close();
  return es;
}

// Función para compatibilidad con la interfaz existente
export async function promptStreaming(
  options: {
    modelAlias: string;
    systemPrompt: string;
    initialPrompts: { role: string; content: string }[];
    topK?: number;
    temperature?: number;
  },
  onToken: (token: string) => void,
  abortSignal?: AbortSignal
): Promise<void> {
  const response = await fetch('http://localhost:5001/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
    signal: abortSignal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
              onToken(parsed.token);
            }
          } catch (e) {
            // Ignorar líneas que no son JSON válido
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}