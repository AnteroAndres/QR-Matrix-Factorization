import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { MatrixInput } from './components/MatrixInput';
import { MatrixDisplay } from './components/MatrixDisplay';
import { Statistics } from './components/Statistics';
import { LogOut } from 'lucide-react';
import { matrixService } from './services/api.service';
import { QRFactorizationResponse } from './types/matrix.types';
import toast from 'react-hot-toast';

function App() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [result, setResult] = useState<QRFactorizationResponse | null>(null);
  const [calculating, setCalculating] = useState(false);

  const handleCalculate = async (matrix: number[][]) => {
    setCalculating(true);
    try {
      const response = await matrixService.calculateQR(matrix);
      setResult(response);
      toast.success('QR factorization calculated successfully!');
    } catch (error) {
      console.error('Error calculating QR:', error);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            QR Matrix Factorization
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MatrixInput onCalculate={handleCalculate} loading={calculating} />
          {result && <Statistics statistics={result.statistics} />}
        </div>

        {result && (
          <div className="mt-6">
            <MatrixDisplay
              original={result.original}
              Q={result.Q}
              R={result.R}
              statistics={result.statistics}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;



