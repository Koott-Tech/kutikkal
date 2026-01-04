'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Eye, Check, Clock, Calendar, User, Loader2 } from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';

export default function FinancePayouts() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [payouts, setPayouts] = useState([]);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthName, setMonthName] = useState('');
  const [markingAsPaid, setMarkingAsPaid] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [payoutToMark, setPayoutToMark] = useState(null);

  const loadPayouts = async (status = null) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = status ? { status } : {};
      const response = await financeApi.getPayouts(params);
      
      if (response.success) {
        setPayouts(response.data.payouts || []);
      } else {
        setError(response.message || 'Failed to load payouts');
      }
    } catch (err) {
      console.error('Failed to load payouts:', err);
      setError('Failed to load payouts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingPayouts = async () => {
    try {
      setIsLoading(true);
      const response = await financeApi.getPendingPayouts({ month: selectedMonth, year: selectedYear });
      if (response.success) {
        setPendingPayouts(response.data.payouts || []);
        if (response.data.month_name) {
          setMonthName(response.data.month_name);
        }
      }
    } catch (err) {
      console.error('Failed to load pending payouts:', err);
      setError('Failed to load pending payouts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
      
      // Initial load
      loadPendingPayouts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, hasRole, router]);

  useEffect(() => {
    if (!authLoading && (hasRole('finance') || hasRole('admin') || hasRole('superadmin'))) {
      if (activeTab === 'completed') {
        loadPayouts('paid');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (!authLoading && (hasRole('finance') || hasRole('admin') || hasRole('superadmin'))) {
      loadPendingPayouts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const handleViewDetails = async (payout) => {
    // For pending payouts, use the payout object directly (no API call needed)
    if (activeTab === 'pending') {
      setSelectedPayout(payout);
      return;
    }
    
    // For processed payouts, fetch details from API
    try {
      const response = await financeApi.getPayoutDetails(payout.id);
      if (response.success) {
        setSelectedPayout(response.data.payout);
      }
    } catch (err) {
      console.error('Failed to load payout details:', err);
    }
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
      const response = await financeApi.markPayoutAsPaid({
        psychologist_id: payoutToMark.psychologist_id,
        month: selectedMonth,
        year: selectedYear
      });

      if (response.success) {
        // Reload pending payouts and completed payouts
        await loadPendingPayouts();
        await loadPayouts('paid');
        // Switch to completed tab
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

  const displayPayouts = activeTab === 'pending' ? pendingPayouts : payouts.filter(p => p.status === 'paid');
  const totalPending = pendingPayouts.reduce((sum, p) => sum + (parseFloat(p.total_company_commission || p.total_commission) || 0), 0);
  const totalDoctorWallet = pendingPayouts.reduce((sum, p) => sum + (parseFloat(p.total_doctor_wallet || p.net_payout) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div role="heading" aria-level="2" className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">Payouts & Payments</div>
          <p className="text-xs sm:text-sm text-gray-600">Manage doctor payouts and commission payments</p>
        </div>

        {/* Tabs and Month Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row border-b border-gray-200 items-stretch sm:items-center justify-between px-4 sm:px-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium ${
                  activeTab === 'pending'
                    ? 'text-[#3f2e73] border-b-2 border-[#3f2e73]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending Payouts ({pendingPayouts.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('completed');
                  loadPayouts('paid');
                }}
                className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium ${
                  activeTab === 'completed'
                    ? 'text-[#3f2e73] border-b-2 border-[#3f2e73]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Completed Payouts
              </button>
            </div>
            {activeTab === 'pending' && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-3 sm:py-0">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'long' })}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards for Pending */}
        {activeTab === 'pending' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800 mb-1">{monthName || 'Pending Payouts'}</p>
                  <p style={{ fontSize: '20px', fontWeight: 600, color: '#854d0e' }}>₹{totalPending.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-yellow-700 mt-1">Company Commission</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 mb-1">Total Doctor Wallet</p>
                  <p style={{ fontSize: '20px', fontWeight: 600, color: '#166534' }}>₹{totalDoctorWallet.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-green-700 mt-1">To be paid to doctors</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800 mb-1">Total Sessions</p>
                  <p style={{ fontSize: '20px', fontWeight: 600, color: '#1e40af' }}>
                    {pendingPayouts.reduce((sum, p) => sum + (p.total_sessions || 0), 0)}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Completed sessions</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        ) : activeTab === 'pending' ? (
          <div className="grid grid-cols-1 gap-6">
            {displayPayouts.length > 0 ? (
              displayPayouts.map((payout) => (
                <div key={payout.psychologist_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#3f2e73] flex items-center justify-center text-white font-semibold">
                        {payout.psychologist?.first_name?.[0] || <User className="h-6 w-6" />}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {payout.psychologist?.first_name} {payout.psychologist?.last_name}
                        </div>
                        <div className="text-sm text-gray-600">{payout.psychologist?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkAsPaidClick(payout)}
                        disabled={markingAsPaid === payout.psychologist_id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {markingAsPaid === payout.psychologist_id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Marking...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Mark as Paid</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedPayout(payout)}
                        className="text-[#3f2e73] hover:text-[#2d1f52]"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Total Sessions</div>
                      <div className="text-lg font-semibold text-gray-900">{payout.total_sessions || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Company Commission</div>
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{(payout.total_company_commission || payout.total_commission || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Doctor Wallet</div>
                      <div className="text-lg font-semibold text-green-600">
                        ₹{(payout.total_doctor_wallet || payout.net_payout || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Status</div>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>

                  {/* Session counts by type */}
                  {payout.session_counts_by_type && Object.keys(payout.session_counts_by_type).length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Sessions by Type:</div>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(payout.session_counts_by_type).map(([type, count]) => (
                          <div key={type} className="bg-gray-50 px-3 py-1 rounded-md">
                            <span className="text-xs text-gray-600 capitalize">{type.replace('_', ' ')}:</span>
                            <span className="text-sm font-semibold text-gray-900 ml-1">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No completed sessions found for {monthName || 'the selected month'}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Payout</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayPayouts.length > 0 ? (
                    displayPayouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payout.payout_date ? new Date(payout.payout_date).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payout.psychologist?.first_name} {payout.psychologist?.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{(payout.total_commission || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          ₹{(payout.net_payout || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            payout.status === 'paid' ? 'bg-green-100 text-green-800' :
                            payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payout.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewDetails(payout)}
                            className="text-[#3f2e73] hover:text-[#2d1f52]"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No payouts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                  </span>
                  {' '}for {monthName || `${selectedMonth}/${selectedYear}`}?
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
                        ₹{(payoutToMark.total_doctor_wallet || payoutToMark.net_payout || 0).toLocaleString('en-IN')}
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
                      ₹{(selectedPayout.total_company_commission || selectedPayout.total_commission || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Doctor Wallet</label>
                    <p className="mt-1 text-lg font-semibold text-green-600">
                      ₹{(selectedPayout.total_doctor_wallet || selectedPayout.net_payout || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        {selectedPayout.status || 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Session Counts by Type */}
                {selectedPayout.session_counts_by_type && Object.keys(selectedPayout.session_counts_by_type).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">Sessions by Type</label>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(selectedPayout.session_counts_by_type).map(([type, count]) => (
                        <div key={type} className="bg-gray-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}:</span>
                          <span className="text-base font-semibold text-gray-900 ml-2">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                                {new Date(session.session_date).toLocaleDateString('en-IN')}
                              </td>
                              <td className="px-4 py-2 text-gray-600 capitalize">{session.session_type?.replace('_', ' ')}</td>
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

                {/* Legacy fields for "All Payouts" tab */}
                {selectedPayout.payout_date && (
                  <>
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Payout Date</label>
                        <p className="mt-1 text-gray-900">{new Date(selectedPayout.payout_date).toLocaleDateString('en-IN')}</p>
                      </div>
                      {selectedPayout.tds_amount !== undefined && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">TDS Amount</label>
                          <p className="mt-1 text-gray-900">₹{(selectedPayout.tds_amount || 0).toLocaleString('en-IN')}</p>
                        </div>
                      )}
                      {selectedPayout.payment_method && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Payment Method</label>
                          <p className="mt-1 text-gray-900 capitalize">{selectedPayout.payment_method.replace('_', ' ')}</p>
                        </div>
                      )}
                      {selectedPayout.transaction_id && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Transaction ID</label>
                          <p className="mt-1 text-gray-900">{selectedPayout.transaction_id}</p>
                        </div>
                      )}
                    </div>
                    {selectedPayout.notes && (
                      <div className="border-t pt-4">
                        <label className="text-sm font-medium text-gray-700">Notes</label>
                        <p className="mt-1 text-gray-900">{selectedPayout.notes}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

