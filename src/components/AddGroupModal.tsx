import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Info, Mail } from 'lucide-react';
import Tooltip from './Tooltip';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: {
    name: string;
    members: string[];
    knowledgeBooks: string[];
    accessLevel: 'View-only' | 'Can Edit' | 'Full access';
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
    knowledgeBooks: [] as string[],
    accessLevel: 'View-only' as 'View-only' | 'Can Edit' | 'Full access'
  });

  const [memberInput, setMemberInput] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showKnowledgeBooksDropdown, setShowKnowledgeBooksDropdown] = useState(false);
  const [showAccessLevelDropdown, setShowAccessLevelDropdown] = useState(false);

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

  // Toggle knowledge book selection
  const toggleKnowledgeBook = (book: string) => {
    setFormData(prev => ({
      ...prev,
      knowledgeBooks: prev.knowledgeBooks.includes(book)
        ? prev.knowledgeBooks.filter(kb => kb !== book)
        : [...prev.knowledgeBooks, book]
    }));
  };

  // Get member display name
  const getMemberDisplayName = (email: string) => {
    const member = availableMembers.find(m => m.email === email);
    return member ? `${member.name} (${email})` : email;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({
        name: '',
        members: [],
        knowledgeBooks: [],
        accessLevel: 'View-only'
      });
      setMemberInput('');
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      members: [],
      knowledgeBooks: [],
      accessLevel: 'View-only'
    });
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

          {/* Knowledge Books */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Knowledge Books
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowKnowledgeBooksDropdown(!showKnowledgeBooksDropdown)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-gray-900 dark:text-white focus:border-violet-600 focus:outline-none flex items-center justify-between"
              >
                <span>
                  {formData.knowledgeBooks.length === 0
                    ? 'Select knowledge books'
                    : `${formData.knowledgeBooks.length} selected`}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {showKnowledgeBooksDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {availableKnowledgeBooks.map((book) => (
                    <label
                      key={book}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.knowledgeBooks.includes(book)}
                        onChange={() => toggleKnowledgeBook(book)}
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
                Access Level
              </label>
              <Tooltip 
                text="This Access Level will be granted to this new role group for the selected knowledge book(s)."
                position="top"
              >
                <Info size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
              </Tooltip>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAccessLevelDropdown(!showAccessLevelDropdown)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-gray-900 dark:text-white focus:border-violet-600 focus:outline-none flex items-center justify-between"
              >
                <span>{formData.accessLevel}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {showAccessLevelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  {accessLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, accessLevel: level }));
                        setShowAccessLevelDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
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