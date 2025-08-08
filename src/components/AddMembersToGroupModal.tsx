import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddMembersToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberEmails: string[]) => void;
  groupName: string;
}

const AddMembersToGroupModal: React.FC<AddMembersToGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  groupName
}) => {
  const [formData, setFormData] = useState({
    emails: [] as string[],
    currentEmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.emails.length > 0) {
      onSubmit(formData.emails);
      setFormData({
        emails: [],
        currentEmail: ''
      });
    }
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
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg border border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">
            Add Members to "{groupName}"
          </h2>
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Add member email addresses and press Enter for each one
            </p>
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
              disabled={formData.emails.length === 0}
              className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Add Members
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMembersToGroupModal; 