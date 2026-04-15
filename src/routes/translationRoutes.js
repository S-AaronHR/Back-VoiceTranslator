import express from 'express';
import TranslationService from '../services/translationService.js';

const router = express.Router();

/**
 * GET /api/translation/health
 * Verificar el estado de la conexión con Azure
 */
router.get('/health', async (req, res) => {
  try {
    const languages = await TranslationService.getAvailableLanguages();
    res.json({
      success: true,
      message: 'Conectado a Azure Translator',
      languageCount: languages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'No se pudo conectar a Azure Translator',
      details: error.message
    });
  }
});

/**
 * GET /api/translation/languages
 * Obtener todos los idiomas disponibles
 */
router.get('/languages', async (req, res) => {
  try {
    const languages = await TranslationService.getAvailableLanguages();
    res.json({
      success: true,
      languages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/translation/translate
 * Traducir texto
 * Body: { text, fromLanguage, toLanguage }
 */
router.post('/translate', async (req, res) => {
  try {
    const { text, fromLanguage = 'auto-detect', toLanguage = 'en' } = req.body;

    if (!text || !toLanguage) {
      return res.status(400).json({
        success: false,
        error: 'El texto y el idioma destino son requeridos'
      });
    }

    const result = await TranslationService.translateText(
      text,
      fromLanguage,
      toLanguage
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/translation/swap
 * Intercambiar idiomas
 * Body: { text, currentFrom, currentTo }
 */
router.post('/swap', async (req, res) => {
  try {
    const { text, currentFrom, currentTo } = req.body;

    if (!text || !currentFrom || !currentTo) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren: text, currentFrom y currentTo'
      });
    }

    const result = await TranslationService.swapLanguages(
      text,
      currentFrom,
      currentTo
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
