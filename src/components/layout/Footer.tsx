import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Knowledge Hostage Detector • Scan Results from Saleor Repository
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <button
              onClick={() => alert('Documentation coming soon!')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Documentation
            </button>
            <button
              onClick={() => alert('About IBM Bob coming soon!')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              About IBM Bob
            </button>
            <a href="https://github.com/saleor/saleor" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Saleor GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Made with Bob
