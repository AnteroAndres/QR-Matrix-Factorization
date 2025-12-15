import { Router } from 'express';
import { StatisticsController } from '../controllers/statistics.controller';
import { validateStatisticsRequest } from '../middlewares/validation.middleware';

const router = Router();
const statisticsController = new StatisticsController();

router.post(
  '/statistics',
  validateStatisticsRequest,
  statisticsController.calculate
);

export default router;


