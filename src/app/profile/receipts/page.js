'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Download, Receipt, Clock, User, CreditCard } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

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
      
      const response = await fetch('/api/clients/receipts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
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

      const response = await fetch(`/api/clients/receipts/${receiptId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 Download response status:', response.status);
      console.log('🔍 Download response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        // Check if it's a redirect response
        if (response.redirected) {
          // Follow the redirect to download the PDF
          window.open(response.url, '_blank');
          console.log('✅ Receipt download initiated via redirect');
        } else {
          // Handle direct PDF response (fallback)
          const blob = await response.blob();
          console.log('🔍 Blob size:', blob.size, 'bytes');
          console.log('🔍 Blob type:', blob.type);
          
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `receipt-${receiptId}.pdf`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          console.log('✅ Receipt download initiated successfully');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Download failed:', errorData);
        showError(`Failed to download receipt: ${errorData.message || 'Unknown error'}`, 'Download Failed');
      }
    } catch (err) {
      console.error('❌ Error downloading receipt:', err);
      showError('Failed to download receipt. Please try again.', 'Download Error');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Loading authentication...' : 'Loading receipts...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 text-red-500 mx-auto text-4xl">❌</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchReceipts}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Receipts</h1>
              <p className="mt-2 text-gray-600">
                View and download receipts for your completed sessions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {receipts.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
            <p className="text-gray-600">
              Receipts will appear here after you complete a paid session.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Receipt className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Session with {receipt.psychologist_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Receipt #{receipt.receipt_number}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Session Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(receipt.session_date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Session Time</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatTime(receipt.session_time)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Amount Paid</p>
                          <p className="text-sm font-medium text-green-600">
                            ₹{receipt.amount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Payment Status</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <p><strong>Transaction ID:</strong> {receipt.transaction_id}</p>
                          <p><strong>Payment Date:</strong> {formatDate(receipt.payment_date)}</p>
                        </div>
                        <button
                          onClick={() => downloadReceipt(receipt.id)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
