import React, { useState } from 'react';
import { Search, Plus, User, LogOut, Users, Home, Bell, Menu, X, UserCog, Edit, Building, ExternalLink } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import MyTeamsTab from './components/MyTeamsTab';

function App() {
  const [currentPage, setCurrentPage] = useState<'profile' | 'myTeams'>('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const sidebarItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'myTeams', label: 'My Teams', icon: Users },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleUserMenuItemClick = (action: string) => {
    if (action === 'myTeams') {
      setCurrentPage('myTeams');
      setIsMobileMenuOpen(false);
    } else if (action === 'editProfile') {
      setCurrentPage('profile');
      setIsMobileMenuOpen(false);
    }
    setIsUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target?.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Teams Tab Navigation Component
  const TeamsTabNavigation: React.FC = () => {
    const [activeTeamsTab, setActiveTeamsTab] = useState<'knowledgeSpace' | 'apiWorkspace' | 'projectManagement'>('knowledgeSpace');

    const teamsTabItems = [
      { id: 'knowledgeSpace', label: 'My Knowledge Space' },
      { id: 'apiWorkspace', label: 'API Workspace', comingSoon: true },
      { id: 'projectManagement', label: 'Project Management', comingSoon: true },
    ];

    return (
      <div>
        {/* Teams Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Teams Tabs">
            {teamsTabItems.map((tab) => (
              <div key={tab.id} className="flex items-center">
                <button
                  onClick={() => !tab.comingSoon && setActiveTeamsTab(tab.id as 'knowledgeSpace' | 'apiWorkspace' | 'projectManagement')}
                  disabled={tab.comingSoon}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTeamsTab === tab.id && !tab.comingSoon
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : tab.comingSoon
                      ? 'border-transparent text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                  {tab.comingSoon && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                      Coming Soon
                    </span>
                  )}
                </button>
                
                {/* Add external link icon for My Knowledge Space */}
                {tab.id === 'knowledgeSpace' && (
                  <button
                    onClick={() => {
                      // This could navigate to a dedicated Knowledge Space page
                      console.log('Navigate to My Knowledge Space module');
                    }}
                    className="ml-1 p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    title="Go to My Knowledge Space"
                  >
                    <ExternalLink size={16} />
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Teams Tab Content */}
        {activeTeamsTab === 'knowledgeSpace' && (
          <MyTeamsTab />
        )}

        {activeTeamsTab === 'apiWorkspace' && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">API Workspace</div>
            <div className="text-gray-400 dark:text-gray-500 text-sm">Coming soon - Manage your API teams and collaborative development spaces</div>
          </div>
        )}

        {activeTeamsTab === 'projectManagement' && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">Project Management</div>
            <div className="text-gray-400 dark:text-gray-500 text-sm">Coming soon - Coordinate projects and manage team workflows</div>
          </div>
        )}
      </div>
    );
  };

  const renderProfilePage = () => (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">My Profile</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Photo Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Photo</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This will be displayed on your profile and throughout the marketplace.
        </p>
        <div className="flex items-center gap-4">
          <img 
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" 
            alt="Profile" 
            className="w-16 h-16 rounded-full object-cover"
          />
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
            Update photo
          </button>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              defaultValue="taylor.zhang@item.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="taylor.zhang@item.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              defaultValue="taylor"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              defaultValue="zhang"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            defaultValue="AI enthusiast and developer working on machine learning projects."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Organization & Department Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Organization & Department</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This information is managed by your organization's administrator.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tenant
          </label>
          <input
            type="text"
            defaultValue="Item"
            disabled
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Logo and navigation */}
            <div className="flex items-center ml-2 lg:ml-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">I</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">Item Marketplace</span>
              </div>
              
              <div className="hidden lg:flex items-center space-x-8 ml-10">
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">AI Agents</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">MCP</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Knowledge Base</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">APIs</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">API</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">SaaS</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">RaaS</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Tools</a>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search marketplace..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>
            
            {/* Notification bell */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Bell size={20} />
            </button>
            
            {/* Admin Dashboard */}
            <div className="relative group">
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <UserCog size={20} />
              </button>
              
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Enterprise User Management
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
              </div>
            </div>
            
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* User avatar and dropdown */}
            <div className="user-menu-container relative">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2" 
                  alt="User" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">T</span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2" 
                        alt="User" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">taylor.zhang@item.com</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">taylor.zhang@item.com</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => handleUserMenuItemClick('editProfile')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit size={18} />
                      <span>Edit Profile</span>
                    </button>
                    
                    <button
                      onClick={() => handleUserMenuItemClick('myTeams')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Users size={18} />
                      <span>My Teams</span>
                    </button>
                    
                    <button
                      onClick={() => handleUserMenuItemClick('item')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Building size={18} />
                      <span>Item</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700 pt-4">
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Home</a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">AI Agents</a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Knowledge Base</a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">APIs</a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">Tools</a>
          </div>
        )}
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 min-h-screen`}>
          <div className="p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as 'profile' | 'myTeams');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      currentPage === item.id
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Sign Out Button */}
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'profile' && renderProfilePage()}
            {currentPage === 'myTeams' && (
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-medium text-gray-900 dark:text-white">My Teams</h1>
                  <p className="text-gray-600 dark:text-gray-300 text-base mt-2">
                    Manage your team members and role groups across different modules.
                  </p>
                </div>
                
                {/* Teams Tab Navigation */}
                <TeamsTabNavigation />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;