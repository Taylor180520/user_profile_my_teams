import React, { useState } from 'react';
import { X, ChevronDown, Info } from 'lucide-react';
import Tooltip from './Tooltip';

interface RoleGroup {
  id: string;
  name: string;
  type: 'Enterprise' | 'Custom';
  knowledgeBooks: { name: string; accessLevel: 'View-only' | 'Can Edit' | 'Full access' | 'Revoke' }[];
  memberCount: number;
}

interface BulkAddRoleGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMembers: string[];
  availableRoleGroups: RoleGroup[];
  onSubmit: (data: {
    action: 'existing' | 'new';
    existingGroupIds?: string[];
    newGroupName?: string;
    knowledgeBooks?: string[];
    accessLevel?: string;
  }) => void;
}

const BulkAddRoleGroupModal: React.FC<BulkAddRoleGroupModalProps> = ({
  isOpen,
  onClose,
  selectedMembers,
  availableRoleGroups,
  onSubmit
}) => {
  const [action, setAction] = useState<'existing' | 'new'>('existing');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedKnowledgeBooks, setSelectedKnowledgeBooks] = useState<string[]>([]);
  const [accessLevel, setAccessLevel] = useState('View-only');
  const [dropdownStates, setDropdownStates] = useState({
    roleGroups: false,
    knowledgeBooks: false,
    accessLevel: false
  });

  // Mock knowledge books data
  const availableKnowledgeBooks = [
    'Personal Documents',
    'Work Projects',
    'Chatbot Resources',
    'Tech Notes',
    'Computer Guides',
    'Financial Records',
    'Travel Plans',
    'Product Descriptions',
    'Work Procedures',
    'Shipping Info',
    'Tech Support',
    'Home Organization',
    'Team Contacts'
  ];

  const accessLevels = ['View-only', 'Can Edit', 'Full access'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (action === 'existing' && selectedGroupIds.length > 0) {
      onSubmit({
        action: 'existing',
        existingGroupIds: selectedGroupIds
      });
    } else if (action === 'new' && newGroupName.trim()) {
      onSubmit({
        action: 'new',
        newGroupName: newGroupName.trim(),
        knowledgeBooks: selectedKnowledgeBooks,
        accessLevel
      });
    }
    
    // Reset form
    setAction('existing');
    setSelectedGroupIds([]);
    setNewGroupName('');
    setSelectedKnowledgeBooks([]);
    setAccessLevel('View-only');
  };

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const toggleKnowledgeBookSelection = (book: string) => {
    setSelectedKnowledgeBooks(prev =>
      prev.includes(book)
        ? prev.filter(b => b !== book)
        : [...prev, book]
    );
  };

  const selectAccessLevel = (level: string) => {
    setAccessLevel(level);
    setDropdownStates(prev => ({ ...prev, accessLevel: false }));
  };

  const toggleRoleGroupSelection = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">
            Add {selectedMembers.length} Member{selectedMembers.length !== 1 ? 's' : ''} to Role Groups
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Action
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="action"
                  value="existing"
                  checked={action === 'existing'}
                  onChange={(e) => setAction(e.target.value as 'existing' | 'new')}
                  className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-violet-600 focus:ring-2 mr-3"
                />
                <span className="text-sm text-gray-900 dark:text-white">Add to existing role group</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="action"
                  value="new"
                  checked={action === 'new'}
                  onChange={(e) => setAction(e.target.value as 'existing' | 'new')}
                  className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-violet-600 focus:ring-2 mr-3"
                />
                <span className="text-sm text-gray-900 dark:text-white">Create new role group</span>
              </label>
            </div>
          </div>

          {/* Existing Role Group Selection */}
          {action === 'existing' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Role Group *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('roleGroups')}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-gray-900 dark:text-white focus:border-violet-600 focus:outline-none flex items-center justify-between"
                >
                  <span>
                    {selectedGroupIds.length === 0
                      ? 'Select role groups'
                      : `${selectedGroupIds.length} group${selectedGroupIds.length !== 1 ? 's' : ''} selected`}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                {dropdownStates.roleGroups && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {availableRoleGroups.map((group) => (
                      <label
                        key={group.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGroupIds.includes(group.id)}
                          onChange={() => toggleRoleGroupSelection(group.id)}
                          className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-600 focus:ring-2 mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{group.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {group.memberCount} members
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* New Role Group Creation */}
          {action === 'new' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-violet-600 focus:outline-none"
                  placeholder="Enter group name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Knowledge Books
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('knowledgeBooks')}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-gray-900 dark:text-white focus:border-violet-600 focus:outline-none flex items-center justify-between"
                  >
                    <span>
                      {selectedKnowledgeBooks.length === 0
                        ? 'Select knowledge books'
                        : `${selectedKnowledgeBooks.length} selected`}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                  {dropdownStates.knowledgeBooks && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {availableKnowledgeBooks.map((book) => (
                        <label
                          key={book}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedKnowledgeBooks.includes(book)}
                            onChange={() => toggleKnowledgeBookSelection(book)}
                            className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-600 focus:ring-2 mr-3"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">{book}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Access Level
                </label>
                  <Tooltip text="This Access Level will be granted to this new role group for the selected knowledge book(s)." position="left">
                    <Info size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                  </Tooltip>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('accessLevel')}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-gray-900 dark:text-white focus:border-violet-600 focus:outline-none flex items-center justify-between"
                  >
                    <span>{accessLevel}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                  {dropdownStates.accessLevel && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                      {accessLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => selectAccessLevel(level)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-white"
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                (action === 'existing' && selectedGroupIds.length === 0) ||
                (action === 'new' && !newGroupName.trim())
              }
              className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {action === 'existing' ? 'Add to Group' : 'Create & Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkAddRoleGroupModal;