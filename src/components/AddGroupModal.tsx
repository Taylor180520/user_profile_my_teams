import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Info, Mail, Search } from 'lucide-react';
import Tooltip from './Tooltip';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface KnowledgeBookPermission {
  name: string;
  accessLevel: 'View-only' | 'Can Edit' | 'Full access';
}

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: {
    name: string;
    members: string[];
    knowledgeBooks: KnowledgeBookPermission[];
  }) => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    members: [] as string[],
  });

  const [memberInput, setMemberInput] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  
  // Knowledge Books related states
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [bookPermissions, setBookPermissions] = useState<{[book: string]: 'View-only' | 'Can Edit' | 'Full access'}>({});
  const [dropdownStates, setDropdownStates] = useState<{[book: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = useState('');

  const memberInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const availableMembers: Member[] = [
    { id: '1', name: 'Anna Taylor', email: 'annataylor@email.com' },
    { id: '2', name: 'Corina McCoy', email: 'corinamcmc@email.com' },
    { id: '3', name: 'David Elson', email: 'david.elson@email.com' },
    { id: '4', name: 'Dennis Callis', email: 'dennis.callis@email.com' },
    { id: '5', name: 'Kathy Pacheco', email: 'kathy1990@email.com' },
    { id: '6', name: 'Iva Ryan', email: 'ivaryan@email.com' },
    { id: '7', name: 'Kurt Bates', email: 'kurbates@email.com' }
  ];

  const availableKnowledgeBooks = [
    'Personal Documents',
    'Work Projects', 
    'Tech Notes',
    'Product Documentation',
    'Financial Records',
    'Marketing Materials',
    'Chatbot Resources',
    'Computer Guides',
    'Travel Plans',
    'Product Descriptions',
    'Work Procedures',
    'Shipping Info',
    'Tech Support',
    'Home Organization',
    'Team Contacts'
  ];

  const accessLevels: ('View-only' | 'Can Edit' | 'Full access')[] = [
    'View-only',
    'Can Edit', 
    'Full access'
  ];

  // Filter members based on input
  useEffect(() => {
    if (memberInput.trim()) {
      const filtered = availableMembers.filter(member => 
        (member.name.toLowerCase().includes(memberInput.toLowerCase()) ||
         member.email.toLowerCase().includes(memberInput.toLowerCase())) &&
        !formData.members.includes(member.email)
      );
      setFilteredMembers(filtered);
      setShowMemberDropdown(true);
    } else {
      setFilteredMembers([]);
      setShowMemberDropdown(false);
    }
  }, [memberInput, formData.members]);

  // Filter knowledge books based on search query
  const filteredKnowledgeBooks = availableKnowledgeBooks.filter(book =>
    book.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle member input
  const handleMemberInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = memberInput.trim();
      
      if (input) {
        // Check if it's a valid email
        if (isValidEmail(input)) {
          if (!formData.members.includes(input)) {
            setFormData(prev => ({
              ...prev,
              members: [...prev.members, input]
            }));
          }
          setMemberInput('');
          setShowMemberDropdown(false);
        } else {
          // Check if it matches a member name/email from dropdown
          const matchedMember = filteredMembers.find(member => 
            member.name.toLowerCase() === input.toLowerCase() ||
            member.email.toLowerCase() === input.toLowerCase()
          );
          
          if (matchedMember && !formData.members.includes(matchedMember.email)) {
            setFormData(prev => ({
              ...prev,
              members: [...prev.members, matchedMember.email]
            }));
            setMemberInput('');
            setShowMemberDropdown(false);
          }
        }
      }
    }
  };

  // Add member from dropdown
  const addMemberFromDropdown = (member: Member) => {
    if (!formData.members.includes(member.email)) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, member.email]
      }));
    }
    setMemberInput('');
    setShowMemberDropdown(false);
    memberInputRef.current?.focus();
  };

  // Remove member
  const removeMember = (email: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m !== email)
    }));
  };

  // Handle knowledge book selection
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

  // Get member display name
  const getMemberDisplayName = (email: string) => {
    const member = availableMembers.find(m => m.email === email);
    return member ? `${member.name} (${email})` : email;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      // Prepare knowledge book permissions
      const knowledgeBooks: KnowledgeBookPermission[] = selectedBooks.map(book => ({
        name: book,
        accessLevel: bookPermissions[book] || 'View-only'
      }));

      onSubmit({
        name: formData.name,
        members: formData.members,
        knowledgeBooks
      });
      
      // Reset form
      setFormData({
        name: '',
        members: [],
      });
      setSelectedBooks([]);
      setBookPermissions({});
      setDropdownStates({});
      setSearchQuery('');
      setMemberInput('');
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      members: [],
    });
    setSelectedBooks([]);
    setBookPermissions({});
    setDropdownStates({});
    setSearchQuery('');
    setMemberInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Create New Role Group</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-violet-600 focus:outline-none"
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Members <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <div className="w-full min-h-[42px] px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:border-violet-600">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.members.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs rounded-md"
                    >
                      <Mail size={12} />
                      {getMemberDisplayName(email)}
                      <button
                        type="button"
                        onClick={() => removeMember(email)}
                        className="ml-1 text-violet-500 hover:text-violet-700 dark:hover:text-violet-400"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  ref={memberInputRef}
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={handleMemberInputKeyDown}
                  onFocus={() => memberInput && setShowMemberDropdown(true)}
                  className="w-full border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500"
                  placeholder="Type name, email or press Enter to add"
                />
              </div>
              
              {showMemberDropdown && filteredMembers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => addMemberFromDropdown(member)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Knowledge Books Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Knowledge Books (Optional)
            </label>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
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
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:border-violet-600 focus:outline-none focus:bg-white dark:focus:bg-gray-800"
              />
            </div>

            {/* Knowledge Books List */}
            <div className="max-h-80 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              {filteredKnowledgeBooks.length > 0 ? (
                <div className="p-4 space-y-3">
                  {filteredKnowledgeBooks.map((book) => (
                    <div key={book} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
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
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No knowledge books found
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupModal;