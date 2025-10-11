'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Download, Receipt, Clock, User, CreditCard } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { clientApi } from '@/lib/backendApi';

export default function ReceiptsPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const { showError } = useNotification();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (token && user) {
        fetchReceipts();
      } else if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
      }
    }
  }, [token, user, authLoading]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      console.log('🔍 Token for receipts:', token ? 'Token exists' : 'No token');
      
      const data = await clientApi.getReceipts();
      console.log('🔍 Receipts API response:', data);

      if (data.success) {
        setReceipts(data.data);
      } else {
        setError(data.message || 'Failed to fetch receipts');
      }
    } catch (err) {
      console.error('Error fetching receipts:', err);
      setError('Failed to load receipts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const downloadReceipt = async (receiptId) => {
    try {
      console.log('🔍 Downloading receipt:', receiptId);
      
      if (!token) {
        showError('No authentication token found. Please login again.', 'Authentication Required');
        return;
      }

      // Use the backend API to get the download URL
      const data = await clientApi.downloadReceipt(receiptId);
      console.log('🔍 Download API response:', data);

      const downloadUrl = data?.data?.downloadUrl || data?.downloadUrl;
      if (data?.success && downloadUrl) {
        // Open the download URL in a new tab
        window.open(downloadUrl, '_blank');
        console.log('✅ Receipt download initiated via redirect');
      } else {
        showError(data?.message || 'Failed to get download link', 'Download Failed');
      }
    } catch (err) {
      console.error('❌ Error downloading receipt:', err);
      showError('Failed to download receipt. Please try again.', 'Download Error');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading receipts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 text-red-500 mx-auto text-4xl mb-4">❌</div>
          <h6 className="text-gray-900 mb-4">Error</h6>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchReceipts}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h5 className="text-gray-900 mb-2">Payment Receipts</h5>
          <p className="text-gray-600">
            View and download receipts for your completed sessions
          </p>
        </div>
        <Receipt className="h-8 w-8 text-blue-600" />
      </div>
      {receipts.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h6 className="text-gray-900 mb-2">No receipts found</h6>
          <p className="text-gray-600">
            Receipts will appear here after you complete a paid session.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {receipts.map((receipt) => (
            <div key={receipt.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                    <Receipt className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h6 className="font-semibold text-gray-900 truncate">
                      Session with {receipt.psychologist_name}
                    </h6>
                    <p className="text-sm text-gray-600">
                      Receipt #{receipt.receipt_number}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Session Date</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formatDate(receipt.session_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Session Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(receipt.session_time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Amount Paid</p>
                      <p className="text-sm font-medium text-green-600">
                        ₹{receipt.amount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Payment Status</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="break-all"><strong>Transaction ID:</strong> {receipt.transaction_id}</p>
                      <p><strong>Payment Date:</strong> {formatDate(receipt.payment_date)}</p>
                    </div>
                    <button
                      onClick={() => downloadReceipt(receipt.id)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
                    >
                      <Download className="h-4 w-4" />
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
