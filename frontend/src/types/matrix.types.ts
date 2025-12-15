export type Matrix = number[][];

export interface QRFactorizationResponse {
  original: Matrix;
  Q: Matrix;
  R: Matrix;
  statistics: Statistics;
}

export interface Statistics {
  max: number;
  min: number;
  average: number;
  sum: number;
  isDiagonal: {
    Q: boolean;
    R: boolean;
  };
}

export interface LoginResponse {
  token: string;
}



