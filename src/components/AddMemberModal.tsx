import React, { useState } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';

interface KnowledgeBookPermission {
  name: string;
  accessLevel: 'View-only' | 'Can Edit' | 'Full access';
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: {
    emails: string[];
    knowledgeBooks: KnowledgeBookPermission[];
  }) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    emails: [] as string[],
    currentEmail: ''
  });

  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [bookPermissions, setBookPermissions] = useState<{[book: string]: 'View-only' | 'Can Edit' | 'Full access'}>({});
  const [dropdownStates, setDropdownStates] = useState<{[book: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Available knowledge books
  const availableKnowledgeBooks = [
    'Personal Documents',
    'Work Projects',
    'Tech Notes',
    'Product Documentation',
    'Financial Records',
    'Marketing Materials',
    'Travel Plans',
    'Product Descriptions',
    'Work Procedures',
    'Chatbot Resources',
    'Computer Guides',
    'Tech Support',
    'Home Organization',
    'Team Contacts',
    'Shipping Info'
  ];

  const accessLevels = ['View-only', 'Can Edit', 'Full access'] as const;

  // Filter knowledge books based on search query
  const filteredKnowledgeBooks = availableKnowledgeBooks.filter(book =>
    book.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.emails.length > 0) {
      const permissions: KnowledgeBookPermission[] = selectedBooks.map(book => ({
        name: book,
        accessLevel: bookPermissions[book] || 'View-only'
      }));
      
      onSubmit({
        emails: formData.emails,
        knowledgeBooks: permissions
      });
      
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      emails: [],
      currentEmail: ''
    });
    setSelectedBooks([]);
    setBookPermissions({});
    setDropdownStates({});
    setSearchQuery('');
    onClose();
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

  const handleBookToggle = (book: string) => {
    setSelectedBooks(prev => {
      const newSelection = prev.includes(book) 
        ? prev.filter(b => b !== book)
        : [...prev, book];
      
      // Set default access level for newly selected books
      if (!prev.includes(book)) {
        setBookPermissions(prevPerms => ({
          ...prevPerms,
          [book]: 'View-only'
        }));
      }
      
      return newSelection;
    });
  };

  const handleAccessLevelChange = (book: string, accessLevel: 'View-only' | 'Can Edit' | 'Full access') => {
    setBookPermissions(prev => ({
      ...prev,
      [book]: accessLevel
    }));
    setDropdownStates(prev => ({
      ...prev,
      [book]: false
    }));
  };

  const toggleDropdown = (book: string) => {
    setDropdownStates(prev => ({
      ...prev,
      [book]: !prev[book]
    }));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Add Members</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Knowledge Books Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Knowledge Books (Optional)
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Configure knowledge book permissions now, or leave empty to configure later.
              </p>
              
              {/* Search Box */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search knowledge books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:border-violet-600 focus:outline-none"
                />
              </div>

              {/* Knowledge Books List */}
              <div className="max-h-80 overflow-y-auto space-y-3">
                {filteredKnowledgeBooks.map((book) => (
                  <div key={book} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book)}
                          onChange={() => handleBookToggle(book)}
                          className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-600 focus:ring-2 mr-3"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{book}</span>
                      </label>
                      
                      {selectedBooks.includes(book) && (
                        <div className="relative ml-4">
                          <button
                            type="button"
                            onClick={() => toggleDropdown(book)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${getAccessLevelColor(bookPermissions[book] || 'View-only')}`}
                          >
                            {bookPermissions[book] || 'View-only'}
                            <ChevronDown size={14} className="text-gray-400" />
                          </button>
                          
                          {dropdownStates[book] && (
                            <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-32">
                              {accessLevels.map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => handleAccessLevelChange(book, level)}
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${getAccessLevelColor(level)}`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.emails.length === 0}
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;