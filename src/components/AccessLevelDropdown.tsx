import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  knowledgeBooks: { name: string; accessLevel: 'View-only' | 'Can Edit' | 'Full access' }[];
  roleGroups: string[];
}

interface AccessLevelDropdownProps {
  member: Member;
  selectedKnowledgeBook: string;
  onAccessLevelChange: (memberId: string, newAccessLevel: string) => void;
}

const AccessLevelDropdown: React.FC<AccessLevelDropdownProps> = ({
  member,
  selectedKnowledgeBook,
  onAccessLevelChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getCurrentAccessLevel = () => {
    const currentKB = selectedKnowledgeBook || member.knowledgeBooks[0]?.name;
    return member.knowledgeBooks.find(kb => kb.name === currentKB)?.accessLevel || 'View-only';
  };

  const getAccessLevelColor = (level: 'View-only' | 'Can Edit' | 'Full access') => {
    switch (level) {
      case 'View-only':
        return 'text-gray-600 dark:text-gray-400';
      case 'Can Edit':
        return 'text-blue-600 dark:text-blue-400';
      case 'Full access':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const currentAccessLevel = getCurrentAccessLevel();
  const accessLevels = ['View-only', 'Can Edit', 'Full access', 'Revoke'];

  const handleAccessLevelSelect = (level: string) => {
    onAccessLevelChange(member.id, level);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400"
      >
        <span className={getAccessLevelColor(currentAccessLevel)}>
          {currentAccessLevel}
        </span>
        <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
      </button>
      
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-32">
          {accessLevels.map((level) => (
            <button
              key={level}
              onClick={() => handleAccessLevelSelect(level)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                level === 'Revoke' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
              } ${currentAccessLevel === level ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
            >
              {level}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessLevelDropdown;