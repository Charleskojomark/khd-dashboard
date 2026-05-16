import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/70 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Knowledge Hostage Detector
              </h1>
              <p className="text-sm text-gray-600 font-medium">Powered by IBM Bob AI</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <span className="text-sm font-medium text-gray-700">
                📊 Analyzing: <span className="text-blue-600 font-semibold">Saleor E-commerce</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

// Made with Bob
