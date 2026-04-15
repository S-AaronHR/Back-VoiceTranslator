import express from 'express';
import SpeechService from '../services/speechService.js';

const router = express.Router();

router.get('/token', async (req, res) => {
  try {
    const tokenData = await SpeechService.getAuthToken();
    res.json({
      success: true,
      data: tokenData,
    });
  } catch (error) {
    console.error('Error obteniendo token de Speech:', error.message);
    res.status(500).json({
      success: false,
      error: 'No se pudo obtener token de Azure Speech',
    });
  }
});

export default router;
