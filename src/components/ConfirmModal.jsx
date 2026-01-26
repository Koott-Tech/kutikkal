'use client';

import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' or 'warning'
  isLoading = false,
  disabled = false
}) {
  const [internalLoading, setInternalLoading] = useState(false);

  // Sync external isLoading with internal state
  useEffect(() => {
    setInternalLoading(isLoading);
  }, [isLoading]);

  if (!isOpen) return null;

  const showLoading = isLoading || internalLoading;

  const variantStyles = {
    danger: {
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'text-red-600',
      border: 'border-red-200'
    },
    warning: {
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      icon: 'text-yellow-600',
      border: 'border-yellow-200'
    }
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-red-50 ${styles.border} border-2`}>
              <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
            </div>
            <h6 className="text-lg font-semibold text-gray-900">{title}</h6>
          </div>
          <button
            onClick={onClose}
            disabled={showLoading || disabled}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={showLoading || disabled}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              if (showLoading || disabled) return;
              
              // Set loading immediately for visual feedback
              setInternalLoading(true);
              
              try {
                await onConfirm();
              } catch (error) {
                console.error('Error in onConfirm:', error);
                setInternalLoading(false);
              }
            }}
            disabled={showLoading || disabled}
            className={`px-4 py-2 rounded-lg transition-colors ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]`}
          >
            {showLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>{typeof confirmText === 'string' ? confirmText : confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

