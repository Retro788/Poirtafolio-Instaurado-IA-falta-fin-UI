// src/components/applications/Clippy/types/interfaces.ts

// Chat y mensajes
export interface ChatRecord {
  id: string;
  createdAt?: number;
  updatedAt?: number;
  preview?: string;
}

export interface MessageRecord {
  id?: string;
  content: string;
  sender?: string;
  createdAt?: number;
}

export interface ChatWithMessages {
  chat: ChatRecord;
  messages: MessageRecord[];
}

// SharedState y DebugState
export interface SharedState {
  settings: Record<string, any>;
  models: Record<string, ManagedModel>;
  [key: string]: any;
}

export interface DebugState { [key: string]: any }

// Versions (SettingsAbout)
export interface Versions {
  clippy?: string;
  electron?: string;
  nodeLlamaCpp?: string;
}

// Exporta también ManagedModel para SettingsModel
export interface ManagedModel {
  name: string;
  size?: number;
  company?: string;
  description?: string;
  homepage?: string;
  downloaded?: boolean;
  imported?: boolean;
  downloadState?: {
    currentBytesPerSecond?: number;
    percentComplete?: number;
  };
}

/**
 * Las mismas vistas que en tu UI (añade o quites según necesites)
 */
export type BubbleView =
  | "hidden"
  | "chat"
  | "chats"
  | "settings"
  | "settings-general"
  | "settings-model"
  | "settings-parameters"
  | "settings-advanced"
  | "settings-about";
