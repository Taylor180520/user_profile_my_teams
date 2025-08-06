import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface RoleGroup {
  id: string;
  name: string;
  type: 'Enterprise' | 'Custom';
  knowledgeBooks: { name: string; accessLevel: 'View-only' | 'Can Edit' | 'Full access' | 'Revoke' }[];
  memberCount: number;
}

interface RoleGroupKnowledgeBooksDropdownProps {
  group: RoleGroup;
  selectedKnowledgeBook: string;
  onKnowledgeBookSelect: (groupId: string, knowledgeBook: string) => void;
}

const RoleGroupKnowledgeBooksDropdown: React.FC<RoleGroupKnowledgeBooksDropdownProps> = ({
  group,
  selectedKnowledgeBook,
  onKnowledgeBookSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const currentKB = selectedKnowledgeBook || group.knowledgeBooks[0]?.name;
  const hasMultiple = group.knowledgeBooks.length > 1;

  const handleKnowledgeBookSelect = (knowledgeBook: string) => {
    onKnowledgeBookSelect(group.id, knowledgeBook);
    setIsExpanded(false);
  };

  if (!hasMultiple) {
    return (
      <span className="text-sm text-gray-900 dark:text-white">
        {group.knowledgeBooks[0]?.name}
      </span>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="knowledge-books-button flex items-center gap-2 text-sm text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        <span>
          {currentKB} +{group.knowledgeBooks.length - 1}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 dark:text-gray-500 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {isExpanded && (
        <div className="knowledge-books-dropdown absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48 py-2">
          {group.knowledgeBooks.map((book) => (
            <div
              key={book.name}
              onClick={() => handleKnowledgeBookSelect(book.name)}
              className={`px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                currentKB === book.name ? 'bg-violet-50 dark:bg-violet-900/20' : ''
              }`}
            >
              <span className="text-sm text-gray-900 dark:text-white">{book.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleGroupKnowledgeBooksDropdown; 