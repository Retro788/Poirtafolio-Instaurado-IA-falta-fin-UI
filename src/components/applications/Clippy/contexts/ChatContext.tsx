import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { clippyWebApi, LlmOptions } from '../api/clippyWebApi';
import { DEFAULT_SYSTEM_PROMPT } from '../sharedState';

// Variable global para el stream actual
let currentStream: ReadableStream<string> & { cancel(): void } | null = null;

/* ──────────── tipos ──────────── */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

type ClippyNamedStatus =
  | 'welcome'
  | 'idle'
  | 'responding'
  | 'thinking'
  | 'goodbye';

export interface ChatRecord {
  id: string;
  updatedAt: Date;
  preview: string;
  messages: Message[];
}

interface ChatSettings {
  selectedModel: string;
  systemPrompt: string;
  topK: number;
  temperature: number;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (txt: string) => void;
  abortCurrent: () => void;
  animationKey: string;
  status: ClippyNamedStatus;
  setStatus: (status: ClippyNamedStatus) => void;
  setIsChatWindowOpen: (isOpen: boolean) => void;
  isChatWindowOpen: boolean;
  isModelLoaded: boolean;
  chatRecords: Record<string, ChatRecord>;
  currentChatRecord: ChatRecord;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  deleteAllChats: () => void;
  settings: ChatSettings;
  setSettings: (settings: ChatSettings) => void;
  messageCount: number;
  isMessageLimitReached: boolean;
}

/* ──────────── implementación ──────────── */
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [animationKey, setAnimationKey] = useState('Default');
  const [status, setStatus] = useState<ClippyNamedStatus>('welcome');
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [isMessageLimitReached, setIsMessageLimitReached] = useState(false); // Simulamos que el modelo está cargado
  const [chatRecords, setChatRecords] = useState<Record<string, ChatRecord>>({});
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [settings, setSettings] = useState<ChatSettings>({
    selectedModel: 'septiembre-clippy',
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    topK: 40,
    temperature: 0.7
  });

  // Crear un chat inicial si no hay ninguno
  useEffect(() => {
    if (Object.keys(chatRecords).length === 0) {
      const initialChatId = crypto.randomUUID();
      const initialChat: ChatRecord = {
        id: initialChatId,
        updatedAt: new Date(),
        preview: 'New Chat',
        messages: []
      };
      setChatRecords({ [initialChatId]: initialChat });
      setCurrentChatId(initialChatId);
      setMessageCount(0);
      setIsMessageLimitReached(false);
    }
  }, []);

  // Obtener el chat actual
  const currentChatRecord = useMemo(() => {
    if (currentChatId && chatRecords[currentChatId]) {
      return chatRecords[currentChatId];
    }
    // Fallback a un chat vacío si no hay chat actual
    return {
      id: '',
      updatedAt: new Date(),
      preview: '',
      messages: []
    };
  }, [chatRecords, currentChatId]);

  const currentRequestRef = useRef<string | null>(null);
  const currentStreamRef = useRef<(ReadableStream<string> & { cancel(): void }) | null>(null);
  const [isResponding, setIsResponding] = useState(false);

  const sendMessage = async (txt: string) => {
    // Verificar límite de mensajes
    if (messageCount >= 10) {
      return;
    }

    console.log('[ChatContext] Starting sendMessage with text:', txt);
    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, content: txt };
    setMessages((m) => [...m, userMessage]);
    
    // Incrementar contador de mensajes
    const newMessageCount = messageCount + 1;
    setMessageCount(newMessageCount);
    
    // Actualizar el chat actual con el mensaje del usuario
    if (currentChatId) {
      const updatedChat = {
        ...chatRecords[currentChatId],
        updatedAt: new Date(),
        preview: txt,
        messages: [...(chatRecords[currentChatId]?.messages || []), userMessage]
      };
      setChatRecords(prev => ({ ...prev, [currentChatId]: updatedChat }));
    }

    // Cambiar estado a "respondiendo"
    setStatus('thinking');
    setIsResponding(true);
    setAnimationKey('Thinking');

    // Preparar las opciones del LLM según la especificación
    const allMessages = [...messages, userMessage];
    const llmOptions: LlmOptions = {
      modelAlias: settings.selectedModel,
      systemPrompt: settings.systemPrompt,
      initialPrompts: allMessages.map(msg => ({ role: msg.role as "user"|"assistant", content: msg.content })),
      topK: settings.topK,
      temperature: settings.temperature
    };
    console.log('[ChatContext] Prepared LLM options for API:', llmOptions);

    // Obtener el stream del backend
    const stream = clippyWebApi.promptStreaming(llmOptions);
    currentStream = stream;
    currentStreamRef.current = stream;

    // Mostrar mensaje asistente en blanco
    let assistantMsg = { id: crypto.randomUUID(), role: 'assistant' as const, content: '' };
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
      setStatus('idle');
    } catch (err) {
      console.error('Stream error:', err);
      setStatus('idle');
    }
      
    
    // Limpiar referencias
    currentStream = null;
    currentStreamRef.current = null;
    setIsResponding(false);
    setAnimationKey('Default');
    
    // Verificar si se alcanzó el límite después de este mensaje
    if (newMessageCount >= 10) {
      setIsMessageLimitReached(true);
      // Agregar mensaje de límite alcanzado
      const limitMessage = {
        id: crypto.randomUUID(),
        role: 'system' as const,
        content: 'Lamentamos los inconvenientes, has alcanzado el máximo de mensajes para esta muestra'
      };
      setMessages(m => [...m, limitMessage]);
      
      // Actualizar el chat record con todos los mensajes incluyendo el de límite
      if (currentChatId) {
        const updatedChat = {
          ...chatRecords[currentChatId],
          updatedAt: new Date(),
          messages: [...(chatRecords[currentChatId]?.messages || []), userMessage, assistantMsg, limitMessage]
        };
        setChatRecords(prev => ({ ...prev, [currentChatId]: updatedChat }));
      }
    } else {
      // Actualizar el chat record con la respuesta completa
      if (currentChatId) {
        const updatedChat = {
          ...chatRecords[currentChatId],
          updatedAt: new Date(),
          messages: [...(chatRecords[currentChatId]?.messages || []), userMessage, assistantMsg]
        };
        setChatRecords(prev => ({ ...prev, [currentChatId]: updatedChat }));
      }
    }
  };

  const abortCurrent = () => {
    console.log('[ChatContext] Aborting current request');
    if (currentStream) {
      currentStream.cancel();
      currentStream = null;
      setStatus('idle');
      setIsResponding(false);
      setAnimationKey('Default');
      console.log('[ChatContext] Request aborted successfully');
    }
    if (currentRequestRef.current) {
      currentRequestRef.current = null;
      currentStreamRef.current = null;
    }
  };

  const selectChat = (chatId: string) => {
    if (chatRecords[chatId]) {
      setCurrentChatId(chatId);
      setMessages(chatRecords[chatId].messages);
      // Contar mensajes del usuario para este chat
      const userMessageCount = chatRecords[chatId].messages.filter(msg => msg.role === 'user').length;
      setMessageCount(userMessageCount);
      setIsMessageLimitReached(userMessageCount >= 10);
    }
  };

  const deleteChat = (chatId: string) => {
    if (chatRecords[chatId]) {
      const newChatRecords = { ...chatRecords };
      delete newChatRecords[chatId];
      setChatRecords(newChatRecords);
      
      // Si se eliminó el chat actual, seleccionar otro
      if (chatId === currentChatId) {
        const remainingChatIds = Object.keys(newChatRecords);
        if (remainingChatIds.length > 0) {
          selectChat(remainingChatIds[0]);
        } else {
          // Crear un nuevo chat si no queda ninguno
          const newChatId = crypto.randomUUID();
          const newChat: ChatRecord = {
            id: newChatId,
            updatedAt: new Date(),
            preview: 'New Chat',
            messages: []
          };
          setChatRecords({ [newChatId]: newChat });
          setCurrentChatId(newChatId);
          setMessages([]);
        }
      }
    }
  };

  const deleteAllChats = () => {
    setChatRecords({});
    // Crear un nuevo chat después de eliminar todos
    const newChatId = crypto.randomUUID();
    const newChat: ChatRecord = {
      id: newChatId,
      updatedAt: new Date(),
      preview: 'New Chat',
      messages: []
    };
    setChatRecords({ [newChatId]: newChat });
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      sendMessage,
      abortCurrent,
      animationKey,
      status,
      setStatus,
      isChatWindowOpen,
      setIsChatWindowOpen,
      isModelLoaded,
      chatRecords,
      currentChatRecord,
      selectChat,
      deleteChat,
      deleteAllChats,
      settings,
      setSettings,
      messageCount,
      isMessageLimitReached
    }}>
      {children}
    </ChatContext.Provider>
  );
};

/* ──────────── hook público ──────────── */
export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be inside <ChatProvider>');
  return ctx;
}
