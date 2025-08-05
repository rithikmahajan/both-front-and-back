import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';

// Constants
const INITIAL_TEXT_POSITION = { x: 20, y: 20 };
const DRAG_CONSTRAINTS = {
  maxTextWidth: 200,
  maxTextHeight: 100
};

const DEFAULT_BANNER_CONTENT = `Welcome reward
Enjoy a welcome reward to spend in your first month.
Birthday reward
Celebrate your birthday month with a special discount
Private members' sale
Unlocked after your first order`;

// Utility functions
const createImageUrl = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

const constrainPosition = (position, maxX, maxY) => ({
  x: Math.max(0, Math.min(position.x, maxX)),
  y: Math.max(0, Math.min(position.y, maxY))
});

/**
 * ManageBannersOnRewards Component
 * 
 * Features:
 * - Image upload functionality for banner creation
 * - Title and detail input fields
 * - Priority management for banners
 * - Preview section showing existing banners
 * - Post to rewards functionality
 * 
 * Performance Optimizations:
 * - Custom hooks for state management
 * - Memoized components to prevent unnecessary re-renders
 * - Optimized drag and drop functionality
 * - Responsive design with Tailwind CSS
 * - Form validation and error handling
 */
/**
 * Custom Hooks for State Management
 */
const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await createImageUrl(file);
      setSelectedImage(imageUrl);
    }
  }, []);

  const resetImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return { selectedImage, handleImageUpload, resetImage };
};

const useDragAndDrop = (initialPosition = INITIAL_TEXT_POSITION) => {
  const [textPosition, setTextPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left - textPosition.x,
      y: e.clientY - rect.top - textPosition.y
    });
  }, [textPosition]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    
    const maxX = rect.width - DRAG_CONSTRAINTS.maxTextWidth;
    const maxY = rect.height - DRAG_CONSTRAINTS.maxTextHeight;
    
    setTextPosition(constrainPosition({ x: newX, y: newY }, maxX, maxY));
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetPosition = useCallback(() => {
    setTextPosition(initialPosition);
  }, [initialPosition]);

  return {
    textPosition,
    isDragging,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp
    },
    resetPosition
  };
};

const useModalState = () => {
  const [modals, setModals] = useState({
    showScreenView: false,
    showEditModal: false,
    showSaveSuccessModal: false,
    showConfirmationModal: false,
    showPostSuccessModal: false,
    showDeleteConfirmationModal: false,
    showDeleteSuccessModal: false
  });

  const openModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  return { modals, openModal, closeModal };
};

/**
 * Reusable Components
 */
const ImageUploadSection = memo(({ selectedImage, onImageUpload, title = "upload image" }) => (
  <div className="mb-6">
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 h-32">
      {selectedImage ? (
        <img 
          src={selectedImage} 
          alt="Uploaded preview" 
          className="max-w-full max-h-full mx-auto rounded object-contain"
        />
      ) : (
        <div className="text-gray-400 flex flex-col items-center justify-center h-full">
          <div className="text-4xl mb-2">📧</div>
        </div>
      )}
    </div>

    <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-2 hover:bg-blue-700 transition-colors">
      <span className="text-xl">+</span>
      <span>{title}</span>
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
    </label>
  </div>
));

ImageUploadSection.displayName = 'ImageUploadSection';

const TextContentDisplay = memo(({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, index) => {
        const isTitle = index % 2 === 0;
        return (
          <div 
            key={index}
            className={isTitle ? "font-bold text-black" : "text-gray-600 text-xs"}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
});

TextContentDisplay.displayName = 'TextContentDisplay';

const PreviewSection = memo(({ 
  selectedImage, 
  createDetail, 
  textPosition, 
  isDragging, 
  dragHandlers 
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-lg font-bold text-black">Preview and arrange here</h2>
      <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
        i
      </div>
    </div>
    <div 
      className="bg-white border-2 border-gray-200 rounded-lg p-4 w-full h-64 relative overflow-hidden cursor-move"
      style={{ aspectRatio: '16/9', maxWidth: '400px' }}
      {...dragHandlers}
    >
      {/* Background Image */}
      {selectedImage && (
        <img 
          src={selectedImage} 
          alt="Banner preview" 
          className="w-full h-full object-cover rounded absolute inset-0"
        />
      )}
      
      {/* Text Overlay */}
      {(selectedImage || createDetail) && (
        <div
          className="absolute cursor-move select-none max-w-xs"
          style={{
            left: textPosition.x,
            top: textPosition.y,
            transform: isDragging ? 'scale(1.02)' : 'scale(1)',
            transition: isDragging ? 'none' : 'transform 0.2s ease'
          }}
          onMouseDown={dragHandlers.onMouseDown}
        >
          {createDetail ? (
            <div className="text-sm leading-tight">
              {createDetail.split('\n').map((line, index) => (
                <div 
                  key={index} 
                  className={`${index % 2 === 0 ? 'font-bold text-black text-shadow-sm' : 'text-gray-700 mb-2 text-shadow-sm'}`}
                  style={{
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="text-sm text-gray-600"
              style={{
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
              }}
            >
              Add text content to preview
            </div>
          )}
        </div>
      )}
      
      {/* Centered message when no content */}
      {!selectedImage && !createDetail && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p>Upload image and add text to preview</p>
        </div>
      )}
    </div>
  </div>
));

PreviewSection.displayName = 'PreviewSection';

const BannerItem = memo(({ banner, onEdit, onDelete }) => (
  <div className="mb-8 bg-white">
    <div className="grid grid-cols-5 gap-6 items-start">
      {/* Column 1 - Details */}
      <div className="col-span-1">
        <h3 className="text-base font-bold text-black mb-3">posting {banner.id}</h3>
        <h4 className="text-sm font-medium text-black mb-2">detail</h4>
        <TextContentDisplay content={DEFAULT_BANNER_CONTENT} />
      </div>
      
      {/* Column 2 - Uploaded Image */}
      <div className="col-span-1 text-center">
        <h4 className="text-sm font-medium text-black mb-3">uploaded image</h4>
        <div className="w-32 h-24 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto overflow-hidden">
          {banner.image && banner.image !== '/api/placeholder/400/300' ? (
            <img 
              src={banner.image} 
              alt={`Banner ${banner.id}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-blue-500 text-4xl">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Column 3 - Priority */}
      <div className="col-span-1 text-center">
        <h4 className="text-sm font-medium text-black mb-3">priority</h4>
        <div className="flex justify-center">
          <div className="w-12 h-8 border-2 border-black rounded-md flex items-center justify-center text-sm font-medium bg-white">
            {banner.priority}
          </div>
        </div>
      </div>
      
      {/* Column 4 - Preview */}
      <div className="col-span-1 text-center">
        <h4 className="text-sm font-medium text-black mb-3">Preview</h4>
        <div className="w-32 h-56 bg-gray-100 rounded-lg overflow-hidden relative mx-auto shadow-sm border">
          <div className="w-full h-full relative">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjIyNCIgdmlld0JveD0iMCAwIDEyOCAyMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9Ijg4IiBoZWlnaHQ9IjE0NCIgZmlsbD0iI0U1RTVFNSIgcng9IjgiLz4KPHN2ZyB4PSI0MCIgeT0iODAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDQ4IDY0IiBmaWxsPSJub25lIj4KPHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgZmlsbD0ibm9uZSI+CjxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSIzMiIgZmlsbD0iI0ZGRkZGRiIgcng9IjQiLz4KPHJlY3QgeT0iMzIiIHdpZHRoPSI0OCIgaGVpZ2h0PSIzMiIgZmlsbD0iIzc2QTlGQSIgcng9IjQiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K')`
              }}
            >
              <div className="absolute inset-0 p-3 flex flex-col justify-center">
                <div className="text-xs font-bold text-black mb-1 leading-tight">Welcome reward</div>
                <div className="text-xs text-gray-700 mb-2 leading-tight">Enjoy a welcome reward to spend in your first month.</div>
                <div className="text-xs font-bold text-black mb-1 leading-tight">Birthday reward</div>
                <div className="text-xs text-gray-700 mb-2 leading-tight">Celebrate your birthday with a special discount</div>
                <div className="text-xs font-bold text-black mb-1 leading-tight">Private members' sale</div>
                <div className="text-xs text-gray-700 leading-tight">Unlocked after your first order</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Column 5 - Actions */}
      <div className="col-span-1 text-center">
        <div className="h-6 mb-3"></div>
        <div className="flex justify-center gap-2">
          <button 
            onClick={() => onEdit(banner)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="Edit banner"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(banner.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete banner"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="m19,6v14a2,2 0 0 1-2,2H7a2,2 0 0 1-2-2V6m3,0V4a2,2 0 0 1 2-2h4a2,2 0 0 1 2,2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
));

BannerItem.displayName = 'BannerItem';
BannerItem.displayName = 'BannerItem';

const ManageBannersOnRewards = () => {
  // Form state
  const [createDetail, setCreateDetail] = useState('');
  
  // Custom hooks
  const { selectedImage, handleImageUpload, resetImage } = useImageUpload();
  const { textPosition, isDragging, dragHandlers, resetPosition } = useDragAndDrop();
  const { modals, openModal, closeModal } = useModalState();
  
  // Edit state
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [editDetail, setEditDetail] = useState('');
  const [editImage, setEditImage] = useState(null);
  
  // Banners state
  const [banners, setBanners] = useState([
    {
      id: 1,
      detail: DEFAULT_BANNER_CONTENT,
      priority: 1,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
      textPosition: INITIAL_TEXT_POSITION
    },
    {
      id: 2,
      detail: DEFAULT_BANNER_CONTENT,
      priority: 2,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80',
      textPosition: INITIAL_TEXT_POSITION
    }
  ]);

  /**
   * Banner management handlers
   */
  const handlePostToRewards = useCallback(() => {
    if (!createDetail.trim()) {
      alert('Please fill in the detail field');
      return;
    }
    openModal('showConfirmationModal');
  }, [createDetail, openModal]);

  const handleConfirmPost = useCallback(() => {
    const newBanner = {
      id: banners.length + 1,
      detail: createDetail,
      priority: banners.length + 1,
      image: selectedImage || null,
      textPosition: { ...textPosition }
    };

    setBanners(prev => [...prev, newBanner]);
    setCreateDetail('');
    resetImage();
    resetPosition();
    closeModal('showConfirmationModal');
    openModal('showPostSuccessModal');
  }, [banners.length, createDetail, selectedImage, textPosition, resetImage, resetPosition, closeModal, openModal]);

  const handleDeleteBanner = useCallback((bannerId) => {
    setBannerToDelete(bannerId);
    openModal('showDeleteConfirmationModal');
  }, [openModal]);

  const handleConfirmDelete = useCallback(() => {
    if (bannerToDelete) {
      setBanners(prev => prev.filter(banner => banner.id !== bannerToDelete));
      closeModal('showDeleteConfirmationModal');
      setBannerToDelete(null);
      openModal('showDeleteSuccessModal');
    }
  }, [bannerToDelete, closeModal, openModal]);

  const handleEditBanner = useCallback((banner) => {
    setEditingBanner(banner);
    setEditDetail(banner.detail);
    setEditImage(banner.image);
    openModal('showEditModal');
  }, [openModal]);

  const handleSaveEdit = useCallback((updatedBannerData) => {
    if (editingBanner) {
      setBanners(prev => prev.map(banner => 
        banner.id === editingBanner.id 
          ? { 
              ...banner, 
              detail: editDetail,
              image: editImage,
              textPosition: updatedBannerData?.textPosition || banner.textPosition,
              priority: updatedBannerData?.priority || banner.priority
            }
          : banner
      ));
      handleCloseEdit();
      openModal('showSaveSuccessModal');
    }
  }, [editingBanner, editDetail, editImage, openModal]);

  const handleCloseEdit = useCallback(() => {
    closeModal('showEditModal');
    setEditingBanner(null);
    setEditDetail('');
    setEditImage(null);
  }, [closeModal]);

  const handleEditImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await createImageUrl(file);
      setEditImage(imageUrl);
    }
  }, []);

  /**
   * Modal handlers
   */
  const modalHandlers = useMemo(() => ({
    handleCancelPost: () => closeModal('showConfirmationModal'),
    handleCancelDelete: () => {
      closeModal('showDeleteConfirmationModal');
      setBannerToDelete(null);
    },
    handleCloseDeleteSuccessModal: () => closeModal('showDeleteSuccessModal'),
    handleViewScreenView: () => openModal('showScreenView'),
    handleCloseScreenView: () => closeModal('showScreenView'),
    handleCloseSaveSuccessModal: () => closeModal('showSaveSuccessModal'),
    handleClosePostSuccessModal: () => closeModal('showPostSuccessModal')
  }), [closeModal, openModal]);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-black">manage banner on rewards</h1>
      </div>

      <div className="flex gap-8">
        {/* Left Section - Create Banner */}
        <div className="flex-1 max-w-md">
          <ImageUploadSection
            selectedImage={selectedImage}
            onImageUpload={handleImageUpload}
          />

          {/* Create Detail */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-black mb-2">Create detail</label>
            <textarea
              value={createDetail}
              onChange={(e) => setCreateDetail(e.target.value)}
              rows={8}
              className="w-full p-3 border-2 border-black rounded-xl resize-none focus:outline-none focus:border-blue-500"
              placeholder={DEFAULT_BANNER_CONTENT}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePostToRewards}
              className="bg-gray-800 text-white px-12 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors"
            >
              Post to rewards
            </button>
            <button 
              onClick={modalHandlers.handleViewScreenView}
              className="bg-red-500 text-white px-12 py-3 rounded-full font-medium hover:bg-red-600 transition-colors"
            >
              View screen view
            </button>
          </div>
        </div>

        {/* Right Section - Preview and Manage */}
        <div className="flex-1">
          <PreviewSection
            selectedImage={selectedImage}
            createDetail={createDetail}
            textPosition={textPosition}
            isDragging={isDragging}
            dragHandlers={dragHandlers}
          />

          {/* All Posting Section */}
          <div>
            <h2 className="text-lg font-bold text-black mb-4">All posting</h2>
            
            {banners.map((banner) => (
              <BannerItem
                key={banner.id}
                banner={banner}
                onEdit={handleEditBanner}
                onDelete={handleDeleteBanner}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modals.showScreenView && (
        <ScreenViewModal 
          banners={banners}
          onClose={modalHandlers.handleCloseScreenView}
        />
      )}

      {modals.showEditModal && (
        <EditBannerModal
          banner={editingBanner}
          detail={editDetail}
          image={editImage}
          onDetailChange={setEditDetail}
          onImageChange={handleEditImageUpload}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
        />
      )}

      {modals.showSaveSuccessModal && (
        <SaveSuccessModal onClose={modalHandlers.handleCloseSaveSuccessModal} />
      )}

      {modals.showConfirmationModal && (
        <ConfirmationModal 
          onConfirm={handleConfirmPost}
          onCancel={modalHandlers.handleCancelPost}
        />
      )}

      {modals.showPostSuccessModal && (
        <PostSuccessModal onClose={modalHandlers.handleClosePostSuccessModal} />
      )}

      {modals.showDeleteConfirmationModal && (
        <DeleteConfirmationModal 
          onConfirm={handleConfirmDelete}
          onCancel={modalHandlers.handleCancelDelete}
        />
      )}

      {modals.showDeleteSuccessModal && (
        <DeleteSuccessModal onClose={modalHandlers.handleCloseDeleteSuccessModal} />
      )}
    </div>
  );
};

/**
 * Screen View Modal Component - Shows mobile app preview with banners
 * Matches the Figma design exactly
 */
const ScreenViewModal = memo(({ banners, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-full max-w-7xl max-h-[90vh] overflow-y-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Screen View Button */}
          <div className="bg-red-500 text-white px-12 py-3 rounded-full font-medium">
            screen view
          </div>
          
          {/* Go Back Button */}
          <button
            onClick={onClose}
            className="border border-gray-300 text-black px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
          >
            go back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[800px]">
        {/* Mobile Preview - Centered */}
        <div className="flex-1 flex items-center justify-center bg-white p-8">
          <div className="w-96 h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
            {/* Phone Screen Content */}
            <div className="h-full flex flex-col">
              {/* Status Bar */}
              <div className="bg-black h-8 flex items-center justify-center">
                <div className="w-16 h-1 bg-white rounded-full"></div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                {banners
                  .sort((a, b) => a.priority - b.priority)
                  .map((banner, index) => (
                    <div key={banner.id} className="relative">
                      {/* First Banner - Black with 10% OFF */}
                      {index === 0 && (
                        <div className="bg-black text-white p-8 text-center min-h-[250px] flex flex-col justify-center">
                          <div className="text-xs mb-2">WANT</div>
                          <div className="text-5xl font-bold mb-2">10% OFF</div>
                          <div className="text-lg mb-4">YOUR NEXT PURCHASE?</div>
                          <div className="text-xs mb-1">PLUS REWARD GIVEAWAY AND MORE!</div>
                          <div className="text-xs mt-4">What are you waiting for?</div>
                          <div className="text-xs">Become aRewards member today!</div>
                        </div>
                      )}

                      {/* Second Banner - Yellow Concert Giveaway */}
                      {index === 1 && (
                        <div className="bg-yellow-300 text-black p-6 min-h-[200px] relative">
                          <div className="text-xs text-center mb-4">Expires in 8 days</div>
                          <div className="text-sm font-bold text-center mb-6">YORAA Concert Giveaways</div>
                          
                          {/* Banner content area with text overlay */}
                          <div className="flex-1 flex items-center justify-center mb-4">
                            <div className="text-center">
                              {banner.detail.split('\n').slice(0, 2).map((line, idx) => (
                                <div key={idx} className={idx === 0 ? 'text-lg font-bold mb-1' : 'text-sm'}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Members Exclusive Label */}
                          <div className="absolute bottom-4 left-4">
                            <div className="border border-black px-4 py-1 text-xs">
                              MEMBERS EXCLUSIVE
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional banners */}
                      {index > 1 && (
                        <div className="p-4 border-b border-gray-200">
                          {banner.image && (
                            <img 
                              src={banner.image} 
                              alt="Banner"
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                          )}
                          <div className="text-sm">
                            {banner.detail.split('\n').map((line, idx) => (
                              <div key={idx} className={idx % 2 === 0 ? 'font-medium text-black mb-1' : 'text-xs text-gray-600 mb-2'}>
                                {line}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

ScreenViewModal.displayName = 'ScreenViewModal';

/**
 * Edit Banner Modal Component - Modal for editing existing banners
 * Matches the Figma design exactly with drag and drop functionality
 */
const EditBannerModal = memo(({ 
  banner, 
  detail, 
  image, 
  onDetailChange, 
  onImageChange, 
  onSave, 
  onClose 
}) => {
  const detailText = detail || DEFAULT_BANNER_CONTENT;

  // Local state for drag and drop functionality
  const [editTextPosition, setEditTextPosition] = useState(banner?.textPosition || INITIAL_TEXT_POSITION);
  const [isEditDragging, setIsEditDragging] = useState(false);
  const [editDragOffset, setEditDragOffset] = useState({ x: 0, y: 0 });
  const [editPriority, setEditPriority] = useState(banner?.priority || 1);

  // Drag and drop handlers for edit modal
  const handleEditMouseDown = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIsEditDragging(true);
    setEditDragOffset({
      x: e.clientX - rect.left - editTextPosition.x,
      y: e.clientY - rect.top - editTextPosition.y
    });
  }, [editTextPosition]);

  const handleEditMouseMove = useCallback((e) => {
    if (!isEditDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - editDragOffset.x;
    const newY = e.clientY - rect.top - editDragOffset.y;
    
    const maxX = rect.width - DRAG_CONSTRAINTS.maxTextWidth;
    const maxY = rect.height - DRAG_CONSTRAINTS.maxTextHeight;
    
    setEditTextPosition(constrainPosition({ x: newX, y: newY }, maxX, maxY));
  }, [isEditDragging, editDragOffset]);

  const handleEditMouseUp = useCallback(() => {
    setIsEditDragging(false);
  }, []);

  const handleSaveWithPosition = useCallback(() => {
    if (banner && onSave) {
      onSave({
        ...banner,
        textPosition: editTextPosition,
        priority: editPriority
      });
    }
  }, [banner, editTextPosition, editPriority, onSave]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-full max-w-7xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
          aria-label="Close modal"
        >
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black text-center">Edit banner on rewards</h2>
        </div>

        {/* Main Content */}
        <div className="flex h-[600px]">
          {/* Left Side - Form */}
          <div className="w-1/3 p-6 space-y-6">
            {/* Posting Header */}
            <div>
              <h3 className="text-lg font-bold text-black mb-1">posting {banner?.id || 1}</h3>
            </div>

            {/* Type Here Section */}
            <div>
              <label className="block text-lg font-bold text-black mb-3">
                Type here
              </label>
              <textarea
                value={detailText}
                onChange={(e) => onDetailChange(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border-2 border-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-none"
                placeholder="Enter banner details..."
              />
            </div>

            {/* Priority Section */}
            <div>
              <label className="block text-lg font-bold text-black mb-3">
                priority {editPriority}
              </label>
              <input
                type="number"
                value={editPriority}
                onChange={(e) => setEditPriority(parseInt(e.target.value) || 1)}
                className="w-20 h-10 px-3 border-2 border-black rounded-lg text-center text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                min="1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <button
                onClick={handleSaveWithPosition}
                className="bg-black text-white font-semibold text-base px-12 py-3 rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Save banner changes"
              >
                save
              </button>
              
              <button
                onClick={onClose}
                className="bg-white text-black font-semibold text-base px-12 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Cancel editing"
              >
                go back
              </button>
            </div>
          </div>

          {/* Middle Section - Image Upload */}
          <div className="w-1/3 p-6 flex flex-col justify-center">
            <div className="w-64 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mx-auto mb-4">
              {image && image !== '/api/placeholder/400/300' ? (
                <img 
                  src={image} 
                  alt="Banner preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-blue-500 text-center">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
              )}
            </div>
            
            <label className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer inline-flex items-center justify-center font-medium hover:bg-blue-700 transition-colors mx-auto">
              <span>change image</span>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Right Side - Preview and Arrange */}
          <div className="w-1/3 p-6">
            <div className="mb-4 flex items-center gap-2">
              <h3 className="text-lg font-bold text-black">Preview and arrange here</h3>
              <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                i
              </div>
            </div>
            
            {/* Phone Preview with Drag and Drop */}
            <div className="w-64 h-80 bg-gray-100 rounded-lg overflow-hidden relative mx-auto shadow-sm border">
              <div 
                className="w-full h-full relative cursor-move"
                onMouseDown={handleEditMouseDown}
                onMouseMove={handleEditMouseMove}
                onMouseUp={handleEditMouseUp}
                onMouseLeave={handleEditMouseUp}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  {image && image !== '/api/placeholder/400/300' && !image.includes('placeholder') ? (
                    <img 
                      src={image} 
                      alt="Banner background" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&h=2000&q=80')`,
                        backgroundPosition: 'center center'
                      }}
                    />
                  )}
                </div>
                
                {/* Draggable Text Overlay */}
                <div
                  className="absolute cursor-move select-none max-w-xs z-10"
                  style={{
                    left: editTextPosition.x,
                    top: editTextPosition.y,
                    transform: isEditDragging ? 'scale(1.02)' : 'scale(1)',
                    transition: isEditDragging ? 'none' : 'transform 0.2s ease'
                  }}
                  onMouseDown={handleEditMouseDown}
                >
                  <div className="text-sm leading-tight">
                    {detailText.split('\n').map((line, index) => (
                      <div 
                        key={index} 
                        className={`${index % 2 === 0 ? 'font-bold text-black mb-1' : 'text-gray-700 mb-2'}`}
                        style={{
                          textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EditBannerModal.displayName = 'EditBannerModal';

/**
 * Confirmation Modal Component - Shows confirmation dialog for posting to rewards
 * Matches the Figma design exactly
 */
const ConfirmationModal = memo(({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-full max-w-md relative p-8">
        {/* Confirmation Message */}
        <div className="text-center mb-8">
          <h2 className="font-['Montserrat'] text-xl font-bold text-black leading-tight">
            Are you sure you<br />
            want to post to<br />
            rewards
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-black text-white font-['Montserrat'] font-semibold text-base px-12 py-3 rounded-full hover:bg-gray-800 transition-colors"
            style={{ width: '120px', height: '48px' }}
          >
            yes
          </button>
          
          <button
            onClick={onCancel}
            className="bg-white text-black font-['Montserrat'] font-semibold text-base px-12 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            style={{ width: '120px', height: '48px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmationModal.displayName = 'ConfirmationModal';

/**
 * Post Success Modal Component - Shows "posting updated successfully!" with checkmark
 * Matches the Figma design exactly
 */
const PostSuccessModal = memo(({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-full max-w-md relative p-8">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="font-['Montserrat'] text-lg font-bold text-black leading-tight">
            posting updated<br />
            successfully!
          </h2>
        </div>

        {/* Done Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-black text-white font-['Montserrat'] font-semibold text-base px-12 py-3 rounded-full hover:bg-gray-800 transition-colors"
            style={{ width: '270px', height: '48px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
});

PostSuccessModal.displayName = 'PostSuccessModal';

/**
 * Save Success Modal Component - Shows "posting updated successfully!" notification
 * Matches the Figma design exactly
 */
const SaveSuccessModal = memo(({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-full max-w-md relative p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close popup"
        >
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Message */}
        <div className="text-center mb-8 mt-4">
          <h2 className="font-['Montserrat'] text-lg font-bold text-black tracking-[-0.41px] leading-[22px]">
            posting updated successfully!
          </h2>
        </div>

        {/* Done Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-black text-white font-['Montserrat'] font-semibold text-base px-12 py-3 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Close success popup"
            style={{ width: '270px', height: '48px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
});

SaveSuccessModal.displayName = 'SaveSuccessModal';

/**
 * Delete Confirmation Modal Component - Shows confirmation dialog for deleting banners
 * Matches the Figma design exactly
 */
const DeleteConfirmationModal = memo(({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-full max-w-md relative p-8">
        {/* Confirmation Message */}
        <div className="text-center mb-8">
          <h2 className="font-['Montserrat'] text-[18px] font-bold text-black leading-[22px] tracking-[-0.41px]">
            Are you sure you<br />
            want to delete this<br />
            post
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-black text-white font-['Montserrat'] font-semibold text-base px-12 py-3 rounded-full hover:bg-gray-800 transition-colors"
            style={{ width: '149px', height: '48px' }}
          >
            yes
          </button>
          
          <button
            onClick={onCancel}
            className="bg-white text-black font-['Montserrat'] font-medium text-base px-12 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            style={{ width: '209px', height: '48px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteConfirmationModal.displayName = 'DeleteConfirmationModal';

/**
 * Delete Success Modal Component - Shows "posting deleted successfully!" with checkmark
 * Matches the Figma design exactly
 */
const DeleteSuccessModal = memo(({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-[0px_4px_120px_2px_rgba(0,0,0,0.25)] w-full max-w-md relative p-8">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="font-['Montserrat'] text-[18px] font-bold text-black leading-[22px] tracking-[-0.41px]">
            posting deleted<br />
            successfully!
          </h2>
        </div>

        {/* Done Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-black text-white font-['Montserrat'] font-semibold text-base px-12 py-3 rounded-full hover:bg-gray-800 transition-colors"
            style={{ width: '270px', height: '48px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteSuccessModal.displayName = 'DeleteSuccessModal';

export default ManageBannersOnRewards;
