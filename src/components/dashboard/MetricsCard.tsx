import React from 'react';

interface MetricsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'red' | 'green' | 'yellow';
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
}) => {
  const colorStyles = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${colorStyles[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;

// Made with Bob
