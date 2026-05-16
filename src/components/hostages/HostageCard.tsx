import React, { useState } from 'react';
import { Hostage } from '../../types/hostage.types';
import SeverityBadge from './SeverityBadge';
import HostageDetails from './HostageDetails';
import Badge from '../common/Badge';

interface HostageCardProps {
  hostage: Hostage;
}

const HostageCard: React.FC<HostageCardProps> = ({ hostage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="group animate-slide-up">
      {/* Subtle glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
      
      {/* Card */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-xl transition-all duration-300 hover:bg-white/90"
          aria-expanded={isExpanded}
          aria-controls={`hostage-details-${hostage.id}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <SeverityBadge severity={hostage.severity} />
                {hostage.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
                {hostage.tags.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{hostage.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {hostage.functionName}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-mono text-xs">
                  {hostage.filePath}
                  {hostage.lineNumber && `:${hostage.lineNumber}`}
                </span>
              </div>
              
              <p className={`text-gray-700 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
                {hostage.explanation}
              </p>
              
              {!isExpanded && hostage.businessCost && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-red-700">
                    Risk: {hostage.businessCost}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <div className={`p-2 rounded-lg bg-gray-100 group-hover:bg-blue-50 transition-colors ${isExpanded ? 'rotate-180' : ''} transform transition-transform duration-300`}>
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </button>
        
        {isExpanded && (
          <div id={`hostage-details-${hostage.id}`} className="animate-fade-in">
            <HostageDetails hostage={hostage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HostageCard;

// Made with Bob
