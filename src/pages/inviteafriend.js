import React, { useState, useCallback, useMemo, useReducer } from 'react';

// Modal state management using useReducer for better performance
const initialModalState = {
  // Edit flow
  showEditModal: false,
  showEdit2FAModal: false,
  showEditSuccessModal: false,
  
  // Delete flow
  showDeleteConfirmationModal: false,
  showDeleteSuccessModal: false,
  showDelete2FAModal: false,
  showDeleteFinalSuccessModal: false,
  
  // Toggle flow
  showConfirmationModal: false,
  showOffConfirmationModal: false,
  show2FAModal: false,
  showOff2FAModal: false,
  showSuccessModal: false,
  showOffSuccessModal: false,
  showFinalSuccessModal: false,
  showOffFinalSuccessModal: false,
  
  // Issue flow
  showIssue2FAModal: false,
  showIssueSuccessModal: false,
  showIssueFinalSuccessModal: false,
};

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return { ...state, [action.modal]: true };
    case 'HIDE_MODAL':
      return { ...state, [action.modal]: false };
    case 'RESET_MODALS':
      return initialModalState;
    default:
      return state;
  }
};

// Form state management
const initialFormState = {
  userName: '',
  codeToIssue: '',
  codeLimit: '',
  codeValue: '',
  editUserName: '',
  editCodeToIssue: '',
  otpCode: ['', '', '', ''],
  issueOtpCode: ['', '', '', ''],
  verificationPassword: '',
  defaultPassword: '',
  issuePassword: '',
  showVerificationPassword: false,
  showDefaultPassword: false,
  showIssuePassword: false,
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET_FORM':
      return initialFormState;
    case 'RESET_2FA':
      return {
        ...state,
        otpCode: ['', '', '', ''],
        issueOtpCode: ['', '', '', ''],
        verificationPassword: '',
        defaultPassword: '',
        issuePassword: '',
      };
    case 'RESET_EDIT':
      return {
        ...state,
        editUserName: '',
        editCodeToIssue: '',
      };
    default:
      return state;
  }
};

const InviteAFriend = React.memo(() => {
  // Core application state
  const [isToggleOn, setIsToggleOn] = useState(true);
  const [toggleAction, setToggleAction] = useState('');
  const [editingCode, setEditingCode] = useState(null);
  const [deletingCode, setDeletingCode] = useState(null);
  
  // Reducers for complex state management
  const [modalState, dispatchModal] = useReducer(modalReducer, initialModalState);
  const [formState, dispatchForm] = useReducer(formReducer, initialFormState);
  
  const [issuedCodes, setIssuedCodes] = useState([
    {
      id: 1,
      username: 'Rithik',
      code: 'RITHIK27',
      description: 'Invite a friend and get additional 10% off on your 1st purchase'
    },
    {
      id: 2,
      username: 'Rithik',
      code: 'RITHIK27',
      description: 'Invite a friend and get additional 10% off on your 1st purchase'
    }
  ]);

  // Memoized validation functions
  const validateFormFields = useCallback(() => {
    return formState.userName && formState.codeToIssue && formState.codeLimit && formState.codeValue;
  }, [formState.userName, formState.codeToIssue, formState.codeLimit, formState.codeValue]);

  const validate2FAFields = useCallback(() => {
    const otpString = formState.otpCode.join('');
    return otpString.length === 4 && formState.verificationPassword && formState.defaultPassword;
  }, [formState.otpCode, formState.verificationPassword, formState.defaultPassword]);

  // Generic modal handlers
  const showModal = useCallback((modal) => {
    dispatchModal({ type: 'SHOW_MODAL', modal });
  }, []);

  const hideModal = useCallback((modal) => {
    dispatchModal({ type: 'HIDE_MODAL', modal });
  }, []);

  const resetForm = useCallback(() => {
    dispatchForm({ type: 'RESET_FORM' });
  }, []);

  const reset2FA = useCallback(() => {
    dispatchForm({ type: 'RESET_2FA' });
  }, []);

  // Optimized handlers using useCallback
  const handleIssueCode = useCallback(() => {
    if (validateFormFields()) {
      showModal('showIssue2FAModal');
    } else {
      alert('Please fill in all fields');
    }
  }, [validateFormFields, showModal]);

  const handleToggleInviteSystem = useCallback((status) => {
    setToggleAction(status);
    if (status === 'on' && !isToggleOn) {
      showModal('showConfirmationModal');
    } else if (status === 'off' && isToggleOn) {
      showModal('showOffConfirmationModal');
    }
  }, [isToggleOn, showModal]);

  // Generic 2FA handler
  const handle2FASubmit = useCallback((nextModal) => {
    if (validate2FAFields()) {
      hideModal('show2FAModal');
      hideModal('showOff2FAModal');
      hideModal('showEdit2FAModal');
      hideModal('showIssue2FAModal');
      hideModal('showDelete2FAModal');
      showModal(nextModal);
      reset2FA();
    } else {
      alert('Please fill in all fields');
    }
  }, [validate2FAFields, hideModal, showModal, reset2FA]);

  // Specific 2FA handlers
  const handleToggle2FASubmit = useCallback(() => {
    handle2FASubmit('showSuccessModal');
  }, [handle2FASubmit]);

  const handleToggleOff2FASubmit = useCallback(() => {
    handle2FASubmit('showOffSuccessModal');
  }, [handle2FASubmit]);

  const handleEdit2FASubmit = useCallback(() => {
    handle2FASubmit('showEditSuccessModal');
  }, [handle2FASubmit]);

  const handleIssue2FASubmit = useCallback(() => {
    handle2FASubmit('showIssueSuccessModal');
  }, [handle2FASubmit]);

  const handleDelete2FASubmit = useCallback(() => {
    handle2FASubmit('showDeleteSuccessModal');
  }, [handle2FASubmit]);

  // Confirmation handlers
  const handleConfirmToggleOn = useCallback(() => {
    hideModal('showConfirmationModal');
    showModal('show2FAModal');
  }, [hideModal, showModal]);

  const handleConfirmToggleOff = useCallback(() => {
    hideModal('showOffConfirmationModal');
    showModal('showOff2FAModal');
  }, [hideModal, showModal]);

  // Cancel handlers
  const handleCancelToggle = useCallback(() => {
    hideModal('showConfirmationModal');
  }, [hideModal]);

  const handleCancelOffToggle = useCallback(() => {
    hideModal('showOffConfirmationModal');
  }, [hideModal]);

  const handleCancel2FA = useCallback(() => {
    hideModal('show2FAModal');
    hideModal('showOff2FAModal');
    hideModal('showEdit2FAModal'); 
    hideModal('showIssue2FAModal');
    hideModal('showDelete2FAModal');
    reset2FA();
  }, [hideModal, reset2FA]);

  // Success modal handlers
  const handleSuccessModalDone = useCallback(() => {
    hideModal('showSuccessModal');
    showModal('showFinalSuccessModal');
  }, [hideModal, showModal]);

  const handleOffSuccessModalDone = useCallback(() => {
    hideModal('showOffSuccessModal');
    showModal('showOffFinalSuccessModal');
  }, [hideModal, showModal]);

  const handleFinalSuccessModalDone = useCallback(() => {
    hideModal('showFinalSuccessModal');
    setIsToggleOn(true);
  }, [hideModal]);

  const handleOffFinalSuccessModalDone = useCallback(() => {
    hideModal('showOffFinalSuccessModal');
    setIsToggleOn(false);
  }, [hideModal]);

  const handleCloseSuccessModal = useCallback(() => {
    hideModal('showSuccessModal');
    setIsToggleOn(true);
  }, [hideModal]);

  const handleCloseOffSuccessModal = useCallback(() => {
    hideModal('showOffSuccessModal');
    setIsToggleOn(false);
  }, [hideModal]);

  const handleCloseFinalSuccessModal = useCallback(() => {
    hideModal('showFinalSuccessModal');
    setIsToggleOn(true);
  }, [hideModal]);

  const handleCloseOffFinalSuccessModal = useCallback(() => {
    hideModal('showOffFinalSuccessModal');
    setIsToggleOn(false);
  }, [hideModal]);

  // Code management handlers
  const handleCopyCode = useCallback((code) => {
    navigator.clipboard.writeText(code);
  }, []);

  const handleEditCode = useCallback((code) => {
    setEditingCode(code);
    dispatchForm({ type: 'SET_FIELD', field: 'editUserName', value: code.username });
    dispatchForm({ type: 'SET_FIELD', field: 'editCodeToIssue', value: code.code });
    showModal('showEditModal');
  }, [showModal]);

  const handleDeleteCode = useCallback((code) => {
    setDeletingCode(code);
    showModal('showDeleteConfirmationModal');
  }, [showModal]);

  const handleSaveEditedCode = useCallback(() => {
    if (formState.editUserName.trim() && formState.editCodeToIssue.trim()) {
      hideModal('showEditModal');
      showModal('showEdit2FAModal');
    } else {
      alert('Please fill in all fields');
    }
  }, [formState.editUserName, formState.editCodeToIssue, hideModal, showModal]);

  const handleCancelEdit = useCallback(() => {
    hideModal('showEditModal');
    setEditingCode(null);
    dispatchForm({ type: 'RESET_EDIT' });
  }, [hideModal]);

  const handleEditSuccessDone = useCallback(() => {
    if (editingCode && formState.editUserName.trim() && formState.editCodeToIssue.trim()) {
      setIssuedCodes(prevCodes => prevCodes.map(code => 
        code.id === editingCode.id 
          ? { 
              ...code, 
              username: formState.editUserName.trim(),
              code: formState.editCodeToIssue.toUpperCase().trim()
            }
          : code
      ));
      setEditingCode(null);
      dispatchForm({ type: 'RESET_EDIT' });
    }
    hideModal('showEditSuccessModal');
  }, [editingCode, formState.editUserName, formState.editCodeToIssue, hideModal]);

  const handleCloseEditSuccessModal = useCallback(() => {
    hideModal('showEditSuccessModal');
    setEditingCode(null);
    dispatchForm({ type: 'RESET_EDIT' });
  }, [hideModal]);

  const handleConfirmDelete = useCallback(() => {
    hideModal('showDeleteConfirmationModal');
    showModal('showDelete2FAModal');
  }, [hideModal, showModal]);

  const handleCancelDelete = useCallback(() => {
    hideModal('showDeleteConfirmationModal');
    setDeletingCode(null);
  }, [hideModal]);

  const handleDeleteSuccessModalDone = useCallback(() => {
    hideModal('showDeleteSuccessModal');
    showModal('showDeleteFinalSuccessModal');
  }, [hideModal, showModal]);

  const handleDeleteFinalSuccessModalDone = useCallback(() => {
    hideModal('showDeleteFinalSuccessModal');
    
    // Actually delete the code now
    if (deletingCode) {
      setIssuedCodes(prevCodes => prevCodes.filter(code => code.id !== deletingCode.id));
      setDeletingCode(null);
    }
  }, [deletingCode, hideModal]);

  const handleCloseDeleteSuccessModal = useCallback(() => {
    hideModal('showDeleteSuccessModal');
    setDeletingCode(null);
  }, [hideModal]);

  const handleCloseDeleteFinalSuccessModal = useCallback(() => {
    hideModal('showDeleteFinalSuccessModal');
    setDeletingCode(null);
  }, [hideModal]);

  // Issue code handlers
  const handleIssueSuccessModalDone = useCallback(() => {
    hideModal('showIssueSuccessModal');
    showModal('showIssueFinalSuccessModal');
  }, [hideModal, showModal]);

  const handleIssueFinalSuccessModalDone = useCallback(() => {
    hideModal('showIssueFinalSuccessModal');
    
    // Actually create the code now
    if (formState.userName && formState.codeToIssue && formState.codeLimit && formState.codeValue) {
      const newCode = {
        id: issuedCodes.length + 1,
        username: formState.userName,
        code: formState.codeToIssue.toUpperCase(),
        description: `Invite a friend and get additional ${formState.codeValue}% off on your 1st purchase`
      };
      setIssuedCodes(prevCodes => [...prevCodes, newCode]);
      
      // Reset form
      dispatchForm({ type: 'RESET_FORM' });
    }
  }, [formState.userName, formState.codeToIssue, formState.codeLimit, formState.codeValue, issuedCodes.length, hideModal]);

  const handleCloseIssueSuccessModal = useCallback(() => {
    hideModal('showIssueSuccessModal');
  }, [hideModal]);

  const handleCloseIssueFinalSuccessModal = useCallback(() => {
    hideModal('showIssueFinalSuccessModal');
  }, [hideModal]);

  // OTP handling with improved focus management
  const handleOtpChange = useCallback((index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...formState.otpCode];
      newOtp[index] = value;
      dispatchForm({ type: 'SET_FIELD', field: 'otpCode', value: newOtp });
      
      // Auto-focus next input
      if (value && index < 3) {
        // Try multiple ID patterns for compatibility
        let nextInput = document.querySelector(`input[data-otp-index="${index + 1}"]`) ||
                       document.getElementById(`otp-${index + 1}`) ||
                       document.getElementById(`otp-off-${index + 1}`) ||
                       document.getElementById(`edit-otp-${index + 1}`) ||
                       document.getElementById(`delete-otp-${index + 1}`) ||
                       document.getElementById(`issue-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  }, [formState.otpCode]);

  const handleOtpKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !formState.otpCode[index] && index > 0) {
      // Try multiple ID patterns for compatibility
      let prevInput = document.querySelector(`input[data-otp-index="${index - 1}"]`) ||
                     document.getElementById(`otp-${index - 1}`) ||
                     document.getElementById(`otp-off-${index - 1}`) ||
                     document.getElementById(`edit-otp-${index - 1}`) ||
                     document.getElementById(`delete-otp-${index - 1}`) ||
                     document.getElementById(`issue-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }, [formState.otpCode]);

  // Issue OTP handling with improved focus management
  const handleIssueOtpChange = useCallback((index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...formState.issueOtpCode];
      newOtp[index] = value;
      dispatchForm({ type: 'SET_FIELD', field: 'issueOtpCode', value: newOtp });
      
      // Auto-focus next input
      if (value && index < 3) {
        let nextInput = document.getElementById(`issue-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  }, [formState.issueOtpCode]);

  const handleIssueOtpKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !formState.issueOtpCode[index] && index > 0) {
      let prevInput = document.getElementById(`issue-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }, [formState.issueOtpCode]);

  const handleCancelIssue2FA = useCallback(() => {
    hideModal('showIssue2FAModal');
    dispatchForm({ type: 'SET_FIELD', field: 'issueOtpCode', value: ['', '', '', ''] });
    dispatchForm({ type: 'SET_FIELD', field: 'issuePassword', value: '' });
  }, [hideModal]);

  // Memoized form field handlers
  const handleFieldChange = useCallback((field, value) => {
    dispatchForm({ type: 'SET_FIELD', field, value });
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    dispatchForm({ type: 'SET_FIELD', field, value: !formState[field] });
  }, [formState]);

  // Memoized computed values
  const memoizedIssuedCodes = useMemo(() => issuedCodes, [issuedCodes]);

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Main Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black mb-4">
          Invite a friend with a referral code
        </h1>
        
        {/* Toggle Section */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-2xl font-bold text-black">
            Invite a friend with a referral code
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleToggleInviteSystem('on')}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                isToggleOn
                  ? 'bg-blue-600 text-white border-black'
                  : 'bg-white text-black border-gray-300'
              }`}
            >
              On
            </button>
            <button
              onClick={() => handleToggleInviteSystem('off')}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                !isToggleOn
                  ? 'bg-blue-600 text-white border-black'
                  : 'bg-white text-black border-gray-300'
              }`}
            >
              Off
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-md space-y-6">
        {/* Generate referral code user name */}
        <div>
          <label className="block text-xl font-bold text-black mb-2">
            Generate referral code user name
          </label>
          <input
            type="text"
            value={formState.userName}
            onChange={(e) => handleFieldChange('userName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-blue-600"
            placeholder="Enter username"
          />
        </div>

        {/* Code to issue */}
        <div>
          <label className="block text-xl font-bold text-black mb-2">
            code to issue
          </label>
          <input
            type="text"
            value={formState.codeToIssue}
            onChange={(e) => handleFieldChange('codeToIssue', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-blue-600"
            placeholder="Enter code"
          />
        </div>

        {/* Code limit */}
        <div>
          <label className="block text-xl font-bold text-black mb-2">
            code limit
          </label>
          <input
            type="number"
            value={formState.codeLimit}
            onChange={(e) => handleFieldChange('codeLimit', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-blue-600"
            placeholder="Enter limit"
          />
        </div>

        {/* Code value */}
        <div>
          <label className="block text-xl font-bold text-black mb-2">
            code value
          </label>
          <input
            type="number"
            value={formState.codeValue}
            onChange={(e) => handleFieldChange('codeValue', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-blue-600"
            placeholder="Enter value (%)"
          />
        </div>

        {/* Issue Code Button */}
        <button
          onClick={handleIssueCode}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          Issue Code
        </button>
      </div>

      {/* Issued Codes Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-black mb-6">Issued Codes</h2>
        <div className="space-y-4">
          {memoizedIssuedCodes.map((code) => (
            <div key={code.id} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{code.username}</div>
                  <div className="text-blue-600 font-mono text-lg">{code.code}</div>
                  <div className="text-gray-600 text-sm mt-1">{code.description}</div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleCopyCode(code.code)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleEditCode(code)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCode(code)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Modal Components with Optimized State Management */}
      
      {/* Confirmation Modal for turning ON */}
      {modalState.showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative w-full max-w-md mx-4 overflow-clip">
            <button 
              onClick={handleCancelToggle}
              className="absolute right-[33px] top-[33px] w-6 h-6 text-gray-500 hover:text-gray-700"
            >
              <div className="absolute bottom-[17.18%] left-[17.18%] right-[17.18%] top-[17.17%]">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
            
            <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[180px] text-center">
              <p className="font-bold text-black text-[18px] leading-[22px] tracking-[-0.41px] font-['Montserrat']">
                Are you sure you want to turn on invite a friend feature
              </p>
            </div>
            
            <div className="absolute top-[189px] left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                onClick={handleConfirmToggleOn}
                className="bg-black text-white rounded-3xl w-[149px] h-12 font-semibold text-[16px] leading-[22px] font-['Montserrat'] hover:bg-gray-800 transition-colors"
              >
                yes
              </button>
              
              <button
                onClick={handleCancelToggle}
                className="border border-[#e4e4e4] text-black rounded-[100px] w-[209px] h-16 font-medium text-[16px] leading-[19.2px] font-['Montserrat'] hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
            
            <div className="h-[280px]"></div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for turning OFF */}
      {modalState.showOffConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative w-full max-w-md mx-4 overflow-clip">
            <button 
              onClick={handleCancelOffToggle}
              className="absolute right-[33px] top-[33px] w-6 h-6 text-gray-500 hover:text-gray-700"
            >
              <div className="absolute bottom-[17.18%] left-[17.18%] right-[17.18%] top-[17.17%]">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
            
            <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[180px] text-center">
              <p className="font-bold text-black text-[18px] leading-[22px] tracking-[-0.41px] font-['Montserrat']">
                Are you sure you want to turn off invite a friend feature
              </p>
            </div>
            
            <div className="absolute top-[189px] left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                onClick={handleConfirmToggleOff}
                className="bg-black text-white rounded-3xl w-[149px] h-12 font-semibold text-[16px] leading-[22px] font-['Montserrat'] hover:bg-gray-800 transition-colors"
              >
                yes
              </button>
              
              <button
                onClick={handleCancelOffToggle}
                className="border border-[#e4e4e4] text-black rounded-[100px] w-[209px] h-16 font-medium text-[16px] leading-[19.2px] font-['Montserrat'] hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
            
            <div className="h-[280px]"></div>
          </div>
        </div>
      )}

      {/* 2FA Modal for turning ON */}
      {modalState.show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-[32px] shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative"
            style={{ width: '600px', minHeight: '600px', padding: '48px 56px' }}
          >
            <button 
              onClick={handleCancel2FA}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <p className="text-lg font-bold text-black mb-4 tracking-[-0.41px] leading-[22px]">
                If you want to change or access these settings please enter the OTP send to your registered mobile no. and the password
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-black mb-2 tracking-[0.72px]">
                Verification code
              </h3>
              <p className="text-sm text-black mb-4">
                Please enter the verification code we sent to your phone number
              </p>
              
              <div className="flex justify-center gap-4 mb-4">
                {formState.otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 border-2 border-gray-300 rounded-full text-center text-lg font-semibold focus:border-blue-500 focus:outline-none"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-black mb-4 text-center">
              Please enter the verification code we sent to your email address
            </p>

            <div className="mb-4 relative">
              <input
                type={formState.showVerificationPassword ? "text" : "password"}
                value={formState.verificationPassword}
                onChange={(e) => handleFieldChange('verificationPassword', e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 pb-2 text-base focus:border-blue-500 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('showVerificationPassword')}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {formState.showVerificationPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>

            <p className="text-sm text-black mb-4">
              Please enter the default code.
            </p>

            <div className="mb-6 relative">
              <input
                type={formState.showDefaultPassword ? "text" : "password"}
                value={formState.defaultPassword}
                onChange={(e) => handleFieldChange('defaultPassword', e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 pb-2 text-base focus:border-blue-500 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('showDefaultPassword')}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {formState.showDefaultPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>

            <button
              onClick={handleToggle2FASubmit}
              className="w-full bg-black text-white py-3 rounded-[26.5px] font-bold text-base uppercase hover:bg-gray-800 transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalState.showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Edit Code</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={formState.editUserName}
                onChange={(e) => handleFieldChange('editUserName', e.target.value)}
                placeholder="Username"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={formState.editCodeToIssue}
                onChange={(e) => handleFieldChange('editCodeToIssue', e.target.value)}
                placeholder="Code"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveEditedCode}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal for turning ON */}
      {modalState.showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative w-full max-w-md mx-4 overflow-clip">
            <button 
              onClick={handleCloseSuccessModal}
              className="absolute right-[33px] top-[33px] w-6 h-6 text-gray-500 hover:text-gray-700"
            >
              <div className="absolute bottom-[17.18%] left-[17.18%] right-[17.18%] top-[17.17%]">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
            
            <div className="absolute top-[61px] left-1/2 transform -translate-x-1/2 w-[242px] text-center">
              <p className="font-bold text-black text-[18px] leading-[22px] tracking-[-0.41px] font-['Montserrat']">
                id verified successfully!
              </p>
            </div>
            
            <div className="absolute top-[155px] left-1/2 transform" style={{ transform: 'translateX(calc(-50% + 7px))' }}>
              <button
                onClick={handleSuccessModalDone}
                className="bg-black text-white rounded-3xl w-[270px] h-12 font-semibold text-[16px] leading-[22px] font-['Montserrat'] hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
            
            <div className="h-[240px]"></div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalState.showDeleteConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this code?</p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Code Modal */}
      {modalState.showIssue2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-[32px] shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative"
            style={{ width: '600px', minHeight: '600px', padding: '48px 56px' }}
          >
            <button 
              onClick={handleCancelIssue2FA}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <p className="text-lg font-bold text-black mb-4 tracking-[-0.41px] leading-[22px]">
                If you want to change or access these settings please enter the OTP send to your registered mobile no. and the password
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-black mb-2 tracking-[0.72px]">
                Verification code
              </h3>
              <p className="text-sm text-black mb-4">
                Please enter the verification code we sent to your phone number
              </p>
              
              <div className="flex justify-center gap-4 mb-4">
                {formState.issueOtpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`issue-otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleIssueOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleIssueOtpKeyDown(index, e)}
                    className="w-12 h-12 border-2 border-gray-300 rounded-full text-center text-lg font-semibold focus:border-blue-500 focus:outline-none"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4 relative">
              <input
                type={formState.showIssuePassword ? "text" : "password"}
                value={formState.issuePassword}
                onChange={(e) => handleFieldChange('issuePassword', e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 pb-2 text-base focus:border-blue-500 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('showIssuePassword')}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {formState.showIssuePassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>

            <button
              onClick={handleIssue2FASubmit}
              className="w-full bg-black text-white py-3 rounded-[26.5px] font-bold text-base uppercase hover:bg-gray-800 transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

InviteAFriend.displayName = 'InviteAFriend';

export default InviteAFriend;
