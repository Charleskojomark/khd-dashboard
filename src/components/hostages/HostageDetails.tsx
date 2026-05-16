import React, { useState, useEffect, useRef } from 'react';
import { Hostage } from '../../types/hostage.types';
import { formatDate, copyToClipboard } from '../../utils/formatters';
import Button from '../common/Button';

// Constants
const COPY_FEEDBACK_DURATION_MS = 2000;

interface HostageDetailsProps {
  hostage: Hostage;
}

const HostageDetails: React.FC<HostageDetailsProps> = ({ hostage }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const handleCopy = async () => {
    if (hostage.codeSnippet) {
      const result = await copyToClipboard(hostage.codeSnippet);
      if (result.success) {
        setCopied(true);
        setCopyError(null);
        timeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS);
      } else {
        setCopyError(result.error || 'Failed to copy');
        setTimeout(() => setCopyError(null), COPY_FEEDBACK_DURATION_MS);
      }
    }
  };
  
  const handleGenerateDocumentation = () => {
    // TODO: Implement documentation generation
    alert('Documentation generation feature coming soon!');
  };
  
  const handleMarkAsResolved = () => {
    // TODO: Implement mark as resolved
    alert('Mark as resolved feature coming soon!');
  };
  
  return (
    <div className="px-6 pb-6 border-t border-gray-200">
      <div className="pt-4 space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Bob's Analysis</h4>
          <p className="text-gray-700 leading-relaxed">{hostage.whyItMatters}</p>
        </div>
        
        {hostage.codeSnippet && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Code Snippet</h4>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {copied ? '✓ Copied!' : copyError ? `✗ ${copyError}` : 'Copy to clipboard'}
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
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Who Depends On This</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {hostage.whoDepends.map((dep, idx) => (
              <li key={idx}>{dep}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-red-800">Risk Assessment</h4>
              <p className="text-sm text-red-700 mt-1">{hostage.riskLevel}</p>
              {hostage.businessCost && (
                <p className="text-sm text-red-700 mt-1">
                  <span className="font-medium">Potential Cost:</span> {hostage.businessCost}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 text-sm text-gray-500 border-t border-gray-100">
          <span>Detected: {formatDate(hostage.detectedAt)}</span>
          <span>Category: {hostage.category}</span>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="primary" size="sm" onClick={handleGenerateDocumentation}>
            Generate Documentation
          </Button>
          <Button variant="secondary" size="sm" onClick={handleMarkAsResolved}>
            Mark as Resolved
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HostageDetails;

// Made with Bob
