import React, { useState, useMemo } from 'react';
import { Hostage, SeverityLevel, SortOption } from '../../types/hostage.types';
import HostageCard from './HostageCard';
import { compareSeverity } from '../../utils/severityHelpers';

interface HostageListProps {
  hostages: Hostage[];
}

const HostageList: React.FC<HostageListProps> = ({ hostages }) => {
  const [filterSeverity, setFilterSeverity] = useState<SeverityLevel | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('severity');
  
  const filteredAndSortedHostages = useMemo(() => {
    let result = [...hostages];
    
    // Apply filter
    if (filterSeverity) {
      result = result.filter(h => h.severity === filterSeverity);
    }
    
    // Apply sort
    result.sort((a, b) => {
      if (sortBy === 'severity') {
        return compareSeverity(a.severity, b.severity);
      } else if (sortBy === 'date') {
        return b.detectedAt.getTime() - a.detectedAt.getTime();
      } else {
        return a.filePath.localeCompare(b.filePath);
      }
    });
    
    return result;
  }, [hostages, filterSeverity, sortBy]);
  
  const severityOptions: (SeverityLevel | null)[] = [null, 'critical', 'high', 'medium', 'low'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Knowledge Hostages ({filteredAndSortedHostages.length})
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1">
            {severityOptions.map(severity => (
              <button
                key={severity || 'all'}
                onClick={() => setFilterSeverity(severity)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filterSeverity === severity
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {severity ? severity.charAt(0).toUpperCase() + severity.slice(1) : 'All'}
              </button>
            ))}
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-md border-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="severity">Sort by Severity</option>
            <option value="date">Sort by Date</option>
            <option value="file">Sort by File</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAndSortedHostages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hostages found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterSeverity
                ? `No ${filterSeverity} severity hostages found.`
                : 'No knowledge hostages detected in the codebase.'}
            </p>
          </div>
        ) : (
          filteredAndSortedHostages.map(hostage => (
            <HostageCard key={hostage.id} hostage={hostage} />
          ))
        )}
      </div>
    </div>
  );
};

export default HostageList;

// Made with Bob
