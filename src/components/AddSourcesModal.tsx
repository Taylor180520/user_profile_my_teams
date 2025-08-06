import React, { useState, useRef } from 'react';
import { X, Upload, Link, FileText, Plus, Trash2 } from 'lucide-react';

interface AddSourcesModalProps {
  isOpen: boolean;
  knowledgeBaseName: string;
  knowledgeBaseEmoji: string;
  onClose: () => void;
  onConfirm?: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: number;
  sourceType: 'file';
}

interface WebsiteLink {
  id: string;
  url: string;
  title: string;
  addedAt: number;
  sourceType: 'link';
  error?: string;
  isValidating?: boolean;
}

type Source = UploadedFile | WebsiteLink;

const AddSourcesModal: React.FC<AddSourcesModalProps> = ({
  isOpen,
  knowledgeBaseName,
  knowledgeBaseEmoji,
  onClose,
  onConfirm
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'links'>('files');
  const [sources, setSources] = useState<Source[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [tooltipError, setTooltipError] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      addedAt: Date.now(),
      sourceType: 'file'
    }));
    
    setSources(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const validateUrl = async (url: string): Promise<{ isValid: boolean; title: string; error?: string }> => {
    try {
      // Basic URL format validation
      const urlObject = new URL(url);
      
      // Check if protocol is supported
      if (!['http:', 'https:'].includes(urlObject.protocol)) {
        return {
          isValid: false,
          title: url,
          error: 'Upload failed due to an error fetching the URL. Please try again.'
        };
      }

      // For demo purposes, we'll simulate URL validation
      // In real implementation, you would make an actual HTTP request
      const isValidUrl = await new Promise<boolean>((resolve) => {
        setTimeout(() => {
          // Simulate some URLs as invalid for demo
          const invalidDomains = ['invalid.com', 'error.test', 'fail.example'];
          const isInvalid = invalidDomains.some(domain => url.includes(domain));
          resolve(!isInvalid);
        }, 1000);
      });

      if (!isValidUrl) {
        return {
          isValid: false,
          title: urlObject.hostname,
          error: 'Upload failed due to an error fetching the URL. Please try again.'
        };
      }

      return {
        isValid: true,
        title: urlObject.hostname
      };
    } catch (error) {
      return {
        isValid: false,
        title: url,
        error: 'Upload failed due to an error fetching the URL. Please try again.'
      };
    }
  };

  const addWebsiteLink = async () => {
    if (!newLinkUrl.trim()) return;

    const linkId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Add link with validating status
    const tempLink: WebsiteLink = {
      id: linkId,
      url: newLinkUrl.trim(),
      title: 'Validating...',
      addedAt: Date.now(),
      sourceType: 'link',
      isValidating: true
    };
    
    setSources(prev => [...prev, tempLink]);
    setNewLinkUrl('');

    // Validate URL
    const validation = await validateUrl(newLinkUrl.trim());
    
    // Update the link with validation results
    setSources(prev => prev.map(source => {
      if (source.id === linkId && source.sourceType === 'link') {
        return {
          ...source,
          title: validation.title,
          error: validation.error,
          isValidating: false
        };
      }
      return source;
    }));
  };

  const removeSource = (id: string) => {
    setSources(prev => prev.filter(source => source.id !== id));
  };

  const handleMouseEnter = (event: React.MouseEvent, errorMessage: string) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right - 200, // Position 200px from the right edge of the icon
      y: rect.top - 10 // Position above the icon
    });
    setTooltipError(errorMessage);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📝';
    if (type.includes('audio')) return '🎵';
    if (type.includes('video')) return '🎥';
    return '📄';
  };

  const handleConfirm = () => {
    // Filter out links with errors
    const validSources = sources.filter(source => {
      if (source.sourceType === 'link') {
        return !source.error && !source.isValidating;
      }
      return true;
    });
    
    if (validSources.length === 0) return;
    
    // Handle the upload confirmation
    console.log('Valid sources:', validSources);
    // Reset state
    setSources([]);
    setNewLinkUrl('');
    setActiveTab('files');
    onClose();
    // Notify parent component about upload
    onConfirm?.();
  };

  const handleClose = () => {
    // Reset state when closing
    setSources([]);
    setNewLinkUrl('');
    setActiveTab('files');
    onClose();
  };

  // Sort sources by addedAt timestamp to maintain order
  const sortedSources = [...sources].sort((a, b) => a.addedAt - b.addedAt);
  const fileCount = sources.filter(s => s.sourceType === 'file').length;
  const linkCount = sources.filter(s => s.sourceType === 'link' && !s.error && !s.isValidating).length;
  const errorCount = sources.filter(s => s.sourceType === 'link' && s.error).length;
  const validatingCount = sources.filter(s => s.sourceType === 'link' && s.isValidating).length;
  const validSources = sources.filter(source => {
    if (source.sourceType === 'link') {
      return !source.error && !source.isValidating;
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-5xl max-h-[90vh] border border-gray-700 shadow-2xl relative">
        {/* Global Tooltip */}
        {showTooltip && (
          <div
            className="fixed px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg border border-gray-700 z-[60] pointer-events-none whitespace-nowrap"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            {tooltipError}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-gray-700 border-r border-b rotate-45"></div>
          </div>
        )}
        
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="text-2xl">{knowledgeBaseEmoji}</div>
              <div>
                <h1 className="text-xl font-medium text-white">Add sources</h1>
                <p className="text-gray-400 text-sm">
                  Add sources to <span className="text-purple-400">{knowledgeBaseName}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Sources enable your knowledge base to provide intelligent responses based on the information that matters most to your team.
                  <br />
                  (Examples: project documents, meeting notes, research reports, business manuals, training materials, etc.)
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-1 mb-6 bg-gray-800/50 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('files')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 text-sm ${
                    activeTab === 'files'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <FileText size={16} />
                  Files
                </button>
                <button
                  onClick={() => setActiveTab('links')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 text-sm ${
                    activeTab === 'links'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Link size={16} />
                  Website Links
                </button>
              </div>

              {/* Tab Content */}
              <div className="mb-6">
                {/* Files Tab */}
                {activeTab === 'files' && (
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                        isDragOver
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                          <Upload size={24} className="text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-green-400 mb-2">
                          Choose One/Multiple or drag and drop them here
                        </h3>
                        <p className="text-white mb-3 text-sm">
                          Tip: Hold the Shift key to select multiple files.
                        </p>
                        <p className="text-gray-500 text-xs">
                          Supported file types: PDF, Word, PPTX, Excel, CSV, JSON, Text, Markdown, HTML, PNG, JPEG, TIFF, BMP, HEIC
                        </p>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      accept=".pdf,.txt,.md,.mp3,.wav,.m4a,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.json,.html,.png,.jpg,.jpeg,.tiff,.bmp,.heic"
                    />
                  </div>
                )}

                {/* Website Links Tab */}
                {activeTab === 'links' && (
                  <div className="space-y-4">
                    {/* Add Link Form */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <h3 className="text-base font-medium text-white mb-4">Add Website Link</h3>
                      <div className="relative">
                        <input
                          type="url"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addWebsiteLink();
                            }
                          }}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 pr-16 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 text-sm"
                        />
                        <button
                          onClick={addWebsiteLink}
                          disabled={!newLinkUrl.trim()}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded transition-colors text-xs"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Unified Sources Display - Always Visible */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium text-white">
                    Sources ({sources.length})
                  </h3>
                  {sources.length > 0 && (
                    <div className="text-xs text-gray-400">
                      {fileCount > 0 && `${fileCount} file${fileCount !== 1 ? 's' : ''}`}
                      {fileCount > 0 && (linkCount > 0 || errorCount > 0 || validatingCount > 0) && ' • '}
                      {linkCount > 0 && `${linkCount} link${linkCount !== 1 ? 's' : ''}`}
                      {errorCount > 0 && ` • ${errorCount} error${errorCount !== 1 ? 's' : ''}`}
                      {validatingCount > 0 && ` • ${validatingCount} validating`}
                    </div>
                  )}
                </div>

                {sources.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {sortedSources.map((source, index) => (
                      <div
                        key={source.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          source.sourceType === 'link' && source.error
                            ? 'bg-red-900/20 border-red-500/50 hover:bg-red-900/30'
                            : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-mono w-5 text-center">
                              {index + 1}
                            </span>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                              {source.sourceType === 'file' ? (
                                <span className="text-base">{getFileIcon(source.type)}</span>
                              ) : (
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                  source.error ? 'bg-red-600/20' : 'bg-purple-600/20'
                                }`}>
                                  {source.isValidating ? (
                                    <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Link size={14} className={source.error ? 'text-red-400' : 'text-purple-400'} />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            {source.sourceType === 'file' ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <p className="text-white font-medium truncate text-sm">{source.name}</p>
                                  <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full font-medium">
                                    FILE
                                  </span>
                                </div>
                                <p className="text-gray-400 text-xs">{formatFileSize(source.size)}</p>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium truncate text-sm ${
                                    source.error ? 'text-red-400' : 'text-white'
                                  }`}>
                                    {source.title}
                                  </p>
                                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                    source.error 
                                      ? 'bg-red-600/20 text-red-400' 
                                      : 'bg-green-600/20 text-green-400'
                                  }`}>
                                    {source.error ? 'ERROR' : 'LINK'}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {source.sourceType === 'link' && source.error && (
                            <div
                              className="w-5 h-5 bg-red-100 border border-red-300 rounded-full flex items-center justify-center flex-shrink-0 cursor-help"
                              onMouseEnter={(e) => handleMouseEnter(e, source.error!)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-600">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                              </svg>
                            </div>
                          )}
                          <button
                            onClick={() => removeSource(source.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-gray-700/50 flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700">
                    <p className="text-gray-400 mb-1 text-sm">No sources added yet</p>
                    <p className="text-gray-500 text-xs">
                      Upload files or add website links using the tabs above
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions - Fixed */}
          <div className="border-t border-gray-700 p-6">
            <div className="flex justify-end items-center">
              <div className="text-gray-400 text-sm mr-auto">
                {validSources.length > 0 && (
                  <span>{validSources.length} source{validSources.length !== 1 ? 's' : ''} ready to upload</span>
                )}
                {errorCount > 0 && (
                  <span className="text-red-400 block">
                    {errorCount} link{errorCount !== 1 ? 's' : ''} with errors - please fix or remove
                  </span>
                )}
                {validatingCount > 0 && (
                  <span className="text-yellow-400 block">
                    {validatingCount} link{validatingCount !== 1 ? 's' : ''} validating...
                  </span>
                )}
              </div>
              <button
                onClick={handleConfirm}
                disabled={validSources.length === 0 || validatingCount > 0}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSourcesModal;