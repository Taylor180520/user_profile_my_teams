import React, { useState } from 'react';
import { X, ChevronDown, Info } from 'lucide-react';
import Tooltip from './Tooltip';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: {
    emails: string[];
    knowledgeBooks: string[];
    accessLevel: string;
  }) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    emails: [] as string[],
    currentEmail: '',
    knowledgeBooks: [] as string[],
    accessLevel: 'View-only'
  });

  const [dropdownStates, setDropdownStates] = useState({
    knowledgeBooks: false,
    accessLevel: false
  });

  // Mock data for dropdowns
  const availableKnowledgeBooks = [
    'Personal Documents',
    'Work Projects',
    'Tech Notes',
    'Product Documentation',
    'Financial Records',
    'Marketing Materials'
  ];

  const accessLevels = ['View-only', 'Can Edit', 'Full access'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.emails.length > 0 && formData.knowledgeBooks.length > 0) {
      onSubmit(formData);
      setFormData({
        emails: [],
        currentEmail: '',
        knowledgeBooks: [],
        accessLevel: 'View-only'
      });
    }
  };

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const toggleSelection = (item: string, field: 'knowledgeBooks') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i: string) => i !== item)
        : [...prev[field], item]
    }));
  };

  const selectAccessLevel = (level: string) => {
    setFormData(prev => ({ ...prev, accessLevel: level }));
    setDropdownStates(prev => ({ ...prev, accessLevel: false }));
  };

  const addEmail = () => {
    const email = formData.currentEmail.trim();
    if (email && !formData.emails.includes(email)) {
      setFormData(prev => ({
        ...prev,
        emails: [...prev.emails, email],
        currentEmail: ''
      }));
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter(email => email !== emailToRemove)
    }));
  };

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Add Members</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email Addresses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Addresses *
            </label>
            <div className="min-h-[3rem] p-2 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg flex flex-wrap gap-2 items-center">
              {/* Display existing emails as tags */}
              {formData.emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {/* Input field */}
              <input
                type="email"
                value={formData.currentEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, currentEmail: e.target.value }))}
                onKeyPress={handleEmailKeyPress}
                className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
                placeholder={formData.emails.length === 0 ? "Email address or Username (press Enter to add)" : ""}
              />
            </div>
          </div>

          {/* Knowledge Books */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Knowledge Books *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('knowledgeBooks')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-gray-900 dark:text-white focus:border-violet-600 focus:outline-none flex items-center justify-between"
              >
                <span>
                  {formData.knowledgeBooks.length === 0
                    ? 'Select knowledge books'
                    : `${formData.knowledgeBooks.length} selected`}
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
                        checked={formData.knowledgeBooks.includes(book)}
                        onChange={() => toggleSelection(book, 'knowledgeBooks')}
                        className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-600 focus:ring-2 mr-3"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{book}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Access Level */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Access Level *
              </label>
              <Tooltip text="The selected Access Level will be applied to the added users for all selected Knowledge Books." position="left">
                <Info size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
              </Tooltip>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('accessLevel')}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-gray-900 dark:text-white focus:border-violet-600 focus:outline-none flex items-center justify-between"
              >
                <span>{formData.accessLevel}</span>
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
              disabled={formData.emails.length === 0 || formData.knowledgeBooks.length === 0}
              className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;