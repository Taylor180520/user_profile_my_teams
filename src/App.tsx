import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import KnowledgeBaseCard from './components/KnowledgeBaseCard';
import CreateCentralKBModal from './components/CreateCentralKBModal';
import EditCentralKBModal from './components/EditCentralKBModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import UploadDocumentsPage from './components/UploadDocumentsPage';
import AddSourcesModal from './components/AddSourcesModal';
import ChatInterface from './components/ChatInterface';
import TopNotification from './components/TopNotification';
import MyTeamsTab from './components/MyTeamsTab';

interface KnowledgeBase {
  id: string;
  title: string;
  emoji: string;
  status: 'Public' | 'Private';
  isCentral: boolean;
  roleTags?: string[];
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainTab, setActiveMainTab] = useState<'knowledgeBooks' | 'myTeams'>('knowledgeBooks');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddSourcesModalOpen, setIsAddSourcesModalOpen] = useState(false);
  const [showUploadNotification, setShowUploadNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'upload'>('home');
  const [currentKB, setCurrentKB] = useState<KnowledgeBase | null>(null);
  const [editingKB, setEditingKB] = useState<KnowledgeBase | null>(null);
  const [deletingKB, setDeletingKB] = useState<KnowledgeBase | null>(null);
  const [currentKBName, setCurrentKBName] = useState('');
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([
    { id: '0', title: 'Getting Started with Your KB', emoji: '🎯', status: 'Public', isCentral: false, roleTags: ['system'] },
    { id: '1', title: 'Personal Documents', emoji: '📄', status: 'Public', isCentral: true, roleTags: ['UNIS/Engineering/Manager'] },
    { id: '2', title: 'Work Projects', emoji: '🏢', status: 'Public', isCentral: true, roleTags: ['UNIS/Sales/Lead', 'UNIS/Marketing'] },
    { id: '3', title: 'Chatbot Resources', emoji: '👥', status: 'Public', isCentral: true, roleTags: ['UNIS/Engineering/Developer'] },
    { id: '4', title: 'Tech Notes', emoji: '🏭', status: 'Public', isCentral: true, roleTags: ['UNIS/IT/Admin', 'UNIS/Engineering/Manager'] },
    { id: '5', title: 'Computer Guides', emoji: '📋', status: 'Public', isCentral: true, roleTags: ['UNIS/Support/Specialist'] },
    { id: '6', title: 'Financial Records', emoji: '📊', status: 'Public', isCentral: false, roleTags: ['UNIS/Finance/Analyst'] },
    { id: '7', title: 'Travel Plans', emoji: '🚚', status: 'Public', isCentral: false },
    { id: '8', title: 'Product Descriptions', emoji: '📋', status: 'Public', isCentral: false, roleTags: ['UNIS/Product/Manager'] },
    { id: '9', title: 'Work Procedures', emoji: '📝', status: 'Public', isCentral: false },
    { id: '10', title: 'Shipping Info', emoji: '📦', status: 'Private', isCentral: false, roleTags: ['UNIS/Operations/Lead'] },
    { id: '11', title: 'Tech Support', emoji: '💻', status: 'Public', isCentral: false },
    { id: '12', title: 'Home Organization', emoji: '🏗️', status: 'Public', isCentral: false, roleTags: ['UNIS/Facilities/Manager'] },
    { id: '13', title: 'Team Contacts', emoji: '👥', status: 'Public', isCentral: false },
    { id: '14', title: 'Package Tracking', emoji: '📦', status: 'Public', isCentral: false, roleTags: ['UNIS/Logistics/Coordinator'] },
    { id: '15', title: 'Commute Options', emoji: '🚚', status: 'Public', isCentral: false },
  ]);

  const filteredKnowledgeBases = knowledgeBases.filter(kb =>
    kb.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCentralKB = (name: string, emoji: string) => {
    const newKB: KnowledgeBase = {
      id: Date.now().toString(),
      title: name,
      emoji,
      status: 'Public',
      isCentral: true
    };
    setKnowledgeBases(prev => [newKB, ...prev]);
    setCurrentKB(newKB);
    setIsAddSourcesModalOpen(true);
    setIsCreateModalOpen(false);
  };

  const handleKBClick = (kb: KnowledgeBase) => {
    setCurrentKB(kb);
    setCurrentPage('chat');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setCurrentKB(null);
  };

  const handleGoToUpload = () => {
    if (currentKB?.isCentral) {
      setIsAddSourcesModalOpen(true);
    } else {
      setCurrentPage('upload');
    }
  };

  const handleEditKB = (id: string) => {
    const kb = knowledgeBases.find(kb => kb.id === id);
    if (kb) {
      setEditingKB(kb);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteKB = (id: string) => {
    const kb = knowledgeBases.find(kb => kb.id === id);
    if (kb) {
      setDeletingKB(kb);
      setIsDeleteModalOpen(true);
    }
  };

  const handleEditSubmit = (name: string, emoji: string) => {
    if (editingKB) {
      setKnowledgeBases(prev => 
        prev.map(kb => 
          kb.id === editingKB.id 
            ? { ...kb, title: name, emoji } 
            : kb
        )
      );
      setEditingKB(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingKB) {
      setKnowledgeBases(prev => prev.filter(kb => kb.id !== deletingKB.id));
      setDeletingKB(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleUploadConfirm = () => {
    setShowUploadNotification(true);
  };

  // Render Upload Documents Page
  if (currentPage === 'upload' && currentKB) {
    return (
      <>
        <UploadDocumentsPage
          knowledgeBaseName={currentKB.title}
          onClose={handleBackToHome}
        />
        
        {/* Add Sources Modal - Available globally */}
        <AddSourcesModal
          isOpen={isAddSourcesModalOpen}
          knowledgeBaseName={currentKB?.title || ''}
          knowledgeBaseEmoji={currentKB?.emoji || '📂'}
          onClose={() => setIsAddSourcesModalOpen(false)}
          onConfirm={handleUploadConfirm}
        />

        {/* Top Notification */}
        <TopNotification
          message="Upload received"
          isVisible={showUploadNotification}
          onHide={() => setShowUploadNotification(false)}
        />
      </>
    );
  }

  // Render Chat Interface
  if (currentPage === 'chat' && currentKB) {
    return (
      <>
        <ChatInterface
          knowledgeBaseName={currentKB.title}
          knowledgeBaseEmoji={currentKB.emoji}
          onBack={handleBackToHome}
          onAddDocuments={handleGoToUpload}
          isIntroductory={currentKB.id === '0'}
        />
        
        {/* Add Sources Modal - Available globally */}
        <AddSourcesModal
          isOpen={isAddSourcesModalOpen}
          knowledgeBaseName={currentKB?.title || ''}
          knowledgeBaseEmoji={currentKB?.emoji || '📂'}
          onClose={() => setIsAddSourcesModalOpen(false)}
          onConfirm={handleUploadConfirm}
        />

        {/* Top Notification */}
        <TopNotification
          message="Upload received"
          isVisible={showUploadNotification}
          onHide={() => setShowUploadNotification(false)}
        />
      </>
    );
  }

  // Render Home Page
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white">My Knowledge Space</h1>
            <ThemeToggle />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base mb-6">
            This is your self‑managed knowledge space—completely under your control. Effortlessly organize your notes, ideas, and insights, and share individual articles or entire topic collections with teammates or designated role groups anytime
          </p>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search my knowledge books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                />
              </div>
              
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Create
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setActiveMainTab('knowledgeBooks')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeMainTab === 'knowledgeBooks'
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Knowledge Books
                </button>
                <button
                  onClick={() => setActiveMainTab('myTeams')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeMainTab === 'myTeams'
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  My Teams
                </button>
              </div>
              {activeMainTab === 'knowledgeBooks' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeMainTab === 'knowledgeBooks' ? (
          <>
            {/* Knowledge Base Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredKnowledgeBases.map((kb) => (
                <KnowledgeBaseCard
                  key={kb.id}
                  id={kb.id}
                  title={kb.title}
                  emoji={kb.emoji}
                  status={kb.status}
                  isCentral={kb.isCentral}
                  roleTags={kb.roleTags}
                  onClick={() => handleKBClick(kb)}
                  onEdit={handleEditKB}
                  onDelete={handleDeleteKB}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredKnowledgeBases.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No knowledge bases found</div>
                <div className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search terms</div>
              </div>
            )}
          </>
        ) : (
          <MyTeamsTab />
        )}
      </div>

      {/* Create Central KB Modal */}
      <CreateCentralKBModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCentralKB}
      />

      {/* Edit Central KB Modal */}
      <EditCentralKBModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingKB(null);
        }}
        onSubmit={handleEditSubmit}
        currentName={editingKB?.title || ''}
        currentEmoji={editingKB?.emoji || ''}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingKB(null);
        }}
        onConfirm={handleDeleteConfirm}
        knowledgeBaseName={deletingKB?.title || ''}
      />

      {/* Add Sources Modal - Available globally */}
      <AddSourcesModal
        isOpen={isAddSourcesModalOpen}
        knowledgeBaseName={currentKB?.title || ''}
        knowledgeBaseEmoji={currentKB?.emoji || '📂'}
        onClose={() => setIsAddSourcesModalOpen(false)}
        onConfirm={handleUploadConfirm}
      />

      {/* Top Notification */}
      <TopNotification
        message="Upload received"
        isVisible={showUploadNotification}
        onHide={() => setShowUploadNotification(false)}
      />
    </div>
  );
}

export default App;