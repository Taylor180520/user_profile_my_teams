import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-4 mr-3',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-3',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      style={{ isolation: 'isolate' }}
    >
      {children}
      
      {isVisible && (
        <div 
          className={`absolute z-[9999] px-3 py-2 text-xs font-medium text-white bg-gray-900 dark:bg-gray-800 rounded-lg shadow-xl border border-gray-600 dark:border-gray-500 whitespace-nowrap transition-all duration-200 ease-out ${positionClasses[position]}`}
          style={{ 
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
            backdropFilter: 'blur(4px)'
          }}
        >
          {text}
          <div 
            className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 border border-gray-600 dark:border-gray-500 transform rotate-45 ${
              position === 'top' ? 'top-full -mt-1 left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2' :
              position === 'left' ? 'left-full -ml-1 top-1/2 -translate-y-1/2' :
              'right-full -mr-1 top-1/2 -translate-y-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 