import React, { useState } from 'react';
import { Flag, MessageCircle, Check } from 'lucide-react';

// Modal types enum for better type safety
const MODAL_TYPES = {
  NONE: 'none',
  BLOCK_CONFIRM: 'block_confirm',
  UNBLOCK_CONFIRM: 'unblock_confirm',
  BLOCK_SUCCESS: 'block_success',
  UNBLOCK_SUCCESS: 'unblock_success'
};

// Table headers configuration
const TABLE_HEADERS = [
  { key: 'name', label: 'name' },
  { key: 'channel', label: 'Channel' },
  { key: 'id', label: 'ID' },
  { key: 'phone', label: 'Phone number' },
  { key: 'address', label: 'Address' },
  { key: 'action', label: 'Action' }
];

// Page content constants
const PAGE_CONTENT = {
  title: 'Block User',
  subtitle: 'Block user system',
  messageTitle: 'Write a message',
  messagePlaceholder: 'Type your message here...'
};

/**
 * BlockUser Component - Manages user blocking/unblocking functionality
 * Features:
 * - Display users in a table format
 * - Block/Unblock users with confirmation modals
 * - Send messages to users
 * - User action buttons (flag, upgrade, message limit)
 */
const BlockUser = () => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Cora Cayetto',
      channel: 'WhatsApp',
      userId: '20231042366',
      phoneNumber: '+629797624012',
      address: '5567 Richmond View Suite 961 Burnaby, 93546-8616',
      isBlocked: false
    }
  ]);

  // Simplified modal state management
  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.NONE);
  const [selectedUser, setSelectedUser] = useState(null);

  // Handler functions
  const handleBlockUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    
    if (user.isBlocked) {
      setCurrentModal(MODAL_TYPES.UNBLOCK_CONFIRM);
    } else {
      setCurrentModal(MODAL_TYPES.BLOCK_CONFIRM);
    }
  };

  const confirmBlockUser = () => {
    updateUserBlockStatus(selectedUser.id, true);
    setCurrentModal(MODAL_TYPES.BLOCK_SUCCESS);
  };

  const confirmUnblockUser = () => {
    updateUserBlockStatus(selectedUser.id, false);
    setCurrentModal(MODAL_TYPES.UNBLOCK_SUCCESS);
  };

  const updateUserBlockStatus = (userId, isBlocked) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isBlocked }
          : user
      )
    );
  };

  const closeAllModals = () => {
    setCurrentModal(MODAL_TYPES.NONE);
    setSelectedUser(null);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      alert('Message sent successfully!');
      setMessage('');
    }
  };

  // Reusable components
  /**
   * ActionButton - Reusable button component with predefined variants
   * @param {Function} onClick - Click handler
   * @param {string} variant - Button style variant (primary, success, secondary, dark, icon)
   * @param {ReactNode} children - Button content
   * @param {string} className - Additional CSS classes
   */
  const ActionButton = ({ onClick, variant, children, className = '' }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      success: "bg-green-600 text-white hover:bg-green-700",
      secondary: "bg-orange-100 text-orange-600 hover:bg-orange-200",
      dark: "bg-black text-white hover:bg-gray-800",
      icon: "p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  /**
   * Modal - Reusable modal component
   * @param {boolean} isOpen - Whether modal is open
   * @param {Function} onClose - Close handler (optional)
   * @param {string} title - Modal title
   * @param {ReactNode} children - Modal content
   * @param {Array} actions - Array of action buttons
   */
  const Modal = ({ isOpen, onClose, title, children, actions }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            {title && (
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {title}
              </h3>
            )}
            {children}
            {actions && (
              <div className="flex space-x-4 mt-6">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /**
   * SuccessIcon - Reusable success icon component
   */
  const SuccessIcon = () => (
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Check className="w-8 h-8 text-green-600" />
    </div>
  );

  /**
   * UserRow - Individual user row component
   * @param {Object} user - User object with id, name, channel, etc.
   */
  const UserRow = ({ user }) => (
    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-4 text-gray-900 font-medium">{user.name}</td>
      <td className="py-4 px-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
          {user.channel}
        </span>
      </td>
      <td className="py-4 px-4 text-gray-900">{user.userId}</td>
      <td className="py-4 px-4 text-gray-900">{user.phoneNumber}</td>
      <td className="py-4 px-4 text-gray-700 max-w-xs">
        <div className="truncate" title={user.address}>
          {user.address}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-2">
          {/* Flag Button */}
          <ActionButton variant="icon" onClick={() => {}}>
            <Flag className="h-4 w-4 text-blue-600" />
          </ActionButton>
          
          {/* Upgrade Button */}
          <ActionButton 
            variant="secondary" 
            className="px-3 py-1 rounded-full text-xs"
            onClick={() => {}}
          >
            upgrade
          </ActionButton>
          
          {/* Block/Unblock Button */}
          <ActionButton
            variant={user.isBlocked ? "success" : "primary"}
            onClick={() => handleBlockUser(user.id)}
          >
            {user.isBlocked ? 'Unblock' : 'Block Now'}
          </ActionButton>
          
          {/* Message Limit Button */}
          <ActionButton 
            variant="dark" 
            className="text-sm"
            onClick={() => {}}
          >
            message limit
          </ActionButton>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
     
          <div className="text-2xl font-bold text-gray-900">
            {PAGE_CONTENT.title.toLowerCase()}
          </div>
        

      {/* Main Content */}
      
        <div className="max-w-7xl m-0 p-6">
          
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{PAGE_CONTENT.title.toLowerCase()}</h1>
            <p className="text-lg text-gray-700">{PAGE_CONTENT.subtitle}</p>
          </div>

          {/* Users Table */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {TABLE_HEADERS.map(header => (
                      <th key={header.key} className="text-left py-4 px-4 font-medium text-gray-700 text-base">
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Write a Message Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{PAGE_CONTENT.messageTitle.toLowerCase()}</h2>
            
            <div className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={PAGE_CONTENT.messagePlaceholder}
                className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              
              <div className="flex justify-end">
                <ActionButton
                  variant="primary"
                  onClick={handleSendMessage}
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Message</span>
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      

      {/* Modals */}
      <Modal
        isOpen={currentModal === MODAL_TYPES.BLOCK_CONFIRM}
        title="Are you sure you want to block this user"
        actions={[
          <ActionButton
            key="confirm"
            variant="dark"
            onClick={confirmBlockUser}
            className="flex-1 rounded-full"
          >
            yes
          </ActionButton>,
          <ActionButton
            key="cancel"
            variant="secondary"
            onClick={closeAllModals}
            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full"
          >
            Cancel
          </ActionButton>
        ]}
      />

      <Modal
        isOpen={currentModal === MODAL_TYPES.BLOCK_SUCCESS}
        title="user blocked successfully"
        actions={[
          <ActionButton
            key="ok"
            variant="dark"
            onClick={closeAllModals}
            className="w-full rounded-full"
          >
            OK
          </ActionButton>
        ]}
      >
        <SuccessIcon />
      </Modal>

      <Modal
        isOpen={currentModal === MODAL_TYPES.UNBLOCK_CONFIRM}
        title="Are you sure you want to unblock this user"
        actions={[
          <ActionButton
            key="confirm"
            variant="dark"
            onClick={confirmUnblockUser}
            className="flex-1 rounded-full"
          >
            yes
          </ActionButton>,
          <ActionButton
            key="cancel"
            variant="secondary"
            onClick={closeAllModals}
            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full"
          >
            Cancel
          </ActionButton>
        ]}
      />

      <Modal
        isOpen={currentModal === MODAL_TYPES.UNBLOCK_SUCCESS}
        title="user unblocked successfully"
        actions={[
          <ActionButton
            key="ok"
            variant="dark"
            onClick={closeAllModals}
            className="w-full rounded-full"
          >
            OK
          </ActionButton>
        ]}
      >
        <SuccessIcon />
      </Modal>
    </div>
  );
};

export default BlockUser;
