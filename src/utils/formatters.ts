// Constants for date formatting
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;

// Constants for path formatting
const DEFAULT_MAX_PATH_LENGTH = 50;
const PATH_SEGMENTS_TO_SHOW = 2;

export const formatDate = (date: Date): string => {
  // Validate date
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  // Handle future dates
  if (diffInMs < 0) {
    return 'Future date';
  }
  
  const diffInDays = Math.floor(diffInMs / MS_PER_DAY);

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < DAYS_PER_WEEK) return `${diffInDays} days ago`;
  if (diffInDays < DAYS_PER_MONTH) return `${Math.floor(diffInDays / DAYS_PER_WEEK)} weeks ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatFilePath = (path: string, maxLength: number = DEFAULT_MAX_PATH_LENGTH): string => {
  // Handle empty or invalid paths
  if (!path || typeof path !== 'string') return '';
  if (path.length <= maxLength) return path;
  
  const parts = path.split('/');
  
  // Handle single segment paths
  if (parts.length <= 1) {
    return path.length > maxLength ? `...${path.slice(-maxLength + 3)}` : path;
  }
  
  // Handle paths with only 2 segments
  if (parts.length <= PATH_SEGMENTS_TO_SHOW) return path;
  
  const truncated = `.../${parts.slice(-PATH_SEGMENTS_TO_SHOW).join('/')}`;
  
  // If truncated path is still too long, further truncate
  if (truncated.length > maxLength) {
    return `...${truncated.slice(-(maxLength - 3))}`;
  }
  
  return truncated;
};

export const copyToClipboard = async (text: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to copy to clipboard';
    console.error('Failed to copy to clipboard:', err);
    return { success: false, error: errorMessage };
  }
};

// Made with Bob
