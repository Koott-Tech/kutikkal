'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationPopup = ({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title, 
  message, 
  duration = 5000,
  showCloseButton = true,
  actions = null 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      // Auto-close after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          title: 'text-green-800',
          message: 'text-green-700'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          title: 'text-red-800',
          message: 'text-red-700'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          title: 'text-yellow-800',
          message: 'text-yellow-700'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          title: 'text-blue-800',
          message: 'text-blue-700'
        };
    }
  };

  if (!isOpen) return null;

  const styles = getStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={showCloseButton ? handleClose : undefined}
      />
      
      {/* Popup */}
      <div 
        className={`
          relative bg-white rounded-lg shadow-xl border-2 max-w-md w-full mx-4
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Header */}
        <div className={`p-6 border-b ${styles.container}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {getIcon()}
            </div>
            <div className="flex-1">
              {title && (
                <p className={`font-semibold ${styles.title}`}>
                  {title}
                </p>
              )}
              {message && (
                <p className={`mt-2 text-sm ${styles.message}`}>
                  {message}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="p-6 pt-4">
            <div className="flex justify-end space-x-3">
              {actions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
