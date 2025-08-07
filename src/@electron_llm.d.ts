declare module "@electron/llm" {
  export type LanguageModelPromptRole = "assistant" | "user" | "system";
  export type LanguageModelPromptType = "text" | string;
  export interface LanguageModelPrompt {
    role: LanguageModelPromptRole;
    type: LanguageModelPromptType;
    content: string;
  }
  export interface LanguageModelCreateOptions {
    modelAlias?: string;
    systemPrompt?: string;
    topK?: number;
    temperature?: number;
    initialPrompts?: LanguageModelPrompt[];
  }
  export function create(options: LanguageModelCreateOptions): Promise<void>;
  export function destroy(): Promise<void>;
}
