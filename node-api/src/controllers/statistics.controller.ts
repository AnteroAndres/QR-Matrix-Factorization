import { Request, Response } from 'express';
import { StatisticsService } from '../services/statistics.service';

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }

  calculate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { Q, R } = req.body;

      const statistics = this.statisticsService.calculate({ Q, R });

      res.status(200).json(statistics);
    } catch (error) {
      console.error('Error calculating statistics:', error);
      res.status(500).json({
        error: 'Failed to calculate statistics',
      });
    }
  };

  healthCheck = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      status: 'healthy',
      service: 'node-api',
    });
  };
}

