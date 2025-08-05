import React, { useState, useCallback, useMemo, memo } from 'react';
import { Filter, Download, Mail, Eye, Trash2, Users } from 'lucide-react';
import BulkSMS from './BulkSMS';

/**
 * Empty Cart Management Component
 * 
 * A comprehensive admin interface for managing users with empty carts.
 * Based on the Figma design, this component provides:
 * - View users with empty carts
 * - Filter by date range, user type, and country/region
 * - Send bulk emails and SMS
 * - Export data for analysis
 * - Individual user actions
 * 
 * Performance Optimizations:
 * - Memoized callbacks to prevent unnecessary re-renders
 * - Optimized state structure
 * - Efficient component updates
 */
const CartAbandonmentRecovery = memo(() => {
  // Filter states
  const [filters, setFilters] = useState({
    dateRange: 'last 7 days',
    userType: 'all',
    countryRegion: 'all',
    sortBy: 'last active'
  });

  // Page state
  const [showBulkSMS, setShowBulkSMS] = useState(false);

  // Sample users data with empty carts
  const [users, setUsers] = useState([
    {
      id: 1,
      userId: 'rithikmahaj',
      email: 'rithikmahajan27@gmail.com',
      mobile: '9001146595',
      userName: 'rithikmahaj',
      userType: 'guest',
      dob: '06/05/1999',
      gender: 'M',
      lastActive: '09/05/1999',
      avgVisitTime: '8hours',
      abandonedCart: 'yes',
      status: 'registered'
    }
  ]);

  // Statistics
  const stats = {
    emptyCartStatus: 2000,
    registeredUsers: 2000,
    guests: 2000,
    avgVisitTime: '1 min'
  };

  // Handle filter changes
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle bulk actions
  const handleBulkEmail = useCallback(() => {
    console.log('Sending bulk email to users with empty carts');
  }, []);

  const handleBulkSMS = useCallback(() => {
    setShowBulkSMS(true);
  }, []);

  const handleExportCSV = useCallback(() => {
    console.log('Exporting user data to CSV');
  }, []);

  // Handle individual user actions
  const handleViewProfile = useCallback((userId) => {
    console.log('Viewing profile for user:', userId);
  }, []);

  const handleSendEmail = useCallback((userId) => {
    console.log('Sending email to user:', userId);
  }, []);

  const handleDeleteUser = useCallback((userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, []);

  // Handle close bulk SMS page
  const handleCloseBulkSMS = useCallback(() => {
    setShowBulkSMS(false);
  }, []);

  // If showing bulk SMS page, render it instead
  if (showBulkSMS) {
    return <BulkSMS onClose={handleCloseBulkSMS} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">empty cart</h1>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleBulkEmail}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Mail className="h-4 w-4" />
            Bulk email
          </button>
          <button
            onClick={handleBulkSMS}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + Bulk Sms
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="h-4 w-4" />
            export csv for analysis
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">empty cart status</p>
            <p className="text-xl font-bold text-gray-900">{stats.emptyCartStatus}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">registered users</p>
            <p className="text-xl font-bold text-gray-900">{stats.registeredUsers}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">guests</p>
            <p className="text-xl font-bold text-gray-900">{stats.guests}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">avg visit time</p>
            <p className="text-xl font-bold text-gray-900">{stats.avgVisitTime}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">date range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="last 7 days">last 7 days</option>
              <option value="last 30 days">last 30 days</option>
              <option value="last 90 days">last 90 days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">user type</label>
            <select
              value={filters.userType}
              onChange={(e) => handleFilterChange('userType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">all</option>
              <option value="registered">registered</option>
              <option value="guest">guest</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">country/region</label>
            <select
              value={filters.countryRegion}
              onChange={(e) => handleFilterChange('countryRegion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">all</option>
              <option value="US">United States</option>
              <option value="IN">India</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">sort by</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="last active">last active</option>
              <option value="name">name</option>
              <option value="email">email</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Details Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">user details</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm">
              + sort and export CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  user id
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  mobile
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  user name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  user type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DOB
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GENDER
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  last active
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  avg visit time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  abandon cart
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.userId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.mobile}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.userName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.userType}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.dob}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.gender}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastActive}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.avgVisitTime}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.abandonedCart === 'yes' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.abandonedCart}
                      </span>
                      <span className="text-xs text-gray-500">{user.status}</span>
                      <span className="text-xs text-gray-400">blocked to</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProfile(user.id)}
                        className="bg-green-100 text-green-800 px-3 py-1 text-xs rounded hover:bg-green-200 flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        view profile
                      </button>
                      <button
                        onClick={() => handleSendEmail(user.id)}
                        className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" />
                        send email
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        delete user
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

CartAbandonmentRecovery.displayName = 'CartAbandonmentRecovery';

export default CartAbandonmentRecovery;
