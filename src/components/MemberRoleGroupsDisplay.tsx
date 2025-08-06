import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface MemberRoleGroupsDisplayProps {
  roleGroups: string[];
}

const MemberRoleGroupsDisplay: React.FC<MemberRoleGroupsDisplayProps> = ({ roleGroups }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 如果只有一个Role Group，直接显示不带下拉图标
  if (roleGroups.length <= 1) {
    return (
      <div className="text-sm text-gray-900 dark:text-white">
        {roleGroups[0] || 'No role groups'}
      </div>
    );
  }

  // 如果有多个Role Groups，显示第一个 + 数量，带下拉功能
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
      >
        <span className="text-sm text-gray-900 dark:text-white">
          {roleGroups[0]}
          <span className="ml-1 text-gray-500 dark:text-gray-400">
            +{roleGroups.length - 1}
          </span>
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown content */}
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-48">
            <div className="py-1">
              {roleGroups.map((roleGroup, index) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {roleGroup}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MemberRoleGroupsDisplay; 