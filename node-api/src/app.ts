import express, { Express } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from './middlewares/auth.middleware';
import statisticsRoutes from './routes/statistics.routes';
import { StatisticsController } from './controllers/statistics.controller';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Health check (no auth required)
const statisticsController = new StatisticsController();
app.get('/health', statisticsController.healthCheck);

// API routes with auth
app.use('/api/v1', authMiddleware, statisticsRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;


