import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TableHeaderTooltipProps {
  text: string;
  children: ReactNode;
}

const TableHeaderTooltip: React.FC<TableHeaderTooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Calculate position above the trigger element
      let x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      let y = triggerRect.top - tooltipRect.height - 12;
      
      // Ensure tooltip doesn't go off screen
      const padding = 16;
      if (x < padding) {
        x = padding;
      } else if (x + tooltipRect.width > window.innerWidth - padding) {
        x = window.innerWidth - tooltipRect.width - padding;
      }
      
      if (y < padding) {
        // If there's no space above, show below
        y = triggerRect.bottom + 12;
      }
      
      setPosition({ x, y });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible]);

  const tooltipContent = isVisible ? (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 10000,
      }}
      className="px-3 py-2 text-xs font-medium text-white bg-gray-900 dark:bg-gray-800 rounded-lg shadow-xl border border-gray-600 dark:border-gray-500 whitespace-nowrap transition-all duration-200 ease-out"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {text}
      <div 
        className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 border border-gray-600 dark:border-gray-500 transform rotate-45"
        style={{
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
        }}
      />
    </div>
  ) : null;

  return (
    <>
      <div 
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  );
};

export default TableHeaderTooltip; 