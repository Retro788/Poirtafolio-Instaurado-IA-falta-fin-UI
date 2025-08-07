// src/components/applications/Clippy/api/clippyWebApi.ts

import type {
  Versions,
  ChatWithMessages,
  ChatRecord,
  SharedState,
  DebugState,
  BubbleView,
} from "../types/interfaces";

const API_ROOT = process.env.REACT_APP_API_ROOT || "http://localhost:5001";
const CHAT_API = process.env.REACT_APP_CHAT_API || `${API_ROOT}/api/chat`;

export interface Message {
  role: string;
  content: string;
}

export interface LlmOptions {
  modelAlias: string;
  systemPrompt: string;
  initialPrompts: { role: "user"|"assistant"; content: string }[];
  topK: number;
  temperature: number;
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_ROOT}${url}`, init);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function promptStreaming(opts: LlmOptions): ReadableStream<string> & { cancel(): void } {
  const controller = new AbortController();
  const stream = new ReadableStream<string>({
    async start(ctrl) {
      try {
        const res = await fetch(CHAT_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(opts),
          signal: controller.signal
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                ctrl.close();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.token) {
                  ctrl.enqueue(parsed.token);
                }
              } catch (e) {
                // Ignorar líneas que no son JSON válido
              }
            }
          }
        }
        ctrl.close();
      } catch (error) {
        ctrl.error(error);
      }
    }
  });
  return Object.assign(stream, { cancel: () => controller.abort() });
}

// Función de compatibilidad con la implementación anterior
export function promptStreamingLegacy(history: Message[]): ReadableStream<string> & { cancel(): void } {
  console.log('[ClippyAPI] Starting stream with history:', history);
  const controller = new AbortController();
  const { signal } = controller;

  const stream = new ReadableStream<string>({
    async start(ctrl) {
      try {
        const res = await fetch(`${API_ROOT}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history }),
          signal
        });
        console.log('[ClippyAPI] fetch response status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            console.log('[ClippyAPI] Stream done');
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          // parse SSE
          const parts = buffer.split('\n\n');
          buffer = parts.pop()!;
          for (const part of parts) {
            if (part.startsWith('data:')) {
              const json = part.replace(/^data:\s*/, '');
              if (json.trim()) {
                try {
                  const data = JSON.parse(json);
                  console.log('[ClippyAPI] Received token:', data.token);
                  if (data.token) ctrl.enqueue(data.token);
                } catch (e) {
                  console.error('[ClippyAPI] Error parsing JSON:', e, 'Raw:', json);
                }
              }
            } else if (part.startsWith('event: error')) {
              console.error('[ClippyAPI] Server error event:', part);
              ctrl.error(new Error('Server error'));
              return;
            } else if (part.startsWith('event: done')) {
              console.log('[ClippyAPI] Received done event');
              ctrl.close();
              return;
            }
          }
        }
        ctrl.close();
      } catch (err) {
        console.error('[ClippyAPI] Stream error:', err);
        ctrl.error(err as Error);
      }
    }
  });

  return Object.assign(stream, { cancel: () => {
    console.log('[ClippyAPI] Stream cancelled by client');
    controller.abort();
  }});
}

export const clippyWebApi = {
  // Chats
  getChatRecords: () => call<Record<string, ChatRecord>>("/api/chats"),
  getChatWithMessages: (id: string) =>
    call<ChatWithMessages>(`/api/chats/${encodeURIComponent(id)}`),
  writeChatWithMessages: (chat: ChatWithMessages) =>
    call<void>(`/api/chats/${encodeURIComponent(chat.chat.id)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chat),
    }),

  // Estado Compartido
  getFullState: () => call<SharedState>("/api/state"),
  setState: (key: string, value: any) =>
    call<void>(`/api/state/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    }),

  // Debug
  getFullDebugState: () => call<DebugState>("/api/debug"),
  setDebugState: (key: string, value: any) =>
    call<void>(`/api/debug/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    }),

  // Modelos
  downloadModelByName: (name: string) =>
    call<void>(`/api/models/${encodeURIComponent(name)}`, { method: "POST" }),
  deleteModelByName: (name: string) =>
    call<void>(`/api/models/${encodeURIComponent(name)}`, {
      method: "DELETE",
    }),

  // Acerca de (Versions)
  getVersions: (): Promise<Versions> =>
    // Si tienes un endpoint real, usa: call<Versions>("/api/app/versions")
    Promise.resolve({
      clippy: undefined,
      electron: undefined,
      nodeLlamaCpp: undefined,
    }),

  // Actualizaciones
  checkForUpdates: () =>
    call<void>("/api/app/check-updates", { method: "POST" }),

  // Vista de burbujas
  setBubbleView: (view: BubbleView) =>
    call<void>(`/api/view/${encodeURIComponent(view)}`, {
      method: "POST",
    }),
  onSetBubbleView: (_cb: (view: BubbleView) => void) => {},
  offSetBubbleView: () => {},

  // Ventana / UI
  toggleChatWindow: () => Promise.resolve(),
  minimizeChatWindow: () => Promise.resolve(),
  maximizeChatWindow: () => Promise.resolve(),
  popupAppMenu: () => Promise.resolve(),

  // Editor de estado
  openStateInEditor: () => Promise.resolve(),
  onStateChanged: (_cb: (s: SharedState) => void) => {},
  offStateChanged: () => {},

  // Debug extras
  openDebugStateInEditor: () => Promise.resolve(),
  onDebugStateChanged: (_cb: (d: DebugState) => void) => {},
  offDebugStateChanged: () => {},
  getDebugInfo: (): Promise<any> => Promise.resolve({}),

  // Model workflow
  updateModelState: () => Promise.resolve(),
  deleteAllModels: () => Promise.resolve(),
  removeModelByName: (_name: string) => Promise.resolve(),
  addModelFromFile: () => Promise.resolve(),

  // Chats extras
  deleteChat: (id: string) =>
    call<void>(`/api/chats/${encodeURIComponent(id)}`, { method: "DELETE" }),
  deleteAllChats: () => call<void>("/api/chats", { method: "DELETE" }),
  onNewChat: (_cb: () => void) => {},
  offNewChat: () => {},

  // Model control (ChatContext)
  create: (_options?: any) => Promise.resolve({}),
  destroy: () => Promise.resolve(),

  // Portapapeles
  clipboardWrite: (_data: any) => Promise.resolve(),

  // Abort y streaming
  abortRequest: (_requestId: string): Promise<void> => Promise.resolve(),
  promptStreaming,
  promptStreamingLegacy
};

// Alias para compatibilidad con import { electronAi }
export const electronAi = clippyWebApi;
