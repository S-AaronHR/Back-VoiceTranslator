import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import translationRoutes from './routes/translationRoutes.js';
import speechRoutes from './routes/speechRoutes.js';

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || '*';
const morganFormat = process.env.MORGAN_FORMAT || 'dev';
const jsonBodyLimit = process.env.JSON_BODY_LIMIT || '1mb';

app.use(
  cors(
    corsOrigin === '*'
      ? undefined
      : {
          origin: corsOrigin.split(',').map((origin) => origin.trim()),
        },
  ),
);
app.use(helmet());
app.use(express.json({ limit: jsonBodyLimit }));
app.use(morgan(morganFormat));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor Express funcionando'
  });
});

// Rutas de traducción
app.use('/api/translation', translationRoutes);
app.use('/api/speech', speechRoutes);

export default app;