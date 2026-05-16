# Implementation Guide

This guide provides step-by-step instructions for implementing the Knowledge Hostage Detector dashboard based on the architecture and component specifications.

---

## Prerequisites

Before starting implementation, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Tailwind CSS

---

## Phase 1: Project Setup

### Step 1.1: Initialize Vite Project

```bash
# Create new Vite project with React and TypeScript
npm create vite@latest khd-dashboard -- --template react-ts

# Navigate to project directory
cd khd-dashboard

# Install dependencies
npm install
```

### Step 1.2: Install Tailwind CSS

```bash
# Install Tailwind CSS and dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind configuration
npx tailwindcss init -p
```

### Step 1.3: Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        severity: {
          critical: '#DC2626',
          high: '#EA580C',
          medium: '#CA8A04',
          low: '#2563EB',
        },
      },
    },
  },
  plugins: [],
}
```

Update `src/styles/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
```

### Step 1.4: Update Main Entry Point

Update `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 1.5: Create Project Structure

```bash
# Create directory structure
mkdir -p src/{components/{layout,dashboard,hostages,common},context,hooks,types,data,utils,services,styles}
```

---

## Phase 2: Type Definitions

### Step 2.1: Create Hostage Types

Create `src/types/hostage.types.ts`:

```typescript
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Hostage {
  id: string;
  severity: SeverityLevel;
  filePath: string;
  lineNumber?: number;
  explanation: string;
  recommendedAction: string;
  codeSnippet?: string;
  detectedAt: Date;
  category?: string;
  tags?: string[];
}

export interface HostageFilters {
  severity?: SeverityLevel | null;
  category?: string | null;
  searchTerm?: string;
}

export type SortOption = 'severity' | 'date' | 'file';
```

### Step 2.2: Create Metrics Types

Create `src/types/metrics.types.ts`:

```typescript
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
  icon?: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'yellow';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}
```

---

## Phase 3: Mock Data

### Step 3.1: Create Mock Hostages

Create `src/data/mockHostages.ts`:

```typescript
import { Hostage } from '../types/hostage.types';

export const mockHostages: Hostage[] = [
  {
    id: '1',
    severity: 'critical',
    filePath: 'src/services/payment.service.ts',
    lineNumber: 145,
    explanation: 'Complex payment calculation logic with multiple edge cases is not documented. The formula handles discounts, taxes, and promotional codes but lacks any explanation of the business rules.',
    recommendedAction: 'Create comprehensive documentation explaining the payment calculation formula, including all edge cases and business rules. Add inline comments for complex conditions.',
    codeSnippet: 'const total = calculateWithDiscounts(base, promo) * (1 + taxRate);',
    detectedAt: new Date('2026-05-15'),
    category: 'Business Logic',
    tags: ['payment', 'calculation', 'critical-path']
  },
  {
    id: '2',
    severity: 'high',
    filePath: 'src/utils/validation.ts',
    lineNumber: 78,
    explanation: 'Custom email validation logic that differs from standard RFC 5322. The regex pattern includes specific business rules for allowed domains but these rules are not documented.',
    recommendedAction: 'Document the specific email validation requirements and why they differ from standard validation. List allowed/blocked domains explicitly.',
    codeSnippet: 'const emailRegex = /^[a-zA-Z0-9._%+-]+@(company|partner)\\.com$/;',
    detectedAt: new Date('2026-05-14'),
    category: 'Validation',
    tags: ['email', 'validation', 'security']
  },
  {
    id: '3',
    severity: 'medium',
    filePath: 'src/components/Dashboard/filters.ts',
    lineNumber: 34,
    explanation: 'Date range filtering logic with special handling for fiscal year boundaries. The code adjusts dates based on company fiscal year start but this is not explained.',
    recommendedAction: 'Add documentation explaining fiscal year calculation and why date adjustments are necessary. Include examples of edge cases.',
    codeSnippet: 'const fiscalStart = month < 4 ? year - 1 : year;',
    detectedAt: new Date('2026-05-13'),
    category: 'Date Handling',
    tags: ['dates', 'fiscal-year', 'filtering']
  },
  {
    id: '4',
    severity: 'critical',
    filePath: 'src/api/auth.middleware.ts',
    lineNumber: 92,
    explanation: 'Token refresh logic with undocumented retry mechanism and exponential backoff. The implementation includes special cases for different error types that are not explained.',
    recommendedAction: 'Document the token refresh strategy, retry logic, and error handling approach. Explain why certain errors trigger immediate logout vs retry.',
    codeSnippet: 'if (attempt < 3 && error.code !== "INVALID_TOKEN") { retry(attempt * 2000); }',
    detectedAt: new Date('2026-05-12'),
    category: 'Authentication',
    tags: ['auth', 'security', 'retry-logic']
  },
  {
    id: '5',
    severity: 'low',
    filePath: 'src/utils/formatters.ts',
    lineNumber: 23,
    explanation: 'Currency formatting function with special rounding rules for certain currencies. The logic handles fractional currency units differently but lacks explanation.',
    recommendedAction: 'Add comments explaining the rounding rules for each currency type and why they differ from standard rounding.',
    codeSnippet: 'return currency === "JPY" ? Math.round(amount) : (Math.round(amount * 100) / 100);',
    detectedAt: new Date('2026-05-11'),
    category: 'Formatting',
    tags: ['currency', 'formatting', 'internationalization']
  },
  {
    id: '6',
    severity: 'high',
    filePath: 'src/services/inventory.service.ts',
    lineNumber: 201,
    explanation: 'Stock allocation algorithm that prioritizes certain warehouses based on undocumented business rules. The priority calculation includes factors like distance, stock levels, and customer tier.',
    recommendedAction: 'Document the warehouse prioritization algorithm and the weight given to each factor. Explain how customer tier affects allocation.',
    codeSnippet: 'const priority = (distance * 0.3) + (stockLevel * 0.5) + (customerTier * 0.2);',
    detectedAt: new Date('2026-05-10'),
    category: 'Inventory',
    tags: ['inventory', 'allocation', 'warehouse']
  }
];
```

---

## Phase 4: Utility Functions

### Step 4.1: Create Severity Helpers

Create `src/utils/severityHelpers.ts`:

```typescript
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
```

### Step 4.2: Create Formatters

Create `src/utils/formatters.ts`:

```typescript
export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatFilePath = (path: string, maxLength: number = 50): string => {
  if (path.length <= maxLength) return path;
  
  const parts = path.split('/');
  if (parts.length <= 2) return path;
  
  return `.../${parts.slice(-2).join('/')}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};
```

---

## Phase 5: Common Components

### Step 5.1: Create Button Component

Create `src/components/common/Button.tsx`:

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
```

### Step 5.2: Create Badge Component

Create `src/components/common/Badge.tsx`:

```typescript
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
}) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
```

### Step 5.3: Create LoadingSpinner Component

Create `src/components/common/LoadingSpinner.tsx`:

```typescript
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizes[size]}`} />
      {message && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
```

---

## Phase 6: Hostage Components

### Step 6.1: Create SeverityBadge Component

Create `src/components/hostages/SeverityBadge.tsx`:

```typescript
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
```

### Step 6.2: Create HostageDetails Component

Create `src/components/hostages/HostageDetails.tsx`:

```typescript
import React, { useState } from 'react';
import { Hostage } from '../../types/hostage.types';
import { formatDate, copyToClipboard } from '../../utils/formatters';
import Button from '../common/Button';

interface HostageDetailsProps {
  hostage: Hostage;
}

const HostageDetails: React.FC<HostageDetailsProps> = ({ hostage }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    if (hostage.codeSnippet) {
      const success = await copyToClipboard(hostage.codeSnippet);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };
  
  return (
    <div className="px-6 pb-6 border-t border-gray-200">
      <div className="pt-4 space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Bob's Analysis</h4>
          <p className="text-gray-700 leading-relaxed">{hostage.explanation}</p>
        </div>
        
        {hostage.codeSnippet && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Code Snippet</h4>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>
            <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto border border-gray-200">
              <code className="text-gray-800">{hostage.codeSnippet}</code>
            </pre>
          </div>
        )}
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Recommended Action</h4>
          <p className="text-gray-700 leading-relaxed">{hostage.recommendedAction}</p>
        </div>
        
        <div className="flex items-center justify-between pt-2 text-sm text-gray-500 border-t border-gray-100">
          <span>Detected: {formatDate(hostage.detectedAt)}</span>
          {hostage.category && <span>Category: {hostage.category}</span>}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="primary" size="sm">
            Generate Documentation
          </Button>
          <Button variant="secondary" size="sm">
            Mark as Resolved
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HostageDetails;
```

### Step 6.3: Create HostageCard Component

Create `src/components/hostages/HostageCard.tsx`:

```typescript
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
              {hostage.tags?.map(tag => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {hostage.filePath}
              {hostage.lineNumber && (
                <span className="text-sm text-gray-500 font-normal ml-2">
                  :Line {hostage.lineNumber}
                </span>
              )}
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
```

### Step 6.4: Create HostageList Component

Create `src/components/hostages/HostageList.tsx`:

```typescript
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
```

---

## Phase 7: Dashboard Components

### Step 7.1: Create MetricsCard Component

Create `src/components/dashboard/MetricsCard.tsx`:

```typescript
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
```

### Step 7.2: Create MetricsBar Component

Create `src/components/dashboard/MetricsBar.tsx`:

```typescript
import React from 'react';
import { Metrics } from '../../types/metrics.types';
import MetricsCard from './MetricsCard';

interface MetricsBarProps {
  metrics: Metrics;
}

const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricsCard
        title="Hostages Found"
        value={metrics.totalHostages}
        color="blue"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />
      <MetricsCard
        title="Critical Count"
        value={metrics.criticalCount}
        color="red"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <MetricsCard
        title="Docs Generated"
        value={metrics.docsGenerated}
        color="green"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
    </div>
  );
};

export default MetricsBar;
```

### Step 7.3: Create Dashboard Component

Create `src/components/dashboard/Dashboard.tsx`:

```typescript
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
    return <LoadingSpinner size="lg" message="Loading knowledge hostages..." />;
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
```

---

## Phase 8: Layout Components

### Step 8.1: Create Header Component

Create `src/components/layout/Header.tsx`:

```typescript
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Hostage Detector</h1>
              <p className="text-sm text-gray-600">Powered by IBM Bob</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### Step 8.2: Create Footer Component

Create `src/components/layout/Footer.tsx`:

```typescript
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2026 Knowledge Hostage Detector
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Documentation
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              About IBM Bob
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

### Step 8.3: Create Layout Component

Create `src/components/layout/Layout.tsx`:

```typescript
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
```

---

## Phase 9: Hooks and Context

### Step 9.1: Create useMetrics Hook

Create `src/hooks/useMetrics.ts`:

```typescript
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
```

### Step 9.2: Create useHostages Hook

Create `src/hooks/useHostages.ts`:

```typescript
import { useState, useEffect } from 'react';
import { Hostage } from '../types/hostage.types';
import { mockHostages } from '../data/mockHostages';

export const useHostages = () => {
  const [hostages, setHostages] = useState<Hostage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchHostages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data
        setHostages(mockHostages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hostages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHostages();
  }, []);
  
  return { hostages, loading, error };
};
```

---

## Phase 10: Main App Component

### Step 10.1: Update App Component

Update `src/App.tsx`:

```typescript
import React from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import { useHostages } from './hooks/useHostages';
import { useMetrics } from './hooks/useMetrics';

const App: React.FC = () => {
  const { hostages, loading, error } = useHostages();
  const metrics = useMetrics(hostages);
  
  return (
    <Layout>
      <Dashboard
        hostages={hostages}
        metrics={metrics}
        loading={loading}
        error={error}
      />
    </Layout>
  );
};

export default App;
```

---

## Phase 11: Testing and Refinement

### Step 11.1: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your application.

### Step 11.2: Test Functionality

- [ ] Verify all metrics display correctly
- [ ] Test hostage card expand/collapse
- [ ] Test severity filtering
- [ ] Test sorting options
- [ ] Test responsive design on different screen sizes
- [ ] Test copy to clipboard functionality
- [ ] Verify loading states
- [ ] Test empty states

### Step 11.3: Build for Production

```bash
npm run build
```

---

## Next Steps

1. **Add More Mock Data**: Expand `mockHostages.ts` with more diverse examples
2. **Implement Search**: Add search functionality to filter hostages by text
3. **Add Animations**: Use Framer Motion for smooth transitions
4. **Implement Dark Mode**: Add theme toggle functionality
5. **Add Charts**: Visualize severity distribution with charts
6. **Prepare API Integration**: Set up API service layer for future backend
7. **Add Tests**: Write unit and integration tests
8. **Optimize Performance**: Implement virtual scrolling for large lists
9. **Add Export Feature**: Allow exporting hostages to CSV/PDF
10. **Implement Persistence**: Save filter/sort preferences to localStorage

---

## Troubleshooting

### Common Issues

**Issue**: Tailwind styles not applying
- **Solution**: Ensure `tailwind.config.js` content paths are correct
- **Solution**: Verify `@tailwind` directives are in `src/styles/index.css`
- **Solution**: Restart dev server after config changes

**Issue**: TypeScript errors
- **Solution**: Run `npm install` to ensure all types are installed
- **Solution**: Check `tsconfig.json` configuration
- **Solution**: Verify all imports have correct paths

**Issue**: Components not rendering
- **Solution**: Check browser console for errors
- **Solution**: Verify all required props are passed
- **Solution**: Ensure mock data structure matches type definitions

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

---

This implementation guide provides a complete, step-by-step approach to building the Knowledge Hostage Detector dashboard. Follow each phase sequentially for the best results.