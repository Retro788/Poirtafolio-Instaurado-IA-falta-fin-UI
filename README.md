# 🚀 Portafolio Interactivo con Septiembre.AI

## 📋 Descripción

Este es un portafolio interactivo que incluye un asistente de IA llamado **Septiembre.AI**, creado por el Ing. Fernando San Gabriel (RetroTheDev). El proyecto combina una interfaz de portafolio moderna con capacidades de chat en tiempo real usando modelos LLM locales.

## 🏗️ Arquitectura del Proyecto

### Frontend (React + TypeScript)
- **Puerto**: 3000
- **Tecnologías**: React, TypeScript, CSS personalizado
- **Características**: Interfaz de portafolio, chat con Septiembre.AI, streaming en tiempo real

### Backend LLM (Node.js + Express)
- **Puerto**: 5001
- **Tecnologías**: Node.js, Express, TypeScript, node-llama-cpp
- **Características**: API REST, streaming SSE, gestión de modelos LLM

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **pnpm**
- **Git**
- Al menos **8GB de RAM** para modelos LLM
- **Espacio en disco**: 5-10GB para modelos

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Portafolio-chatUiSolved-main
```

### 2. Configurar el Backend LLM

```bash
# Navegar al directorio del servidor
cd server

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Iniciar el servidor
npm start
```

El servidor backend estará disponible en: `http://localhost:5001`

### 3. Configurar el Frontend

```bash
# Regresar al directorio raíz
cd ..

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

El frontend estará disponible en: `http://localhost:3000`

## 🤖 Gestión de Modelos LLM

### Ubicación de los Modelos

Los modelos LLM se almacenan en:
```
server/storage/downloaded_models/
```

### Modelos Disponibles

El proyecto viene configurado con el modelo **Septiembre Clippy**, que se descarga automáticamente desde Hugging Face:

- **Modelo**: `septiembre-clippy`
- **Fuente**: Hugging Face
- **Tamaño**: ~4GB
- **Formato**: GGUF (cuantizado)

### Descargar Modelos

#### Método 1: Automático (Recomendado)

1. Inicia el backend (`npm start` en `/server`)
2. Abre el frontend (`npm start` en raíz)
3. Haz clic en el asistente Septiembre.AI
4. El modelo se descargará automáticamente al primer uso

#### Método 2: Manual via API

```bash
# Descargar modelo específico
curl -X POST http://localhost:5001/api/chat/models/septiembre-clippy/download

# Verificar modelos disponibles
curl http://localhost:5001/api/chat/models
```

### Agregar Nuevos Modelos

Para agregar nuevos modelos, edita el archivo:
```
server/storage/models.json
```

Ejemplo de configuración:
```json
{
  "models": [
    {
      "id": "nuevo-modelo",
      "name": "Nuevo Modelo",
      "description": "Descripción del modelo",
      "url": "https://huggingface.co/usuario/modelo/resolve/main/modelo.gguf",
      "size": "4.2GB",
      "type": "chat"
    }
  ]
}
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Frontend
REACT_APP_API_ROOT=http://localhost:5001
REACT_APP_CHAT_API=http://localhost:5001/api/chat

# Backend (opcional)
PORT=5001
MODELS_DIR=./storage/downloaded_models
```

### Configuración del Servidor

Edita `server/index.ts` para ajustar:

- **Puerto del servidor**
- **Tamaño del contexto** del modelo
- **Parámetros de generación** (temperature, top_k)
- **Límites de memoria**

### Personalizar Septiembre.AI

El system prompt se puede modificar en:
```
src/components/applications/Clippy/sharedState.ts
```

Cambia la constante `DEFAULT_SYSTEM_PROMPT` para personalizar el comportamiento del asistente.

## 🚀 Scripts Disponibles

### Frontend

```bash
npm start          # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm test           # Ejecutar pruebas
npm run eject      # Exponer configuración de Webpack
```

### Backend

```bash
npm start          # Iniciar servidor (requiere compilación previa)
npm run build      # Compilar TypeScript
npm run dev        # Desarrollo con recarga automática
npm run clean      # Limpiar archivos compilados
```

## 🔍 Estructura del Proyecto

```
Portafolio-chatUiSolved-main/
├── 📁 public/                    # Archivos estáticos
├── 📁 src/                       # Código fuente del frontend
│   ├── 📁 components/
│   │   ├── 📁 applications/
│   │   │   └── 📁 Clippy/        # Componentes de Septiembre.AI
│   │   ├── 📁 os/                # Componentes del sistema operativo
│   │   └── 📁 showcase/          # Componentes del portafolio
│   ├── 📁 services/              # Servicios y APIs
│   └── 📁 assets/                # Recursos (imágenes, fuentes, etc.)
├── 📁 server/                    # Backend LLM
│   ├── 📁 llm/                   # Lógica del chat y LLM
│   ├── 📁 models/                # Gestión de modelos
│   ├── 📁 storage/               # Almacenamiento de modelos y datos
│   │   ├── models.json           # Configuración de modelos
│   │   └── 📁 downloaded_models/ # Modelos descargados
│   └── 📁 dist/                  # Código compilado
├── 📄 package.json               # Dependencias del frontend
├── 📄 .env                       # Variables de entorno
└── 📄 README.md                  # Este archivo
```

## 🧪 Pruebas y Verificación

### Verificar Backend

```bash
# Estado del servidor
curl http://localhost:5001/api/health

# Modelos disponibles
curl http://localhost:5001/api/chat/models

# Probar chat
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "modelAlias": "septiembre-clippy",
    "systemPrompt": "Eres Septiembre.AI",
    "initialPrompts": [{"role": "user", "content": "Hola"}],
    "topK": 40,
    "temperature": 0.7
  }'
```

### Verificar Frontend

1. Abre `http://localhost:3000`
2. Haz clic en el asistente Septiembre.AI
3. Envía un mensaje de prueba
4. Verifica que la respuesta aparezca en streaming

## 🐛 Solución de Problemas

### El modelo no se descarga

1. Verifica la conexión a internet
2. Revisa los logs del servidor: `server/logs/`
3. Verifica espacio en disco disponible
4. Intenta descarga manual via API

### Error de memoria insuficiente

1. Cierra otras aplicaciones
2. Reduce el `contextSize` en `server/llm/chat-router.ts`
3. Usa un modelo más pequeño

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo en puerto 5001
2. Revisa las variables de entorno en `.env`
3. Verifica CORS en el servidor

### Respuestas lentas del modelo

1. Verifica que tienes suficiente RAM
2. Usa un modelo cuantizado más agresivamente
3. Reduce el `contextSize`
4. Considera usar GPU si está disponible

## 📚 Documentación Adicional

- **[STREAMING_IMPLEMENTATION.md](./STREAMING_IMPLEMENTATION.md)**: Detalles técnicos del streaming
- **[README_LLM.md](./README_LLM.md)**: Documentación específica del LLM
- **[server/README.md](./server/README.md)**: Documentación del backend

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Ing. Fernando San Gabriel** (RetroTheDev)
- Estudiante de Ing. Sistemas Computacionales (ITSX)
- Estudiante de Ing. Mecatrónica (UANL)
- IBM Champion nominee
- Google Developers Group Lead
- AWS Community Builder
- Fundador de Hexile Technologies y Connectec

---

¿Necesitas ayuda? ¡Abre un issue o contacta al desarrollador! 🚀