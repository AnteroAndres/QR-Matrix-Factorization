import { StatisticsRequest, StatisticsResponse } from '../models/matrix.model';
import { calculateStatistics } from '../utils/matrixUtils';

export class StatisticsService {

  calculate(request: StatisticsRequest): StatisticsResponse {
    const { Q, R } = request;
    return calculateStatistics(Q, R);
  }
}


