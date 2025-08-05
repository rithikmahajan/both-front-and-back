import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Constants
const SECTIONS = {
  HEAD: 'head',
  POSTING: 'posting',
  BOTTOM: 'bottom'
};

const DEFAULT_TEXT_POSITION = { x: 20, y: 20 };
const PREVIEW_IMAGE_URL = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

const DEFAULT_POST_CONTENT = [
  {
    title: 'Welcome reward',
    description: 'Enjoy a welcome reward to spend in your first month.'
  },
  {
    title: 'Birthday reward',
    description: 'Celebrate your birthday month with a special discount'
  },
  {
    title: 'Private members\' sale',
    description: 'Unlocked after your first order'
  }
];

// Utility functions
const createImageUrl = (file) => {
  return file ? URL.createObjectURL(file) : null;
};

const revokeImageUrl = (url) => {
  if (url) URL.revokeObjectURL(url);
};

const constrainPosition = (position, maxX, maxY) => ({
  x: Math.max(0, Math.min(position.x, maxX)),
  y: Math.max(0, Math.min(position.y, maxY))
});

/**
 * Memoized PostItem Component - Enhanced for different sections
 */
const PostItem = memo(({ post, index, onEdit, onDelete, onPriorityUpdate, sectionType }) => {
  const handlePriorityChange = useCallback((e) => {
    onPriorityUpdate(post.id, parseInt(e.target.value) || 1);
  }, [post.id, onPriorityUpdate]);

  const handleEditClick = useCallback(() => {
    onEdit(post);
  }, [post, onEdit]);

  const handleDeleteClick = useCallback(() => {
    onDelete(post.id);
  }, [post.id, onDelete]);

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-black mb-4">
            {sectionType} {index + 1}
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Post Content Section - Matches Figma layout */}
            <div className="lg:col-span-2 space-y-3">
              <div>
                <h5 className="font-semibold text-xs mb-1">Welcome reward</h5>
                <p className="text-gray-500 text-xs leading-tight">Enjoy a welcome reward to spend in your first month.</p>
              </div>
              <div>
                <h5 className="font-semibold text-xs mb-1">Birthday reward</h5>
                <p className="text-gray-500 text-xs leading-tight">Celebrate your birthday month with a special discount</p>
              </div>
              <div>
                <h5 className="font-semibold text-xs mb-1">Private members' sale</h5>
                <p className="text-gray-500 text-xs leading-tight">Unlocked after your first order</p>
              </div>
            </div>

            {/* Uploaded Image Section */}
            <div className="flex flex-col items-center">
              <h5 className="text-xs font-bold text-black mb-2">uploaded image</h5>
              <div className="w-24 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>

            {/* Priority Control Section */}
            <div className="flex flex-col items-center">
              <h5 className="text-xs font-bold text-black mb-2">priority</h5>
              <div className="text-center">
                <div className="text-2xl font-bold text-black mb-2">{post.priority}</div>
                <input
                  type="number"
                  value={post.priority}
                  onChange={handlePriorityChange}
                  className="w-12 px-1 py-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500 transition-colors text-xs"
                  min="1"
                  aria-label={`Priority for ${post.title}`}
                />
              </div>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col items-center">
              <h5 className="text-xs font-bold text-black mb-2">Preview</h5>
              <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Default preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="mt-2 text-center space-y-1">
                <div>
                  <h6 className="font-semibold text-[10px] text-black">Welcome reward</h6>
                  <p className="text-gray-500 text-[9px] leading-tight">Enjoy a welcome reward to spend in your first month.</p>
                </div>
                <div>
                  <h6 className="font-semibold text-[10px] text-black">Birthday reward</h6>
                  <p className="text-gray-500 text-[9px] leading-tight">Celebrate your birthday month with a special discount</p>
                </div>
                <div>
                  <h6 className="font-semibold text-[10px] text-black">Private members' sale</h6>
                  <p className="text-gray-500 text-[9px] leading-tight">Unlocked after your first order</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 ml-4">
          <button 
            onClick={handleEditClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
            aria-label={`Edit ${post.title}`}
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button 
            onClick={handleDeleteClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
            aria-label={`Delete ${post.title}`}
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
});

/**
 * Reusable Text Content Component
 */
const TextContent = memo(({ content = DEFAULT_POST_CONTENT, customText }) => {
  if (customText) {
    return (
      <div className="space-y-1">
        {customText.split('\n').map((line, index) => (
          <div 
            key={index} 
            className="font-semibold text-black"
            style={{
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8)'
            }}
          >
            {line}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {content.map((item, index) => (
        <div key={index}>
          <h4 className="font-semibold text-black mb-1" style={{
            textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8)'
          }}>
            {item.title}
          </h4>
          <p className="text-gray-700 leading-tight" style={{
            textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
          }}>
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
});

TextContent.displayName = 'TextContent';

/**
 * Reusable Image Upload Component
 */
const ImageUploadSection = memo(({ 
  title, 
  selectedImage, 
  onImageUpload, 
  onImageRemove, 
  uploadId,
  ariaLabel 
}) => (
  <div className="space-y-4">
    <div className="text-center">
      <h3 className="text-sm font-bold text-black mb-4">{title}</h3>
      
      <div className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center h-48 flex flex-col items-center justify-center">
        {selectedImage ? (
          <div className="space-y-3">
            <img 
              src={selectedImage} 
              alt={`${title} preview`}
              className="max-w-full max-h-32 object-contain mx-auto rounded-lg"
              loading="lazy"
            />
            <button
              onClick={onImageRemove}
              className="text-red-500 hover:text-red-700 transition-colors text-xs"
              type="button"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-2 border-gray-400 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              id={uploadId}
              aria-label={ariaLabel}
            />
            <label
              htmlFor={uploadId}
              className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-700 inline-flex items-center gap-2 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              upload image
            </label>
          </div>
        )}
      </div>
    </div>
  </div>
));

ImageUploadSection.displayName = 'ImageUploadSection';

/**
 * Reusable Preview Section with Drag and Drop
 */
const PreviewSection = memo(({ 
  selectedImage, 
  textPosition, 
  customText,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave 
}) => (
  <div className="space-y-4">
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-bold text-black">Preview and arrange</h3>
        <div className="w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-white text-[10px]">i</span>
        </div>
      </div>
      
      <div 
        className="bg-gray-100 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden relative cursor-move"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {/* Background Image */}
        <img 
          src={selectedImage || PREVIEW_IMAGE_URL}
          alt="Preview background" 
          className="w-full h-full object-cover rounded-lg absolute inset-0"
          loading="lazy"
        />

        {/* Draggable Text Overlay */}
        <div
          className="absolute cursor-move select-none max-w-xs z-10"
          style={{
            left: textPosition.x,
            top: textPosition.y,
            transform: isDragging ? 'scale(1.02)' : 'scale(1)',
            transition: isDragging ? 'none' : 'transform 0.2s ease'
          }}
          onMouseDown={onMouseDown}
        >
          <div className="text-xs space-y-1">
            <TextContent customText={customText} />
          </div>
        </div>

        {/* Helper text when no content */}
        {!selectedImage && !customText && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            <p>Drag text to arrange position</p>
          </div>
        )}
      </div>
    </div>
  </div>
));

PreviewSection.displayName = 'PreviewSection';

/**
 * Reusable Form Section Component
 */
const FormSection = memo(({ 
  title,
  formState,
  onDetailChange,
  onImageUpload,
  onImageRemove,
  onCreatePost,
  onScreenViewOpen,
  textPosition,
  isDragging,
  dragHandlers,
  uploadId,
  buttonText 
}) => (
  <div className="mb-16">
    <h2 className="text-lg font-bold text-black mb-8 text-center">{title}</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <ImageUploadSection
        title="Add image"
        selectedImage={formState.selectedImage}
        onImageUpload={onImageUpload}
        onImageRemove={onImageRemove}
        uploadId={uploadId}
        ariaLabel={`Upload ${title.toLowerCase()} image file`}
      />

      {/* Create Detail Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-black mb-4">Create detail</h3>
          <textarea
            value={formState.detail}
            onChange={onDetailChange}
            rows={10}
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none transition-colors text-sm"
            placeholder=""
            aria-label={`${title} post details`}
          />
        </div>
      </div>

      <PreviewSection
        selectedImage={formState.selectedImage}
        textPosition={textPosition}
        customText={formState.detail}
        isDragging={isDragging}
        {...dragHandlers}
      />
    </div>

    {/* Action Buttons */}
    <div className="mt-8 flex justify-center gap-4">
      <button
        onClick={onCreatePost}
        className="bg-black text-white px-12 py-3 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
        disabled={!formState.detail}
        type="button"
      >
        {buttonText}
      </button>
      <button 
        onClick={onScreenViewOpen}
        className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition-colors text-sm font-medium"
        type="button"
      >
        screen view
      </button>
    </div>
  </div>
));

FormSection.displayName = 'FormSection';

/**
 * Posts Section Component
 */
const PostsSection = memo(({ title, posts, onEdit, onDelete, onPriorityUpdate, sectionType }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-black">{title}</h3>
    </div>

    {posts.map((post, index) => (
      <PostItem
        key={post.id}
        post={post}
        index={index}
        onEdit={onEdit}
        onDelete={onDelete}
        onPriorityUpdate={onPriorityUpdate}
        sectionType={sectionType}
      />
    ))}

    {posts.length === 0 && (
      <div className="border-b border-gray-200 pb-6 mb-6">
        <p className="text-gray-500 text-sm text-center py-8">
          No {title.toLowerCase()} posts yet. {title === 'Head' || title === 'Bottom' ? 'Create one using the form above.' : ''}
        </p>
      </div>
    )}
  </div>
));

PostsSection.displayName = 'PostsSection';

/**
 * Custom Hooks for State Management
 */
const useFormState = (initialState = { detail: '', selectedImage: null }) => {
  const [state, setState] = useState(initialState);

  const updateDetail = useCallback((detail) => {
    setState(prev => ({ ...prev, detail }));
  }, []);

  const updateImage = useCallback((file) => {
    if (state.selectedImage) {
      revokeImageUrl(state.selectedImage);
    }
    const imageUrl = createImageUrl(file);
    setState(prev => ({ ...prev, selectedImage: imageUrl }));
  }, [state.selectedImage]);

  const removeImage = useCallback(() => {
    if (state.selectedImage) {
      revokeImageUrl(state.selectedImage);
    }
    setState(prev => ({ ...prev, selectedImage: null }));
  }, [state.selectedImage]);

  const resetForm = useCallback(() => {
    if (state.selectedImage) {
      revokeImageUrl(state.selectedImage);
    }
    setState(initialState);
  }, [state.selectedImage, initialState]);

  return {
    state,
    updateDetail,
    updateImage,
    removeImage,
    resetForm
  };
};

const useModalState = () => {
  const [modalStates, setModalStates] = useState({
    isEditModalOpen: false,
    isSuccessModalOpen: false,
    isDeleteSuccessModalOpen: false,
    isScreenViewOpen: false
  });

  const openModal = useCallback((modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: false }));
  }, []);

  return {
    modalStates,
    openModal,
    closeModal
  };
};

const useDragAndDrop = (initialPosition = DEFAULT_TEXT_POSITION) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left - position.x,
      y: e.clientY - rect.top - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    
    const maxX = rect.width - 200;
    const maxY = rect.height - 100;
    
    setPosition(constrainPosition({ x: newX, y: newY }, maxX, maxY));
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetPosition = useCallback(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return {
    position,
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
/**
 * JoinUsControl Component - Complete Header and Footer Implementation
 */
const JoinUsControl = memo(() => {
  // Form states using custom hooks
  const headerForm = useFormState();
  const bottomForm = useFormState();
  
  // Modal state management
  const { modalStates, openModal, closeModal } = useModalState();
  
  // Drag and drop for text positioning
  const headerDrag = useDragAndDrop();
  const bottomDrag = useDragAndDrop();

  // Edit form state
  const [editState, setEditState] = useState({
    editingPost: null,
    editTitle: '',
    editDetail: '',
    editPriority: 1,
    editSection: SECTIONS.POSTING
  });

  // Posts data with sections
  const [posts, setPosts] = useState(() => [
    {
      id: 1,
      title: 'Welcome reward',
      detail: 'Enjoy a welcome reward to spend in your first month.',
      priority: 1,
      section: SECTIONS.HEAD,
      image: null,
      textPosition: DEFAULT_TEXT_POSITION
    },
    {
      id: 2,
      title: 'Birthday reward', 
      detail: 'Celebrate your birthday month with a special discount',
      priority: 1,
      section: SECTIONS.POSTING,
      image: null,
      textPosition: DEFAULT_TEXT_POSITION
    },
    {
      id: 3,
      title: 'Private members sale', 
      detail: 'Unlocked after your first order',
      priority: 2,
      section: SECTIONS.POSTING,
      image: null,
      textPosition: DEFAULT_TEXT_POSITION
    },
    {
      id: 4,
      title: 'Bottom reward',
      detail: 'Special bottom section promotional content',
      priority: 1,
      section: SECTIONS.BOTTOM,
      image: null,
      textPosition: DEFAULT_TEXT_POSITION
    }
  ]);

  /**
   * Post creation handlers
   */
  const createPost = useCallback((formState, section, textPosition, resetForm, resetPosition) => {
    if (!formState.detail) return;

    const newPost = {
      id: Date.now() + Math.random(),
      title: `${section.charAt(0).toUpperCase() + section.slice(1)} Post`,
      detail: formState.detail,
      priority: 1,
      section,
      image: formState.selectedImage,
      textPosition: { ...textPosition }
    };
    
    setPosts(prevPosts => [...prevPosts, newPost]);
    resetForm();
    resetPosition();
  }, []);

  const handleCreateHeaderPost = useCallback(() => {
    createPost(headerForm.state, SECTIONS.HEAD, headerDrag.position, headerForm.resetForm, headerDrag.resetPosition);
  }, [headerForm.state, headerDrag.position, headerForm.resetForm, headerDrag.resetPosition, createPost]);

  const handleCreateBottomPost = useCallback(() => {
    createPost(bottomForm.state, SECTIONS.BOTTOM, bottomDrag.position, bottomForm.resetForm, bottomDrag.resetPosition);
  }, [bottomForm.state, bottomDrag.position, bottomForm.resetForm, bottomDrag.resetPosition, createPost]);

  /**
   * Post management handlers
   */
  const handleDeletePost = useCallback((id) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    openModal('isDeleteSuccessModalOpen');
  }, [openModal]);

  const handlePriorityUpdate = useCallback((id, newPriority) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === id ? { ...post, priority: newPriority } : post
      )
    );
  }, []);

  /**
   * Edit handlers
   */
  const handleEditClick = useCallback((post) => {
    setEditState({
      editingPost: post,
      editTitle: post.title,
      editDetail: post.detail,
      editPriority: post.priority,
      editSection: post.section
    });
    openModal('isEditModalOpen');
  }, [openModal]);

  const handleSaveEdit = useCallback(() => {
    const { editingPost, editTitle, editDetail, editPriority } = editState;
    
    if (editingPost) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === editingPost.id 
            ? { ...post, title: editTitle, detail: editDetail, priority: editPriority }
            : post
        )
      );
      
      closeModal('isEditModalOpen');
      openModal('isSuccessModalOpen');
      
      setEditState({
        editingPost: null,
        editTitle: '',
        editDetail: '',
        editPriority: 1,
        editSection: SECTIONS.POSTING
      });
    }
  }, [editState, closeModal, openModal]);

  const handleCancelEdit = useCallback(() => {
    closeModal('isEditModalOpen');
    setEditState({
      editingPost: null,
      editTitle: '',
      editDetail: '',
      editPriority: 1,
      editSection: SECTIONS.POSTING
    });
  }, [closeModal]);

  /**
   * Form input handlers
   */
  const handleHeaderDetailChange = useCallback((e) => {
    headerForm.updateDetail(e.target.value);
  }, [headerForm.updateDetail]);

  const handleBottomDetailChange = useCallback((e) => {
    bottomForm.updateDetail(e.target.value);
  }, [bottomForm.updateDetail]);

  const handleHeaderImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) headerForm.updateImage(file);
  }, [headerForm.updateImage]);

  const handleBottomImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) bottomForm.updateImage(file);
  }, [bottomForm.updateImage]);

  const handleEditTitleChange = useCallback((e) => {
    setEditState(prev => ({ ...prev, editTitle: e.target.value }));
  }, []);

  const handleEditDetailChange = useCallback((e) => {
    setEditState(prev => ({ ...prev, editDetail: e.target.value }));
  }, []);

  const handleEditPriorityChange = useCallback((e) => {
    setEditState(prev => ({ ...prev, editPriority: parseInt(e.target.value) || 1 }));
  }, []);

  /**
   * Modal handlers
   */
  const handleScreenViewOpen = useCallback(() => openModal('isScreenViewOpen'), [openModal]);
  const handleSuccessModalClose = useCallback(() => closeModal('isSuccessModalOpen'), [closeModal]);
  const handleDeleteSuccessModalClose = useCallback(() => closeModal('isDeleteSuccessModalOpen'), [closeModal]);
  const handleScreenViewClose = useCallback(() => closeModal('isScreenViewOpen'), [closeModal]);

  /**
   * Computed values
   */
  const sectionPosts = useMemo(() => ({
    head: posts.filter(post => post.section === SECTIONS.HEAD).sort((a, b) => a.priority - b.priority),
    posting: posts.filter(post => post.section === SECTIONS.POSTING).sort((a, b) => a.priority - b.priority),
    bottom: posts.filter(post => post.section === SECTIONS.BOTTOM).sort((a, b) => a.priority - b.priority)
  }), [posts]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      revokeImageUrl(headerForm.state.selectedImage);
      revokeImageUrl(bottomForm.state.selectedImage);
    };
  }, [headerForm.state.selectedImage, bottomForm.state.selectedImage]);

  return (
    <div className="min-h-screen">
      <div className="p-6">
        
        {/* Main Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-6">join us control screen</h1>
        </div>

        {/* Add Header Details Section */}
        <FormSection
          title="Add header details"
          formState={headerForm.state}
          onDetailChange={handleHeaderDetailChange}
          onImageUpload={handleHeaderImageUpload}
          onImageRemove={headerForm.removeImage}
          onCreatePost={handleCreateHeaderPost}
          onScreenViewOpen={handleScreenViewOpen}
          textPosition={headerDrag.position}
          isDragging={headerDrag.isDragging}
          dragHandlers={headerDrag.dragHandlers}
          uploadId="header-image-upload"
          buttonText="Post to head"
        />

        {/* Add Bottom Details Section */}
        <FormSection
          title="Add bottom details"
          formState={bottomForm.state}
          onDetailChange={handleBottomDetailChange}
          onImageUpload={handleBottomImageUpload}
          onImageRemove={bottomForm.removeImage}
          onCreatePost={handleCreateBottomPost}
          onScreenViewOpen={handleScreenViewOpen}
          textPosition={bottomDrag.position}
          isDragging={bottomDrag.isDragging}
          dragHandlers={bottomDrag.dragHandlers}
          uploadId="bottom-image-upload"
          buttonText="Post to bottom"
        />

        {/* Posts Management Section with CRUD */}
        <div className="mt-12 space-y-12">
          <PostsSection
            title="Head"
            posts={sectionPosts.head}
            onEdit={handleEditClick}
            onDelete={handleDeletePost}
            onPriorityUpdate={handlePriorityUpdate}
            sectionType="head posting"
          />

          <PostsSection
            title="All posting"
            posts={sectionPosts.posting}
            onEdit={handleEditClick}
            onDelete={handleDeletePost}
            onPriorityUpdate={handlePriorityUpdate}
            sectionType="posting"
          />

          <PostsSection
            title="Bottom"
            posts={sectionPosts.bottom}
            onEdit={handleEditClick}
            onDelete={handleDeletePost}
            onPriorityUpdate={handlePriorityUpdate}
            sectionType="bottom posting"
          />
        </div>
      </div>

      {/* Edit Modal */}
      {modalStates.isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
            
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-black">
                Edit <span className="font-bold">{editState.editSection} post</span>
              </h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
                aria-label="Close edit modal"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3">Edit Title</h3>
                    <input
                      type="text"
                      value={editState.editTitle}
                      onChange={handleEditTitleChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Enter title..."
                      aria-label="Edit post title"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-black mb-3">Edit Detail</h3>
                    <textarea
                      value={editState.editDetail}
                      onChange={handleEditDetailChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500 resize-none transition-colors"
                      placeholder="Enter details..."
                      aria-label="Edit post details"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-black mb-3">Priority</h3>
                    <input
                      type="number"
                      value={editState.editPriority}
                      onChange={handleEditPriorityChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:border-blue-500 text-center text-lg font-bold transition-colors"
                      min="1"
                      aria-label="Edit post priority"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-black mb-3">Preview</h3>
                    <div className="bg-gray-100 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-left space-y-3">
                      <div>
                        <h4 className="font-medium text-base mb-1">{editState.editTitle || "Title Preview"}</h4>
                        <p className="text-gray-600 text-sm">{editState.editDetail || "Detail preview will appear here..."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={handleSaveEdit}
                  className="bg-black text-white px-16 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
                  type="button"
                >
                  save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="border border-gray-300 text-black px-12 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
                  type="button"
                >
                  go back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {modalStates.isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-80 mx-4">
            <div className="flex justify-end p-4">
              <button
                onClick={handleSuccessModalClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
                aria-label="Close success modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="px-8 pb-8 text-center">
              <h2 className="text-lg font-bold text-black mb-8 leading-tight">
                posting updated successfully!
              </h2>
              <button
                onClick={handleSuccessModalClose}
                className="bg-black text-white px-16 py-3 rounded-full hover:bg-gray-800 transition-colors font-semibold"
                type="button"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {modalStates.isDeleteSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-80 mx-4">
            <div className="flex justify-end p-4">
              <button
                onClick={handleDeleteSuccessModalClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
                aria-label="Close delete success modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="px-8 pb-8 text-center">
              <h2 className="text-lg font-bold text-black mb-8 leading-tight">
                posting deleted successfully!
              </h2>
              <button
                onClick={handleDeleteSuccessModalClose}
                className="bg-black text-white px-16 py-3 rounded-full hover:bg-gray-800 transition-colors font-semibold"
                type="button"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen View Modal - Enhanced to match Figma */}
      {modalStates.isScreenViewOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden">
          {/* Fixed Header - Stagnant upper part */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-10">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-black">YORAA</h1>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleScreenViewClose}
                  className="border border-gray-300 text-black px-8 py-3 rounded-full hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  go back
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Scrollable lower part */}
          <div className="flex pt-20 min-h-screen">
            {/* Sidebar */}
            <div className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-black mb-6">Dashboard</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">App functional area</h3>
                    <div className="space-y-1 ml-2">
                      <p className="text-sm font-medium text-black">join us control screen</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content Area - Moved to left */}
            <div className="flex-1 overflow-y-auto">
              <div className="pl-4 pr-8 py-8 bg-gray-50 min-h-full">
                <div className="max-w-5xl space-y-6">
                  
                  {/* Header Content - Moved to left alignment */}
                  <div className="bg-black text-white p-8 text-left relative rounded-lg max-w-4xl">
                    <div className="space-y-2">
                      <p className="text-sm tracking-wide">WANT</p>
                      <p className="text-5xl font-bold">10% OFF</p>
                      <p className="text-lg">YOUR NEXT PURCHASE?</p>
                      <p className="text-sm">PLUS REWARD GIVEAWAY AND MORE!</p>
                      <div className="mt-6">
                        <p className="text-sm">What are you waiting for?</p>
                        <p className="text-sm">Become a Rewards member today!</p>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Content Cards - Aligned to left */}
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-max">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-yellow-300 p-4 relative h-80 w-72 flex-shrink-0 rounded-lg">
                          <p className="text-xs text-center mb-2">Expires in 8 days</p>
                          <p className="text-sm font-bold text-center mb-4">YORAA Concert Giveaways</p>
                          <div className="absolute inset-3 flex items-center justify-center">
                            <img 
                              src={PREVIEW_IMAGE_URL}
                              alt={`Promotional content ${i}`}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="border border-black text-center py-1 bg-white bg-opacity-90 rounded">
                              <p className="text-xs font-medium">MEMBERS EXCLUSIVE</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Arrows - Left aligned */}
                  <div className="flex gap-4 mt-6">
                    <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

JoinUsControl.displayName = 'JoinUsControl';

export default JoinUsControl;
