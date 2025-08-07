import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODELS_DIR = path.resolve(__dirname, "storage/downloaded_models");

const modelUrl = "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf";
const dest = path.join(MODELS_DIR, "septiembre-clippy.gguf");

console.log(`Descargando desde: ${modelUrl}`);
console.log(`Guardando en: ${dest}`);

const request = https.get(modelUrl, (response) => {
  console.log(`Status Code: ${response.statusCode}`);
  console.log(`Headers:`, response.headers);
  
  if (response.statusCode === 302 || response.statusCode === 301) {
    console.log(`Redirección a: ${response.headers.location}`);
    return;
  }
  
  if (response.statusCode !== 200) {
    console.error(`Error HTTP: ${response.statusCode}`);
    return;
  }
  
  const totalSize = parseInt(response.headers['content-length'] || '0', 10);
  let downloadedSize = 0;
  
  console.log(`Tamaño total: ${totalSize} bytes`);
  
  const fileStream = fs.createWriteStream(dest);
  
  response.on('data', (chunk) => {
    downloadedSize += chunk.length;
    const progress = totalSize > 0 ? (downloadedSize / totalSize) * 100 : 0;
    if (downloadedSize % (1024 * 1024) === 0) { // Log cada MB
      console.log(`Descargado: ${downloadedSize} bytes (${progress.toFixed(2)}%)`);
    }
  });
  
  response.pipe(fileStream);
  
  fileStream.on('finish', () => {
    fileStream.close();
    console.log(`✅ Descarga completada: ${dest}`);
    console.log(`Archivo existe: ${fs.existsSync(dest)}`);
    if (fs.existsSync(dest)) {
      const stats = fs.statSync(dest);
      console.log(`Tamaño del archivo: ${stats.size} bytes`);
    }
  });
  
  fileStream.on('error', (err) => {
    console.error(`❌ Error escribiendo archivo:`, err);
    fs.unlink(dest, () => {});
  });
});

request.on('error', (err) => {
  console.error(`❌ Error de red:`, err);
});

request.setTimeout(300000); // 5 minutos timeout

request.on('timeout', () => {
  console.error('❌ Timeout de descarga');
  request.destroy();
});