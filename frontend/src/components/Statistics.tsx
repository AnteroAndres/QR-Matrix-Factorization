import { Statistics as StatisticsType } from '../types/matrix.types';
import { TrendingUp, TrendingDown, BarChart3, Sigma } from 'lucide-react';

interface StatisticsProps {
  statistics: StatisticsType;
}

export const Statistics = ({ statistics }: StatisticsProps) => {
  const stats = [
    {
      label: 'Maximum',
      value: statistics.max.toFixed(4),
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Minimum',
      value: statistics.min.toFixed(4),
      icon: TrendingDown,
      color: 'bg-red-500',
    },
    {
      label: 'Average',
      value: statistics.average.toFixed(4),
      icon: BarChart3,
      color: 'bg-blue-500',
    },
    {
      label: 'Sum',
      value: statistics.sum.toFixed(4),
      icon: Sigma,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`${stat.color} p-2 rounded text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Matrix Q is Diagonal
          </h4>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              statistics.isDiagonal.Q
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {statistics.isDiagonal.Q ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Matrix R is Diagonal
          </h4>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              statistics.isDiagonal.R
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {statistics.isDiagonal.R ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
};



