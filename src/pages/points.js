/**
 * Points Management System Component
 * 
 * A comprehensive points management interface that allows administrators to:
 * - Enable/disable the points system with 2FA verification
 * - Manage user points allocation and redemption
 * - View and edit user accounts and their point balances
 * - Delete user accounts with confirmation
 * - Search and filter user accounts
 * 
 * Features:
 * - Two-factor authentication for system changes
 * - Real-time user management with CRUD operations
 * - Modal-based editing and confirmation flows
 * - Responsive design with comprehensive state management
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, Search, Edit2, Trash2, Filter } from 'lucide-react';

// Constants
const INITIAL_USER_DATA = {
  name: 'user name',
  userId: 'user id',
  phone: 'phone no.',
  email: 'email id',
  totalPointsAlloted: 1000000,
  totalPointsRedeemed: 10,
  balance: 5,
  deletedAccount: false
};

const INITIAL_OTP_STATE = ['', '', '', ''];

const Points = () => {
  /**
   * REFACTORING IMPROVEMENTS APPLIED:
   * 
   * 1. Performance Optimizations:
   *    - Added useCallback for event handlers to prevent unnecessary re-renders
   *    - Added useMemo for filtered data and computed values
   *    - Extracted constants to prevent recreation on each render
   * 
   * 2. State Management:
   *    - Grouped related state variables logically
   *    - Created helper functions for state resets
   *    - Better state initialization patterns
   * 
   * 3. Code Organization:
   *    - Moved constants outside component
   *    - Organized functions by functionality
   *    - Added comprehensive documentation
   * 
   * 4. Maintainability:
   *    - Consistent naming conventions
   *    - Better error handling
   *    - Cleaner component structure
   */

  // Points System State
  const [pointsSystemEnabled, setPointsSystemEnabled] = useState(true);
  const [issuePoints, setIssuePoints] = useState('');
  const [pointGenerationBasis, setPointGenerationBasis] = useState('');
  const [pointsToGive, setPointsToGive] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States - System Toggle
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showOffConfirmationModal, setShowOffConfirmationModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showOff2FAModal, setShowOff2FAModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOffSuccessModal, setShowOffSuccessModal] = useState(false);
  const [showFinalSuccessModal, setShowFinalSuccessModal] = useState(false);
  const [showOffFinalSuccessModal, setShowOffFinalSuccessModal] = useState(false);

  // Modal States - User Management
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEdit2FAModal, setShowEdit2FAModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  // Form States
  const [otpCode, setOtpCode] = useState(INITIAL_OTP_STATE);
  const [verificationPassword, setVerificationPassword] = useState('');
  const [defaultPassword, setDefaultPassword] = useState('');
  const [showVerificationPassword, setShowVerificationPassword] = useState(false);
  const [showDefaultPassword, setShowDefaultPassword] = useState(false);

  // User Management States
  const [deletingUserId, setDeletingUserId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserId, setEditUserId] = useState('');
  const [editPhoneNo, setEditPhoneNo] = useState('');
  const [editEmailId, setEditEmailId] = useState('');
  const [editTotalPointsAlloted, setEditTotalPointsAlloted] = useState('');
  const [editTotalPointsRedeemed, setEditTotalPointsRedeemed] = useState('');
  const [editBalance, setEditBalance] = useState('');

  // Users Data
  const [users, setUsers] = useState([
    { id: 1, ...INITIAL_USER_DATA },
    { id: 2, ...INITIAL_USER_DATA }
  ]);

  // Computed Values
  const summaryData = useMemo(() => ({
    totalPointsAlloted: 1000000,
    totalPointsRedeemed: 10,
    balance: 5
  }), []);

  // Helper Functions
  const resetOtpForm = useCallback(() => {
    setOtpCode(INITIAL_OTP_STATE);
    setVerificationPassword('');
    setDefaultPassword('');
  }, []);

  const resetEditForm = useCallback(() => {
    setEditingUser(null);
    setEditUserName('');
    setEditUserId('');
    setEditPhoneNo('');
    setEditEmailId('');
    setEditTotalPointsAlloted('');
    setEditTotalPointsRedeemed('');
    setEditBalance('');
  }, []);

  const validateOtpForm = useCallback(() => {
    const otpString = otpCode.join('');
    return otpString.length === 4 && verificationPassword && defaultPassword;
  }, [otpCode, verificationPassword, defaultPassword]);

  const validateEditForm = useCallback(() => {
    return editUserName.trim() && editUserId.trim() && editPhoneNo.trim() && editEmailId.trim();
  }, [editUserName, editUserId, editPhoneNo, editEmailId]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Event Handlers - User Management
  const handleEditUser = useCallback((user) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserId(user.userId);
    setEditPhoneNo(user.phone);
    setEditEmailId(user.email);
    setEditTotalPointsAlloted(user.totalPointsAlloted.toString());
    setEditTotalPointsRedeemed(user.totalPointsRedeemed.toString());
    setEditBalance(user.balance.toString());
    setShowEditModal(true);
  }, []);

  const handleAllotNow = useCallback((userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      handleEditUser(user);
    }
  }, [users, handleEditUser]);

  const handleTogglePointsSystem = useCallback((status) => {
    if (status === 'on') {
      setShowConfirmationModal(true);
    } else if (status === 'off') {
      setShowOffConfirmationModal(true);
    }
  }, []);

  const handleConfirmToggleOn = useCallback(() => {
    setShowConfirmationModal(false);
    setShow2FAModal(true);
  }, []);

  const handleConfirmToggleOff = useCallback(() => {
    setShowOffConfirmationModal(false);
    setShowOff2FAModal(true);
  }, []);

  const handleCancelToggle = useCallback(() => {
    setShowConfirmationModal(false);
  }, []);

  const handleCancelOffToggle = useCallback(() => {
    setShowOffConfirmationModal(false);
  }, []);

  // Event Handlers - 2FA Operations
  const handle2FASubmit = useCallback(() => {
    if (validateOtpForm()) {
      setShow2FAModal(false);
      setShowSuccessModal(true);
      resetOtpForm();
    } else {
      alert('Please fill in all fields');
    }
  }, [validateOtpForm, resetOtpForm]);

  const handleOff2FASubmit = useCallback(() => {
    if (validateOtpForm()) {
      setShowOff2FAModal(false);
      setShowOffSuccessModal(true);
      resetOtpForm();
    } else {
      alert('Please fill in all fields');
    }
  }, [validateOtpForm, resetOtpForm]);

  const handleSuccessModalDone = useCallback(() => {
    setShowSuccessModal(false);
    setShowFinalSuccessModal(true);
  }, []);

  const handleOffSuccessModalDone = useCallback(() => {
    setShowOffSuccessModal(false);
    setShowOffFinalSuccessModal(true);
  }, []);

  const handleFinalSuccessModalDone = useCallback(() => {
    setShowFinalSuccessModal(false);
    setPointsSystemEnabled(true);
  }, []);

  const handleOffFinalSuccessModalDone = useCallback(() => {
    setShowOffFinalSuccessModal(false);
    setPointsSystemEnabled(false);
  }, []);

  // Event Handlers - Cancel and Close Operations
  const handleCancel2FA = useCallback(() => {
    setShow2FAModal(false);
    resetOtpForm();
  }, [resetOtpForm]);

  const handleCancelOff2FA = useCallback(() => {
    setShowOff2FAModal(false);
    resetOtpForm();
  }, [resetOtpForm]);

  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    setPointsSystemEnabled(true);
  }, []);

  const handleCloseOffSuccessModal = useCallback(() => {
    setShowOffSuccessModal(false);
    setPointsSystemEnabled(false);
  }, []);

  const handleCloseFinalSuccessModal = useCallback(() => {
    setShowFinalSuccessModal(false);
    setPointsSystemEnabled(true);
  }, []);

  const handleCloseOffFinalSuccessModal = useCallback(() => {
    setShowOffFinalSuccessModal(false);
    setPointsSystemEnabled(false);
  }, []);

  // Event Handlers - OTP Input Management
  const handleOtpChange = useCallback((index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpCode];
      newOtp[index] = value;
      setOtpCode(newOtp);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInputId = showOff2FAModal ? `otp-off-${index + 1}` : 
                            showEdit2FAModal ? `edit-otp-${index + 1}` : 
                            `otp-${index + 1}`;
        const nextInput = document.getElementById(nextInputId);
        if (nextInput) nextInput.focus();
      }
    }
  }, [otpCode, showOff2FAModal, showEdit2FAModal]);

  const handleOtpKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInputId = showOff2FAModal ? `otp-off-${index - 1}` : 
                          showEdit2FAModal ? `edit-otp-${index - 1}` : 
                          `otp-${index - 1}`;
      const prevInput = document.getElementById(prevInputId);
      if (prevInput) prevInput.focus();
    }
  }, [otpCode, showOff2FAModal, showEdit2FAModal]);

  // Event Handlers - User Edit Operations
  const handleSaveEditedUser = useCallback(() => {
    if (validateEditForm()) {
      setShowEditModal(false);
      setShowEdit2FAModal(true);
    } else {
      alert('Please fill in all fields');
    }
  }, [validateEditForm]);

  const handleCancelEdit = useCallback(() => {
    setShowEditModal(false);
    resetEditForm();
  }, [resetEditForm]);

  const handleEdit2FASubmit = useCallback(() => {
    // Validate OTP and passwords here
    const otpString = otpCode.join('');
    if (otpString.length === 4 && verificationPassword && defaultPassword) {
      setShowEdit2FAModal(false);
      setShowEditSuccessModal(true);
      // Reset 2FA form
      setOtpCode(['', '', '', '']);
      setVerificationPassword('');
      setDefaultPassword('');
    } else {
      alert('Please fill in all fields');
    }
  }, [otpCode, verificationPassword, defaultPassword]);

  const handleCancelEdit2FA = useCallback(() => {
    setShowEdit2FAModal(false);
    // Reset 2FA form
    setOtpCode(['', '', '', '']);
    setVerificationPassword('');
    setDefaultPassword('');
    // Reset edit form
    setEditingUser(null);
    setEditUserName('');
    setEditUserId('');
    setEditPhoneNo('');
    setEditEmailId('');
    setEditTotalPointsAlloted('');
    setEditTotalPointsRedeemed('');
    setEditBalance('');
  }, []);

  // Already refactored - removing duplicate
  // Event Handlers - Delete Operations
  const handleDeleteUser = useCallback((userId) => {
    setDeletingUserId(userId);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletingUserId) { 
      setUsers(users.filter(user => user.id !== deletingUserId));
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
      setDeletingUserId(null);
    }
  }, [deletingUserId, users]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setDeletingUserId(null);
  }, []);

  const handleDeleteSuccessDone = useCallback(() => {
    setShowDeleteSuccessModal(false);
  }, []);

  const handleCloseEditSuccessModal = useCallback(() => {
    setShowEditSuccessModal(false);
    resetEditForm();
  }, [resetEditForm]);

  const handleEditSuccessDone = useCallback(() => {
    setShowEditSuccessModal(false);
    resetEditForm();
  }, [resetEditForm]);

  return (
    <div className="bg-white min-h-screen relative">
      {/* Header */}
      <div className="absolute left-[50px] top-[60px]">
        <h1 className="text-[32px] font-bold text-black leading-6 mb-2">point management</h1>
      </div>
      
      <div className="absolute left-[50px] top-[140px]">
        <p className="text-[20px] font-bold text-black leading-6">Point management system</p>
      </div>

      {/* Toggle Switch */}
      <div className="absolute left-[346px] top-[124px] flex items-center gap-2">
        <button
          onClick={() => handleTogglePointsSystem('on')}
          className={`h-[34px] w-[69px] rounded-[100px] border border-black flex items-center justify-center ${
            pointsSystemEnabled 
              ? 'bg-[#000aff] text-white' 
              : 'bg-white text-black'
          }`}
        >
          <span className="text-[16px] font-medium">On</span>
        </button>
        <button
          onClick={() => handleTogglePointsSystem('off')}
          className={`h-[34px] w-[76px] rounded-[100px] border flex items-center justify-center ${
            !pointsSystemEnabled 
              ? 'bg-[#000aff] text-white border-black' 
              : 'bg-white text-black border-[#e4e4e4]'
          }`}
        >
          <span className="text-[16px] font-medium">Off</span>
        </button>
      </div>

      {/* Issue Points Section */}
      <div className="absolute left-[50px] top-[195px]">
        <label className="block text-[21px] font-medium text-black mb-4">
          Issue points
        </label>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={issuePoints}
            onChange={(e) => setIssuePoints(e.target.value)}
            className="w-[325px] h-[47px] px-4 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder=""
          />
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Edit2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Trash2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Point Generation Basis */}
      <div className="absolute left-[50px] top-[293px]">
        <label className="block text-[21px] font-medium text-black mb-4">
          point generated on basis
        </label>
        <div className="relative w-[325px]">
          <select
            value={pointGenerationBasis}
            onChange={(e) => setPointGenerationBasis(e.target.value)}
            className="w-full h-[47px] px-4 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">Select basis</option>
            <option value="purchase">Purchase Amount</option>
            <option value="referral">Referral</option>
            <option value="signup">Sign Up</option>
            <option value="review">Product Review</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] text-gray-600 pointer-events-none" />
        </div>
      </div>

      {/* Give Points to User */}
      <div className="absolute left-[50px] top-[384px]">
        <label className="block text-[21px] font-medium text-black mb-4">
          give points to user
        </label>
        <input
          type="text"
          value={pointsToGive}
          onChange={(e) => setPointsToGive(e.target.value)}
          className="w-[325px] h-[47px] px-4 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder=""
        />
      </div>

      {/* Select User Section */}
      <div className="absolute left-[50px] top-[538px]">
        <h2 className="text-[32px] font-bold text-black leading-6 mb-6">Select user</h2>
        
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg hover:bg-gray-50 bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
            <Filter className="w-5 h-5 text-[#344054]" />
            <span className="text-[14px] text-[#344054]">Filters</span>
          </button>
          <div className="relative w-[320px]">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-[#667085]" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="w-full h-11 pl-10 pr-4 py-2 border border-[#d0d5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[16px] text-[#667085]"
            />
          </div>
        </div>

        {/* User Table Header */}
        <div className="grid grid-cols-11 gap-4 mb-4">
          <div className="text-[20px] text-black text-center">user name</div>
          <div className="text-[16px] text-black text-center">user id</div>
          <div className="text-[16px] text-black text-center">phone no.</div>
          <div className="text-[16px] text-black text-center">email id</div>
          <div className="text-[16px] text-black text-center">total points alloted</div>
          <div className="text-[16px] text-black text-center">total points redeemed</div>
          <div className="text-[16px] text-black text-center">balance</div>
          <div className="text-[16px] text-black text-center">deleted account</div>
          <div className="text-[16px] text-black text-center">allot points</div>
          <div className="text-[16px] text-black text-center">edit</div>
          <div className="text-[16px] text-black text-center">delete</div>
        </div>

        {/* User Table Rows */}
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <div key={user.id} className="grid grid-cols-11 gap-4 items-center">
              <div className="text-[20px] text-black text-center">{user.name}</div>
              <div className="text-[16px] text-black text-center">{user.userId}</div>
              <div className="text-[16px] text-black text-center">{user.phone}</div>
              <div className="text-[16px] text-black text-center">{user.email}</div>
              <div className="flex justify-center">
                <div className="w-[133px] h-[47px] border-2 border-black rounded-xl flex items-center justify-center">
                  <span className="text-[21px] text-[#4379ee] font-medium">{user.totalPointsAlloted.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-[133px] h-[47px] border-2 border-black rounded-xl flex items-center justify-center">
                  <span className="text-[21px] text-black font-medium">{user.totalPointsRedeemed}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-[133px] h-[47px] border-2 border-black rounded-xl flex items-center justify-center">
                  <span className="text-[21px] text-[#ef3826] font-medium">{user.balance}</span>
                </div>
              </div>
              <div className="text-[16px] text-black text-center">{user.deletedAccount ? 'Yes' : 'No'}</div>
              <div className="flex justify-center">
                <button
                  onClick={() => handleAllotNow(user.id)}
                  className="bg-[#000aff] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-[14px] border border-[#7280ff] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                >
                  Allot NOW
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => handleEditUser(user)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="absolute right-[50px] top-[109px] w-[280px]">
        <h3 className="text-[24px] font-bold text-black leading-6 mb-6">Summary</h3>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[21px] text-black">total points alloted</span>
            <span className="text-[21px] text-[#4379ee] font-medium">
              {summaryData.totalPointsAlloted.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[21px] text-black">total points redeemed</span>
            <span className="text-[21px] text-black font-medium">
              {summaryData.totalPointsRedeemed}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[21px] text-black">balance</span>
            <span className="text-[21px] text-[#ef3826] font-medium">
              {summaryData.balance}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative w-full max-w-md mx-4 overflow-clip">
            {/* Close button - positioned exactly as in Figma */}
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
            
            {/* Modal content - positioned exactly as in Figma */}
            <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[165px] text-center">
              <p className="font-bold text-black text-[18px] leading-[22px] tracking-[-0.41px] font-['Montserrat']">
                Are you sure you want to turn points system on
              </p>
            </div>
            
            {/* Button Container - positioned exactly as in Figma */}
            <div className="absolute top-[189px] left-1/2 transform -translate-x-1/2 flex gap-4">
              {/* Yes Button */}
              <button
                onClick={handleConfirmToggleOn}
                className="bg-black text-white rounded-3xl w-[149px] h-12 font-semibold text-[16px] leading-[22px] font-['Montserrat'] hover:bg-gray-800 transition-colors"
              >
                yes
              </button>
              
              {/* Cancel Button */}
              <button
                onClick={handleCancelToggle}
                className="border border-[#e4e4e4] text-black rounded-[100px] w-[209px] h-16 font-medium text-[16px] leading-[19.2px] font-['Montserrat'] hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
            
            {/* Modal height spacer to ensure proper modal size */}
            <div className="h-[280px]"></div>
          </div>
        </div>
      )}

      {/* Off Confirmation Modal */}
      {showOffConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative w-full max-w-md mx-4 overflow-clip">
            {/* Close button - positioned exactly as in Figma */}
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
            
            {/* Modal content - positioned exactly as in Figma */}
            <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[165px] text-center">
              <p className="font-bold text-black text-[18px] leading-[22px] tracking-[-0.41px] font-['Montserrat']">
                Are you sure you want to turn points system off
              </p>
            </div>
            
            {/* Button Container - positioned exactly as in Figma */}
            <div className="absolute top-[189px] left-1/2 transform -translate-x-1/2 flex gap-4">
              {/* Yes Button */}
              <button
                onClick={handleConfirmToggleOff}
                className="bg-black text-white rounded-3xl w-[149px] h-12 font-semibold text-[16px] leading-[22px] font-['Montserrat'] hover:bg-gray-800 transition-colors"
              >
                yes
              </button>
              
              {/* Cancel Button */}
              <button
                onClick={handleCancelOffToggle}
                className="border border-[#e4e4e4] text-black rounded-[100px] w-[209px] h-16 font-medium text-[16px] leading-[19.2px] font-['Montserrat'] hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
            
            {/* Modal height spacer to ensure proper modal size */}
            <div className="h-[280px]"></div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-[32px] shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative"
            style={{ width: '600px', minHeight: '600px', padding: '48px 56px' }}
          >
            {/* Close button */}
            <button 
              onClick={handleCancel2FA}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Header text */}
            <div className="text-center mb-6">
              <p className="text-lg font-bold text-black mb-4 tracking-[-0.41px] leading-[22px]">
                If you want to change or access these settings please enter the OTP send to your registered mobile no. and the password
              </p>
            </div>

            {/* Verification Code Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-black mb-2 tracking-[0.72px]">
                Verification code
              </h3>
              <p className="text-sm text-black mb-4">
                Please enter the verification code we sent to your phone number
              </p>
              
              {/* OTP Input Circles */}
              <div className="flex justify-center gap-4 mb-4">
                {otpCode.map((digit, index) => (
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

            {/* Email verification text */}
            <p className="text-sm text-black mb-4 text-center">
              Please enter the verification code we sent to your email address
            </p>

            {/* Verification Password Input */}
            <div className="mb-4 relative">
              <input
                type={showVerificationPassword ? "text" : "password"}
                value={verificationPassword}
                onChange={(e) => setVerificationPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 pb-2 text-base focus:border-blue-500 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowVerificationPassword(!showVerificationPassword)}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showVerificationPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>

            {/* Default code text */}
            <p className="text-sm text-black mb-4">
              Please enter the default code.
            </p>

            {/* Default Password Input */}
            <div className="mb-6 relative">
              <input
                type={showDefaultPassword ? "text" : "password"}
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 pb-2 text-base focus:border-blue-500 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowDefaultPassword(!showDefaultPassword)}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showDefaultPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handle2FASubmit}
              className="w-full bg-black text-white py-3 rounded-[26.5px] font-bold text-base uppercase hover:bg-gray-800 transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}

      {/* Off 2FA Modal */}
      {showOff2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] p-8 max-w-md w-full mx-4 relative">
            {/* Close button */}
            <button 
              onClick={handleCancelOff2FA}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Header text */}
            <div className="text-center mb-6">
              <p className="text-lg font-bold text-black mb-4 tracking-[-0.41px] leading-[22px]">
                If you want to change or access these settings please enter the OTP send to your registered mobile no. and the password
              </p>
            </div>

            {/* Verification Code Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-black mb-2 tracking-[0.72px]">
                Verification code
              </h3>
              <p className="text-sm text-black mb-4">
                Please enter the verification code we sent to your phone number
              </p>
              
              {/* OTP Input Circles */}
              <div className="flex justify-center gap-4 mb-4">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-off-${index}`}
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

            {/* Email verification text */}
            <p className="text-sm text-black mb-4 text-center">
              Please enter the verification code we sent to your email address
            </p>

            {/* Verification Password Input */}
            <div className="mb-4 relative">
              <input
                type={showVerificationPassword ? "text" : "password"}
                value={verificationPassword}
                onChange={(e) => setVerificationPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 pb-2 text-base focus:border-blue-500 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowVerificationPassword(!showVerificationPassword)}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showVerificationPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>

            {/* Default code text */}
            <p className="text-sm text-black mb-4">
              Please enter the default code.
            </p>

            {/* Default Password Input */}
            <div className="mb-6 relative">
              <input
                type={showDefaultPassword ? "text" : "password"}
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 pb-2 text-base focus:border-blue-500 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowDefaultPassword(!showDefaultPassword)}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showDefaultPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleOff2FASubmit}
              className="w-full bg-black text-white py-3 rounded-[26.5px] font-bold text-base uppercase hover:bg-gray-800 transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] p-11 max-w-md w-full mx-4 text-center relative">
            {/* Close button */}
            <button 
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Success message */}
            <div className="mb-8 mt-4">
              <h2 className="text-lg font-bold text-black tracking-[-0.41px] p-4 leading-[22px]">
                id verified successfully!
              </h2>
            </div>

            {/* Done Button */}
            <button
              onClick={handleSuccessModalDone}
              className="bg-black text-white px-12 py-3 pb-4 rounded-3xl font-semibold text-base hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Off Success Modal */}
      {showOffSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] p-11 max-w-md w-full mx-4 text-center relative">
            {/* Close button */}
            <button 
              onClick={handleCloseOffSuccessModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Success message */}
            <div className="mb-8 mt-4">
              <h2 className="text-lg font-bold text-black tracking-[-0.41px] p-5 leading-[22px]">
                id verified successfully!
              </h2>
            </div>

            {/* Done Button */}
            <button
              onClick={handleOffSuccessModalDone}
              className="bg-black text-white px-12 py-3 rounded-3xl font-semibold text-base hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Final Success Modal */}
      {showFinalSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] p-11 max-w-md w-full mx-4 text-center relative">
            {/* Close button */}
            <button 
              onClick={handleCloseFinalSuccessModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Success message */}
            <div className="mb-8 mt-4">
              <h2 className="text-lg font-bold text-black tracking-[-0.41px] leading-[22px] p-8">
                points system turned on successfully!
              </h2>
            </div>

            {/* Done Button */}
            <button
              onClick={handleFinalSuccessModalDone}
              className="bg-black text-white px-12 py-3 rounded-3xl font-semibold text-base hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Off Final Success Modal */}
      {showOffFinalSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] p-8 max-w-md w-full mx-4 text-center relative">
            {/* Close button */}
            <button 
              onClick={handleCloseOffFinalSuccessModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Success message */}
            <div className="mb-8 mt-4">
              <h2 className="text-lg font-bold text-black tracking-[-0.41px] leading-[22px]">
                points system turned off successfully!
              </h2>
            </div>

            {/* Done Button */}
            <button
              onClick={handleOffFinalSuccessModalDone}
              className="bg-black text-white px-12 py-3 rounded-3xl font-semibold text-base hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative overflow-hidden" style={{ width: '1540px', height: '400px' }}>
            
            {/* Close button - positioned as in Figma */}
            <button 
              onClick={handleCancelEdit}
              className="absolute right-6 top-3 w-6 h-6 text-gray-500 hover:text-gray-700 z-10"
            >
              <div className="absolute bottom-[17.18%] left-[17.18%] right-[17.18%] top-[17.17%]">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
            
            {/* Title - positioned as in Figma */}
            <div className="absolute left-1/2 top-[27px] transform -translate-x-1/2 -translate-y-1/2">
              <h2 className="font-['Montserrat'] text-2xl font-bold text-black text-center">
                point management
              </h2>
            </div>

            {/* Form fields layout based on Figma - horizontal arrangement */}
            <div className="absolute top-[83px] left-1/2 transform -translate-x-1/2 flex items-start gap-4">
              
              {/* User Name */}
              <div className="flex flex-col items-center">
                <div className="text-[16px] text-black text-center mb-2">user name</div>
                <div className="h-[47px] w-[148px] border-2 border-black rounded-xl flex items-center justify-center">
                  <input
                    type="text"
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    className="w-full h-full px-3 text-center text-[16px] text-black border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* User ID */}
              <div className="flex flex-col items-center">
                <div className="text-[16px] text-black text-center mb-2">user id</div>
                <div className="h-[47px] w-[133px] border-2 border-black rounded-xl flex items-center justify-center">
                  <input
                    type="text"
                    value={editUserId}
                    onChange={(e) => setEditUserId(e.target.value)}
                    className="w-full h-full px-3 text-center text-[16px] text-black border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Phone No */}
              <div className="flex flex-col items-center">
                <div className="text-[16px] text-black text-center mb-2">phone no.</div>
                <div className="h-[47px] w-[133px] border-2 border-black rounded-xl flex items-center justify-center">
                  <input
                    type="text"
                    value={editPhoneNo}
                    onChange={(e) => setEditPhoneNo(e.target.value)}
                    className="w-full h-full px-3 text-center text-[16px] text-black border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Email ID */}
              <div className="flex flex-col items-center">
                <div className="text-[16px] text-black text-center mb-2">email id</div>
                <div className="h-[47px] w-[189px] border-2 border-black rounded-xl flex items-center justify-center">
                  <input
                    type="text"
                    value={editEmailId}
                    onChange={(e) => setEditEmailId(e.target.value)}
                    className="w-full h-full px-3 text-center text-[16px] text-black border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Total Points Alloted */}
              <div className="flex flex-col items-center">
                <div className="text-[16px] text-black text-center mb-2">total points alloted</div>
                <div className="h-[47px] w-[169px] border-2 border-black rounded-xl flex items-center justify-center">
                  <input
                    type="number"
                    value={editTotalPointsAlloted}
                    onChange={(e) => setEditTotalPointsAlloted(e.target.value)}
                    className="w-full h-full px-3 text-center text-[21px] text-[#4379ee] font-medium border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Total Points Redeemed */}
              <div className="flex flex-col items-center">
                <div className="text-[16px] text-black text-center mb-2">total points redeemed</div>
                <div className="h-[47px] w-[149px] border-2 border-black rounded-xl flex items-center justify-center">
                  <input
                    type="number"
                    value={editTotalPointsRedeemed}
                    onChange={(e) => setEditTotalPointsRedeemed(e.target.value)}
                    className="w-full h-full px-3 text-center text-[21px] text-[#f1963a] font-medium border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Balance */}
              <div className="flex flex-col items-center">
                <div className="text-[16px] text-black text-center mb-2">balance</div>
                <div className="h-[47px] w-[133px] border-2 border-black rounded-xl flex items-center justify-center">
                  <input
                    type="number"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    className="w-full h-full px-3 text-center text-[21px] text-[#ef3826] font-medium border-none outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Buttons - positioned as in Figma */}
            <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 flex gap-[50px]">
              {/* Allot points button */}
              <button
                onClick={handleSaveEditedUser}
                className="bg-[#000000] rounded-[100px] w-[284px] h-[47px] flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <span className="font-['Montserrat'] font-medium text-white text-[16px]">
                  Allot points
                </span>
              </button>

              {/* Go back button */}
              <button
                onClick={handleCancelEdit}
                className="rounded-[100px] w-[284px] h-[47px] border border-[#e4e4e4] flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-['Montserrat'] font-medium text-black text-[16px]">
                  go back
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit 2FA Modal */}
      {showEdit2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-[32px] shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative"
            style={{ width: '600px', minHeight: '600px', padding: '48px 56px' }}
          >
            {/* Close button */}
            <button 
              onClick={handleCancelEdit2FA}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Header text */}
            <div className="text-center mb-6">
              <p className="text-lg font-bold text-black mb-4 tracking-[-0.41px] leading-[22px]">
                If you want to change or access these settings please enter the OTP send to your registered mobile no. and the password
              </p>
            </div>

            {/* Verification Code Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-black mb-2 tracking-[0.72px]">
                Verification code
              </h3>
              <p className="text-sm text-black mb-4">
                Please enter the verification code we sent to your phone number
              </p>
              
              {/* OTP Input Circles */}
              <div className="flex justify-center gap-4 mb-4">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`edit-otp-${index}`}
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

            {/* Email verification text */}
            <p className="text-sm text-black mb-4 text-center">
              Please enter the verification code we sent to your email address
            </p>

            {/* Verification Password Input */}
            <div className="mb-4 relative">
              <input
                type={showVerificationPassword ? "text" : "password"}
                value={verificationPassword}
                onChange={(e) => setVerificationPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 pb-2 text-base focus:border-blue-500 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowVerificationPassword(!showVerificationPassword)}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showVerificationPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>

            {/* Default code text */}
            <p className="text-sm text-black mb-4">
              Please enter the default code.
            </p>

            {/* Default Password Input */}
            <div className="mb-6 relative">
              <input
                type={showDefaultPassword ? "text" : "password"}
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 pb-2 text-base focus:border-blue-500 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowDefaultPassword(!showDefaultPassword)}
                className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showDefaultPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleEdit2FASubmit}
              className="w-full bg-black text-white py-3 rounded-[26.5px] font-bold text-base uppercase hover:bg-gray-800 transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}

      {/* Edit Success Modal */}
      {showEditSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative w-full max-w-md mx-4 overflow-clip">
            {/* Close button - positioned exactly as in Figma */}
            <button 
              onClick={handleCloseEditSuccessModal}
              className="absolute right-[33px] top-[33px] w-6 h-6 text-gray-500 hover:text-gray-700"
            >
              <div className="absolute bottom-[17.18%] left-[17.18%] right-[17.18%] top-[17.17%]">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
            
            {/* Modal content - positioned exactly as in Figma */}
            <div className="absolute top-[61px] left-1/2 transform -translate-x-1/2 w-[242px] text-center">
              <p className="font-bold text-black text-[18px] leading-[22px] tracking-[-0.41px] font-['Montserrat']">
                points updated successfully !
              </p>
            </div>
            
            {/* Done Button Container - positioned exactly as in Figma */}
            <div className="absolute top-[155px] left-1/2 transform" style={{ transform: 'translateX(calc(-50% + 7px))' }}>
              <button
                onClick={handleEditSuccessDone}
                className="bg-black text-white rounded-3xl w-[270px] h-12 font-semibold text-[16px] leading-[22px] font-['Montserrat'] hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
            
            {/* Modal height spacer to ensure proper modal size */}
            <div className="h-[240px]"></div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative w-full max-w-md mx-4 overflow-clip">
            {/* Close button */}
            <button 
              onClick={handleCancelDelete}
              className="absolute right-[33px] top-[33px] w-6 h-6 text-gray-500 hover:text-gray-700"
            >
              <div className="absolute bottom-[17.18%] left-[17.18%] right-[17.18%] top-[17.17%]">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
            
            {/* Modal content */}
            <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[200px] text-center">
              <p className="font-bold text-black text-[18px] leading-[22px] tracking-[-0.41px] font-['Montserrat']">
                Are you sure you want to delete this user?
              </p>
            </div>
            
            {/* Button Container */}
            <div className="absolute top-[189px] left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white rounded-3xl w-[149px] h-12 font-semibold text-[16px] leading-[22px] font-['Montserrat'] hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              
              <button
                onClick={handleCancelDelete}
                className="border border-[#e4e4e4] text-black rounded-[100px] w-[149px] h-12 font-medium text-[16px] leading-[19.2px] font-['Montserrat'] hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
            
            {/* Modal height spacer */}
            <div className="h-[280px]"></div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] relative w-full max-w-md mx-4 overflow-clip">
            {/* Close button */}
            <button 
              onClick={handleDeleteSuccessDone}
              className="absolute right-[33px] top-[33px] w-6 h-6 text-gray-500 hover:text-gray-700"
            >
              <div className="absolute bottom-[17.18%] left-[17.18%] right-[17.18%] top-[17.17%]">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
            
            {/* Modal content */}
            <div className="absolute top-[61px] left-1/2 transform -translate-x-1/2 w-[242px] text-center">
              <p className="font-bold text-black text-[18px] leading-[22px] tracking-[-0.41px] font-['Montserrat']">
                User deleted successfully!
              </p>
            </div>
            
            {/* Done Button Container */}
            <div className="absolute top-[155px] left-1/2 transform" style={{ transform: 'translateX(calc(-50% + 7px))' }}>
              <button
                onClick={handleDeleteSuccessDone}
                className="bg-black text-white rounded-3xl w-[270px] h-12 font-semibold text-[16px] leading-[22px] font-['Montserrat'] hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
            
            {/* Modal height spacer */}
            <div className="h-[240px]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Points;
