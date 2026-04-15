import axios from 'axios';
import { AZURE_CONFIG, getAzureHeaders } from '../config/azure.js';

class TranslationService {
  /**
   * Obtener los idiomas disponibles en Azure Translator
   */
  static async getAvailableLanguages() {
    try {
      const url = `${AZURE_CONFIG.endpoint}/languages?api-version=${AZURE_CONFIG.apiVersion}`;
      const response = await axios.get(url);
      
      // Transformar los datos para obtener solo los idiomas de traducción
      const translationLanguages = response.data.translation || {};
      
      const languages = Object.entries(translationLanguages).map(([code, data]) => ({
        code,
        name: data.name,
        nativeName: data.nativeName
      }));

      // Agregar opción de detección automática al inicio
      const languagesWithAuto = [
        {
          code: 'auto-detect',
          name: 'Auto Detect',
          nativeName: 'Detección Automática'
        },
        ...languages
      ];

      return languagesWithAuto;
    } catch (error) {
      console.error('Error obteniendo idiomas:', error.message);
      throw new Error('No se pudieron obtener los idiomas disponibles');
    }
  }

  /**
   * Traducir texto
   * @param {string} text - Texto a traducir
   * @param {string} fromLanguage - Código del idioma de origen (use 'auto-detect' o code específico)
   * @param {string} toLanguage - Código del idioma destino
   */
  static async translateText(text, fromLanguage = 'auto-detect', toLanguage = 'en') {
    try {
      // Convertir 'auto-detect' al parámetro que espera Azure
      const from = fromLanguage === 'auto-detect' ? '' : fromLanguage;
      
      const params = {
        'api-version': AZURE_CONFIG.apiVersion,
        'to': toLanguage
      };

      // Solo agregar 'from' si no es detección automática
      if (from) {
        params.from = from;
      }

      const url = `${AZURE_CONFIG.endpoint}/translate`;
      
      // Usar headers dinámicos para obtener la API Key actualizada
      const response = await axios.post(url, [{ Text: text }], {
        params,
        headers: getAzureHeaders()
      });

      return {
        originalText: text,
        translatedText: response.data[0]?.translations[0]?.text || '',
        detectedLanguage: response.data[0]?.detectedLanguage?.language || null,
        sourceLanguage: from || response.data[0]?.detectedLanguage?.language,
        targetLanguage: toLanguage
      };
    } catch (error) {
      console.error('Error en traducción:', error.response?.status, error.response?.statusText, error.message);
      throw new Error('Error al traducir el texto');
    }
  }

  /**
   * Intercambiar idiomas (swap)
   * @param {string} text - Texto actual
   * @param {string} currentFrom - Idioma actual de origen
   * @param {string} currentTo - Idioma actual destino
   */
  static async swapLanguages(text, currentFrom, currentTo) {
    try {
      // Si fue detección automática, usamos el idioma detectado
      let newFrom = currentTo;
      let newTo = currentFrom === 'auto-detect' ? 'auto-detect' : currentFrom;

      // Traducir de newFrom a newTo
      const result = await this.translateText(text, newFrom, newTo);
      
      return result;
    } catch (error) {
      console.error('Error en intercambio de idiomas:', error.message);
      throw new Error('Error al intercambiar idiomas');
    }
  }
}

export default TranslationService;
