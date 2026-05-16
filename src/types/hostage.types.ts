export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Hostage {
  id: string;
  severity: SeverityLevel;
  filePath: string;
  lineNumber?: number;
  functionName: string;
  explanation: string;
  recommendedAction: string;
  codeSnippet?: string;
  detectedAt: Date;
  category: string;
  tags: string[];
  riskLevel: string;
  businessCost?: string;
  whyItMatters: string;
  whoDepends: string[];
}

export interface HostageFilters {
  severity?: SeverityLevel | null;
  category?: string | null;
  searchTerm?: string;
}

export type SortOption = 'severity' | 'date' | 'file';

// Made with Bob
