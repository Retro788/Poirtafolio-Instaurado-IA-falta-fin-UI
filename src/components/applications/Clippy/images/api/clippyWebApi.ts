// src/components/applications/Clippy/api/clippyWebApi.ts

// Tipos mínimos para tu API
export interface ChatWithMessages {
    id: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  }
  export interface SharedState { [key: string]: any }
  export interface DebugState  { [key: string]: any }
  export type BubbleView = 'hidden' | 'chat' | 'bubble';
  
  // Prefijo (CRA usará proxy a /api)
  const API_ROOT = '';
  
  async function call<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_ROOT}${url}`, init);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  
  export const clippyWebApi = {
    // Chats
    getChatRecords: () => call<string[]>('/api/chats'),
    getChatWithMessages: (id: string) =>
      call<ChatWithMessages>(`/api/chats/${encodeURIComponent(id)}`),
    writeChatWithMessages: (chat: ChatWithMessages) =>
      call<void>(`/api/chats/${encodeURIComponent(chat.id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chat),
      }),
  
    // Estado Compartido
    getFullState: () => call<SharedState>('/api/state'),
    setState: (key: string, value: any) =>
      call<void>(`/api/state/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      }),
  
    // Debug
    getFullDebugState: () => call<DebugState>('/api/debug'),
    setDebugState: (key: string, value: any) =>
      call<void>(`/api/debug/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      }),
  
    // Modelos
    downloadModelByName: (name: string) =>
      call<void>(`/api/models/${encodeURIComponent(name)}`, { method: 'POST' }),
    deleteModelByName: (name: string) =>
      call<void>(`/api/models/${encodeURIComponent(name)}`, { method: 'DELETE' }),
  
    // App
    getVersions: () => call<string[]>('/api/app/versions'),
    checkForUpdates: () =>
      call<void>('/api/app/check-updates', { method: 'POST' }),
  
    // Vista de burbujas/ventana de chat
    setBubbleView: (view: BubbleView) =>
      call<void>(`/api/view/${encodeURIComponent(view)}`, {
        method: 'POST',
      }),
  };
  