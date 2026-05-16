import React from 'react';
import { Hostage } from '../../types/hostage.types';
import { Metrics } from '../../types/metrics.types';
import MetricsBar from './MetricsBar';
import HostageList from '../hostages/HostageList';
import LoadingSpinner from '../common/LoadingSpinner';

interface DashboardProps {
  hostages: Hostage[];
  metrics: Metrics;
  loading: boolean;
  error: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  hostages,
  metrics,
  loading,
  error,
}) => {
  if (loading) {
    return <LoadingSpinner size="lg" message="Loading knowledge hostages from Saleor codebase..." />;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <MetricsBar metrics={metrics} />
      <HostageList hostages={hostages} />
    </div>
  );
};

export default Dashboard;

// Made with Bob
