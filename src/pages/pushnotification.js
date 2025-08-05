import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Mail, Edit, Trash2, Info } from "lucide-react";
import ConfirmationDialogue from "../components/confirmationDialogue";
import EditNotificationModal from "../components/EditNotificationModal";

// Constants
const PLATFORM_OPTIONS = [
  { label: "Android", value: "android" },
  { label: "iOS", value: "ios" },
];

const INITIAL_STACKED_NOTIFICATIONS = [
  { id: 1, text: "Manage account and services linked to your Yoraa account" },
  { id: 2, text: "Manage account and services linked to your Yoraa account" },
  { id: 3, text: "Manage account and services linked to your Yoraa account" },
  { id: 4, text: "Manage account and services linked to your Yoraa account" },
];

const DIALOG_ACTIONS = {
  SEND: "send",
  EDIT: "edit",
  DELETE: "delete",
};

// Utility functions
const getStoredImage = () => {
  try {
    return localStorage.getItem("notificationImage") || null;
  } catch {
    return null;
  }
};

const saveImageToStorage = (image) => {
  try {
    if (image) {
      localStorage.setItem("notificationImage", image);
    } else {
      localStorage.removeItem("notificationImage");
    }
  } catch (error) {
    console.debug("Failed to save image to localStorage:", error);
  }
};

// PushNotification page for sending and managing push notifications
const PushNotification = () => {
  // Form state
  const [notificationText, setNotificationText] = useState("");
  const [deeplink, setDeeplink] = useState("eg yoraa/product/123");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["android"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [image, setImage] = useState(getStoredImage);

  // Stacked notifications state
  const [stackedNotifications, setStackedNotifications] = useState(INITIAL_STACKED_NOTIFICATIONS);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Refs and hooks
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    saveImageToStorage(image);
  }, [image]);

  // Event handlers
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePlatformSelect = useCallback((platforms) => {
    setSelectedPlatforms(platforms);
    setDropdownOpen(false);
  }, []);

  const handleNotificationAction = useCallback((action, notification, index = null) => {
    setDialogAction(action);
    setSelectedNotification(notification);
    if (action === DIALOG_ACTIONS.EDIT) {
      setEditIndex(index);
      setEditValue(notification.text);
    }
    setDialogOpen(true);
  }, []);

  const handleDialogConfirm = useCallback(() => {
    switch (dialogAction) {
      case DIALOG_ACTIONS.SEND:
        // Add send logic here
        console.log("Sending notification:", selectedNotification);
        break;
      
      case DIALOG_ACTIONS.DELETE:
        setStackedNotifications(prev => 
          prev.filter(notification => notification.id !== selectedNotification.id)
        );
        break;
      
      case DIALOG_ACTIONS.EDIT:
        setStackedNotifications(prev => 
          prev.map((notification, index) => 
            index === editIndex 
              ? { ...notification, text: editValue }
              : notification
          )
        );
        setEditIndex(null);
        break;
      
      default:
        break;
    }
    setDialogOpen(false);
  }, [dialogAction, selectedNotification, editIndex, editValue]);

  const handleDialogCancel = useCallback(() => {
    setDialogOpen(false);
    setEditIndex(null);
    setEditValue("");
  }, []);

  const handleSaveForLater = useCallback(() => {
    if (notificationText.trim()) {
      const newNotification = {
        id: Date.now(),
        text: notificationText.trim(),
      };
      setStackedNotifications(prev => [...prev, newNotification]);
      setNotificationText("");
    }
  }, [notificationText]);

  const handleSendNow = useCallback(() => {
    if (notificationText.trim()) {
      // Add send logic here
      console.log("Sending notification now:", {
        text: notificationText,
        deeplink,
        platforms: selectedPlatforms,
        image,
      });
      setNotificationText("");
    }
  }, [notificationText, deeplink, selectedPlatforms, image]);

  // Computed values
  const platformDisplayText = selectedPlatforms.length === 2
    ? "android/ios"
    : selectedPlatforms.length === 1
    ? PLATFORM_OPTIONS.find(opt => opt.value === selectedPlatforms[0])?.label
    : "android/ios";

  // Render helpers
  const renderImagePreview = (imageSource, className = "", alt = "Notification") => (
    imageSource ? (
      <img
        src={imageSource}
        alt={alt}
        className={`object-cover rounded-lg ${className}`}
      />
    ) : (
      <div className="w-8 h-8 border-2 border-[#CCD2E3] rounded"></div>
    )
  );

  const renderPlatformOption = (option) => (
    <button
      key={option.value}
      type="button"
      className={`w-full text-left px-4 py-2 text-sm font-montserrat ${
        selectedPlatforms.includes(option.value) && selectedPlatforms.length === 1
          ? "text-blue-600 bg-gray-100"
          : "text-gray-900"
      }`}
      onClick={() => handlePlatformSelect([option.value])}
    >
      {option.label}
      {selectedPlatforms.includes(option.value) && selectedPlatforms.length === 1 && (
        <span className="ml-2">✓</span>
      )}
    </button>
  );

  const renderStackedNotification = (notification, index) => (
    <div key={notification.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
          <Info size={12} className="text-white" />
        </div>
        <p className="text-black text-base flex-1 font-montserrat leading-tight max-w-sm">
          {notification.text}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium font-montserrat"
          onClick={() => handleNotificationAction(DIALOG_ACTIONS.SEND, notification)}
        >
          send Now
        </button>
        <button 
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={() => handleNotificationAction(DIALOG_ACTIONS.EDIT, notification, index)}
        >
          <Edit size={16} className="text-[#667085]" />
        </button>
        <button 
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={() => handleNotificationAction(DIALOG_ACTIONS.DELETE, notification)}
        >
          <Trash2 size={16} className="text-[#667085]" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-montserrat">
      <div className="max-w-6xl ml-6 px-6 py-8 flex gap-12">
        {/* Left Column - Form */}
        <div className="flex-1 max-w-2xl">
          <h2 className="text-2xl font-bold text-black mb-8">
            Notification
          </h2>

          {/* Notification Text */}
          <div className="mb-8">
            <textarea
              value={notificationText}
              onChange={(e) => setNotificationText(e.target.value)}
              placeholder="Type Here"
              className="w-full h-36 border-2 border-black rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-black font-montserrat text-[#979797]"
            />
          </div>

          {/* Notification Image Upload */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-black mb-4">
              Notification image(optional)
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 bg-[#000AFF] text-white px-4 py-2.5 rounded-lg text-sm hover:bg-blue-700 border border-[#7280FF] shadow-sm font-montserrat"
                onClick={handleFileInputClick}
              >
                <Upload size={16} />
                Upload image
              </button>
              <div className="w-16 h-16 border-2 border-dashed border-[#CCD2E3] rounded-[15px] flex items-center justify-center">
                {renderImagePreview(image, "w-12 h-12")}
              </div>
            </div>
          </div>

          {/* Deeplink */}
          <div className="mb-8">
            <label className="block text-xl font-bold text-black mb-4">
              Deeplink(optional) eg yoraa/product/123
            </label>
            <input
              type="text"
              value={deeplink}
              onChange={(e) => setDeeplink(e.target.value)}
              placeholder="enter Deeplink  eg yoraa/product/123"
              className="w-full max-w-lg border-2 border-black rounded-xl px-4 py-3 text-xl focus:outline-none focus:border-black text-[#979797] font-medium font-montserrat"
            />
          </div>

          {/* Target Platform Dropdown */}
          <div className="mb-8 relative">
            <label className="block text-2xl font-bold text-black mb-4">
              Target platform
            </label>
            <div className="relative max-w-xs">
              <button
                type="button"
                className="w-full border-2 border-black rounded-xl px-4 py-3 text-xl text-left focus:outline-none bg-white text-[#979797] font-medium font-montserrat"
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                {platformDisplayText}
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border-2 border-black rounded-xl shadow-lg">
                  <div className="py-1">
                    <button
                      type="button"
                      className={`w-full text-left px-4 py-2 text-sm font-montserrat ${
                        selectedPlatforms.length === 2
                          ? "text-blue-600 bg-gray-100"
                          : "text-gray-900"
                      }`}
                      onClick={() => handlePlatformSelect(["android", "ios"])}
                    >
                      Both
                      {selectedPlatforms.length === 2 && (
                        <span className="ml-2">✓</span>
                      )}
                    </button>
                    {PLATFORM_OPTIONS.map(renderPlatformOption)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-12">
            <button 
              className="text-black px-12 py-4 border border-[#E4E4E4] rounded-full text-base font-medium hover:bg-gray-50 font-montserrat"
              onClick={handleSaveForLater}
            >
              save for later
            </button>
            <button 
              className="bg-black text-white px-12 py-4 rounded-full text-base font-medium hover:bg-gray-800 font-montserrat"
              onClick={handleSendNow}
            >
              send Now
            </button>
          </div>

          {/* Stack notification for later */}
          <div>
            <h3 className="text-2xl font-bold text-black mb-6">
              Stack notification for later
            </h3>
            <div className="space-y-4">
              {stackedNotifications.map(renderStackedNotification)}
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="w-80 flex-shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-2xl font-bold text-black">
              Preview
            </h3>
            <button
              className="bg-black rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => navigate("/notification-preview", { state: { image } })}
              title="See full preview"
            >
              <Info size={12} className="text-white" />
            </button>
          </div>

          <div className="border-2 border-dashed border-[#CCD2E3] rounded-xl p-8 flex items-center justify-center h-80">
            <div className="text-center">
              {image ? (
                <div className="w-full mx-auto border-2 border-blue-500 rounded-lg flex items-center justify-center overflow-hidden">
                  {renderImagePreview(image, "w-full h-full", "Notification Preview")}
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto border-2 border-[#003F62] rounded-lg flex items-center justify-center">
                  <Mail size={32} className="text-[#003F62]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          {dialogAction === DIALOG_ACTIONS.EDIT ? (
            <EditNotificationModal
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onSave={handleDialogConfirm}
              onCancel={handleDialogCancel}
              original={selectedNotification?.text}
            />
          ) : dialogAction === DIALOG_ACTIONS.DELETE ? (
            <ConfirmationDialogue
              open={dialogOpen}
              message="Are you sure you want to delete this notification?"
              confirmText="Delete"
              onConfirm={handleDialogConfirm}
              onCancel={handleDialogCancel}
            />
          ) : (
            <ConfirmationDialogue
              open={dialogOpen}
              message="Are you sure you want to send the notification?"
              onConfirm={handleDialogConfirm}
              onCancel={handleDialogCancel}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PushNotification;
