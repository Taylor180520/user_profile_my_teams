import React, { useState } from 'react';
import { X, Upload, ArrowLeft } from 'lucide-react';

interface UploadDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBaseName: string;
}

const UploadDocumentsModal: React.FC<UploadDocumentsModalProps> = ({
  isOpen,
  onClose,
  knowledgeBaseName
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    company: '',
    department: '',
    position: '',
    facility: '',
    urls: '',
    folderName: '',
    process: '',
    documentName: '',
    customers: '',
    retailer: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-white">Upload Documents</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                1
              </div>
              <span className="ml-2 text-green-400 text-sm">Contributor Info</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-600 mx-4">
              <div className={`h-full transition-all duration-300 ${
                currentStep >= 2 ? 'bg-green-600' : 'bg-gray-600'
              }`} style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                2
              </div>
              <span className="ml-2 text-green-400 text-sm">Document Details</span>
            </div>
          </div>

          {/* Step 1: Contributor Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                  placeholder="190769413964851969"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                  placeholder="taylor.zhang张"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                    placeholder="Item"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                    placeholder="IT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                    placeholder="BA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Facility
                </label>
                <input
                  type="text"
                  value={formData.facility}
                  onChange={(e) => handleInputChange('facility', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                  placeholder="Enter facility"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Document Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Files *
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-300 mb-2">
                    <span className="text-green-400">Choose One/Multiple</span> or drag and drop them here
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Tip: Hold the Shift key to select multiple files.
                  </p>
                  <p className="text-gray-500 text-xs">
                    Supported file types: PDF, Word, PPTX, Excel, CSV, JSON, Text, Markdown, HTML, PNG, JPEG, TIFF, BMP, HEIC
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL Links
                </label>
                <textarea
                  value={formData.urls}
                  onChange={(e) => handleInputChange('urls', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                  rows={3}
                  placeholder="Press Enter after each URL to add multiple URLs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Folder Name *
                  </label>
                  <select
                    value={formData.folderName}
                    onChange={(e) => handleInputChange('folderName', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-600 focus:outline-none"
                  >
                    <option value="">Select Folder</option>
                    <option value="documents">Documents</option>
                    <option value="reports">Reports</option>
                    <option value="procedures">Procedures</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Process
                  </label>
                  <select
                    value={formData.process}
                    onChange={(e) => handleInputChange('process', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-600 focus:outline-none"
                  >
                    <option value="">Select process</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="training">Training</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Document Name *
                  </label>
                  <select
                    value={formData.documentName}
                    onChange={(e) => handleInputChange('documentName', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-600 focus:outline-none"
                  >
                    <option value="">Enter document name</option>
                    <option value="manual">Manual</option>
                    <option value="guide">Guide</option>
                    <option value="policy">Policy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Customers *
                  </label>
                  <input
                    type="text"
                    value={formData.customers}
                    onChange={(e) => handleInputChange('customers', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                    placeholder="General"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Retailer *
                  </label>
                  <input
                    type="text"
                    value={formData.retailer}
                    onChange={(e) => handleInputChange('retailer', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                    placeholder="None"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
                  rows={3}
                  placeholder="Write description"
                />
              </div>

              <div className="border-t border-gray-700 pt-4">
                <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                  <span>+</span> Add to Batch List
                </button>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Previous Step
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Batch Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsModal;