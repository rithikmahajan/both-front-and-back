import React, { useState, useMemo, useCallback, memo } from 'react';
import { 
  Search, Filter, RotateCcw, Calendar, Edit2, Trash2, Download, Check, X,
  Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, 
  Plus, BarChart3, RefreshCw, Info
} from 'lucide-react';

/**
 * Unified Database & Dashboard Component - Performance Optimized
 * 
 * A comprehensive admin interface that combines:
 * - Dashboard analytics with real-time statistics
 * - Database inventory management with advanced filtering
 * - SMS analytics and tracking
 * - Sales charts and visualizations
 * - Product sync management across marketplaces
 * - Marketplace connection status monitoring
 * - Sync logs and error tracking with audit trail
 * 
 * Performance Optimizations:
 * - Memoized components to prevent unnecessary re-renders
 * - useCallback for stable function references
 * - Optimized filtering with proper dependency arrays
 * - Extracted sub-components for better code splitting
 * - Reduced object creation in render cycles
 * - Proper key props for list items
 * - Optimized hover states and transitions
 */

// Constants moved outside component to prevent recreation
const FILTER_OPTIONS = {
  categories: ['Profile', 'inventory list', 'Order statistics'],
  subcategories: [
    'Name', 'EMAIL', 'PHONE', 'Date of Birth', 'ADDRESS', 
    'delete account record', 'user details', 'app reviews', 
    'GENDER', 'password details', 'points', 'PG rent receipt – Duly stamped'
  ],
  filterBy: ['category', 'status'],
  dates: ['today', 'week']
};

const TIME_PERIODS = ['07 Days', '30 Days', '6 Months', '7 Days'];
const MONTHS = ['October', 'November', 'December'];

// Table Headers
const PRODUCT_SYNC_HEADERS = [
  'Image', 'product name', 'Price', 'SKU', 
  'barcode no.', 'synced', 'marketplace', 'error', 'action'
];

const INVENTORY_HEADERS = [
  'Image', 'Product Name', 'Category', 'sub categories', 'Price', 'size', 'quantity', 
  'sale price', 'actual price', 'SKU', 'barcode no.', 'Description', 'Manufacturing details',
  'Shipping returns and exchange', 'meta title', 'meta description', 'slug URL', 'photos', 
  'size chart', 'Action'
];

const SYNC_LOG_HEADERS = [
  'date', 'operation', 'market place', 'status', 'error message'
];

// Status Colors Configuration
const STATUS_COLORS = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-500 text-white',
  Yes: 'bg-green-500 text-white',
  no: 'bg-blue-500 text-white',
  sync: 'bg-red-500 text-white',
  fail: 'bg-red-500 text-white',
  connected: 'bg-green-500 hover:bg-green-600 text-white',
  'not connected': 'bg-red-500 hover:bg-red-600 text-white',
  'good to go': 'bg-green-100 text-green-600',
  'low': 'bg-purple-100 text-purple-600',
  'finished': 'bg-red-100 text-red-600'
};

// Memoized Status Badge Component
const StatusBadge = memo(({ status, type = 'status' }) => {
  const getStatusColor = useCallback((status, type) => {
    if (type === 'error') return STATUS_COLORS.error;
    return STATUS_COLORS[status] || STATUS_COLORS.error;
  }, []);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status, type)}`}>
      {status}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Memoized Action Buttons Component
const ActionButtons = memo(({ productId, onEdit, onDelete, onDownload }) => (
  <div className="flex gap-1">
    <button 
      className="p-1.5 bg-gray-100 rounded hover:bg-gray-200"
      onClick={() => onEdit(productId)}
      aria-label="Edit product"
    >
      <Edit2 className="h-3 w-3 text-gray-600" />
    </button>
    <button 
      className="p-1.5 bg-gray-100 rounded hover:bg-gray-200"
      onClick={() => onDelete(productId)}
      aria-label="Delete product"
    >
      <Trash2 className="h-3 w-3 text-gray-600" />
    </button>
    <button 
      className="p-1.5 bg-gray-100 rounded hover:bg-gray-200"
      onClick={() => onDownload(productId)}
      aria-label="Download product data"
    >
      <Download className="h-3 w-3 text-gray-600" />
    </button>
  </div>
));

ActionButtons.displayName = 'ActionButtons';

// Memoized Availability Button Component
const AvailabilityButton = memo(({ available, label }) => (
  <div className="flex items-center justify-center">
    <button 
      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
        available ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
      } transition-colors cursor-pointer`}
      title={available ? `${label} available` : `No ${label.toLowerCase()}`}
    >
      {available ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
    </button>
  </div>
));

AvailabilityButton.displayName = 'AvailabilityButton';

// Memoized Product Image Component
const ProductImage = memo(({ image, productName }) => (
  <div className="flex items-center gap-2">
    <div className="w-12 h-14 bg-gray-200 rounded overflow-hidden">
      <img
        src={image}
        alt={productName}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="flex gap-1">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="w-3 h-3 bg-gray-300 rounded"></div>
      ))}
    </div>
  </div>
));

ProductImage.displayName = 'ProductImage';

// Memoized Size Data Component
const SizeData = memo(({ sizes, dataType }) => (
  <div className="space-y-1">
    {sizes.map((size) => (
      <div key={`${size.size}-${dataType}`} className="text-xs text-gray-900">
        {dataType === 'size' ? size.size : size[dataType]}
      </div>
    ))}
  </div>
));

SizeData.displayName = 'SizeData';

// Main Database Component
const Database = () => {
  // State management for UI interactions
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('07 Days');
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    date: '',
    filterBy: ''
  });

  // Data hooks - Centralized data management
  const { stats, smsStats, analyticsData } = useDashboardData();
  const { productSyncData, marketplaces, syncLogs } = useMarketplaceData();
  const { inventoryProducts } = useInventoryData();

  // Filtered data based on search
  const filteredSyncProducts = useMemo(() => {
    if (!searchTerm) return productSyncData;
    return productSyncData.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marketplace.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productSyncData, searchTerm]);

  const filteredInventoryProducts = useMemo(() => {
    return inventoryProducts.filter(product => {
      const matchesSearch = !searchTerm || 
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesSubcategory = !filters.subcategory || product.subcategory === filters.subcategory;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [inventoryProducts, searchTerm, filters.category, filters.subcategory]);

  // Event handlers
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearchTerm(''); // Reset search when switching tabs
  }, []);

  const handleTimeRangeChange = useCallback((period) => {
    setSelectedTimeRange(period);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: '',
      subcategory: '',
      date: '',
      filterBy: ''
    });
    setSearchTerm('');
  }, []);

  // Action handlers with useCallback for performance
  const handleEdit = useCallback((productId) => {
    console.log('Edit product:', productId);
    // Add edit functionality here
  }, []);

  const handleDelete = useCallback((productId) => {
    console.log('Delete product:', productId);
    // Add delete functionality here
  }, []);

  const handleDownload = useCallback((productId) => {
    console.log('Download product:', productId);
    // Add download functionality here
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-black">Database Management System</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>Nov 11,2025 - Nov 27 2025</span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b">
          <TabButton 
            active={activeTab === 'dashboard'} 
            onClick={() => handleTabChange('dashboard')}
            label="Dashboard & Analytics"
          />
          <TabButton 
            active={activeTab === 'inventory'} 
            onClick={() => handleTabChange('inventory')}
            label="Inventory Management"
          />
          <TabButton 
            active={activeTab === 'sync'} 
            onClick={() => handleTabChange('sync')}
            label="Marketplace Sync"
          />
          <TabButton 
            active={activeTab === 'analytics'} 
            onClick={() => handleTabChange('analytics')}
            label="Analytics Reports"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            stats={stats}
            smsStats={smsStats}
            analyticsData={analyticsData}
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        )}
        
        {activeTab === 'inventory' && (
          <InventoryTab 
            products={filteredInventoryProducts}
            searchTerm={searchTerm}
            filters={filters}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        )}
        
        {activeTab === 'sync' && (
          <SyncTab 
            productSyncData={filteredSyncProducts}
            marketplaces={marketplaces}
            syncLogs={syncLogs}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsTab />
        )}
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = memo(({ active, onClick, label }) => (
  <button
    className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
      active 
        ? 'border-blue-500 text-blue-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
));

TabButton.displayName = 'TabButton';

// Dashboard Tab Component
const DashboardTab = memo(({ stats, smsStats, analyticsData, selectedTimeRange, onTimeRangeChange }) => (
  <div className="space-y-6">
    <StatsGrid stats={stats} />
    <SMSStatsSection smsStats={smsStats} />
    <SalesAnalyticsSection 
      analyticsData={analyticsData}
      selectedTimeRange={selectedTimeRange}
      onTimeRangeChange={onTimeRangeChange}
    />
    <MarketplaceSettingsSection />
  </div>
));

DashboardTab.displayName = 'DashboardTab';

// Inventory Tab Component
const InventoryTab = memo(({ products, searchTerm, filters, onSearchChange, onFilterChange, onResetFilters, onEdit, onDelete, onDownload }) => (
  <div className="space-y-6">
    {/* Search and Filter Bar */}
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <Filter className="h-5 w-5 text-gray-600" />

        {/* Filter Controls */}
        <select
          value={filters.filterBy}
          onChange={(e) => onFilterChange('filterBy', e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Filter By</option>
          {FILTER_OPTIONS.filterBy.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose category</option>
          {FILTER_OPTIONS.categories.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select
          value={filters.subcategory}
          onChange={(e) => onFilterChange('subcategory', e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose sub category</option>
          {FILTER_OPTIONS.subcategories.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <button
          onClick={onResetFilters}
          className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filter
        </button>
      </div>
    </div>

    {/* Inventory Results */}
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-black">
          Inventory Data ({products.length} items)
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {INVENTORY_HEADERS.map(header => (
                <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <InventoryProductRow 
                key={product.id} 
                product={product} 
                onEdit={onEdit}
                onDelete={onDelete}
                onDownload={onDownload}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
));

InventoryTab.displayName = 'InventoryTab';

// Sync Tab Component
const SyncTab = memo(({ productSyncData, marketplaces, syncLogs, searchTerm, onSearchChange }) => (
  <div className="space-y-6">
    <ProductSyncSection 
      productSyncData={productSyncData} 
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />
    <MarketplaceConnectionsSection marketplaces={marketplaces} />
    <SyncLogsSection syncLogs={syncLogs} />
  </div>
));

SyncTab.displayName = 'SyncTab';

// Analytics Tab Component
const AnalyticsTab = memo(() => (
  <div className="space-y-6">
    {/* Analytics Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Reports</h2>
        <p className="text-gray-600 mt-1">Track your business performance and insights</p>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Period Selector */}
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 3 months</option>
          <option value="1y">Last year</option>
        </select>
        
        {/* Action Buttons */}
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>
    </div>

    {/* Analytics Overview Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹45,230</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">12.5%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,324</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-red-600">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">2.1%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">8,942</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">8.7%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹156.80</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">4.2%</span>
          </div>
        </div>
      </div>
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue This Week</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Revenue chart visualization</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
        <div className="space-y-3">
          {[
            { name: 'T-shirt', sales: 245, revenue: 12250 },
            { name: 'Jeans', sales: 189, revenue: 15120 },
            { name: 'Sneakers', sales: 156, revenue: 18720 },
            { name: 'Jacket', sales: 134, revenue: 20100 },
            { name: 'Dress', sales: 98, revenue: 9800 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">₹{item.revenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{item.sales} sales</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Additional Insights */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-600">Best Performing Day</p>
          <p className="text-lg font-bold text-green-900">Saturday</p>
          <p className="text-xs text-green-600">₹9,100 revenue</p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-600">Growth Trend</p>
          <p className="text-lg font-bold text-blue-900">+12.5%</p>
          <p className="text-xs text-blue-600">vs last period</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-purple-600">Top Category</p>
          <p className="text-lg font-bold text-purple-900">Footwear</p>
          <p className="text-xs text-purple-600">156 units sold</p>
        </div>
      </div>
    </div>
  </div>
));

AnalyticsTab.displayName = 'AnalyticsTab';

// Custom hooks for data management (same as before but organized)
const useDashboardData = () => {
  const stats = useMemo(() => [
    {
      title: 'Total User',
      value: '40,689',
      change: '+8.5%',
      changeType: 'increase',
      period: 'Up from yesterday',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Order',
      value: '10293',
      change: '+1.3%',
      changeType: 'increase',
      period: 'Up from past week',
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      title: 'Total Sales',
      value: '$89,000',
      change: '-4.3%',
      changeType: 'decrease',
      period: 'Down from yesterday',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Pending',
      value: '2040',
      change: '+1.8%',
      changeType: 'increase',
      period: 'Up from yesterday',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Sync Products',
      value: '10293',
      change: '+1.3%',
      changeType: 'increase',
      period: 'Up from past week',
      icon: RefreshCw,
      color: 'bg-indigo-500'
    }
  ], []);

  const smsStats = useMemo(() => [
    { title: 'SMS Sent', value: '50,000' },
    { title: 'Delivery Report', value: '35%' },
    { title: 'Promotional SMS', value: '₹ 3345' },
    { title: 'Transactional SMS', value: '₹ 778' }
  ], []);

  const analyticsData = useMemo(() => [
    { title: 'Visitor', value: '395', growth: '348.9', growthType: 'up' },
    { title: 'New Visitors', value: '932', growth: '565.7', growthType: 'up' },
    { title: 'Average engagement time', value: '1m 50', growth: '250.1', growthType: 'down' },
    { title: 'Total Visitors', value: '150K', growth: null, growthType: null }
  ], []);

  return { stats, smsStats, analyticsData };
};

const useMarketplaceData = () => {
  const productSyncData = useMemo(() => [
    { 
      id: 1,
      image: '/api/placeholder/200/200',
      name: 'Item Stock',
      price: '2025',
      sku: '2025',
      barcode: '2025',
      synced: 'Yes',
      marketplace: 'amazon',
      status: 'connected',
      error: null,
      action: 'sync now'
    },
    {
      id: 2,
      image: '/api/placeholder/200/200', 
      name: 'Item Stock',
      price: '2025',
      sku: '2025',
      barcode: '2025',
      synced: 'no',
      marketplace: 'flipkart',
      status: 'not connected',
      error: 'sync',
      action: 'sync now'
    },
    {
      id: 3,
      image: '/api/placeholder/200/200',
      name: 'Item Stock', 
      price: '2025',
      sku: '2025',
      barcode: '2025',
      synced: 'sync',
      marketplace: 'ajio',
      status: 'not connected',
      error: 'sync',
      action: 'sync now'
    }
  ], []);

  const marketplaces = useMemo(() => [
    { id: 1, name: 'amazon', sellerId: '1234', status: 'connected', lastSync: '02.03pm' },
    { id: 2, name: 'flipkart', sellerId: '5678', status: 'not connected', lastSync: null },
    { id: 3, name: 'ajio', sellerId: '4587', status: 'connected', lastSync: null },
    { id: 4, name: 'myntra', sellerId: null, status: 'not connected', lastSync: null },
    { id: 5, name: 'nykaa', sellerId: null, status: 'not connected', lastSync: null }
  ], []);

  const syncLogs = useMemo(() => [
    { id: 1, date: 'Nov 11,2025', operation: 'product sync', marketplace: 'amazon', status: 'success', error: null },
    { id: 2, date: 'Nov 11,2025', operation: 'inventory sync', marketplace: 'flipkart', status: 'fail', error: 'connection timeout' },
    { id: 3, date: 'Nov 11,2025', operation: 'product sync', marketplace: 'ajio', status: 'fail', error: 'invalid credentials' }
  ], []);

  return { productSyncData, marketplaces, syncLogs };
};

const useInventoryData = () => {
  const inventoryProducts = useMemo(() => [
    {
      id: 1,
      image: '/api/placeholder/120/140',
      productName: 'T shirt',
      category: 'T shirt',
      subcategory: 'T shirt',
      returnable: 'returnable',
      sizes: [
        { size: 'small', quantity: 5, myntraPrice: 4566, amazonPrice: 4566, flipkartPrice: 4566, nykaPrice: 4566, salePrice: 4566, actualPrice: 4566 },
        { size: 'medium', quantity: 10, myntraPrice: 4566, amazonPrice: 4566, flipkartPrice: 4566, nykaPrice: 4566, salePrice: 4566, actualPrice: 4566 },
        { size: 'large', quantity: 15, myntraPrice: 4566, amazonPrice: 4566, flipkartPrice: 4566, nykaPrice: 4566, salePrice: 4566, actualPrice: 4566 }
      ],
      sku: 'blk/m/inso123',
      barcode: '45660000000000',
      description: 'this is a shirt',
      manufacturingDetails: 'mfd by apparels pvt ltd',
      shippingReturns: '7 day return',
      metaTitle: 'dhdhd/dhdhdh',
      metaDescription: 'ths/ isnsn/s',
      slugUrl: 'ths/ isnsn/s',
      photos: true,
      sizeChart: true,
      status: 'good to go'
    },
    {
      id: 2,
      image: '/api/placeholder/120/140',
      productName: 'T shirt',
      category: 'T shirt',
      subcategory: 'T shirt',
      returnable: 'returnable',
      sizes: [
        { size: 'small', quantity: 3, myntraPrice: 3999, amazonPrice: 3999, flipkartPrice: 3999, nykaPrice: 3999, salePrice: 3999, actualPrice: 3999 },
        { size: 'medium', quantity: 8, myntraPrice: 3999, amazonPrice: 3999, flipkartPrice: 3999, nykaPrice: 3999, salePrice: 3999, actualPrice: 3999 },
        { size: 'large', quantity: 12, myntraPrice: 3999, amazonPrice: 3999, flipkartPrice: 3999, nykaPrice: 3999, salePrice: 3999, actualPrice: 3999 }
      ],
      sku: 'red/l/inso124',
      barcode: '45660000000001',
      description: 'red cotton shirt',
      manufacturingDetails: 'mfd by textile mills',
      shippingReturns: '7 day return',
      metaTitle: 'red-shirt-cotton',
      metaDescription: 'comfortable red shirt',
      slugUrl: 'red-cotton-shirt',
      photos: true,
      sizeChart: true,
      status: 'low'
    },
    {
      id: 3,
      image: '/api/placeholder/120/140',
      productName: 'T shirt',
      category: 'T shirt',
      subcategory: 'T shirt',
      returnable: 'returnable',
      sizes: [
        { size: 'small', quantity: 0, myntraPrice: 2999, amazonPrice: 2999, flipkartPrice: 2999, nykaPrice: 2999, salePrice: 2999, actualPrice: 2999 },
        { size: 'medium', quantity: 2, myntraPrice: 2999, amazonPrice: 2999, flipkartPrice: 2999, nykaPrice: 2999, salePrice: 2999, actualPrice: 2999 },
        { size: 'large', quantity: 5, myntraPrice: 2999, amazonPrice: 2999, flipkartPrice: 2999, nykaPrice: 2999, salePrice: 2999, actualPrice: 2999 }
      ],
      sku: 'blu/xl/inso125',
      barcode: '45660000000002',
      description: 'blue formal shirt',
      manufacturingDetails: 'mfd by fashion house',
      shippingReturns: '7 day return',
      metaTitle: 'blue-formal-shirt',
      metaDescription: 'professional blue shirt',
      slugUrl: 'blue-formal-shirt',
      photos: true,
      sizeChart: false,
      status: 'finished'
    }
  ], []);

  return { inventoryProducts };
};

// All other components remain the same but are imported from the previous implementations
// I'll include the essential ones here for completeness:

const StatsGrid = memo(({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    {stats.map((stat, index) => (
      <StatCard key={`stat-${index}`} stat={stat} />
    ))}
  </div>
));

StatsGrid.displayName = 'StatsGrid';

const StatCard = memo(({ stat }) => {
  const Icon = stat.icon;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${stat.color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-base font-semibold text-[#202224] opacity-70 mb-1">{stat.title}</p>
        <p className="text-3xl font-bold text-[#202224] tracking-wide mb-3">{stat.value}</p>
        <div className="flex items-center">
          {stat.changeType === 'increase' ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-base font-semibold ${
            stat.changeType === 'increase' ? 'text-[#00b69b]' : 'text-[#f93c65]'
          }`}>
            {stat.change}
          </span>
          <span className="text-base text-[#606060] ml-1">{stat.period}</span>
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

const SMSStatsSection = memo(({ smsStats }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-4">SMS Analytics</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {smsStats.map((stat, index) => (
        <div key={`sms-${index}`} className="text-left">
          <p className="text-sm font-normal text-[#101316] mb-2">{stat.title}</p>
          <p className="text-2xl font-bold text-[#202020]">{stat.value}</p>
        </div>
      ))}
    </div>
  </div>
));

SMSStatsSection.displayName = 'SMSStatsSection';

const SalesAnalyticsSection = memo(({ analyticsData, selectedTimeRange, onTimeRangeChange }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-gray-900">Sales Details</h3>
      <div className="flex items-center space-x-2">
        <select className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          {MONTHS.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
    </div>
    
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6 hover:bg-gray-50 transition-colors duration-200">
      <div className="text-center">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Chart visualization area</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {analyticsData.map((item, index) => (
        <div key={`analytics-${index}`}>
          <p className="text-sm font-semibold text-[#9aa0a6] mb-1 tracking-wider">{item.title}</p>
          <p className="text-xl font-semibold text-[#9aa0a6] mb-1">{item.value}</p>
          {item.growth && (
            <div className="flex items-center">
              <span className={`text-sm ${item.growthType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {item.growth}
              </span>
              {item.growthType === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 ml-1" />
              )}
            </div>
          )}
        </div>
      ))}
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h4 className="font-bold text-gray-900">Views Report</h4>
      <div className="flex flex-wrap gap-2">
        {TIME_PERIODS.map((period) => (
          <button
            key={period}
            className={`px-4 py-2 rounded text-xs font-bold transition-all duration-200 ${
              selectedTimeRange === period
                ? 'bg-zinc-900 text-white border border-zinc-400'
                : 'bg-white text-zinc-500 border border-zinc-400 hover:bg-gray-50'
            }`}
            onClick={() => onTimeRangeChange(period)}
          >
            {period}
          </button>
        ))}
        <button className="px-4 py-2 rounded text-xs font-bold bg-white border border-zinc-300 text-zinc-900 hover:bg-gray-50 transition-colors duration-200">
          Export PDF
        </button>
      </div>
    </div>
  </div>
));

SalesAnalyticsSection.displayName = 'SalesAnalyticsSection';

// Inventory Product Row Component
const InventoryProductRow = memo(({ product, onEdit, onDelete, onDownload }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-4 py-4">
      <ProductImage image={product.image} productName={product.productName} />
    </td>
    <td className="px-4 py-4">
      <div className="font-medium text-gray-900 text-sm">{product.productName}</div>
      <div className="flex items-center gap-1 mt-1">
        <span className="w-2 h-2 bg-black rounded-full"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
      </div>
    </td>
    <td className="px-4 py-4">
      <span className="text-sm text-gray-900">{product.category}</span>
    </td>
    <td className="px-4 py-4">
      <span className="text-sm text-gray-900">{product.subcategory}</span>
      <div className="text-xs text-gray-500 mt-1">{product.returnable}</div>
    </td>
    <td className="px-4 py-4">
      <div className="space-y-1">
        <div className="text-xs text-gray-600">myntra</div>
        <div className="text-xs text-gray-600">amazon</div>
        <div className="text-xs text-gray-600">flipkart</div>
        <div className="text-xs text-gray-600">nykaa</div>
      </div>
    </td>
    <td className="px-4 py-4">
      <SizeData sizes={product.sizes} dataType="size" />
    </td>
    <td className="px-4 py-4">
      <SizeData sizes={product.sizes} dataType="quantity" />
    </td>
    <td className="px-4 py-4">
      <SizeData sizes={product.sizes} dataType="salePrice" />
    </td>
    <td className="px-4 py-4">
      <SizeData sizes={product.sizes} dataType="actualPrice" />
    </td>
    <td className="px-4 py-4">
      <span className="text-xs text-gray-600">{product.sku}</span>
    </td>
    <td className="px-4 py-4">
      <span className="text-xs text-gray-600">{product.barcode}</span>
    </td>
    <td className="px-4 py-4">
      <span className="text-xs text-gray-900 truncate max-w-xs">{product.description}</span>
    </td>
    <td className="px-4 py-4">
      <span className="text-xs text-gray-900 truncate max-w-xs">{product.manufacturingDetails}</span>
    </td>
    <td className="px-4 py-4">
      <span className="text-xs text-gray-900">{product.shippingReturns}</span>
    </td>
    <td className="px-4 py-4">
      <span className="text-xs text-gray-900 truncate max-w-xs">{product.metaTitle}</span>
    </td>
    <td className="px-4 py-4">
      <span className="text-xs text-gray-900 truncate max-w-xs">{product.metaDescription}</span>
    </td>
    <td className="px-4 py-4">
      <span className="text-xs text-gray-900 truncate max-w-xs">{product.slugUrl}</span>
    </td>
    <td className="px-4 py-4">
      <AvailabilityButton available={product.photos} label="Photos" />
    </td>
    <td className="px-4 py-4">
      <AvailabilityButton available={product.sizeChart} label="Size chart" />
    </td>
    <td className="px-4 py-4">
      <div className="flex flex-col items-center gap-2">
        <StatusBadge status={product.status} />
        <ActionButtons 
          productId={product.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      </div>
    </td>
  </tr>
));

InventoryProductRow.displayName = 'InventoryProductRow';

// Additional components (simplified for brevity - include all from Dashboard_optimized.js)
const ProductSyncSection = memo(({ productSyncData, searchTerm, onSearchChange }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Sync Manager</h2>
    
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, marketplace, or SKU..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            {PRODUCT_SYNC_HEADERS.map(header => (
              <th key={header} className="text-left py-3 px-4 font-normal text-[15px] text-black">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productSyncData.map((product) => (
            <tr key={`sync-product-${product.id}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
              <td className="py-4 px-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
              </td>
              <td className="py-4 px-4 font-medium text-gray-900 text-[21px]">{product.name}</td>
              <td className="py-4 px-4 text-gray-700 text-[21px]">{product.price}</td>
              <td className="py-4 px-4 text-gray-700 text-[21px]">{product.sku}</td>
              <td className="py-4 px-4 text-gray-700 text-[21px]">{product.barcode}</td>
              <td className="py-4 px-4">
                <StatusBadge status={product.synced} />
              </td>
              <td className="py-4 px-4 text-gray-700 capitalize text-[21px]">{product.marketplace}</td>
              <td className="py-4 px-4">
                {product.error && <StatusBadge status={product.error} type="error" />}
              </td>
              <td className="py-4 px-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                  sync NOW
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

ProductSyncSection.displayName = 'ProductSyncSection';

const MarketplaceSettingsSection = memo(() => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Marketplace Settings</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Orders from marketplace</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Global inventory sync</span>
            <span className="text-green-600 font-medium">on</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Sync frequency</span>
            <span className="text-green-600 font-medium">enabled</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Per marketplace rules</span>
            <span className="text-gray-700 font-medium">6 hours</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Out series settings</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Global sync</span>
            <div className="flex space-x-4">
              <span className="text-green-600 font-medium">on</span>
              <span className="text-green-600 font-medium">delivered</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Additional sync</span>
            <div className="flex space-x-4">
              <span className="text-red-600 font-medium">off</span>
              <span className="text-red-600 font-medium">failed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

MarketplaceSettingsSection.displayName = 'MarketplaceSettingsSection';

const MarketplaceConnectionsSection = memo(({ marketplaces }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect Marketplaces</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Available marketplace</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center font-bold border-b pb-2">
            <span className="text-lg">marketplace</span>
            <span className="text-lg">actions</span>
          </div>
          {marketplaces.map((marketplace) => (
            <div key={`available-${marketplace.id}`} className="flex justify-between items-center py-2">
              <span className="text-lg text-gray-700 capitalize">{marketplace.name}</span>
              <button className={`px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-200 ${
                STATUS_COLORS[marketplace.status] || STATUS_COLORS['not connected']
              }`}>
                {marketplace.status}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Connected accounts</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center font-bold border-b pb-2">
            <span className="text-lg">seller id</span>
            <span className="text-lg">last sync</span>
          </div>
          {marketplaces.map((marketplace) => (
            <div key={`connected-${marketplace.id}`} className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700 font-mono">
                {marketplace.sellerId || 'Not connected'}
              </span>
              <span className="text-sm text-gray-700">
                {marketplace.lastSync || 'Never'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

MarketplaceConnectionsSection.displayName = 'MarketplaceConnectionsSection';

const SyncLogsSection = memo(({ syncLogs }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sync Logs</h2>
    
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            {SYNC_LOG_HEADERS.map(header => (
              <th key={header} className="text-left py-3 px-4 font-bold text-gray-700 text-lg">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {syncLogs.map((log) => (
            <tr key={`sync-log-${log.id}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
              <td className="py-4 px-4 text-sm font-bold text-gray-900 tracking-wider">
                {log.date}
              </td>
              <td className="py-4 px-4 text-sm font-bold text-gray-900 capitalize">{log.operation}</td>
              <td className="py-4 px-4 text-sm text-gray-700 capitalize">{log.marketplace}</td>
              <td className="py-4 px-4">
                <StatusBadge status={log.status} />
              </td>
              <td className="py-4 px-4">
                {log.error ? (
                  <StatusBadge status={log.error} type="error" />
                ) : (
                  <span className="text-gray-400 text-sm">No errors</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

SyncLogsSection.displayName = 'SyncLogsSection';

export default Database;
