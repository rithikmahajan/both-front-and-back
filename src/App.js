import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';

// Lazy load components for better performance and code splitting
// This reduces the initial bundle size and improves loading times
const Dashboard = React.lazy(() => import('./pages/database'));
const Users = React.lazy(() => import('./pages/Users'));
const Products = React.lazy(() => import('./pages/Products'));
const Orders = React.lazy(() => import('./pages/Orders'));
const ReturnOrders = React.lazy(() => import('./pages/ReturnOrders'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Filters = React.lazy(() => import('./pages/Filters'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Messages = React.lazy(() => import('./pages/Messages'));
const Settings = React.lazy(() => import('./pages/Settings'));
const UploadCategory = React.lazy(() => import('./pages/UploadCategory'));
const SubCategory = React.lazy(() => import('./pages/SubCategory'));
const ManageItems = React.lazy(() => import('./pages/ManageItems'));
const SingleProductUpload = React.lazy(() => import('./pages/SingleProductUpload'));
const JoinUsControl = React.lazy(() => import('./pages/JoinUsControl'));
const ManageBannersOnRewards = React.lazy(() => import('./pages/ManageBannersOnRewards'));
const PromoCodeManagement = React.lazy(() => import('./pages/PromoCodeManagement'));
const FaqManagement = React.lazy(() => import('./pages/FaqManagement'));
const ProductBundling = React.lazy(() => import('./pages/ProductBundling'));
const ArrangementControl = React.lazy(() => import('./pages/ArrangementControl'));
const NewPartner = React.lazy(() => import('./pages/NewPartner'));
const BlockUser = React.lazy(() => import('./pages/BlockUser'));
const SendNotificationInApp = React.lazy(() => import('./pages/sendnotificationinapp'));
const Points = React.lazy(() => import('./pages/points'));
const InviteAFriend = React.lazy(() => import('./pages/inviteafriend'));
const PushNotification = React.lazy(() => import('./pages/pushnotification'));
const NotificationPreview = React.lazy(() => import('./pages/notificationPreview'));
const SendPromoNotification = React.lazy(() => import('./pages/sendpromonotification'));
const CartAbandonmentRecovery = React.lazy(() => import('./pages/cartabandonmentrecovery'));
const Database = React.lazy(() => import('./pages/database'));
const ManageReviews = React.lazy(() => import('./pages/ManageReviews'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-lg text-gray-600">Loading...</span>
  </div>
);

/**
 * Main App Component
 * 
 * Features:
 * - Router configuration with lazy loading for optimal performance
 * - Suspense boundaries for smooth loading experiences
 * - Nested routing with AdminLayout wrapper
 * 
 * Performance Optimizations:
 * - Code splitting with React.lazy reduces initial bundle size
 * - Suspense provides loading states during chunk loading
 * - Each page component loads only when needed
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Admin layout wrapper with nested routes */}
        <Route path="/" element={<AdminLayout />}>
          {/* Wrap all lazy-loaded components in Suspense */}
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="users" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Users />
            </Suspense>
          } />
          <Route path="products" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Products />
            </Suspense>
          } />
          <Route path="orders" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Orders />
            </Suspense>
          } />
          <Route path="return-orders" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ReturnOrders />
            </Suspense>
          } />
          <Route path="analytics" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Analytics />
            </Suspense>
          } />
          <Route path="filters" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Filters />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Profile />
            </Suspense>
          } />
          <Route path="messages" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Messages />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </Suspense>
          } />
          <Route path="upload-category" element={
            <Suspense fallback={<LoadingSpinner />}>
              <UploadCategory />
            </Suspense>
          } />
          <Route path="subcategory" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SubCategory />
            </Suspense>
          } />
          <Route path="manage-items" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ManageItems />
            </Suspense>
          } />
          <Route path="single-product-upload" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SingleProductUpload />
            </Suspense>
          } />
          <Route path="join-control" element={
            <Suspense fallback={<LoadingSpinner />}>
              <JoinUsControl />
            </Suspense>
          } />
          <Route path="manage-banners-rewards" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ManageBannersOnRewards />
            </Suspense>
          } />
          <Route path="promo-code-management" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PromoCodeManagement />
            </Suspense>
          } />
          <Route path="faq-management" element={
            <Suspense fallback={<LoadingSpinner />}>
              <FaqManagement />
            </Suspense>
          } />
          <Route path="bundling" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProductBundling />
            </Suspense>
          } />
          <Route path="arrangement" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ArrangementControl />
            </Suspense>
          } />
          <Route path="new-partner" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NewPartner />
            </Suspense>
          } />
          <Route path="block-user" element={
            <Suspense fallback={<LoadingSpinner />}>
              <BlockUser />
            </Suspense>
          } />
          <Route path="send-notification-in-app" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SendNotificationInApp />
            </Suspense>
          } />
          <Route path="points" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Points />
            </Suspense>
          } />
          <Route path="invite" element={
            <Suspense fallback={<LoadingSpinner />}>
              <InviteAFriend />
            </Suspense>
          } />
          <Route path="pushnotification" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PushNotification />
            </Suspense>
          } />
          <Route path="notification-preview" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotificationPreview />
            </Suspense>
          } />
          <Route path="send-promo-notification" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SendPromoNotification />
            </Suspense>
          } />
          <Route path="cart-recovery" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CartAbandonmentRecovery />
            </Suspense>
          } />
          <Route path="manage-reviews" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ManageReviews />
            </Suspense>
          } />
          <Route path="database" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Database />
            </Suspense>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
