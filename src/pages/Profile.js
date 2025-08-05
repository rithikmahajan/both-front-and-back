import React from 'react';

const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">User Profile</h3>
        <p className="text-gray-600">This page will allow users to update their profile information, change passwords, and manage account settings.</p>
      </div>
    </div>
  );
};

export default Profile;
