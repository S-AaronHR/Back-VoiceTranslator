export const AZURE_CONFIG = {
  apiKey: process.env.AZURE_API_KEY,
  region: process.env.AZURE_REGION || 'westus2',
  endpoint: 'https://api.cognitive.microsofttranslator.com',
  apiVersion: '3.0'
};

// Función para obtener headers actualizados
export function getAzureHeaders() {
  return {
    'Ocp-Apim-Subscription-Key': process.env.AZURE_API_KEY || AZURE_CONFIG.apiKey,
    'Ocp-Apim-Subscription-Region': process.env.AZURE_REGION || AZURE_CONFIG.region,
    'Content-Type': 'application/json'
  };
}
