# Component Specifications

This document provides detailed specifications for each component in the Knowledge Hostage Detector dashboard.

---

## Layout Components

### Layout.tsx

**Purpose**: Main application wrapper providing consistent page structure

**Props**: 
```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

**Structure**:
```tsx
<div className="min-h-screen bg-gray-50">
  <Header />
  <main className="container mx-auto px-4 py-8">
    {children}
  </main>
  <Footer />
</div>
```

**Styling**:
- Full viewport height
- Light gray background
- Responsive container with padding
- Centered content

---

### Header.tsx

**Purpose**: Application branding and navigation

**Props**: None

**Structure**:
```tsx
<header className="bg-white shadow-sm">
  <div className="container mx-auto px-4 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon />
        <h1>Knowledge Hostage Detector</h1>
      </div>
      <nav>
        {/* Future: Filter controls, search */}
      </nav>
    </div>
  </div>
</header>
```

**Features**:
- Logo/icon display
- Application title
- Placeholder for future navigation
- Responsive layout

**Styling**:
- White background with subtle shadow
- Flexbox layout for alignment
- Responsive padding

---

### Footer.tsx

**Purpose**: Application footer with metadata

**Props**: None

**Structure**:
```tsx
<footer className="bg-white border-t border-gray-200 mt-auto">
  <div className="container mx-auto px-4 py-6">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <p className="text-sm text-gray-600">
        © 2026 Knowledge Hostage Detector
      </p>
      <div className="flex space-x-4 mt-2 md:mt-0">
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
          Documentation
        </a>
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
          About IBM Bob
        </a>
      </div>
    </div>
  </div>
</footer>
```

**Features**:
- Copyright information
- Links to documentation
- Responsive layout

---

## Dashboard Components

### Dashboard.tsx

**Purpose**: Main container orchestrating dashboard content

**Props**: None

**State**:
```typescript
// Managed via HostageContext
const { hostages, metrics, loading, error } = useHostages();
```

**Structure**:
```tsx
<div className="space-y-8">
  {loading && <LoadingSpinner />}
  {error && <ErrorMessage message={error} />}
  {!loading && !error && (
    <>
      <MetricsBar metrics={metrics} />
      <HostageList hostages={hostages} />
    </>
  )}
</div>
```

**Features**:
- Loading state handling
- Error state handling
- Coordinates MetricsBar and HostageList
- Vertical spacing between sections

---

### MetricsBar.tsx

**Purpose**: Display summary metrics in a responsive grid

**Props**:
```typescript
interface MetricsBarProps {
  metrics: Metrics;
}
```

**Structure**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <MetricsCard
    title="Hostages Found"
    value={metrics.totalHostages}
    icon={<AlertIcon />}
    color="blue"
  />
  <MetricsCard
    title="Critical Count"
    value={metrics.criticalCount}
    icon={<WarningIcon />}
    color="red"
  />
  <MetricsCard
    title="Docs Generated"
    value={metrics.docsGenerated}
    icon={<DocumentIcon />}
    color="green"
  />
</div>
```

**Features**:
- Responsive grid (1 column mobile, 3 columns desktop)
- Consistent spacing
- Passes metrics to individual cards

---

### MetricsCard.tsx

**Purpose**: Display individual metric with icon and styling

**Props**:
```typescript
interface MetricsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'red' | 'green' | 'yellow';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}
```

**Structure**:
```tsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {trend && <TrendIndicator {...trend} />}
    </div>
    <div className={`p-3 rounded-full bg-${color}-100`}>
      {icon}
    </div>
  </div>
</div>
```

**Features**:
- Large, bold value display
- Icon with colored background
- Optional trend indicator
- Hover effect
- Smooth transitions

**Styling**:
- Card elevation with shadow
- Color-coded icon backgrounds
- Responsive text sizing

---

## Hostage Components

### HostageList.tsx

**Purpose**: Container for all hostage cards with filtering/sorting

**Props**:
```typescript
interface HostageListProps {
  hostages: Hostage[];
}
```

**State**:
```typescript
const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
const [sortBy, setSortBy] = useState<'severity' | 'date'>('severity');
```

**Structure**:
```tsx
<div className="space-y-6">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <h2 className="text-2xl font-bold text-gray-900">
      Knowledge Hostages ({filteredHostages.length})
    </h2>
    <div className="flex gap-2">
      <FilterButtons onFilter={setFilterSeverity} active={filterSeverity} />
      <SortDropdown onSort={setSortBy} active={sortBy} />
    </div>
  </div>
  
  <div className="space-y-4">
    {filteredHostages.length === 0 ? (
      <EmptyState />
    ) : (
      filteredHostages.map(hostage => (
        <HostageCard key={hostage.id} hostage={hostage} />
      ))
    )}
  </div>
</div>
```

**Features**:
- Filter by severity
- Sort by severity or date
- Count display
- Empty state handling
- Responsive controls layout

**Logic**:
```typescript
const filteredHostages = useMemo(() => {
  let result = hostages;
  
  if (filterSeverity) {
    result = result.filter(h => h.severity === filterSeverity);
  }
  
  result.sort((a, b) => {
    if (sortBy === 'severity') {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.detectedAt.getTime() - a.detectedAt.getTime();
  });
  
  return result;
}, [hostages, filterSeverity, sortBy]);
```

---

### HostageCard.tsx

**Purpose**: Individual hostage display with expand/collapse functionality

**Props**:
```typescript
interface HostageCardProps {
  hostage: Hostage;
}
```

**State**:
```typescript
const [isExpanded, setIsExpanded] = useState(false);
```

**Structure**:
```tsx
<div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="w-full p-6 text-left"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <SeverityBadge severity={hostage.severity} />
          {hostage.tags?.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {hostage.filePath}
          {hostage.lineNumber && (
            <span className="text-sm text-gray-500 ml-2">
              :Line {hostage.lineNumber}
            </span>
          )}
        </h3>
        <p className="text-gray-600 line-clamp-2">
          {hostage.explanation}
        </p>
      </div>
      <ChevronIcon 
        className={`transform transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`}
      />
    </div>
  </button>
  
  {isExpanded && (
    <HostageDetails hostage={hostage} />
  )}
</div>
```

**Features**:
- Click to expand/collapse
- Severity badge display
- File path with line number
- Truncated explanation preview
- Animated chevron icon
- Tag display
- Smooth transitions

**Accessibility**:
- Button for keyboard navigation
- ARIA expanded state
- Focus management

---

### SeverityBadge.tsx

**Purpose**: Visual indicator of severity level

**Props**:
```typescript
interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  size?: 'sm' | 'md' | 'lg';
}
```

**Structure**:
```tsx
<span className={`
  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
  ${severityStyles[severity]}
  ${sizeStyles[size]}
`}>
  <span className="w-2 h-2 rounded-full mr-2 bg-current">{/* Dot */}</span>
  {severity.charAt(0).toUpperCase() + severity.slice(1)}
</span>
```

**Styling Map**:
```typescript
const severityStyles = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};
```

**Features**:
- Color-coded by severity
- Includes status dot
- Multiple sizes
- Consistent styling

---

### HostageDetails.tsx

**Purpose**: Expanded view showing full hostage information

**Props**:
```typescript
interface HostageDetailsProps {
  hostage: Hostage;
}
```

**Structure**:
```tsx
<div className="px-6 pb-6 border-t border-gray-200">
  <div className="pt-4 space-y-4">
    <div>
      <h4 className="font-semibold text-gray-900 mb-2">
        Bob's Analysis
      </h4>
      <p className="text-gray-700 leading-relaxed">
        {hostage.explanation}
      </p>
    </div>
    
    {hostage.codeSnippet && (
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">
          Code Snippet
        </h4>
        <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto">
          <code>{hostage.codeSnippet}</code>
        </pre>
        <button 
          onClick={() => copyToClipboard(hostage.codeSnippet)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Copy to clipboard
        </button>
      </div>
    )}
    
    <div>
      <h4 className="font-semibold text-gray-900 mb-2">
        Recommended Action
      </h4>
      <p className="text-gray-700 leading-relaxed">
        {hostage.recommendedAction}
      </p>
    </div>
    
    <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
      <span>Detected: {formatDate(hostage.detectedAt)}</span>
      <span>Category: {hostage.category}</span>
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
```

**Features**:
- Full explanation display
- Code snippet with syntax highlighting
- Copy to clipboard functionality
- Recommended action
- Metadata (date, category)
- Action buttons
- Proper spacing and typography

---

## Common Components

### Button.tsx

**Purpose**: Reusable button component with variants

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

**Variants**:
```typescript
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
```

**Features**:
- Multiple variants and sizes
- Loading state with spinner
- Icon support
- Focus management
- Disabled state handling

---

### Card.tsx

**Purpose**: Base card component for consistent styling

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}
```

**Structure**:
```tsx
<div className={`
  bg-white rounded-lg
  ${shadowStyles[shadow]}
  ${paddingStyles[padding]}
  ${hover ? 'hover:shadow-lg transition-shadow' : ''}
  ${className}
`}>
  {children}
</div>
```

**Features**:
- Consistent card styling
- Configurable padding and shadow
- Optional hover effects
- Extensible with custom classes

---

### Badge.tsx

**Purpose**: Generic badge component for tags and labels

**Props**:
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}
```

**Variants**:
```typescript
const variants = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
};
```

**Features**:
- Multiple color variants
- Two sizes
- Rounded pill shape
- Consistent typography

---

### LoadingSpinner.tsx

**Purpose**: Loading state indicator

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}
```

**Structure**:
```tsx
<div className="flex flex-col items-center justify-center py-8">
  <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeStyles[size]}`} />
  {message && (
    <p className="mt-2 text-sm text-gray-600">{message}</p>
  )}
</div>
```

**Features**:
- Animated spinner
- Multiple sizes
- Optional message
- Centered layout

---

## State Management

### HostageContext.tsx

**Purpose**: Global state management for hostage data

**Context Value**:
```typescript
interface HostageContextValue {
  hostages: Hostage[];
  metrics: Metrics;
  loading: boolean;
  error: string | null;
  expandedHostageId: string | null;
  setExpandedHostageId: (id: string | null) => void;
  refreshData: () => Promise<void>;
  filterBySeverity: (severity: string | null) => void;
  sortHostages: (sortBy: 'severity' | 'date') => void;
}
```

**Provider Structure**:
```tsx
export const HostageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hostages, setHostages] = useState<Hostage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedHostageId, setExpandedHostageId] = useState<string | null>(null);
  
  const metrics = useMemo(() => calculateMetrics(hostages), [hostages]);
  
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHostages(); // Mock data for now
      setHostages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  const value = {
    hostages,
    metrics,
    loading,
    error,
    expandedHostageId,
    setExpandedHostageId,
    refreshData,
    filterBySeverity: () => {}, // Implemented in HostageList
    sortHostages: () => {}, // Implemented in HostageList
  };
  
  return (
    <HostageContext.Provider value={value}>
      {children}
    </HostageContext.Provider>
  );
};
```

---

## Custom Hooks

### useHostages.ts

**Purpose**: Hook for accessing hostage data and operations

```typescript
export const useHostages = () => {
  const context = useContext(HostageContext);
  if (!context) {
    throw new Error('useHostages must be used within HostageProvider');
  }
  return context;
};
```

### useMetrics.ts

**Purpose**: Hook for calculated metrics

```typescript
export const useMetrics = (hostages: Hostage[]): Metrics => {
  return useMemo(() => {
    const severityBreakdown = hostages.reduce((acc, hostage) => {
      acc[hostage.severity] = (acc[hostage.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalHostages: hostages.length,
      criticalCount: severityBreakdown.critical || 0,
      docsGenerated: 0, // Mock value
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

---

## Responsive Design Specifications

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 768px (md)
- **Desktop**: 768px+ (lg, xl)

### Layout Adaptations

#### Mobile (< 640px)
- Single column layout
- Stacked metrics cards
- Full-width hostage cards
- Simplified header
- Touch-friendly button sizes

#### Tablet (640px - 768px)
- Two-column metrics grid
- Larger touch targets
- Optimized spacing

#### Desktop (768px+)
- Three-column metrics grid
- Hover effects enabled
- Optimal reading width
- Side-by-side controls

### Component Responsive Classes

#### MetricsBar
```css
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6
```

#### HostageList Controls
```css
flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
```

#### HostageCard
```css
p-4 sm:p-6 /* Responsive padding */
```

---

## Accessibility Specifications

### Keyboard Navigation
- Tab order: Header → Metrics → Filters → Hostage Cards
- Enter/Space to expand cards
- Escape to close expanded cards
- Arrow keys for filter navigation

### ARIA Labels
```typescript
// HostageCard
<button
  aria-expanded={isExpanded}
  aria-controls={`hostage-details-${hostage.id}`}
  aria-label={`${hostage.severity} severity hostage in ${hostage.filePath}`}
>

// SeverityBadge
<span
  role="status"
  aria-label={`Severity level: ${severity}`}
>

// MetricsCard
<div
  role="region"
  aria-labelledby={`metric-${title.toLowerCase().replace(' ', '-')}`}
>
```

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- Severity colors tested for accessibility
- Focus indicators clearly visible

### Screen Reader Support
- Semantic HTML structure
- Descriptive alt text for icons
- Status announcements for loading/error states
- Proper heading hierarchy (h1 → h2 → h3)

---

## Performance Specifications

### Component Optimization

#### React.memo Usage
```typescript
export const HostageCard = React.memo<HostageCardProps>(({ hostage }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.hostage.id === nextProps.hostage.id &&
         prevProps.hostage.severity === nextProps.hostage.severity;
});
```

#### useMemo for Expensive Calculations
```typescript
const filteredHostages = useMemo(() => {
  // Filtering and sorting logic
}, [hostages, filterSeverity, sortBy]);

const metrics = useMemo(() => {
  // Metrics calculation
}, [hostages]);
```

#### useCallback for Event Handlers
```typescript
const handleExpand = useCallback((id: string) => {
  setExpandedHostageId(expandedHostageId === id ? null : id);
}, [expandedHostageId]);
```

### Bundle Optimization
- Tree shaking enabled
- Code splitting at route level
- Lazy loading for non-critical components
- Optimized imports (import specific functions)

### Runtime Performance
- Virtual scrolling for 100+ items
- Debounced search/filter inputs
- Efficient re-renders with proper dependencies
- Minimal DOM manipulations

---

## Error Handling Specifications

### Error Boundaries
```typescript
class HostageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Hostage component error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Error States
- Network errors
- Data parsing errors
- Component render errors
- User action errors

### Error UI Components
```typescript
const ErrorMessage: React.FC<{ message: string; retry?: () => void }> = ({
  message,
  retry
}) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4">
    <div className="flex">
      <AlertIcon className="text-red-400" />
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <p className="text-sm text-red-700 mt-1">{message}</p>
        {retry && (
          <button
            onClick={retry}
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  </div>
);
```

---

This comprehensive component specification provides detailed implementation guidance for each component in the Knowledge Hostage Detector dashboard, ensuring consistency, accessibility, and maintainability across the entire application.