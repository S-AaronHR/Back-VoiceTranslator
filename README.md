# 🌐 Voice Translator — Backend API

> API REST que actúa como proxy seguro hacia Azure Cognitive Services, proporcionando traducción de texto y generación de tokens de voz sin exponer claves sensibles al cliente.

## 🧩 Problema que resuelve

La comunicación entre personas que hablan diferentes idiomas es una barrera constante en un mundo globalizado. Las herramientas de traducción existentes a menudo requieren múltiples pasos manuales, no ofrecen soporte de voz integrado, o exponen claves de API directamente en el navegador, generando riesgos de seguridad.

Este backend resuelve el problema de **seguridad y centralización**: protege las credenciales de Azure Cognitive Services actuando como intermediario entre el frontend y los servicios de Microsoft, evitando que las claves de API se expongan en el código del cliente.

## 🎯 Objetivo principal

Proveer una API REST segura, eficiente y fácil de consumir que permita al frontend realizar traducciones de texto en **130+ idiomas** y obtener tokens temporales para servicios de voz (Speech-to-Text y Text-to-Speech), todo sin comprometer la seguridad de las credenciales.

---

## 📑 Tabla de contenido

- [Problema que resuelve](#-problema-que-resuelve)
- [Objetivo principal](#-objetivo-principal)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Guía de instalación](#-guía-de-instalación)
- [Instrucciones de uso](#-instrucciones-de-uso)
- [Funcionalidades](#-funcionalidades)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Despliegue](#-despliegue)
- [Integrantes](#-integrantes)

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **Node.js** | >= 18 | Entorno de ejecución |
| **Express** | 5.1 | Framework HTTP |
| **Axios** | 1.15 | Cliente HTTP para Azure API |
| **CORS** | 2.8 | Control de orígenes cruzados |
| **Helmet** | 8.1 | Headers de seguridad HTTP |
| **Morgan** | 1.10 | Logging de peticiones HTTP |
| **dotenv** | 16.6 | Variables de entorno |
| **Nodemon** | 3.1 | Hot-reload en desarrollo |
| **Azure Translator** | API v3.0 | Servicio de traducción de texto |
| **Azure Speech Services** | — | Tokens para voz (STT/TTS) |

---

## 📁 Arquitectura del proyecto

```
./
├── package.json
├── .gitignore
├── .env                          # Variables de entorno (no versionado)
└── src/
    ├── server.js                 # Punto de entrada — inicia el servidor HTTP
    ├── app.js                    # Configuración de Express (middlewares, rutas, CORS)
    ├── config/
    │   └── azure.js              # Configuración y headers de Azure Translator
    ├── routes/
    │   ├── translationRoutes.js  # Endpoints de traducción e idiomas
    │   └── speechRoutes.js       # Endpoint de token para Azure Speech
    └── services/
        ├── translationService.js # Lógica de negocio: traducción, idiomas, swap
        └── speechService.js      # Lógica de negocio: obtención de token de Speech
```

---

## 📦 Guía de instalación

### Requisitos previos

- **Node.js** >= 18
- **npm** >= 9
- Una suscripción activa de **Azure Cognitive Services** con:
  - Azure Translator (clave de API + región)
  - Azure Speech Services (clave de Speech + región)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
# (o crea el archivo .env manualmente — ver sección siguiente)
```

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# === Servidor ===
PORT=3000                              # Puerto del servidor (default: 3000)
CORS_ORIGIN=*                          # Orígenes permitidos (separados por coma)
MORGAN_FORMAT=dev                      # Formato de logging: dev, combined, short, tiny
JSON_BODY_LIMIT=1mb                    # Límite del body JSON

# === Azure Translator ===
AZURE_API_KEY=tu_clave_de_translator
AZURE_REGION=westus2                   # Región del recurso de Translator

# === Azure Speech Services ===
AZURE_SPEECH_KEY=tu_clave_de_speech
AZURE_SPEECH_KEY_2=tu_clave_secundaria # Opcional — fallback automático
AZURE_SPEECH_REGION=westus2            # Región del recurso de Speech
AZURE_SPEECH_ENDPOINT=                 # Opcional — se genera desde la región
```

---

## 🚀 Instrucciones de uso

```bash
# Desarrollo (con hot-reload usando Nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000` (o el puerto configurado en `.env`).

### Verificar que funciona

```bash
# Health check del servidor
curl http://localhost:3000/health

# Health check de Azure Translator
curl http://localhost:3000/api/translation/health

# Obtener idiomas disponibles
curl http://localhost:3000/api/translation/languages

# Traducir texto
curl -X POST http://localhost:3000/api/translation/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hola mundo", "fromLanguage": "auto-detect", "toLanguage": "en"}'
```

---

## ⚡ Funcionalidades

- **Traducción de texto** — Traduce entre 130+ idiomas usando Azure Translator API v3.0
- **Detección automática de idioma** — Azure detecta el idioma de origen cuando se envía `"auto-detect"`
- **Intercambio de idiomas (Swap)** — Invierte los idiomas de origen/destino y re-traduce en una sola petición
- **Token de Azure Speech** — Genera tokens temporales (~9 min) para que el frontend use Speech-to-Text y Text-to-Speech sin exponer claves
- **Resiliencia en Speech** — Intenta múltiples URLs y claves de Speech para mayor tolerancia a fallos
- **Seguridad** — Helmet para headers seguros, CORS configurable, claves nunca expuestas al cliente
- **Logging** — Morgan con formato configurable para monitorear todas las peticiones HTTP

---

## 📡 Endpoints de la API

### `GET /health`
Health check general del servidor.

### `GET /api/translation/health`
Verifica la conectividad con Azure Translator.

### `GET /api/translation/languages`
Devuelve la lista de idiomas soportados.

### `POST /api/translation/translate`
Traduce texto de un idioma a otro.

| Campo | Tipo | Requerido | Default | Descripción |
|---|---|---|---|---|
| `text` | string | ✅ | — | Texto a traducir |
| `fromLanguage` | string | ❌ | `"auto-detect"` | Idioma de origen |
| `toLanguage` | string | ❌ | `"en"` | Idioma de destino |

### `POST /api/translation/swap`
Intercambia los idiomas y re-traduce.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `text` | string | ✅ | Texto a re-traducir |
| `currentFrom` | string | ✅ | Idioma origen actual |
| `currentTo` | string | ✅ | Idioma destino actual |

### `GET /api/speech/token`
Genera un token temporal de autenticación para Azure Speech Services.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAi...",
    "region": "westus2",
    "expiresInSeconds": 540
  }
}
```

> Todas las respuestas de error siguen el formato: `{ "success": false, "error": "mensaje" }`

---

## 🌍 Despliegue

El backend está preparado para desplegarse en **Render**, **Railway** o cualquier proveedor de Node.js:

1. Configurar las variables de entorno en el panel del proveedor
2. Establecer el comando de inicio: `npm start`
3. Configurar `CORS_ORIGIN` con la URL del frontend en producción:

```env
CORS_ORIGIN=https://tu-frontend.page.app
```

---

## 👥 Integrantes

| Nombre | GitHub |
|---|---|
| Aaron Hernandez | [GitHub](https://github.com/S-AaronHR) |
| Miguel Mejia | [GitHub](https://github.com/AngelMejiaUAQ) |
| Omar Martinez | [GitHub](https://github.com/OmarAguilar43) |
| Mateo Perez | [GitHub](https://github.com/MateoPerez117) |
