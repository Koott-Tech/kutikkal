'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, Filter, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';

export default function FinanceSessions() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingSessionId, setLoadingSessionId] = useState(null);

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
      
      loadSessions();
    }
  }, [authLoading, isAuthenticated, hasRole, router, page]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        page,
        limit: 20,
        ...(searchTerm && { search: searchTerm })
      };

      const response = await financeApi.getSessions(params);
      
      if (response.success) {
        setSessions(response.data.sessions || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError(response.message || 'Failed to load sessions');
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError('Failed to load sessions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (sessionId) => {
    try {
      setLoadingSessionId(sessionId);
      const response = await financeApi.getSessionDetails(sessionId);
      if (response.success && response.data?.session) {
        setSelectedSession(response.data.session);
      }
    } catch (err) {
      console.error('Failed to load session details:', err);
    } finally {
      setLoadingSessionId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3f2e73' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div role="heading" aria-level="2" className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">Sessions Management</div>
          <p className="text-xs sm:text-sm text-gray-600">View and manage all therapy sessions</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor, client, or session ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadSessions()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
              />
            </div>
            <button
              onClick={loadSessions}
              className="px-6 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#2d1f52] transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Sessions Table */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Client</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {new Date(session.session_date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {session.psychologist?.first_name} {session.psychologist?.last_name}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                          {session.client?.first_name} {session.client?.last_name}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 capitalize">
                          {session.session_type || 'Individual'}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                          ₹{(session.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {session.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewDetails(session.id)}
                            disabled={loadingSessionId === session.id}
                            className="px-4 py-1.5 bg-[#3f2e73] text-white rounded-lg hover:bg-[#2d1f52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                          >
                            {loadingSessionId === session.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading...</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4" />
                                <span>Details</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No sessions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        )}

        {/* Session Details Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div role="heading" aria-level="2" style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Session Details</div>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Session Information */}
                <div>
                  <div role="heading" aria-level="3" style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Session Information</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Session ID</label>
                      <p className="mt-1 text-gray-900 font-mono text-sm">{selectedSession.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <p className="mt-1 text-gray-900">
                        {selectedSession.session_date 
                          ? new Date(selectedSession.session_date).toLocaleDateString('en-IN', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <p className="mt-1 text-gray-900">{selectedSession.session_time || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedSession.status === 'completed' ? 'bg-green-100 text-green-800' :
                          selectedSession.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {(selectedSession.status || 'N/A').toUpperCase()}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Session Type</label>
                      <p className="mt-1 text-gray-900 capitalize">{selectedSession.session_type || 'Individual'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Amount</label>
                      <p className="mt-1 text-gray-900 font-semibold text-lg">₹{(selectedSession.price || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                {selectedSession.psychologist && (
                  <div>
                    <div role="heading" aria-level="3" style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Doctor Information</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 text-gray-900">
                          {selectedSession.psychologist.first_name} {selectedSession.psychologist.last_name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{selectedSession.psychologist.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-gray-900">{selectedSession.psychologist.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Specialization</label>
                        <p className="mt-1 text-gray-900">{selectedSession.psychologist.specialization || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Experience</label>
                        <p className="mt-1 text-gray-900">{selectedSession.psychologist.experience_years ? `${selectedSession.psychologist.experience_years} years` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Client Information */}
                {selectedSession.client && (
                  <div>
                    <div role="heading" aria-level="3" style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Client Information</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 text-gray-900">
                          {selectedSession.client.first_name} {selectedSession.client.last_name}
                        </p>
                      </div>
                      {selectedSession.client.child_name && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Child Name</label>
                          <p className="mt-1 text-gray-900">{selectedSession.client.child_name}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{selectedSession.client.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-gray-900">{selectedSession.client.phone_number || 'N/A'}</p>
                      </div>
                      {selectedSession.client.date_of_birth && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                          <p className="mt-1 text-gray-900">{new Date(selectedSession.client.date_of_birth).toLocaleDateString('en-IN')}</p>
                        </div>
                      )}
                      {selectedSession.client.gender && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Gender</label>
                          <p className="mt-1 text-gray-900 capitalize">{selectedSession.client.gender}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                {selectedSession.payment && (
                  <div>
                    <div role="heading" aria-level="3" style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Payment Information</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Transaction ID</label>
                        <p className="mt-1 text-gray-900 font-mono text-sm">{selectedSession.payment.transaction_id || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Razorpay Order ID</label>
                        <p className="mt-1 text-gray-900 font-mono text-sm">{selectedSession.payment.razorpay_order_id || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Razorpay Payment ID</label>
                        <p className="mt-1 text-gray-900 font-mono text-sm">{selectedSession.payment.razorpay_payment_id || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Payment Method</label>
                        <p className="mt-1 text-gray-900 capitalize">{selectedSession.payment.payment_method || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Payment Status</label>
                        <p className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            selectedSession.payment.status === 'paid' || selectedSession.payment.status === 'success' || selectedSession.payment.status === 'completed' || selectedSession.payment.status === 'cash'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(selectedSession.payment.status || 'N/A').toUpperCase()}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Payment Date</label>
                        <p className="mt-1 text-gray-900">
                          {selectedSession.payment.payment_date 
                            ? new Date(selectedSession.payment.payment_date).toLocaleString('en-IN')
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Amount</label>
                        <p className="mt-1 text-gray-900 font-semibold">₹{(selectedSession.payment.amount || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Currency</label>
                        <p className="mt-1 text-gray-900">{selectedSession.payment.currency || 'INR'}</p>
                      </div>
                      {selectedSession.payment.reference_number && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Reference Number</label>
                          <p className="mt-1 text-gray-900 font-mono text-sm">{selectedSession.payment.reference_number}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Receipt Information */}
                {selectedSession.receipt && (
                  <div>
                    <div role="heading" aria-level="3" style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Receipt Information</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Receipt Number</label>
                        <p className="mt-1 text-gray-900 font-mono text-sm">{selectedSession.receipt.receipt_number || selectedSession.receipt.receipt_number_long || 'N/A'}</p>
                      </div>
                      {selectedSession.receipt.receipt_url && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Receipt URL</label>
                          <p className="mt-1">
                            <a 
                              href={selectedSession.receipt.receipt_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#3f2e73] hover:underline"
                            >
                              View Receipt
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Commission Information */}
                {selectedSession.commission && (
                  <div>
                    <div role="heading" aria-level="3" style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Commission Information</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Session Amount</label>
                        <p className="mt-1 text-gray-900">₹{(selectedSession.commission.session_amount || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Company Commission</label>
                        <p className="mt-1 text-gray-900 font-semibold">₹{(selectedSession.commission.commission_amount || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Doctor Wallet</label>
                        <p className="mt-1 text-gray-900">₹{((selectedSession.commission.session_amount || 0) - (selectedSession.commission.commission_amount || 0)).toLocaleString('en-IN')}</p>
                      </div>
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

