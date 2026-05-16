import { useMemo } from 'react';
import { Hostage } from '../types/hostage.types';
import { Metrics } from '../types/metrics.types';

export const useMetrics = (hostages: Hostage[]): Metrics => {
  return useMemo(() => {
    const severityBreakdown = hostages.reduce((acc, hostage) => {
      acc[hostage.severity] = (acc[hostage.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalHostages: hostages.length,
      criticalCount: severityBreakdown.critical || 0,
      docsGenerated: 0, // Mock value - will be updated with real data
      severityBreakdown: {
        critical: severityBreakdown.critical || 0,
        high: severityBreakdown.high || 0,
        medium: severityBreakdown.medium || 0,
        low: severityBreakdown.low || 0,
      },
    };
  }, [hostages]);
};

// Made with Bob
