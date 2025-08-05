import React, { useCallback } from 'react';
import { Search, MessageSquare, User, Menu, X } from 'lucide-react';

/**
 * Header Component
 * 
 * Top navigation bar for the admin dashboard providing:
 * - Brand logo/title
 * - Global search functionality
 * - Quick action buttons (messages, notifications, profile)
 * - Responsive design with mobile sidebar toggle
 * 
 * Performance Optimizations:
 * - React.memo to prevent unnecessary re-renders
 * - useCallback for event handlers
 * - Optimized icon rendering
 * - Proper accessibility attributes
 */
const Header = React.memo(({ setSidebarOpen, onToggleSidebarVisibility, sidebarHidden }) => {
  // Handle search functionality
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    console.log('Searching for:', searchTerm);
    // TODO: Implement global search functionality
  }, []);

  // Handle quick action clicks
  const handleMessageClick = useCallback(() => {
    console.log('Opening messages');
    // TODO: Navigate to messages or open message modal
  }, []);

  const handleProfileClick = useCallback(() => {
    console.log('Opening profile');
    // TODO: Navigate to profile or show profile dropdown
  }, []);

  // Handle sidebar visibility toggle
  const handleSidebarVisibilityToggle = useCallback(() => {
    onToggleSidebarVisibility();
  }, [onToggleSidebarVisibility]);

  return (
    <header className="bg-white h-[60px] w-full max-w-[1920px] relative shadow-sm">
      <div className="flex items-center justify-between h-full px-4 sm:px-8 lg:px-16">
        
        {/* Left side - Brand Logo and Sidebar Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={handleSidebarVisibilityToggle}
            className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
            title={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
          >
            {sidebarHidden ? (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            ) : (
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            )}
          </button>
          
          {/* Brand Logo */}
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-black tracking-wide">
            YORAA
          </div>
        </div>

        {/* Center - Global Search Form (Hidden on mobile) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <form onSubmit={handleSearch} className="relative w-32 sm:w-40 lg:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-[20px] w-[20px] sm:h-[26px] sm:w-[26px] text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="block w-full pl-10 sm:pl-12 pr-3 py-2 sm:py-3 border border-gray-300 rounded-3xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm transition-all duration-200"
              aria-label="Global search"
            />
          </form>
        </div>

        {/* Right side - Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Mobile Search Button (Visible on mobile only) */}
          <button 
            onClick={handleSearch}
            className="w-[28px] h-[28px] sm:hidden bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search"
            title="Search"
          >
            <Search className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Messages/Chat Button */}
          <button 
            onClick={handleMessageClick}
            className="w-[28px] h-[28px] sm:w-[33px] sm:h-[33px] bg-gray-100 hover:bg-gray-200 rounded-[30px] flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open messages"
            title="Messages"
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>

          {/* Secondary Message/SMS Icon (Hidden on mobile) */}
          <button 
            onClick={handleMessageClick}
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded hidden sm:block"
            aria-label="SMS messages"
            title="SMS Messages"
          >
            <MessageSquare className="w-full h-full" />
          </button>

          {/* Profile/User Icon */}
          <button 
            onClick={handleProfileClick}
            className="w-[20px] h-[20px] sm:w-[21.85px] sm:h-[22px] text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="User profile"
            title="Profile"
          >
            <User className="w-full h-full" />
          </button>
        </div>
      </div>
    </header>
  );
});

// Set display name for debugging
Header.displayName = 'Header';

export default Header;
