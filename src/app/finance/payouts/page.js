'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Eye, Check, Clock, Calendar, User, Loader2, MoreVertical, Filter, Receipt, CheckCircle } from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';
import DateRangePicker from '@/components/ui/date-range-picker';
import { hasDateRangeBounds } from '@/lib/dateRangeBounds';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function FinancePayouts() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [doctorPayouts, setDoctorPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [markingAsPaid, setMarkingAsPaid] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [payoutToMark, setPayoutToMark] = useState(null);
  
  // Date range filter (default to current month in IST)
  const [dateRange, setDateRange] = useState(() => {
    try {
      const now = new Date();
      const istString = now.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      const [month, day, year] = istString.split('/').map(Number);
      const startOfMonth = new Date(year, month - 1, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) {
        const today = new Date();
        const fallbackStart = new Date(today.getFullYear(), today.getMonth(), 1);
        fallbackStart.setHours(0, 0, 0, 0);
        const fallbackEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        fallbackEnd.setHours(23, 59, 59, 999);
        return { from: fallbackStart, to: fallbackEnd };
      }
      return { from: startOfMonth, to: endOfMonth };
    } catch (error) {
      console.error('Error initializing date range:', error);
      const today = new Date();
      const fallbackStart = new Date(today.getFullYear(), today.getMonth(), 1);
      fallbackStart.setHours(0, 0, 0, 0);
      const fallbackEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      fallbackEnd.setHours(23, 59, 59, 999);
      return { from: fallbackStart, to: fallbackEnd };
    }
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push('/');
        return;
      }
      
      if (!hasRole('finance') && !hasRole('admin') && !hasRole('superadmin')) {
        router.push('/');
        return;
      }
      
      loadDashboardData();
      loadDoctorPayouts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, hasRole, router]);

  // Reload data when date range changes
  useEffect(() => {
    if (!authLoading && (hasRole('finance') || hasRole('admin') || hasRole('superadmin')) && dateRange) {
      loadDashboardData();
      loadDoctorPayouts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, authLoading]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Format dates for API (YYYY-MM-DD format) - ALWAYS return valid strings
      const formatDateToIST = (date) => {
        if (!date) {
          // Return current date in IST if date is invalid
          const now = new Date();
          const istString = now.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          const [month, day, year] = istString.split('/').map(num => num.padStart(2, '0'));
          return `${year}-${month}-${day}`;
        }
        
        try {
          const istString = new Date(date).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          const [month, day, year] = istString.split('/').map(num => num.padStart(2, '0'));
          return `${year}-${month}-${day}`;
        } catch (error) {
          console.error('Error formatting date:', error);
          // Return current date as fallback
          const now = new Date();
          const istString = now.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          const [month, day, year] = istString.split('/').map(num => num.padStart(2, '0'));
          return `${year}-${month}-${day}`;
        }
      };
      
      // Get current month dates in IST as default
      const getCurrentMonthDates = () => {
        const now = new Date();
        const istString = now.toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const [month, day, year] = istString.split('/').map(Number);
        const startOfMonth = new Date(year, month - 1, 1);
        return {
          from: formatDateToIST(startOfMonth),
          to: formatDateToIST(now)
        };
      };
      
      const allTime = !!(dateRange && dateRange.all);
      let dateFrom;
      let dateTo;

      if (allTime) {
        dateFrom = undefined;
        dateTo = undefined;
      } else if (hasDateRangeBounds(dateRange)) {
        dateFrom = formatDateToIST(dateRange.from);
        dateTo = formatDateToIST(dateRange.to);
      } else {
        const currentDates = getCurrentMonthDates();
        dateFrom = currentDates.from;
        dateTo = currentDates.to;
      }

      if (!allTime) {
        if (!dateFrom || !dateTo || typeof dateFrom !== 'string' || typeof dateTo !== 'string') {
          console.error('CRITICAL: Dates validation failed!', { dateFrom, dateTo, dateRange });
          const currentDates = getCurrentMonthDates();
          dateFrom = currentDates.from;
          dateTo = currentDates.to;
        }
      }

      const response = await financeApi.getDashboard(
        allTime ? { allTime: true } : { dateFrom, dateTo }
      );
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoctorPayouts = async () => {
    try {
      // Format dates for API
      let dateFrom = null;
      let dateTo = null;
      
      if (hasDateRangeBounds(dateRange)) {
        const formatDateToIST = (date) => {
          if (!date) return null;
          const istString = new Date(date).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          const [month, day, year] = istString.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };
        
        dateFrom = formatDateToIST(dateRange.from);
        dateTo = formatDateToIST(dateRange.to);
      }

      const response = await financeApi.getDoctorPayouts({
        dateFrom,
        dateTo,
        status: activeTab === 'pending' ? 'pending' : 'completed'
      });
      
      if (response.success) {
        setDoctorPayouts(response.data.payouts || []);
      }
    } catch (err) {
      console.error('Failed to load doctor payouts:', err);
    }
  };

  useEffect(() => {
    if (!authLoading && (hasRole('finance') || hasRole('admin') || hasRole('superadmin'))) {
      loadDoctorPayouts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
  };

  const handleMarkAsPaidClick = (payout) => {
    setPayoutToMark(payout);
    setShowConfirmModal(true);
  };

  const handleConfirmMarkAsPaid = async () => {
    if (!payoutToMark) return;

    try {
      setShowConfirmModal(false);
      setMarkingAsPaid(payoutToMark.psychologist_id);
      
      // Format dates for API
      let dateFrom = null;
      let dateTo = null;
      if (hasDateRangeBounds(dateRange)) {
        const formatDateToIST = (date) => {
          if (!date) return null;
          const istString = new Date(date).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          const [month, day, year] = istString.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };
        dateFrom = formatDateToIST(dateRange.from);
        dateTo = formatDateToIST(dateRange.to);
      }

      const response = await financeApi.markPayoutAsPaid({
        psychologist_id: payoutToMark.psychologist_id,
        dateFrom,
        dateTo
      });

      if (response.success) {
        await loadDashboardData();
        await loadDoctorPayouts();
        setActiveTab('completed');
      } else {
        alert(response.message || 'Failed to mark payout as paid');
      }
    } catch (err) {
      console.error('Failed to mark payout as paid:', err);
      alert('Failed to mark payout as paid. Please try again.');
    } finally {
      setMarkingAsPaid(null);
      setPayoutToMark(null);
    }
  };

  const handleCancelMarkAsPaid = () => {
    setShowConfirmModal(false);
    setPayoutToMark(null);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3f2e73' }}></div>
      </div>
    );
  }

  const stats = dashboardData?.summary || {};
  const pendingTotal = stats.pending_payouts || 0;
  const completedTotal = stats.payout || 0;
  const pendingSessions = stats.pending_sessions || 0;
  const completedSessions = stats.completed_sessions || 0;
  const totalSessions = activeTab === 'pending' 
    ? pendingSessions
    : completedSessions;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-3 lg:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2 sm:mb-3">
          <div role="heading" aria-level="2" className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-1">Payouts & Payments</div>
          <p className="text-xs sm:text-sm text-gray-600">Manage doctor payouts and commission payments</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 sm:mb-4">
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap items-start md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
            </div>
            <DateRangePicker
              selectedRange={dateRange}
              onSelect={setDateRange}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium ${
                activeTab === 'pending'
                  ? 'text-[#3f2e73] border-b-2 border-[#3f2e73]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Payouts ({doctorPayouts.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium ${
                activeTab === 'completed'
                  ? 'text-[#3f2e73] border-b-2 border-[#3f2e73]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed Payouts ({doctorPayouts.length})
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 ${activeTab === 'pending' ? 'border-orange-200 bg-orange-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Payout</p>
                <p className="text-2xl font-semibold text-orange-700">₹{pendingTotal.toLocaleString('en-IN')}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 ${activeTab === 'completed' ? 'border-green-200 bg-green-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Payout</p>
                <p className="text-2xl font-semibold text-green-700">₹{completedTotal.toLocaleString('en-IN')}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Sessions</p>
                <p className="text-2xl font-semibold text-yellow-700">{pendingSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Sessions</p>
                <p className="text-2xl font-semibold text-blue-700">{completedSessions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {doctorPayouts.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Sessions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Commission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor Wallet</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {doctorPayouts.map((payout) => (
                        <tr key={payout.psychologist_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {payout.psychologist?.first_name} {payout.psychologist?.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payout.total_sessions || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ₹{(payout.total_company_commission || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            ₹{(payout.total_doctor_wallet || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              activeTab === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {activeTab === 'pending' ? 'Pending' : 'Completed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100">
                                  <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleViewDetails(payout)} className="cursor-pointer">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {activeTab === 'pending' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleMarkAsPaidClick(payout)}
                                      disabled={markingAsPaid === payout.psychologist_id}
                                      className="cursor-pointer text-green-600"
                                    >
                                      {markingAsPaid === payout.psychologist_id ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Marking...
                                        </>
                                      ) : (
                                        <>
                                          <Check className="h-4 w-4 mr-2" />
                                          Mark as Paid
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No {activeTab} payouts found for the selected date range</p>
              </div>
            )}
          </div>
        )}

        {/* Confirm Mark as Paid Modal */}
        {showConfirmModal && payoutToMark && (
          <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
              <div className="p-6 border-b border-gray-200">
                <div role="heading" aria-level="2" className="text-lg font-semibold text-gray-900">Confirm Mark as Paid</div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to mark the payout as paid for{' '}
                  <span className="font-semibold">
                    {payoutToMark.psychologist?.first_name} {payoutToMark.psychologist?.last_name}
                  </span>?
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Sessions:</span>
                      <span className="ml-2 font-semibold text-gray-900">{payoutToMark.total_sessions || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Doctor Wallet:</span>
                      <span className="ml-2 font-semibold text-green-600">
                        ₹{(payoutToMark.total_doctor_wallet || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancelMarkAsPaid}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmMarkAsPaid}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Mark as Paid
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payout Details Modal */}
        {selectedPayout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div role="heading" aria-level="2" style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Payout Details</div>
                  <button
                    onClick={() => setSelectedPayout(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Doctor Info */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Doctor</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3f2e73] flex items-center justify-center text-white font-semibold">
                      {selectedPayout.psychologist?.first_name?.[0] || <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {selectedPayout.psychologist?.first_name} {selectedPayout.psychologist?.last_name}
                      </div>
                      <div className="text-sm text-gray-600">{selectedPayout.psychologist?.email}</div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Sessions</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{selectedPayout.total_sessions || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company Commission</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      ₹{(selectedPayout.total_company_commission || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Doctor Wallet</label>
                    <p className="mt-1 text-lg font-semibold text-green-600">
                      ₹{(selectedPayout.total_doctor_wallet || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        activeTab === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {activeTab === 'pending' ? 'Pending' : 'Completed'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Session Details */}
                {selectedPayout.session_details && selectedPayout.session_details.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3">Session Details</label>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Session Amount</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Company</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Doctor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedPayout.session_details.map((session, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 text-gray-900">
                                {session.session_date ? new Date(session.session_date).toLocaleDateString('en-IN') : '-'}
                              </td>
                              <td className="px-4 py-2 text-gray-600 capitalize">{session.session_type?.replace('_', ' ') || '-'}</td>
                              <td className="px-4 py-2 text-right font-semibold text-gray-900">
                                ₹{(session.session_amount || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-2 text-right text-gray-900">
                                ₹{(session.company_commission || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-2 text-right font-semibold text-green-600">
                                ₹{(session.doctor_wallet || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
