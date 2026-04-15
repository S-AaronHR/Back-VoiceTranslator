import axios from 'axios';

class SpeechService {
  static async getAuthToken() {
    const speechRegion = process.env.AZURE_SPEECH_REGION || process.env.AZURE_REGION;
    const speechEndpoint =
      (process.env.AZURE_SPEECH_ENDPOINT || '').replace(/\/$/, '') ||
      (speechRegion ? `https://${speechRegion}.api.cognitive.microsoft.com` : '');
    const speechKeys = [
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_KEY_2,
    ].filter(Boolean);

    if (!speechKeys.length || !speechRegion) {
      throw new Error('Faltan variables AZURE_SPEECH_KEY/AZURE_SPEECH_KEY_2 o AZURE_SPEECH_REGION');
    }

    const tokenUrls = [
      `${speechEndpoint}/sts/v1.0/issueToken`,
      `${speechEndpoint}/sts/v1.0/issuetoken`,
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`,
      'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
    ];

    let lastError = null;

    for (const key of speechKeys) {
      for (const tokenUrl of tokenUrls) {
        try {
          const response = await axios.post(tokenUrl, null, {
            headers: {
              'Ocp-Apim-Subscription-Key': key,
              'Ocp-Apim-Subscription-Region': speechRegion,
              'Content-Length': '0',
            },
            timeout: 10000,
          });

          if (typeof response.data === 'string' && response.data.trim()) {
            return {
              token: response.data,
              region: speechRegion,
              expiresInSeconds: 540,
            };
          }
        } catch (error) {
          lastError = error;
        }
      }
    }

    const status = lastError?.response?.status;
    throw new Error(`No se pudo obtener token de Speech (${status || 'sin status'})`);
  }
}

export default SpeechService;
