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
  const [isGenerating, setIsGenerating] = useState(false);
  const [docGenerated, setDocGenerated] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolved, setResolved] = useState(false);
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
    // Mock documentation generation with loading state
    setIsGenerating(true);
    setDocGenerated(false);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      setDocGenerated(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setDocGenerated(false);
      }, 3000);
    }, 1500);
  };
  
  const handleMarkAsResolved = () => {
    // Mock mark as resolved with loading state
    setIsResolving(true);
    setResolved(false);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsResolving(false);
      setResolved(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setResolved(false);
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className="px-6 pb-6 border-t border-gray-100">
      <div className="pt-6 space-y-6">
        {/* Bob's Analysis Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Bob's Analysis</h4>
              <p className="text-gray-700 leading-relaxed">{hostage.whyItMatters}</p>
            </div>
          </div>
        </div>
        
        {/* Code Snippet Section */}
        {hostage.codeSnippet && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code Snippet
              </h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : copyError ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {copyError}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="bg-white rounded-lg p-4 text-sm overflow-x-auto border border-gray-200 scrollbar-thin">
              <code className="text-gray-800 font-mono">{hostage.codeSnippet}</code>
            </pre>
          </div>
        )}
        
        {/* Recommended Action Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Recommended Action</h4>
              <p className="text-gray-700 leading-relaxed">{hostage.recommendedAction}</p>
            </div>
          </div>
        </div>
        
        {/* Stakeholders Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Who Depends On This</h4>
              <ul className="space-y-2">
                {hostage.whoDepends.map((dep, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{dep}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Risk Assessment Section */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Risk Assessment</h4>
              <p className="text-gray-700 font-semibold mb-1">{hostage.riskLevel}</p>
              {hostage.businessCost && (
                <p className="text-gray-700">
                  <span className="font-semibold">Potential Cost:</span> <span className="text-red-700 font-bold">{hostage.businessCost}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Metadata */}
        <div className="flex items-center justify-between pt-2 pb-2 text-sm text-gray-600 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Detected: <span className="font-semibold">{formatDate(hostage.detectedAt)}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Category: <span className="font-semibold">{hostage.category}</span></span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleGenerateDocumentation}
            disabled={isGenerating || docGenerated}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : docGenerated ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Documentation Generated!
              </span>
            ) : (
              'Generate Documentation'
            )}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleMarkAsResolved}
            disabled={isResolving || resolved}
          >
            {isResolving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resolving...
              </span>
            ) : resolved ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Resolved!
              </span>
            ) : (
              'Mark as Resolved'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HostageDetails;

// Made with Bob
