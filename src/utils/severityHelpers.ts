import { SeverityLevel } from '../types/hostage.types';

export const severityOrder: Record<SeverityLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const severityColors: Record<SeverityLevel, string> = {
  critical: 'red',
  high: 'orange',
  medium: 'yellow',
  low: 'blue',
};

export const severityStyles: Record<SeverityLevel, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

export const getSeverityLabel = (severity: SeverityLevel): string => {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
};

export const compareSeverity = (a: SeverityLevel, b: SeverityLevel): number => {
  return severityOrder[a] - severityOrder[b];
};

// Made with Bob
