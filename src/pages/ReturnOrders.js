import React, { useState, useCallback, useMemo } from 'react';
import { Info, Send } from 'lucide-react';

// Constants and Configuration
const RETURN_REASONS = [
  { id: 1, text: 'Size/fit issue (the knowledge on the product)', checked: true },
  { id: 2, text: 'Product not as expected', checked: false },
  { id: 3, text: 'Wrong item received', checked: false },
  { id: 4, text: 'Damaged/defective product', checked: false },
  { id: 5, text: 'Late delivery', checked: false },
  { id: 6, text: 'Quality not as expected', checked: false }
];

const STATUS_OPTIONS = [
  { id: 'accept', label: 'accept', bgColor: 'bg-green-500', hoverColor: 'hover:bg-green-600', lightBg: 'bg-green-100', textColor: 'text-green-700', hoverLight: 'hover:bg-green-200' },
  { id: 'no', label: 'no', bgColor: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', lightBg: 'bg-blue-100', textColor: 'text-blue-700', hoverLight: 'hover:bg-blue-200' },
  { id: 'yes', label: 'yes', bgColor: 'bg-red-500', hoverColor: 'hover:bg-red-600', lightBg: 'bg-red-100', textColor: 'text-red-700', hoverLight: 'hover:bg-red-200' },
  { id: 'reject', label: 'reject', bgColor: 'bg-red-600', hoverColor: 'hover:bg-red-700', lightBg: 'bg-red-500', textColor: 'text-white', hoverLight: 'hover:bg-red-600' }
];

const PRODUCT_IMAGES = [
  { id: 1, src: '/api/placeholder/80/80', isMain: true },
  { id: 2, src: '/api/placeholder/60/60', isMain: false },
  { id: 3, src: '/api/placeholder/60/60', isMain: false },
  { id: 4, src: '/api/placeholder/60/60', isMain: false },
  { id: 5, src: '/api/placeholder/60/60', isMain: false }
];

const SUMMARY_STATS = {
  statusOverview: [
    { label: 'Pending Returns', value: 12, colorClass: 'text-orange-600' },
    { label: 'Approved Returns', value: 8, colorClass: 'text-green-600' },
    { label: 'Rejected Returns', value: 3, colorClass: 'text-red-600' }
  ],
  topReasons: [
    { label: 'Size/Fit Issues', percentage: '45%' },
    { label: 'Quality Issues', percentage: '28%' },
    { label: 'Wrong Item', percentage: '18%' }
  ],
  quickActions: [
    { label: 'View All Returns', bgColor: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
    { label: 'Bulk Approve', bgColor: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    { label: 'Export Report', bgColor: 'bg-gray-500', hoverColor: 'hover:bg-gray-600' }
  ]
};

const INITIAL_FORM_STATE = {
  selectedReason: '',
  status: '',
  giveReason: '',
  explanation: ''
};

/**
 * Return Orders Component
 * 
 * REFACTORED ARCHITECTURE:
 * ========================
 * 
 * 1. CONSTANTS & CONFIGURATION
 *    - RETURN_REASONS: Predefined return reason options
 *    - STATUS_OPTIONS: Status button configurations with styling
 *    - PRODUCT_IMAGES: Product image data structure
 *    - SUMMARY_STATS: Dashboard statistics and quick actions
 *    - INITIAL_FORM_STATE: Default form values
 * 
 * 2. STATE MANAGEMENT
 *    - Form state: reason selection, status, text inputs
 *    - Return reasons with checkbox states
 *    - Computed values for selected reasons and form validation
 * 
 * 3. EVENT HANDLERS (Organized by Category)
 *    - Form Management: reason selection, status updates, text changes
 *    - Submission: response sending with validation
 *    - Quick Actions: summary panel actions
 * 
 * 4. UI HELPER COMPONENTS
 *    - Image preview with thumbnails
 *    - Reason selection checkboxes
 *    - Status button group
 *    - Form text areas
 *    - Summary dashboard sections
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Computed values for form state and validation
 * - Component wrapped with memo()
 * - Efficient state updates with functional patterns
 * - Optimized rendering of list items
 */
const ReturnOrders = React.memo(() => {
  // State Management - Form Data
  const [selectedReason, setSelectedReason] = useState(INITIAL_FORM_STATE.selectedReason);
  const [status, setStatus] = useState(INITIAL_FORM_STATE.status);
  const [giveReason, setGiveReason] = useState(INITIAL_FORM_STATE.giveReason);
  const [explanation, setExplanation] = useState(INITIAL_FORM_STATE.explanation);

  // State Management - Return Reasons
  const [reasons, setReasons] = useState(RETURN_REASONS);

  // Computed Values
  const selectedReasons = useMemo(() => 
    reasons.filter(reason => reason.checked),
    [reasons]
  );

  const isFormValid = useMemo(() => 
    selectedReasons.length > 0 && status && (giveReason.trim() || explanation.trim()),
    [selectedReasons, status, giveReason, explanation]
  );

  // Event Handlers - Reason Management
  const handleReasonChange = useCallback((id) => {
    setReasons(prev => 
      prev.map(reason => 
        reason.id === id ? { ...reason, checked: !reason.checked } : reason
      )
    );
  }, []);

  // Event Handlers - Form Management
  const handleStatusChange = useCallback((newStatus) => {
    setStatus(newStatus);
  }, []);

  const handleReasonTextChange = useCallback((value) => {
    setGiveReason(value);
  }, []);

  const handleExplanationChange = useCallback((value) => {
    setExplanation(value);
  }, []);

  // Event Handlers - Form Submission
  const handleSendResponse = useCallback(() => {
    if (!isFormValid) {
      console.warn('Form is not valid');
      return;
    }

    const responseData = {
      selectedReasons,
      status,
      giveReason: giveReason.trim(),
      explanation: explanation.trim(),
      timestamp: new Date().toISOString()
    };

    console.log('Sending response with:', responseData);
    
    // TODO: Implement actual API call
    // Reset form after successful submission
    setReasons(RETURN_REASONS);
    setStatus('');
    setGiveReason('');
    setExplanation('');
  }, [isFormValid, selectedReasons, status, giveReason, explanation]);

  // Event Handlers - Quick Actions
  const handleQuickAction = useCallback((actionLabel) => {
    console.log(`Executing quick action: ${actionLabel}`);
    // TODO: Implement quick action logic
  }, []);

  // UI Helper Components
  const renderImagePreview = useCallback(() => (
    <div className="lg:col-span-1">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
        <div className="flex items-center justify-center w-6 h-6 bg-gray-800 text-white rounded-full text-sm font-bold">
          <Info className="h-3 w-3" />
        </div>
      </div>
      
      {/* Main Product Image */}
      <div className="mb-4">
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          <img 
            src="/api/placeholder/200/250" 
            alt="Product main view"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="flex space-x-2">
        {PRODUCT_IMAGES.slice(1).map((image) => (
          <div key={image.id} className="w-12 h-12 bg-gray-200 rounded border-2 border-gray-300 overflow-hidden">
            <img 
              src={image.src} 
              alt={`Product view ${image.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  ), []);

  const renderReturnReasons = useCallback(() => (
    <div className="lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reason of return</h3>
      <div className="space-y-3">
        {reasons.map((reason) => (
          <label key={reason.id} className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={reason.checked}
              onChange={() => handleReasonChange(reason.id)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 leading-relaxed">{reason.text}</span>
          </label>
        ))}
      </div>
    </div>
  ), [reasons, handleReasonChange]);

  const renderStatusButtons = useCallback(() => (
    <div className="lg:col-span-1">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">status</h3>
      <div className="space-y-3">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleStatusChange(option.id)}
            className={`w-full px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              status === option.id 
                ? `${option.bgColor} text-white` 
                : `${option.lightBg} ${option.textColor} ${option.hoverLight}`
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  ), [status, handleStatusChange]);

  const renderTextInputs = useCallback(() => (
    <div className="lg:col-span-1">
      <div className="space-y-6">
        {/* Give Reason */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">give reason</h3>
          <textarea
            value={giveReason}
            onChange={(e) => handleReasonTextChange(e.target.value)}
            placeholder="Enter reason..."
            className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
          />
        </div>

        {/* Give Explanation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">give explanation</h3>
          <textarea
            value={explanation}
            onChange={(e) => handleExplanationChange(e.target.value)}
            placeholder="Enter explanation..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
          />
        </div>
      </div>
    </div>
  ), [giveReason, explanation, handleReasonTextChange, handleExplanationChange]);

  const renderSendButton = useCallback(() => (
    <div className="mt-8 flex justify-center">
      <button
        onClick={handleSendResponse}
        disabled={!isFormValid}
        className={`px-8 py-3 rounded-full font-semibold transition-colors flex items-center space-x-2 ${
          isFormValid 
            ? 'bg-black text-white hover:bg-gray-800' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <span>send response</span>
        <Send className="h-4 w-4" />
      </button>
    </div>
  ), [handleSendResponse, isFormValid]);

  const renderSummarySection = useCallback((title, items, renderItem) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map(renderItem)}
      </div>
    </div>
  ), []);

  const renderStatusOverviewItem = useCallback((item, index) => (
    <div key={index} className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{item.label}</span>
      <span className={`text-sm font-semibold ${item.colorClass}`}>{item.value}</span>
    </div>
  ), []);

  const renderTopReasonItem = useCallback((item, index) => (
    <div key={index} className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{item.label}</span>
      <span className="text-sm font-semibold text-gray-900">{item.percentage}</span>
    </div>
  ), []);

  const renderQuickActionItem = useCallback((item, index) => (
    <button 
      key={index}
      onClick={() => handleQuickAction(item.label)}
      className={`w-full ${item.bgColor} text-white py-2 px-4 rounded-lg text-sm ${item.hoverColor} transition-colors`}
    >
      {item.label}
    </button>
  ), [handleQuickAction]);

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Return window screen</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {renderImagePreview()}
          {renderReturnReasons()}
          {renderStatusButtons()}
          {renderTextInputs()}
        </div>

        {renderSendButton()}
      </div>

      {/* Return Summary Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderSummarySection('Status Overview', SUMMARY_STATS.statusOverview, renderStatusOverviewItem)}
          {renderSummarySection('Top Return Reasons', SUMMARY_STATS.topReasons, renderTopReasonItem)}
          {renderSummarySection('Quick Actions', SUMMARY_STATS.quickActions, renderQuickActionItem)}
        </div>
      </div>
    </div>
  );
});

ReturnOrders.displayName = 'ReturnOrders';

export default ReturnOrders;
