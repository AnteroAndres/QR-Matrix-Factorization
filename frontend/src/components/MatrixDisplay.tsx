import { Matrix, Statistics } from '../types/matrix.types';

interface MatrixDisplayProps {
  original: Matrix;
  Q: Matrix;
  R: Matrix;
  statistics: Statistics;
}

export const MatrixDisplay = ({
  original,
  Q,
  R,
  statistics,
}: MatrixDisplayProps) => {
  const renderMatrix = (matrix: Matrix, title: string, isDiagonal: boolean) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">{title}</h4>
        <div className="overflow-x-auto">
          <table className="border-collapse mx-auto">
            <tbody>
              {matrix.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, colIdx) => {
                    const isDiagonalCell = rowIdx === colIdx;
                    return (
                      <td
                        key={colIdx}
                        className={`px-3 py-2 border border-gray-300 text-center ${
                          isDiagonal && isDiagonalCell
                            ? 'bg-yellow-200 font-semibold'
                            : ''
                        }`}
                      >
                        {cell.toFixed(4)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderMatrix(original, 'Original Matrix', false)}
        {renderMatrix(Q, 'Matrix Q', statistics.isDiagonal.Q)}
        {renderMatrix(R, 'Matrix R', statistics.isDiagonal.R)}
      </div>
    </div>
  );
};



