import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const matrixSchema = z.array(z.array(z.number()));

const statisticsRequestSchema = z.object({
  Q: matrixSchema,
  R: matrixSchema,
});

export const validateStatisticsRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    statisticsRequestSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid request body',
        details: error.errors,
      });
    } else {
      res.status(500).json({
        error: 'Validation error',
      });
    }
  }
};


