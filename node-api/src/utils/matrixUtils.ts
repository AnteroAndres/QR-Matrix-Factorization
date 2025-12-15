import { Matrix } from '../models/matrix.model';

export function isDiagonal(matrix: Matrix, tolerance: number = 1e-10): boolean {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (i !== j && Math.abs(matrix[i][j]) > tolerance) {
        return false;
      }
    }
  }
  return true;
}

export function flattenMatrix(matrix: Matrix): number[] {
  return matrix.flat();
}

export function calculateStatistics(q: Matrix, r: Matrix) {
  const allValues = [...flattenMatrix(q), ...flattenMatrix(r)];

  if (allValues.length === 0) {
    return {
      max: 0,
      min: 0,
      average: 0,
      sum: 0,
      isDiagonal: {
        Q: false,
        R: false,
      },
    };
  }

  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const sum = allValues.reduce((acc, val) => acc + val, 0);
  const average = sum / allValues.length;

  return {
    max,
    min,
    average,
    sum,
    isDiagonal: {
      Q: isDiagonal(q),
      R: isDiagonal(r),
    },
  };
}


