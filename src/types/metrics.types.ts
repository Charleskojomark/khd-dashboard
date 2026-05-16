import { ReactNode } from 'react';

export interface Metrics {
  totalHostages: number;
  criticalCount: number;
  docsGenerated: number;
  severityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface MetricsCardData {
  title: string;
  value: number;
  icon?: ReactNode;
  color: 'blue' | 'red' | 'green' | 'yellow';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

// Made with Bob
