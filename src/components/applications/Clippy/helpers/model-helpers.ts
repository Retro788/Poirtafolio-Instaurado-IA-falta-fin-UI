// src/components/applications/Clippy/helpers/model-helpers.ts
import type { ManagedModel } from "../types/interfaces";

/** ¿Algún modelo está descargando o ya listo? */ 
export function areAnyModelsReadyOrDownloading(models: Record<string, ManagedModel>) { 
  return Object.values(models).some(m => m.downloaded || m.downloadState != null); 
} 

export function isModelDownloading(model?: ManagedModel | null): boolean {
  return !!model?.downloadState && !model?.downloaded;
}

export function isModelReady(model?: ManagedModel | null): boolean {
  return !!model?.downloaded;
}

// Mantenemos las funciones existentes para compatibilidad
export async function loadModels(): Promise<string[]> { return []; }
export async function getDefaultModel(): Promise<{ name: string }> {
  return { name: 'default' };
}