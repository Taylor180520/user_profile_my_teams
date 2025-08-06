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

interface KnowledgeBooksDropdownProps {
  member: Member;
  selectedKnowledgeBook: string;
  onKnowledgeBookSelect: (memberId: string, knowledgeBook: string) => void;
}

const KnowledgeBooksDropdown: React.FC<KnowledgeBooksDropdownProps> = ({
  member,
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

  const currentKB = selectedKnowledgeBook || member.knowledgeBooks[0]?.name;
  const hasMultiple = member.knowledgeBooks.length > 1;

  const handleKnowledgeBookSelect = (knowledgeBook: string) => {
    onKnowledgeBookSelect(member.id, knowledgeBook);
    setIsExpanded(false);
  };

  if (!hasMultiple) {
    return (
      <span className="text-sm text-gray-900 dark:text-white">
        {member.knowledgeBooks[0]?.name}
      </span>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="knowledge-books-button flex items-center gap-2 text-sm text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
      >
        <span>
          {currentKB} +{member.knowledgeBooks.length - 1}
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
          {member.knowledgeBooks.map((book) => (
            <div
              key={book.name}
              onClick={() => handleKnowledgeBookSelect(book.name)}
              className={`px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                currentKB === book.name ? 'bg-purple-50 dark:bg-purple-900/20' : ''
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

export default KnowledgeBooksDropdown;