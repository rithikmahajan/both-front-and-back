import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const NotificationItem = ({ notification, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">
            {notification.title || 'Push Notification'}
          </h3>
          <p className="text-gray-600 mb-2">
            {notification.message || notification.text}
          </p>
          {notification.deeplink && (
            <p className="text-sm text-blue-600 mb-2">
              Deep Link: {notification.deeplink}
            </p>
          )}
          {notification.platforms && (
            <div className="flex gap-2 mb-2">
              {notification.platforms.map((platform, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {platform}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500">
            {notification.date || 'No date specified'}
          </p>
        </div>
        
        <div className="flex gap-2 ml-4">
          {onEdit && (
            <button
              onClick={() => onEdit(notification)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit notification"
            >
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(notification)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete notification"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
