export interface Matrix extends Array<Array<number>> {}

export interface StatisticsRequest {
  Q: Matrix;
  R: Matrix;
}

export interface StatisticsResponse {
  max: number;
  min: number;
  average: number;
  sum: number;
  isDiagonal: {
    Q: boolean;
    R: boolean;
  };
}


