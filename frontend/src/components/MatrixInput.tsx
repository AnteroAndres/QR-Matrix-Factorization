import { useState, useEffect, useRef  } from 'react';
import { Plus, Minus, Calculator, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Matrix } from '../types/matrix.types';

interface MatrixInputProps {
  onCalculate: (matrix: Matrix) => void;
  loading?: boolean;
}

export const MatrixInput = ({ onCalculate, loading }: MatrixInputProps) => {
  const [matrix, setMatrix] = useState<Matrix>([
    [12, -51, 4],
    [6, 167, -68],
    [-4, 24, -41],
  ]);

  const isNormalizing = useRef(false);

  useEffect(() => {
    if (matrix.length === 0 || isNormalizing.current) return;
    
    const maxCols = Math.max(...matrix.map(r => r.length));
    const needsNormalization = matrix.some(row => row.length !== maxCols);
    
    if (needsNormalization) {
      isNormalizing.current = true;
      
      const normalized = matrix.map(row => {
        const copy = [...row];
        while (copy.length < maxCols) copy.push(0);
        return copy;
      });
      
      setMatrix(normalized);
      
      setTimeout(() => {
        isNormalizing.current = false;
      }, 0);
    }
  }, [matrix]);
  const [showInfo, setShowInfo] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  const updateMatrix = (row: number, col: number, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isFinite(numValue)) return;

    const newMatrix = matrix.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? numValue : c))
    );
    setMatrix(newMatrix);
  };

  const addRow = () => {
    const cols = matrix[0]?.length || 1;
    const newRow = Array(cols).fill(0);
    const normalized = [...matrix, newRow];
    
    const maxCols = Math.max(...normalized.map(r => r.length));
    const fullyNormalized = normalized.map(row => {
      const copy = [...row];
      while (copy.length < maxCols) copy.push(0);
      return copy;
    });
    
    setMatrix(fullyNormalized);
  };

  const removeRow = () => {
    if (matrix.length > 1) {
      const newMatrix = matrix.slice(0, -1);
      
      const maxCols = Math.max(...newMatrix.map(r => r.length));
      const normalized = newMatrix.map(row => {
        const copy = [...row];
        while (copy.length < maxCols) copy.push(0);
        return copy;
      });
      
      setMatrix(normalized);
    }
  };

  const addCol = () => {
    if (matrix.length === 0) {
      setMatrix([[0]]);
      return;
    }
    const newMatrix = matrix.map((row) => [...row, 0]);
    setMatrix(newMatrix);
  };

  const removeCol = () => {
    const cols = matrix[0]?.length || 0;
    if (cols > 1) {
      const newMatrix = matrix.map((row) => row.slice(0, -1));
      setMatrix(newMatrix);
    }
  };

  const handleCalculate = () => {
    const rows = matrix.length;
    const cols = rows === 0 ? 0 : Math.max(...matrix.map((r) => r.length));

    if (rows === 0 || cols === 0) {
      toast.error('Matriz vacía. Agrega filas o columnas antes de calcular.');
      return;
    }

    if (rows < cols) {
      toast.error('Restricción: el número de filas debe ser mayor o igual al de columnas.');
      return;
    }

    const normalized = matrix.map((r) => {
      const copy = r.slice();
      while (copy.length < cols) copy.push(0);
      return copy;
    });

    // Validate values
    for (let i = 0; i < normalized.length; i++) {
      for (let j = 0; j < normalized[0].length; j++) {
        const v = normalized[i][j];
        if (!isFinite(v)) {
          toast.error('Valores inválidos en la matriz. Revísalos antes de enviar.');
          return;
        }
      }
    }

    // Update matrix state to reflect normalization (so inputs show 0s)
    setMatrix(normalized);

    onCalculate(normalized);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-800">Matrix Input</h3>
          <button
            onClick={() => setShowInfo((s) => !s)}
            className="text-gray-500 hover:text-gray-700"
            title="Info about QR"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        {showInfo && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowInfo(false)}
              aria-hidden
            />
            <div className="absolute mt-20 left-6 w-80 bg-white border border-gray-200 p-3 rounded shadow-md text-sm z-20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">¿Qué es QR?</p>
                  <p className="text-gray-600 text-sm">La factorización QR descompone una matriz A en Q (ortogonal) y R (triangular superior).</p>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                  aria-label="Cerrar info"
                >
                  ✕
                </button>
              </div>
              <p className="font-semibold mt-2">¿Para qué en finanzas?</p>
              <p className="text-gray-600 text-sm">Se usa en regresiones, resolución de sistemas y cálculo eficiente de proyecciones y mínimos cuadrados.</p>
              <p className="font-semibold mt-2">Restricción</p>
              <p className="text-gray-600 text-sm">Debe cumplirse: filas {'>='} columnas.</p>
            </div>
          </>
        )}
        <div className="flex gap-2">
          <button
            onClick={addRow}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
            title="Add Row"
          >
            <Plus className="w-4 h-4" />
            Row
          </button>
          <button
            onClick={removeRow}
            disabled={rows <= 1}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            title="Remove Row"
          >
            <Minus className="w-4 h-4" />
            Row
          </button>
          <button
            onClick={addCol}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
            title="Add Column"
          >
            <Plus className="w-4 h-4" />
            Col
          </button>
          <button
            onClick={removeCol}
            disabled={cols <= 1}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            title="Remove Column"
          >
            <Minus className="w-4 h-4" />
            Col
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExamples((s) => !s)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
            title="Examples"
          >
            Examples
          </button>
          {showExamples && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-md z-30">
              <button
                onClick={() => {
                  setMatrix([
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1],
                  ]);
                  setShowExamples(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                Identidad 3x3
              </button>
              <button
                onClick={() => {
                  setMatrix([
                    [1200, -300, 250],
                    [1500, -400, 300],
                    [800, -200, 150],
                  ]);
                  setShowExamples(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                Datos financieros (ejemplo)
              </button>
              <button
                onClick={() => {
                  const rand = Array.from({ length: 3 }, () =>
                    Array.from({ length: 3 }, () =>
                      parseFloat((Math.random() * 20 - 10).toFixed(4))
                    )
                  );
                  setMatrix(rand);
                  setShowExamples(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                Matriz aleatoria 3x3
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <div className="inline-block">
          <table className="border-collapse">
            <tbody>
              {matrix.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="p-1">
                      <input
                        type="number"
                        step="any"
                        value={cell}
                        onChange={(e) =>
                          updateMatrix(rowIdx, colIdx, e.target.value)
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Calculating...
          </>
        ) : (
          <>
            <Calculator className="w-5 h-5" />
            Calculate QR
          </>
        )}
      </button>
    </div>
  );
};

