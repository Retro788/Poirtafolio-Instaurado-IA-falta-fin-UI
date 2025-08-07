import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { URL, fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODELS_FILE = path.resolve(__dirname, "../storage/models.json");
const MODELS_DIR = path.resolve(__dirname, "../storage/downloaded_models");

export interface ModelMeta {
  id: string;
  name: string;
  url: string;
  description?: string;
  size?: string;
  localPath?: string;
  downloaded?: boolean;
}

// Asegurar que el directorio de modelos existe
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

export function listModels(): ModelMeta[] {
  try {
    const data = fs.readFileSync(MODELS_FILE, "utf-8");
    const models = JSON.parse(data) as ModelMeta[];
    
    // Verificar si los modelos están descargados
    return models.map(model => {
      const localPath = path.join(MODELS_DIR, `${model.id}.gguf`);
      const downloaded = fs.existsSync(localPath);
      return {
        ...model,
        localPath: downloaded ? localPath : undefined,
        downloaded
      };
    });
  } catch (error) {
    console.error("Error reading models file:", error);
    return [];
  }
}

export function getModel(id: string): ModelMeta | undefined {
  const models = listModels();
  return models.find(m => m.id === id);
}

export async function downloadModel(id: string, onProgress?: (progress: number) => void): Promise<ModelMeta> {
  const models = listModels();
  const model = models.find(m => m.id === id);
  
  if (!model) {
    throw new Error(`Modelo no encontrado: ${id}`);
  }
  
  const dest = path.join(MODELS_DIR, `${model.id}.gguf`);
  
  // Si ya está descargado, retornarlo
  if (fs.existsSync(dest)) {
    console.log(`Modelo ${id} ya está descargado`);
    return {
      ...model,
      localPath: dest,
      downloaded: true
    };
  }
  
  console.log(`Descargando modelo ${model.name} desde ${model.url}`);
  
  return new Promise((resolve, reject) => {
    const url = new URL(model.url);
    const client = url.protocol === 'https:' ? https : http;
    
    const request = client.get(model.url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Manejar redirecciones
        if (response.headers.location) {
          console.log(`Redirección detectada a: ${response.headers.location}`);
          return downloadFromUrl(response.headers.location, dest, onProgress)
            .then(() => {
              console.log(`Modelo ${id} descargado exitosamente`);
              resolve({ ...model, localPath: dest, downloaded: true });
            })
            .catch(reject);
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Error HTTP: ${response.statusCode}`));
        return;
      }
      
      const totalSize = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedSize = 0;
      
      console.log(`Descarga directa, tamaño: ${totalSize} bytes`);
      
      const fileStream = fs.createWriteStream(dest);
      
      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (onProgress && totalSize > 0) {
          const progress = (downloadedSize / totalSize) * 100;
          onProgress(progress);
        }
      });
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Modelo ${id} descargado exitosamente`);
        resolve({
          ...model,
          localPath: dest,
          downloaded: true
        });
      });
      
      fileStream.on('error', (err) => {
        console.error(`Error escribiendo archivo: ${err}`);
        fs.unlink(dest, () => {}); // Limpiar archivo parcial
        reject(err);
      });
    });
    
    request.on('error', reject);
    request.setTimeout(300000); // 5 minutos timeout
  });
}

async function downloadFromUrl(url: string, dest: string, onProgress?: (progress: number) => void, maxRedirects: number = 5): Promise<void> {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      reject(new Error('Demasiadas redirecciones'));
      return;
    }
    
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const request = client.get(url, (response) => {
      // Manejar redirecciones
      if (response.statusCode === 302 || response.statusCode === 301) {
        if (response.headers.location) {
          console.log(`Siguiendo redirección a: ${response.headers.location}`);
          return downloadFromUrl(response.headers.location, dest, onProgress, maxRedirects - 1)
            .then(resolve)
            .catch(reject);
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Error HTTP: ${response.statusCode}`));
        return;
      }
      
      const totalSize = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedSize = 0;
      
      console.log(`Iniciando descarga, tamaño: ${totalSize} bytes`);
      
      const fileStream = fs.createWriteStream(dest);
      
      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (onProgress && totalSize > 0) {
          const progress = (downloadedSize / totalSize) * 100;
          onProgress(progress);
        }
      });
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Descarga completada: ${dest}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        console.error(`Error escribiendo archivo: ${err}`);
        fs.unlink(dest, () => {}); // Limpiar archivo parcial
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      console.error(`Error de red: ${err}`);
      reject(err);
    });
    request.setTimeout(300000); // 5 minutos timeout
  });
}

export function deleteModel(id: string): boolean {
  const model = getModel(id);
  if (!model || !model.localPath) {
    return false;
  }
  
  try {
    fs.unlinkSync(model.localPath);
    console.log(`Modelo ${id} eliminado`);
    return true;
  } catch (error) {
    console.error(`Error eliminando modelo ${id}:`, error);
    return false;
  }
}

export function getDownloadedModels(): ModelMeta[] {
  return listModels().filter(m => m.downloaded);
}