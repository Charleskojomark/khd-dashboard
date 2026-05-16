import React from 'react';
import { SeverityLevel } from '../../types/hostage.types';
import { severityStyles, getSeverityLabel } from '../../utils/severityHelpers';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${severityStyles[severity]} ${sizeStyles[size]}`}
      role="status"
      aria-label={`Severity level: ${severity}`}
    >
      <span className="w-2 h-2 rounded-full mr-2 bg-current" />
      {getSeverityLabel(severity)}
    </span>
  );
};

export default SeverityBadge;

// Made with Bob
