'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Download, Receipt, Clock, User, CreditCard, MessageSquare, LogOut, FileText, BarChart3, Menu, X } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { clientApi, authApi } from '@/lib/backendApi';
import LoadingScreen from '@/components/LoadingScreen';

export default function ReceiptsPage() {
  const { user, token, isLoading: authLoading, hasRole } = useAuth();
  const { showError } = useNotification();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

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
      setShowLoadingScreen(true); // Show loading screen during API call
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
      setShowLoadingScreen(false); // Hide loading screen when API call completes
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

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  const navigation = [
    { name: 'Browse Therapists', href: '/guide', icon: Calendar, show: hasRole('client') },
    { name: 'Sessions', href: '/profile', icon: Calendar },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Contact', href: '/profile', icon: MessageSquare },
    { name: 'Report', href: '/profile', icon: BarChart3 },
    { name: 'Packages', href: '/profile', icon: FileText, show: hasRole('client') },
    { name: 'Receipts', href: '/profile/receipts', icon: Receipt, show: hasRole('client'), active: true },
  ];

  // Handle navigation click
  const handleNavigationClick = (item) => {
    // Always show refresh animation on dashboard menu navigation
    setShowLoadingScreen(true);
    if (item.href) {
      setSidebarOpen(false); // Close mobile menu after navigation
      router.push(item.href);
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
    <>
      {showLoadingScreen && <LoadingScreen />}
      <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                {user.profile?.first_name} {user.profile?.last_name}
              </h2>
              <p className="text-xs text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.filter(item => item.show !== false).map((item) => {
              const Icon = item.icon;
              const isActive = item.active || (item.href === '/profile/receipts' && router.pathname === '/profile/receipts');
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">Hi - {user.profile?.first_name} {user.profile?.last_name}</h1>
          </div>
          
          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                {user.profile?.first_name} {user.profile?.last_name}
              </h2>
              <p className="text-xs text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.filter(item => item.show !== false).map((item) => {
              const Icon = item.icon;
              const isActive = item.active || (item.href === '/profile/receipts' && router.pathname === '/profile/receipts');
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex h-16 items-center justify-between px-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Payment Receipts</h1>
          <div className="w-6" />
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Receipts</h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    View and download receipts for your completed sessions
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
              </div>
        {receipts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Receipt className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Receipts will appear here after you complete a paid session.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col gap-4">
                  {/* Header Section */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-green-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                      <Receipt className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">
                        Session with {receipt.psychologist_name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Receipt #{receipt.receipt_number}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Session Date</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {formatDate(receipt.session_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Session Time</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {formatTime(receipt.session_time)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Amount Paid</p>
                        <p className="text-xs sm:text-sm font-medium text-green-600">
                          ₹{receipt.amount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Payment Status</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="border-t pt-3 sm:pt-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <p className="break-all"><strong>Transaction ID:</strong> {receipt.transaction_id}</p>
                        <p><strong>Payment Date:</strong> {formatDate(receipt.payment_date)}</p>
                      </div>
                      <button
                        onClick={() => downloadReceipt(receipt.id)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto justify-center"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Download Receipt</span>
                        <span className="sm:hidden">Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
