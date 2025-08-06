import React, { useState } from 'react';
import { Upload, ArrowLeft, X } from 'lucide-react';

interface UploadDocumentsPageProps {
  knowledgeBaseName: string;
  onClose: () => void;
}

const UploadDocumentsPage: React.FC<UploadDocumentsPageProps> = ({
  knowledgeBaseName,
  onClose
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

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">Upload Documents</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Upload documents to <span className="text-purple-400 font-medium">{knowledgeBaseName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-12">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium ${
              currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }`}>
              1
            </div>
            <span className="ml-3 text-green-600 dark:text-green-400 font-medium">Contributor Info</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-700 mx-8 rounded-full">
            <div className={`h-full transition-all duration-500 rounded-full ${
              currentStep >= 2 ? 'bg-green-600' : 'bg-gray-700'
            }`} style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium ${
              currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }`}>
              2
            </div>
            <span className="ml-3 text-green-600 dark:text-green-400 font-medium">Document Details</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Step 1: Contributor Info */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Contributor Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  placeholder="190769413964851969"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  placeholder="taylor.zhang张"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    placeholder="Item"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    placeholder="IT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    placeholder="BA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Facility
                </label>
                <input
                  type="text"
                  value={formData.facility}
                  onChange={(e) => handleInputChange('facility', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  placeholder="Enter facility"
                />
              </div>

              <div className="flex justify-end pt-6">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Document Details */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Document Details</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Files *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <Upload size={64} className="mx-auto text-gray-500 dark:text-gray-400 mb-6" />
                  <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg">
                    <span className="text-green-600 dark:text-green-400 font-medium">Choose One/Multiple</span> or drag and drop them here
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Tip: Hold the Shift key to select multiple files.
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    Supported file types: PDF, Word, PPTX, Excel, CSV, JSON, Text, Markdown, HTML, PNG, JPEG, TIFF, BMP, HEIC
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  URL Links
                </label>
                <textarea
                  value={formData.urls}
                  onChange={(e) => handleInputChange('urls', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  rows={4}
                  placeholder="Press Enter after each URL to add multiple URLs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Folder Name *
                  </label>
                  <select
                    value={formData.folderName}
                    onChange={(e) => handleInputChange('folderName', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="">Select Folder</option>
                    <option value="documents">Documents</option>
                    <option value="reports">Reports</option>
                    <option value="procedures">Procedures</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Process
                  </label>
                  <select
                    value={formData.process}
                    onChange={(e) => handleInputChange('process', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="">Select process</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="training">Training</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Document Name *
                  </label>
                  <select
                    value={formData.documentName}
                    onChange={(e) => handleInputChange('documentName', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="">Enter document name</option>
                    <option value="manual">Manual</option>
                    <option value="guide">Guide</option>
                    <option value="policy">Policy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Customers *
                  </label>
                  <input
                    type="text"
                    value={formData.customers}
                    onChange={(e) => handleInputChange('customers', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    placeholder="General"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Retailer *
                  </label>
                  <input
                    type="text"
                    value={formData.retailer}
                    onChange={(e) => handleInputChange('retailer', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    placeholder="None"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  rows={4}
                  placeholder="Write description"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <button className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-3 text-lg">
                  <span>+</span> Add to Batch List
                </button>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back to Previous Step
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
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

export default UploadDocumentsPage; 