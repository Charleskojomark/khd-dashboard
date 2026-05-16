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
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/50',
    red: 'from-red-500 to-red-600 shadow-red-500/50',
    green: 'from-green-500 to-green-600 shadow-green-500/50',
    yellow: 'from-yellow-500 to-yellow-600 shadow-yellow-500/50',
  };
  
  const iconBgStyles = {
    blue: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600',
    red: 'bg-gradient-to-br from-red-100 to-red-200 text-red-600',
    green: 'bg-gradient-to-br from-green-100 to-green-200 text-green-600',
    yellow: 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600',
  };
  
  return (
    <div className="group relative animate-fade-in">
      {/* Glow effect on hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorStyles[color]} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
      
      {/* Card content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
          </div>
          {icon && (
            <div className={`p-4 rounded-xl ${iconBgStyles[color]} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
          )}
        </div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorStyles[color]} rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
      </div>
    </div>
  );
};

export default MetricsCard;

// Made with Bob
