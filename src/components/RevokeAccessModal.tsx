import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface RevokeAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
  knowledgeBookName: string;
}

const RevokeAccessModal: React.FC<RevokeAccessModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  memberName,
  knowledgeBookName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Confirm Access Revocation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You are about to revoke <strong className="text-gray-900 dark:text-white">{memberName}'s</strong> access to{' '}
              <strong className="text-purple-600 dark:text-purple-400">{knowledgeBookName}</strong>.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              This action will not affect their permissions in other knowledge books.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-3 font-medium">
              Do you want to proceed?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Confirm Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevokeAccessModal;