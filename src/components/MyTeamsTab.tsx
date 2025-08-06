import React, { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronRight, Filter, X, Users, Info, MoreVertical } from 'lucide-react';
import KnowledgeBooksDropdown from './KnowledgeBooksDropdown';
import AccessLevelDropdown from './AccessLevelDropdown';
import RoleGroupKnowledgeBooksDropdown from './RoleGroupKnowledgeBooksDropdown';
import RoleGroupAccessLevelDropdown from './RoleGroupAccessLevelDropdown';
import AddMemberModal from './AddMemberModal';
import AddGroupModal from './AddGroupModal';
import BulkAddRoleGroupModal from './BulkAddRoleGroupModal';
import RevokeAccessModal from './RevokeAccessModal';
import DisbandConfirmModal from './DisbandConfirmModal';
import Tooltip from './Tooltip';
import TableHeaderTooltip from './TableHeaderTooltip';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  knowledgeBooks: { name: string; accessLevel: 'View-only' | 'Can Edit' | 'Full access' }[];
  roleGroups: string[];
}

interface FilterState {
  knowledgeBooks: string[];
  roleGroups: string[];
  accessLevels: string[];
}

interface RoleGroup {
  id: string;
  name: string;
  type: 'Enterprise' | 'Custom';
  knowledgeBooks: { name: string; accessLevel: 'View-only' | 'Can Edit' | 'Full access' | 'Revoke' }[];
  memberCount: number;
  members: Member[];
}

const MyTeamsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'roleGroups'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    knowledgeBooks: [],
    roleGroups: [],
    accessLevels: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedKnowledgeBook, setSelectedKnowledgeBook] = useState<{[memberId: string]: string}>({});
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isBulkAddRoleGroupModalOpen, setIsBulkAddRoleGroupModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revokeData, setRevokeData] = useState<{memberId: string; memberName: string; knowledgeBook: string} | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [selectedGroupKnowledgeBook, setSelectedGroupKnowledgeBook] = useState<{[groupId: string]: string}>({});
  const [openGroupMenus, setOpenGroupMenus] = useState<string[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [isDisbandModalOpen, setIsDisbandModalOpen] = useState(false);
  const [disbandGroupData, setDisbandGroupData] = useState<{id: string; name: string} | null>(null);

  // Mock data with actual project names
  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'Anna Taylor',
      email: 'annataylor@email.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      knowledgeBooks: [
        { name: 'Personal Documents', accessLevel: 'View-only' },
        { name: 'Work Projects', accessLevel: 'Can Edit' },
        { name: 'Tech Notes', accessLevel: 'Full access' }
      ],
      roleGroups: ['Engineering Team'],
    },
    {
      id: '2',
      name: 'Corina McCoy',
      email: 'corinamcmc@email.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      knowledgeBooks: [
        { name: 'Chatbot Resources', accessLevel: 'Can Edit' },
        { name: 'Computer Guides', accessLevel: 'View-only' }
      ],
      roleGroups: ['Marketing Team'],
    },
    {
      id: '3',
      name: 'David Elson',
      email: 'david.elson@email.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      knowledgeBooks: [
        { name: 'Financial Records', accessLevel: 'Can Edit' }
      ],
      roleGroups: ['ABC'],
    },
    {
      id: '4',
      name: 'Dennis Callis',
      email: 'dennis.callis@email.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      knowledgeBooks: [
        { name: 'Travel Plans', accessLevel: 'Full access' },
        { name: 'Product Descriptions', accessLevel: 'Can Edit' },
        { name: 'Work Procedures', accessLevel: 'View-only' }
      ],
      roleGroups: ['ABC'],
    },
    {
      id: '5',
      name: 'Kathy Pacheco',
      email: 'kathy1990@email.com',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      knowledgeBooks: [
        { name: 'Shipping Info', accessLevel: 'Full access' }
      ],
      roleGroups: ['ABC'],
    },
    {
      id: '6',
      name: 'Iva Ryan',
      email: 'ivaryan@email.com',
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      knowledgeBooks: [
        { name: 'Tech Support', accessLevel: 'Full access' },
        { name: 'Home Organization', accessLevel: 'Can Edit' }
      ],
      roleGroups: ['Engineering Team'],
    },
    {
      id: '7',
      name: 'Kurt Bates',
      email: 'kurbates@email.com',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      knowledgeBooks: [
        { name: 'Team Contacts', accessLevel: 'View-only' }
      ],
      roleGroups: ['Marketing Team'],
    }
  ]);

  const [roleGroups, setRoleGroups] = useState<RoleGroup[]>([
    {
      id: '1',
      name: 'ABC',
      type: 'Enterprise',
      knowledgeBooks: [
        { name: 'Financial Records', accessLevel: 'Can Edit' },
        { name: 'Travel Plans', accessLevel: 'Full access' },
        { name: 'Shipping Info', accessLevel: 'Full access' }
      ],
      memberCount: 3,
      members: members.slice(2, 5)
    },
    {
      id: '2',
      name: 'Engineering Team',
      type: 'Custom',
      knowledgeBooks: [
        { name: 'Personal Documents', accessLevel: 'View-only' },
        { name: 'Tech Notes', accessLevel: 'Full access' },
        { name: 'Tech Support', accessLevel: 'Full access' }
      ],
      memberCount: 2,
      members: [members[0], members[5]]
    },
    {
      id: '3',
      name: 'Marketing Team',
      type: 'Enterprise',
      knowledgeBooks: [
        { name: 'Chatbot Resources', accessLevel: 'Can Edit' },
        { name: 'Team Contacts', accessLevel: 'View-only' }
      ],
      memberCount: 2,
      members: [members[1], members[6]]
    }
  ]);

  // Initialize selected knowledge books
  React.useEffect(() => {
    const initialSelection: {[memberId: string]: string} = {};
    members.forEach(member => {
      if (member.knowledgeBooks.length > 0) {
        initialSelection[member.id] = member.knowledgeBooks[0].name;
      }
    });
    setSelectedKnowledgeBook(initialSelection);
    
    // Initialize group knowledge book selection
    const initialGroupSelection: {[groupId: string]: string} = {};
    roleGroups.forEach(group => {
      if (group.knowledgeBooks.length > 0) {
        initialGroupSelection[group.id] = group.knowledgeBooks[0].name;
      }
    });
    setSelectedGroupKnowledgeBook(initialGroupSelection);
  }, [members, roleGroups]);

  // Rename handlers
  const handleRenameCancel = React.useCallback(() => {
    setEditingGroupId(null);
    setEditingGroupName('');
  }, []);

  const handleRenameSubmit = React.useCallback((groupId: string) => {
    if (editingGroupName.trim()) {
      const newName = editingGroupName.trim();
      
      // Update the group name in the roleGroups data
      setRoleGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, name: newName }
          : group
      ));
      
      console.log('Role group renamed successfully:', { groupId, newName });
      
      setEditingGroupId(null);
      setEditingGroupName('');
    } else {
      handleRenameCancel();
    }
  }, [editingGroupName, handleRenameCancel]);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on the dropdown menu itself or its children
      if (target?.closest('.group-actions-menu')) {
        return;
      }
      
      // Check if the clicked target is inside an editing input
      if (editingGroupId && target?.closest('.group-name-input')) {
        return; // Don't close menus if clicking on the editing input
      }
      
      setOpenGroupMenus([]);
      
      // Save changes if clicking outside while editing
      if (editingGroupId) {
        handleRenameSubmit(editingGroupId);
      }
    };

    if (openGroupMenus.length > 0 || editingGroupId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openGroupMenus, editingGroupId, handleRenameSubmit]);

  const filteredMembers = members.filter(member => {
    // Search filter
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Knowledge Books filter
    const matchesKnowledgeBooks = filters.knowledgeBooks.length === 0 ||
      member.knowledgeBooks.some(kb => filters.knowledgeBooks.includes(kb.name));
    
    // Role Groups filter
    const matchesRoleGroups = filters.roleGroups.length === 0 ||
      member.roleGroups.some(rg => filters.roleGroups.includes(rg));
    
    // Access Level filter
    const currentKB = selectedKnowledgeBook[member.id];
    const currentAccess = member.knowledgeBooks.find(kb => kb.name === currentKB)?.accessLevel;
    const matchesAccessLevel = filters.accessLevels.length === 0 ||
      (currentAccess && filters.accessLevels.includes(currentAccess));
    
    return matchesSearch && matchesKnowledgeBooks && matchesRoleGroups && matchesAccessLevel;
  });

  const filteredGroups = roleGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMemberSelect = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const clearFilters = () => {
    setFilters({
      knowledgeBooks: [],
      roleGroups: [],
      accessLevels: []
    });
  };

  const getActiveFilterCount = () => {
    return filters.knowledgeBooks.length + filters.roleGroups.length + filters.accessLevels.length;
  };

  const handleKnowledgeBookSelect = (memberId: string, knowledgeBook: string) => {
    setSelectedKnowledgeBook(prev => ({
      ...prev,
      [memberId]: knowledgeBook
    }));
  };

  const handleGroupKnowledgeBookSelect = (groupId: string, knowledgeBook: string) => {
    setSelectedGroupKnowledgeBook(prev => ({
      ...prev,
      [groupId]: knowledgeBook
    }));
  };

  const handleGroupAccessLevelChange = (groupId: string, knowledgeBook: string, newAccessLevel: string) => {
    console.log('Group access level changed:', { groupId, knowledgeBook, newAccessLevel });
    // Handle access level change logic here
  };

  const toggleGroupMenu = (groupId: string) => {
    setOpenGroupMenus(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleRename = (groupId: string, currentName: string) => {
    setEditingGroupId(groupId);
    setEditingGroupName(currentName);
    setOpenGroupMenus([]);
  };

  const handleDisband = (groupId: string, groupName: string) => {
    setDisbandGroupData({ id: groupId, name: groupName });
    setIsDisbandModalOpen(true);
    setOpenGroupMenus([]);
  };

  const handleDisbandConfirm = () => {
    if (disbandGroupData) {
      // Remove the group from roleGroups data
      setRoleGroups(prev => prev.filter(group => group.id !== disbandGroupData.id));
      
      console.log('Role group disbanded successfully:', disbandGroupData.name);
      
      setIsDisbandModalOpen(false);
      setDisbandGroupData(null);
    }
  };

  const handleAccessLevelChange = (memberId: string, newAccessLevel: string) => {
    if (newAccessLevel === 'Revoke') {
      const member = members.find(m => m.id === memberId);
      const currentKB = selectedKnowledgeBook[memberId];
      if (member && currentKB) {
        setRevokeData({
          memberId,
          memberName: member.name,
          knowledgeBook: currentKB
        });
        setIsRevokeModalOpen(true);
      }
    } else {
      // Handle other access level changes
      console.log(`Changing access level for member ${memberId} to ${newAccessLevel}`);
    }
  };

  const handleRevokeConfirm = () => {
    if (revokeData) {
      console.log(`Revoking access for ${revokeData.memberName} from ${revokeData.knowledgeBook}`);
      // Here you would implement the actual revoke logic
      setIsRevokeModalOpen(false);
      setRevokeData(null);
    }
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
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

  const getCurrentAccessLevel = (member: Member) => {
    const currentKB = selectedKnowledgeBook[member.id];
    return member.knowledgeBooks.find(kb => kb.name === currentKB)?.accessLevel || 'View-only';
  };

  // Get unique values for filters
  const allKnowledgeBooks = Array.from(new Set(members.flatMap(m => m.knowledgeBooks.map(kb => kb.name))));
  const allRoleGroups = Array.from(new Set(members.flatMap(m => m.roleGroups)));
  const allAccessLevels = ['View-only', 'Can Edit', 'Full access'];

  return (
    <div className="space-y-6">
      {/* Card-style Button Group Navigation */}
      <div className="bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-lg inline-flex mb-4 shadow-sm">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'members'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-700/50 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Members
        </button>
        <button
          onClick={() => setActiveTab('roleGroups')}
          className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'roleGroups'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-700/50 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Role Groups
        </button>
      </div>

      {/* Search and Add Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder={activeTab === 'members' ? 'Search by name or email' : 'Search by group name'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:border-violet-600 focus:outline-none"
          />
        </div>
        
        {activeTab === 'members' && (
          <div className="flex items-center gap-3">
            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
                  getActiveFilterCount() > 0
                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Filter size={16} />
                <span className="text-sm">Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
              
              {showFilters && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 w-80">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">Filters</h3>
                      {getActiveFilterCount() > 0 && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    
                    {/* Knowledge Books Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Knowledge Books</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {allKnowledgeBooks.map(book => (
                          <label key={book} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.knowledgeBooks.includes(book)}
                              onChange={(e) => handleFilterChange('knowledgeBooks', book, e.target.checked)}
                              className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-600 focus:ring-2 mr-2"
                            />
                            <span className="text-sm text-gray-900 dark:text-white">{book}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Role Groups Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role Groups</h4>
                      <div className="space-y-2">
                        {allRoleGroups.map(group => (
                          <label key={group} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.roleGroups.includes(group)}
                              onChange={(e) => handleFilterChange('roleGroups', group, e.target.checked)}
                              className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-600 focus:ring-2 mr-2"
                            />
                            <span className="text-sm text-gray-900 dark:text-white">{group}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Access Level Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Access Level</h4>
                      <div className="space-y-2">
                        {allAccessLevels.map(level => (
                          <label key={level} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.accessLevels.includes(level)}
                              onChange={(e) => handleFilterChange('accessLevels', level, e.target.checked)}
                              className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-600 focus:ring-2 mr-2"
                            />
                            <span className="text-sm text-gray-900 dark:text-white">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button
          onClick={() => activeTab === 'members' ? setIsAddMemberModalOpen(true) : setIsAddGroupModalOpen(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          {activeTab === 'members' ? 'Members' : 'Group'}
        </button>
      </div>

      {/* Members Tab Content */}
      {activeTab === 'members' && (
        <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-11 gap-4 items-center">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-600 focus:ring-2"
                />
              </div>
              <div className="col-span-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Users</span>
              </div>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Knowledge Books</span>
                  <TableHeaderTooltip text="Switch Knowledge Books from the dropdown to view the user's Access Level for each.">
                    <Info size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                  </TableHeaderTooltip>
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role Groups</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Access Level</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMembers.map((member) => (
              <div key={member.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="grid grid-cols-11 gap-4 items-center">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleMemberSelect(member.id)}
                      className="w-4 h-4 text-violet-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-violet-600 focus:ring-2"
                    />
                  </div>
                  <div className="col-span-3 flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{member.email}</div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <KnowledgeBooksDropdown
                      member={member}
                      selectedKnowledgeBook={selectedKnowledgeBook[member.id] || member.knowledgeBooks[0]?.name}
                      onKnowledgeBookSelect={handleKnowledgeBookSelect}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {member.roleGroups.join(', ')}
                        {member.roleGroups.length > 1 && (
                          <span className="ml-1 text-gray-500 dark:text-gray-400">+{member.roleGroups.length - 1}</span>
                        )}
                      </span>
                      <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <AccessLevelDropdown
                      member={member}
                      selectedKnowledgeBook={selectedKnowledgeBook[member.id] || member.knowledgeBooks[0]?.name}
                      onAccessLevelChange={handleAccessLevelChange}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No members found</div>
              <div className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search terms</div>
            </div>
          )}
        </div>
      )}

      {/* Role Groups Tab Content */}
      {activeTab === 'roleGroups' && (
        <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1"></div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Group Name</span>
              </div>
              <div className="col-span-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</span>
              </div>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Knowledge Books</span>
                  <TableHeaderTooltip text="Switch Knowledge Books from the dropdown to view the user's Access Level for each.">
                    <Info size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                  </TableHeaderTooltip>
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Access Level</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Actions</span>
              </div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredGroups.map((group) => (
              <div key={group.id}>
                <div className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <button
                        onClick={() => toggleGroupExpansion(group.id)}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <ChevronRight
                          size={20}
                          className={`transform transition-transform ${
                            expandedGroups.includes(group.id) ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    </div>
                    <div className="col-span-2">
                      {editingGroupId === group.id ? (
                        <input
                          type="text"
                          value={editingGroupName}
                          onChange={(e) => setEditingGroupName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleRenameSubmit(group.id);
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              handleRenameCancel();
                            }
                          }}
                          onBlur={() => handleRenameSubmit(group.id)}
                          className="group-name-input w-full px-2 py-1 text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-violet-300 dark:border-violet-600 rounded focus:outline-none focus:border-violet-500"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900 dark:text-white">{group.name}</span>
                      )}
                    </div>
                    <div className="col-span-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        group.type === 'Enterprise' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        {group.type}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <RoleGroupKnowledgeBooksDropdown
                        group={group}
                        selectedKnowledgeBook={selectedGroupKnowledgeBook[group.id] || group.knowledgeBooks[0]?.name}
                        onKnowledgeBookSelect={handleGroupKnowledgeBookSelect}
                      />
                    </div>
                    <div className="col-span-2">
                      <RoleGroupAccessLevelDropdown
                        group={group}
                        selectedKnowledgeBook={selectedGroupKnowledgeBook[group.id] || group.knowledgeBooks[0]?.name}
                        onAccessLevelChange={handleGroupAccessLevelChange}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="relative">
                        <button
                          onClick={() => toggleGroupMenu(group.id)}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {openGroupMenus.includes(group.id) && (
                          <div className="group-actions-menu absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-32">
                            <button
                              onClick={() => handleRename(group.id, group.name)}
                              className="w-full px-3 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => handleDisband(group.id, group.name)}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            >
                              Disband
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1"></div>
                  </div>
                </div>

                {/* Expanded Group Members */}
                {expandedGroups.includes(group.id) && (
                  <div className="px-6 pb-4 bg-gray-50 dark:bg-gray-800/20">
                    <div className="pl-8 space-y-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Group Members ({group.memberCount})
                      </div>
                      {group.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 py-2">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No role groups found</div>
              <div className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search terms</div>
            </div>
          )}
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectedMembers.length > 0 && activeTab === 'members' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-violet-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-4 z-50">
          <span className="text-sm font-medium">
            {selectedMembers.length} selected
          </span>
          
          <Tooltip text="Add to Role Groups" position="top">
            <button
              onClick={() => setIsBulkAddRoleGroupModalOpen(true)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Add to Role Groups"
            >
              <Users size={18} />
            </button>
          </Tooltip>
          
          <Tooltip text="Cancel" position="top">
            <button 
              onClick={() => setSelectedMembers([])}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onSubmit={(memberData) => {
          console.log('Add member:', memberData);
          setIsAddMemberModalOpen(false);
        }}
      />

      {/* Add Group Modal */}
      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={() => setIsAddGroupModalOpen(false)}
        onSubmit={(groupData) => {
          // Create new role group
          const newGroup = {
            id: (roleGroups.length + 1).toString(),
            name: groupData.name,
            type: 'Custom' as const,
            knowledgeBooks: groupData.knowledgeBooks.map(kb => ({
              name: kb,
              accessLevel: groupData.accessLevel === 'Full Access' ? 'Full access' as const : groupData.accessLevel as 'View-only' | 'Can Edit'
            })),
            memberCount: groupData.members.length,
            members: groupData.members.map(email => {
              const existingMember = members.find(m => m.email === email);
              return existingMember || {
                id: `temp_${email}`,
                name: email.split('@')[0],
                email: email,
                avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
                knowledgeBooks: [],
                roleGroups: [groupData.name]
              };
            })
          };

          // Add the new group to roleGroups
          setRoleGroups(prev => [...prev, newGroup]);
          
          console.log('Role group created successfully:', newGroup);
          setIsAddGroupModalOpen(false);
        }}
      />

      {/* Bulk Add Role Group Modal */}
      <BulkAddRoleGroupModal
        isOpen={isBulkAddRoleGroupModalOpen}
        onClose={() => setIsBulkAddRoleGroupModalOpen(false)}
        selectedMembers={selectedMembers}
        availableRoleGroups={roleGroups}
        onSubmit={(data) => {
          console.log('Bulk add to role groups:', data);
          setIsBulkAddRoleGroupModalOpen(false);
          setSelectedMembers([]);
        }}
      />



      {/* Revoke Access Modal */}
      <RevokeAccessModal
        isOpen={isRevokeModalOpen}
        onClose={() => {
          setIsRevokeModalOpen(false);
          setRevokeData(null);
        }}
        onConfirm={handleRevokeConfirm}
        memberName={revokeData?.memberName || ''}
        knowledgeBookName={revokeData?.knowledgeBook || ''}
      />

      {/* Disband Confirm Modal */}
      <DisbandConfirmModal
        isOpen={isDisbandModalOpen}
        onClose={() => {
          setIsDisbandModalOpen(false);
          setDisbandGroupData(null);
        }}
        onConfirm={handleDisbandConfirm}
        groupName={disbandGroupData?.name || ''}
      />
    </div>
  );
};

export default MyTeamsTab;