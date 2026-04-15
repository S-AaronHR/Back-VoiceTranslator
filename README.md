# VoiceTranslator Backend

Backend API para VoiceTranslator usando Express.js e integración con Azure Translator.

## Requisitos

- Node.js 16+
- npm o yarn
- Credenciales de Azure Translator API

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Crea un archivo `.env` en la raíz del proyecto (copia desde `.env.example`):
```bash
cp .env.example .env
```

3. Configura tu API Key de Azure en el archivo `.env`:
```
AZURE_API_KEY=tu_api_key_aqui
AZURE_REGION=tu_region_aqui
PORT=3000
```

## Scripts

- **Desarrollo con hot reload:**
```bash
npm run dev
```

- **Producción:**
```bash
npm start
```

## API Endpoints

### 1. Obtener idiomas disponibles

**GET** `/api/translation/languages`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "languages": [
    {
      "code": "auto-detect",
      "name": "Auto Detect",
      "nativeName": "Detección Automática"
    },
    {
      "code": "es",
      "name": "Spanish",
      "nativeName": "Español"
    },
    {
      "code": "en",
      "name": "English",
      "nativeName": "English"
    }
  ]
}
```

### 2. Traducir texto

**POST** `/api/translation/translate`

**Body:**
```json
{
  "text": "Hola, ¿cómo estás?",
  "fromLanguage": "auto-detect",
  "toLanguage": "en"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "originalText": "Hola, ¿cómo estás?",
    "translatedText": "Hello, how are you?",
    "detectedLanguage": "es",
    "sourceLanguage": "es",
    "targetLanguage": "en"
  }
}
```

### 3. Intercambiar idiomas

**POST** `/api/translation/swap`

Intercambia los idiomas de origen y destino, manteniendo el texto traducido como nuevo texto de entrada.

**Body:**
```json
{
  "text": "Hello, how are you?",
  "currentFrom": "en",
  "currentTo": "es"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "originalText": "Hello, how are you?",
    "translatedText": "Hola, ¿cómo estás?",
    "sourceLanguage": "en",
    "targetLanguage": "es"
  }
}
```

## Características

- ✅ **Detección automática de idiomas**: El servicio puede detectar automáticamente el idioma de entrada
- ✅ **Múltiples idiomas**: Usa todos los idiomas soportados por Azure Translator
- ✅ **CORS habilitado**: Compatible con frontend en diferentes puertos
- ✅ **Seguridad**: Implementa Helmet para headers de seguridad
- ✅ **Logging**: Morgan para registrar las peticiones
- ✅ **Validación**: Validación básica de inputs

## Estructura del Proyecto

```
Back/
├── src/
│   ├── config/
│   │   └── azure.js          # Configuración de Azure
│   ├── routes/
│   │   └── translationRoutes.js  # Endpoints de traducción
│   ├── services/
│   │   └── translationService.js # Lógica de traducción
│   ├── app.js               # Configuración de Express
│   └── server.js            # Punto de entrada
├── .env                     # Variables de entorno (NO incluir en Git)
├── .env.example            # Template de variables
├── .gitignore
├── package.json
└── README.md
```

## Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `AZURE_API_KEY` | API Key de Azure Translator | Sí |
| `AZURE_REGION` | Región de Azure (ej: centralindia) | Sí |
| `PORT` | Puerto en el que correr el servidor | No (default: 3000) |

## Errores Comunes

### "No se encontró ningún archivo de declaración para el módulo"
Asegúrate de que la carpeta `node_modules` existe. Ejecuta `npm install`.

### Error de conexión a Azure
- Verifica que `AZURE_API_KEY` sea válida
- Verifica que `AZURE_REGION` sea correcta
- Asegúrate de tener conexión a internet

## Desarrollo

El servidor incluye:
- **Morgan**: Logging de peticiones HTTP
- **Helmet**: Headers de seguridad
- **CORS**: Soporte para peticiones cruzadas
- **Dotenv**: Gestión de variables de entorno

## Seguridad

⚠️ **IMPORTANTE**: Nunca commitees el archivo `.env` con credenciales reales. Siempre usa `.env.example` como template y agrega `.env` a `.gitignore`.

## Contacto

Proyecto desarrollado como parte del curso de Servicios Cloud.
