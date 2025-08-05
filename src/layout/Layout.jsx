// Layout component provides the main dashboard structure with navbar, sidebar, and fixed-width content area
// Usage: Wrap your routes/pages with <Layout> for consistent UI
// - Navbar/Header at the top
// - Sidebar below navbar
// - Main content area uses React Router Outlet for dynamic page rendering
import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import sidebarItems from "../data/sidebarItems";

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Map sidebar items to routes
  const getRouteForItem = (item) => {
    const routeMap = {
      "Dashboard": "/",
      "orders": "/orders",
      "return and exchange requests": "/return-orders",
      "support messages": "/messages",
      "vendor msg and in app notifications": "/messages",
      "Category": "/upload-category",
      "Subcategory": "/subcategory",
      "Items": "/manage-items",
      "Filters": "/filters",
      "join us control screen": "/join-control",
      "Manage banners rewards": "/manage-banners-rewards",
      "manage product and category": "/manage-items",
      "product bundling": "/bundling",
      "Arrangement control": "/arrangement",
      "new admin partner": "/new-partner",
      "users /block user": "/users",
      "send notification in app(inbuilt)": "/in-app-notification",
      "push notification": "/push-notification",
      "manage and post reviews": "/manage-reviews",
      "Promo codes": "/promo-code-management",
      "Points management and issue": "/points",
      "Invite a friend with promo code": "/invite",
      "Cart abandonment recovery": "/cart-recovery",
      "(bulk message and email)": "/bulk-messages",
      "analytics report(google)": "/analytics",
      "Data base": "/database",
      "support chat log": "/support-logs",
      "Settings": "/settings"
    };
    return routeMap[item] || "#";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar/Header at the top */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              YORAA
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <img src="/assets/navbarLinks/message.svg" alt="" />
            <img src="/assets/navbarLinks/search.svg" alt="" />
            <img src="/assets/navbarLinks/account.svg" alt="" />
          </div>
        </div>
      </header>
      {/* Sidebar below navbar and main content to the right */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
          </div>
        )}
        
        {/* Sidebar */}
        <aside
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static absolute inset-y-0 left-0 z-50
            w-64 bg-white border-r border-gray-200 flex-shrink-0 transition-transform duration-300 ease-in-out
          `}
        >
          <div className="p-4 overflow-y-auto h-full">
            {sidebarItems.map((section, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const route = getRouteForItem(item);
                    const isActive = location.pathname === route;
                    
                    return (
                      <li key={itemIndex}>
                        {route !== "#" ? (
                          <Link
                            to={route}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`text-xs block py-1.5 px-2 w-full text-left transition-colors rounded ${
                              isActive
                                ? "text-blue-600 font-medium bg-blue-50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {item}
                          </Link>
                        ) : (
                          <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 block py-1.5 px-2 w-full text-left rounded transition-colors"
                          >
                            {item}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1 bg-white overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
