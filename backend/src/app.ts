import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth';
import posesRouter from './routes/poses';
import programsRouter from './routes/programs';
import enrollmentsRouter from './routes/enrollments';
import articlesRouter from './routes/articles';
import eventsRouter from './routes/events';
import sessionsRouter from './routes/sessions';
import dashboardRouter from './routes/dashboard';
import goalsRouter from './routes/goals';
import plannerRouter from './routes/planner';
import adminRouter from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

// Security / Middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));

// Auth rate limiter to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { message: 'Too many requests from this IP, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'YogaLife API' });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/poses', posesRouter);
app.use('/api/programs', programsRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/planner', plannerRouter);
app.use('/api/admin', adminRouter);

// Centralized Error Handler
app.use(errorHandler);

export default app;
