import React from 'react';

const Messages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Manage customer messages and communications</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Message Center</h3>
        <p className="text-gray-600">This page will display customer messages, support tickets, and communication tools.</p>
      </div>
    </div>
  );
};

export default Messages;
