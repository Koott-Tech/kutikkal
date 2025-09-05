'use client';

import React from 'react';
import { useNotification } from '../contexts/NotificationContext';

const NotificationTest = () => {
  const { showSuccess, showError, showWarning, showInfo, showConfirmDialog } = useNotification();

  const handleTestSuccess = () => {
    showSuccess('This is a success message!', 'Success');
  };

  const handleTestError = () => {
    showError('This is an error message!', 'Error');
  };

  const handleTestWarning = () => {
    showWarning('This is a warning message!', 'Warning');
  };

  const handleTestInfo = () => {
    showInfo('This is an info message!', 'Info');
  };

  const handleTestConfirm = () => {
    showConfirmDialog({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
      onConfirm: () => showSuccess('Action confirmed!'),
      onCancel: () => showInfo('Action cancelled.')
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Notification System Test</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleTestSuccess}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Success
        </button>
        
        <button
          onClick={handleTestError}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Test Error
        </button>
        
        <button
          onClick={handleTestWarning}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Test Warning
        </button>
        
        <button
          onClick={handleTestInfo}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Info
        </button>
        
        <button
          onClick={handleTestConfirm}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 col-span-2"
        >
          Test Confirm Dialog
        </button>
      </div>
    </div>
  );
};

export default NotificationTest;
