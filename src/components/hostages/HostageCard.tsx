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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
        aria-expanded={isExpanded}
        aria-controls={`hostage-details-${hostage.id}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <SeverityBadge severity={hostage.severity} />
              {hostage.tags.map(tag => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {hostage.functionName}
              <span className="text-sm text-gray-500 font-normal ml-2">
                {hostage.filePath}
                {hostage.lineNumber && `:${hostage.lineNumber}`}
              </span>
            </h3>
            <p className={`text-gray-600 ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {hostage.explanation}
            </p>
          </div>
          <svg
            className={`ml-4 h-5 w-5 text-gray-400 transform transition-transform flex-shrink-0 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isExpanded && (
        <div id={`hostage-details-${hostage.id}`}>
          <HostageDetails hostage={hostage} />
        </div>
      )}
    </div>
  );
};

export default HostageCard;

// Made with Bob
