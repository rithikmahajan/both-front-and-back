import React, { useState } from 'react';
import { X } from 'lucide-react';

// Image constants from Figma design
const imgProgressBar = "http://localhost:3845/assets/910f1120d3bdc0f6938634d6aef7d55a7bec572e.svg";
const imgProgressBar1 = "http://localhost:3845/assets/34772e9eec583c7c3b05d958ac9b0f08ea0df778.svg";
const imgProgressBar2 = "http://localhost:3845/assets/03d7a9eb0b3a258f8463991e4d3604bb169d1d1f.svg";
const imgProgressBar3 = "http://localhost:3845/assets/f3f85ecfe751f814840dadb647864a547b36ca15.svg";

const NewPartner = () => {
  const [formData, setFormData] = useState({
    name: '',
    newId: '',
    password: '',
    confirmPassword: ''
  });

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [blockAction, setBlockAction] = useState(''); // 'block' or 'unblock'

  const [vendors, setVendors] = useState([
    {
      id: 1,
      vendorName: 'rithik',
      vendorId: 'rithik09/28/1998',
      password: '************',
      editPassword: '************',
      status: 'active'
    },
    {
      id: 2,
      vendorName: 'pearl',
      vendorId: 'rithik09/28/1998',
      password: '************',
      editPassword: '************',
      status: 'blocked'
    },
    {
      id: 3,
      vendorName: 'saksham',
      vendorId: 'rithik09/28/1998',
      password: '************',
      editPassword: '************',
      status: 'active'
    },
    {
      id: 4,
      vendorName: 'meetu',
      vendorId: 'rithik09/28/1998',
      password: '************',
      editPassword: '************',
      status: 'active'
    }
  ]);

  const [editingPassword, setEditingPassword] = useState({});
  const [editingEditPassword, setEditingEditPassword] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Create new vendor
    const newVendor = {
      id: Date.now(), // Simple ID generation
      vendorName: formData.name,
      vendorId: formData.newId,
      password: '************',
      editPassword: '************',
      status: 'active'
    };
    
    setVendors(prev => [...prev, newVendor]);
    
    // Reset form
    setFormData({
      name: '',
      newId: '',
      password: '',
      confirmPassword: ''
    });
    
    alert('New partner created successfully!');
  };

  const handleBlockVendor = (vendorId, action) => {
    setSelectedVendorId(vendorId);
    setBlockAction(action);
    setShowConfirmModal(true);
  };

  const confirmBlockVendor = () => {
    setVendors(prev => 
      prev.map(vendor => 
        vendor.id === selectedVendorId 
          ? { ...vendor, status: blockAction === 'block' ? 'blocked' : 'active' }
          : vendor
      )
    );
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    setSelectedVendorId(null);
  };

  const cancelBlockVendor = () => {
    setShowConfirmModal(false);
    setSelectedVendorId(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handlePasswordEdit = (vendorId, field, value) => {
    if (field === 'password') {
      setEditingPassword(prev => ({
        ...prev,
        [vendorId]: value
      }));
    } else if (field === 'editPassword') {
      setEditingEditPassword(prev => ({
        ...prev,
        [vendorId]: value
      }));
    }
  };

  const savePassword = (vendorId, field) => {
    const newValue = field === 'password' ? editingPassword[vendorId] : editingEditPassword[vendorId];
    if (newValue) {
      setVendors(prev => 
        prev.map(vendor => 
          vendor.id === vendorId 
            ? { ...vendor, [field]: newValue }
            : vendor
        )
      );
      
      // Clear editing state
      if (field === 'password') {
        setEditingPassword(prev => {
          const updated = { ...prev };
          delete updated[vendorId];
          return updated;
        });
      } else {
        setEditingEditPassword(prev => {
          const updated = { ...prev };
          delete updated[vendorId];
          return updated;
        });
      }
    }
  };

  return (
    <div className="bg-[#ffffff] relative min-h-screen w-full">
      {/* Header */}
      <div className="text-left pt-10 pb-8 px-8">
        <h1 className="font-bold text-[#000000] text-[24px] leading-[22px]">New Partner</h1>
      </div>

      {/* Form Section */}
      <div className="max-w-sm ml-8 px-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-[#000000] text-[20px] text-left mb-2 tracking-[-0.5px]">
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full h-[47px] px-4 border-2 border-[#000000] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
              />
            </div>
          </div>

          {/* Make new id Field */}
          <div>
            <label className="block text-[#000000] text-[20px] text-left mb-2 tracking-[-0.5px]">
              Make new id
            </label>
            <div className="relative">
              <input
                type="text"
                name="newId"
                value={formData.newId}
                onChange={handleInputChange}
                required
                className="w-full h-[47px] px-4 border-2 border-[#000000] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[#000000] text-[20px] text-left mb-2 tracking-[-0.5px]">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full h-[47px] px-4 border-2 border-[#000000] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[#000000] text-[20px] text-left mb-2 tracking-[-0.5px]">
              Confirm password
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full h-[47px] px-4 border-2 border-[#000000] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
              />
            </div>
          </div>

          {/* Create Partner Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#000000] text-[#ffffff] text-[14px] font-medium px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              create partner
            </button>
          </div>
        </form>
      </div>

      {/* Vendors Table Section */}
      <div className="mt-16 px-8">
        {vendors.length > 0 ? (
          <div className="max-w-6xl">
            {/* Table Headers */}
            <div className="grid grid-cols-6 gap-8 mb-4">
              <div className="text-[#000000] text-[20px] text-left tracking-[-0.5px]">vendor name</div>
              <div className="text-[#000000] text-[20px] text-left tracking-[-0.5px]">vendor id</div>
              <div className="text-[#000000] text-[20px] text-center tracking-[-0.5px]">password</div>
              <div className="text-[#000000] text-[20px] text-center tracking-[-0.5px]">edit password</div>
              <div className="text-[#000000] text-[20px] text-center tracking-[-0.5px]">block</div>
              <div className="text-[#000000] text-[20px] text-center tracking-[-0.5px]">unblock</div>
            </div>

            {/* Table Rows */}
            {vendors.map((vendor, index) => (
              <div key={vendor.id} className="grid grid-cols-6 gap-8 items-center py-4">
                <div className="text-[#202224] text-[14px] font-bold">{vendor.vendorName}</div>
                <div className="text-[#202224] text-[14px] font-bold">{vendor.vendorId}</div>
                <div className="flex items-center justify-center">
                  {/* Editable Password Field */}
                  {editingPassword[vendor.id] !== undefined ? (
                    <input
                      type="text"
                      value={editingPassword[vendor.id]}
                      onChange={(e) => handlePasswordEdit(vendor.id, 'password', e.target.value)}
                      onBlur={() => savePassword(vendor.id, 'password')}
                      onKeyPress={(e) => e.key === 'Enter' && savePassword(vendor.id, 'password')}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="text-[#000000] text-[20px] tracking-[-0.5px] cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                      onClick={() => handlePasswordEdit(vendor.id, 'password', vendor.password)}
                    >
                      {vendor.password}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  {/* Editable Edit Password Field */}
                  {editingEditPassword[vendor.id] !== undefined ? (
                    <input
                      type="text"
                      value={editingEditPassword[vendor.id]}
                      onChange={(e) => handlePasswordEdit(vendor.id, 'editPassword', e.target.value)}
                      onBlur={() => savePassword(vendor.id, 'editPassword')}
                      onKeyPress={(e) => e.key === 'Enter' && savePassword(vendor.id, 'editPassword')}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="text-[#000000] text-[20px] tracking-[-0.5px] cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                      onClick={() => handlePasswordEdit(vendor.id, 'editPassword', vendor.editPassword)}
                    >
                      {vendor.editPassword}
                    </span>
                  )}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleBlockVendor(vendor.id, 'block')}
                    disabled={vendor.status === 'blocked'}
                    className={`text-[#ffffff] text-[14px] font-normal px-4 py-2.5 rounded-lg border shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors ${
                      vendor.status === 'blocked'
                        ? 'bg-gray-400 border-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-[#000000] border-[#333333] hover:bg-gray-800 cursor-pointer'
                    }`}
                  >
                    Block NOW
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleBlockVendor(vendor.id, 'unblock')}
                    disabled={vendor.status === 'active'}
                    className={`text-[#ffffff] text-[14px] font-normal px-4 py-2.5 rounded-lg border shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors ${
                      vendor.status === 'active'
                        ? 'bg-gray-400 border-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-[#dc2626] border-[#dc2626] hover:bg-red-700 cursor-pointer'
                    }`}
                  >
                    Unblock NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="max-w-6xl">
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No vendors yet</h3>
              <p className="text-gray-500">Create your first vendor to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={cancelBlockVendor}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal content */}
            <div className="text-center">
              <h2 className="text-lg font-bold text-black mb-8 leading-6">
                are you sure you want to {blockAction}
              </h2>
              
              <div className="flex justify-center space-x-4">
                {/* Yes button */}
                <button
                  onClick={confirmBlockVendor}
                  className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors min-w-[120px]"
                >
                  yes
                </button>
                
                {/* Cancel button */}
                <button
                  onClick={cancelBlockVendor}
                  className="border border-gray-300 text-black px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors min-w-[120px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={closeSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal content */}
            <div className="text-center">
              <div className="mb-6">
                {/* Success icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              {(() => {
                const vendor = vendors.find(v => v.id === selectedVendorId);
                const wasBlocked = vendor?.status === 'blocked';
                return (
                  <h2 className="text-lg font-bold text-black mb-6">
                    Vendor {wasBlocked ? 'blocked' : 'unblocked'} successfully
                  </h2>
                );
              })()}
              
              <button
                onClick={closeSuccessModal}
                className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPartner;
