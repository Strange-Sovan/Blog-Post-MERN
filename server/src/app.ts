import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from './config/passport';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { HttpStatus } from './constants/httpStatus';
import { Messages } from './constants/messages';
import routes from './routes';
import logger from './utils/logger';
import { env } from './config/env';
import { UPLOAD_DIR } from './middleware/uploadThumbnail';

const app = express();

// CORS — must allow credentials and explicit origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Core middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/uploads', express.static(UPLOAD_DIR, { fallthrough: true, maxAge: '7d' }));

// HTTP logging (disabled in test environment for clean output)
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (message: string) => logger.http(message.trim()) },
    })
  );
}

// Passport (stateless OAuth)
app.use(passport.initialize());

// Global rate limiter
app.use('/api', apiLimiter);

// Swagger API Documentation UI
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/v1/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// API routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (_req, res) => {
  res.status(HttpStatus.OK).json({ success: true, message: 'Server is healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: Messages.ROUTE_NOT_FOUND,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
