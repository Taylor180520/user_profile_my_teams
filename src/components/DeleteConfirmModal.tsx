import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  knowledgeBaseName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  knowledgeBaseName
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const isConfirmationValid = confirmationText === knowledgeBaseName;

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm();
      setConfirmationText(''); // Reset input
    }
  };

  const handleClose = () => {
    setConfirmationText(''); // Reset input when closing
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-medium text-white">Delete Knowledge Base</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-3">
            This action <strong className="text-red-400">cannot be undone</strong>. This will permanently delete the knowledge base and all its documents.
          </p>
          
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-4">
            <p className="text-gray-300 text-sm mb-2">
              Knowledge base to be deleted:
            </p>
            <p className="text-white font-medium text-lg break-words">
              "{knowledgeBaseName}"
            </p>
          </div>

          <p className="text-gray-300 text-sm mb-3">
            Please type <code className="bg-gray-800 px-2 py-1 rounded text-red-400 font-mono text-sm">{knowledgeBaseName}</code> to confirm:
          </p>
          
          <div className="relative">
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Type the knowledge base name here"
              className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                confirmationText.length > 0
                  ? isConfirmationValid
                    ? 'border-green-500 focus:border-green-400'
                    : 'border-red-500 focus:border-red-400'
                  : isInputFocused
                  ? 'border-purple-600'
                  : 'border-gray-600'
              }`}
              autoComplete="off"
              spellCheck="false"
            />
            {confirmationText.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isConfirmationValid ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {confirmationText.length > 0 && !isConfirmationValid && (
            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              The name doesn't match. Please check your spelling.
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmationValid}
            className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
              isConfirmationValid
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Delete Knowledge Base
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;