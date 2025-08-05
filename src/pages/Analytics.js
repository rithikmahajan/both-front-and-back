import React, { useState, useMemo, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

// Constants
const PERIOD_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '1y', label: 'Last year' }
];

// Mock data - in production, this would come from an API
const getMockAnalyticsData = () => ({
  overview: {
    totalRevenue: 45230,
    totalOrders: 1324,
    totalUsers: 8942,
    averageOrderValue: 156.80,
    revenueChange: 12.5,
    ordersChange: -2.1,
    usersChange: 8.7,
    aovChange: 4.2
  },
  chartData: {
    revenue: [
      { day: 'Mon', value: 6200 },
      { day: 'Tue', value: 5800 },
      { day: 'Wed', value: 7100 },
      { day: 'Thu', value: 6500 },
      { day: 'Fri', value: 8200 },
      { day: 'Sat', value: 9100 },
      { day: 'Sun', value: 7300 }
    ],
    topProducts: [
      { name: 'T-shirt', sales: 245, revenue: 12250 },
      { name: 'Jeans', sales: 189, revenue: 15120 },
      { name: 'Sneakers', sales: 156, revenue: 18720 },
      { name: 'Jacket', sales: 134, revenue: 20100 },
      { name: 'Dress', sales: 98, revenue: 9800 }
    ]
  }
});

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

const getChangeColor = (change) => {
  return change >= 0 ? 'text-green-600' : 'text-red-600';
};

const getChangeIcon = (change) => {
  return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
};

// Components
const StatCard = React.memo(({ title, value, change, icon: Icon, format = 'number' }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {format === 'currency' ? formatCurrency(value) : formatNumber(value)}
          </p>
        </div>
      </div>
      <div className={`flex items-center space-x-1 ${getChangeColor(change)}`}>
        {getChangeIcon(change)}
        <span className="text-sm font-medium">
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  </div>
));

const SimpleChart = React.memo(({ data, title }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">{item.day || item.name}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(item.value || item.revenue)}
            </p>
            {item.sales && (
              <p className="text-xs text-gray-500">{item.sales} sales</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
));

const InsightCard = ({ title, value, subtitle, bgColor, textColor }) => (
  <div className={`p-4 ${bgColor} rounded-lg`}>
    <p className={`text-sm font-medium ${textColor}`}>{title}</p>
    <p className={`text-lg font-bold ${textColor.replace('600', '900')}`}>{value}</p>
    <p className={`text-xs ${textColor}`}>{subtitle}</p>
  </div>
);

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const analyticsData = useMemo(() => getMockAnalyticsData(), []);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);

  const handleExport = useCallback(() => {
    // Export functionality would be implemented here
    console.log('Exporting analytics data...');
  }, []);

  const insightsData = useMemo(() => [
    {
      title: 'Best Performing Day',
      value: 'Saturday',
      subtitle: '₹9,100 revenue',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Growth Trend',
      value: '+12.5%',
      subtitle: 'vs last period',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Top Category',
      value: 'Footwear',
      subtitle: '156 units sold',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ], []);

  const statsConfig = useMemo(() => [
    {
      title: 'Total Revenue',
      value: analyticsData.overview.totalRevenue,
      change: analyticsData.overview.revenueChange,
      icon: DollarSign,
      format: 'currency'
    },
    {
      title: 'Total Orders',
      value: analyticsData.overview.totalOrders,
      change: analyticsData.overview.ordersChange,
      icon: ShoppingBag
    },
    {
      title: 'Total Users',
      value: analyticsData.overview.totalUsers,
      change: analyticsData.overview.usersChange,
      icon: Users
    },
    {
      title: 'Avg. Order Value',
      value: analyticsData.overview.averageOrderValue,
      change: analyticsData.overview.aovChange,
      icon: Eye,
      format: 'currency'
    }
  ], [analyticsData.overview]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {PERIOD_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart 
          data={analyticsData.chartData.revenue} 
          title="Revenue This Week" 
        />
        <SimpleChart 
          data={analyticsData.chartData.topProducts} 
          title="Top Performing Products" 
        />
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insightsData.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
