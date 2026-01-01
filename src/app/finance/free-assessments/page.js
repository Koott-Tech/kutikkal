'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, Eye, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';

export default function FinanceFreeAssessments() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState(null);

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
      
      loadAssessments();
    }
  }, [authLoading, isAuthenticated, hasRole, router, page, statusFilter]);

  const loadAssessments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        page,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      };

      const response = await financeApi.getFreeAssessments(params);
      
      if (response.success) {
        setAssessments(response.data.assessments || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError(response.message || 'Failed to load free assessments');
      }
    } catch (err) {
      console.error('Failed to load free assessments:', err);
      setError('Failed to load free assessments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (assessment) => {
    setSelectedAssessment(assessment);
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
          <div role="heading" aria-level="2" className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">Free Assessments</div>
          <p className="text-xs sm:text-sm text-gray-600">View and manage all free assessment sessions</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by assessment number, client name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadAssessments()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={loadAssessments}
              className="px-6 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#2d1f52] transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Assessments Table */}
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
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment #</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Time</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Psychologist</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Client</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assessments.length > 0 ? (
                    assessments.map((assessment) => (
                      <tr key={assessment.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          #{assessment.assessment_number}
                        </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {new Date(assessment.scheduled_date).toLocaleDateString('en-IN')}
                        </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                          {assessment.scheduled_time}
                        </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {assessment.psychologist ? (
                            <>
                              {assessment.psychologist.first_name} {assessment.psychologist.last_name}
                            </>
                          ) : (
                            <span className="text-gray-400">Not assigned</span>
                          )}
                        </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                          {assessment.client ? (
                            <>
                              {assessment.client.first_name} {assessment.client.last_name}
                              {assessment.client.child_name && (
                                <span className="text-gray-500 text-xs block">({assessment.client.child_name})</span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            assessment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            assessment.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                            assessment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {assessment.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewDetails(assessment)}
                            className="text-[#3f2e73] hover:text-[#2d1f52] transition-colors"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No free assessments found
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

        {/* Assessment Details Modal */}
        {selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Free Assessment Details</h2>
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Assessment Number</label>
                    <p className="mt-1 text-gray-900">#{selectedAssessment.assessment_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-gray-900 capitalize">{selectedAssessment.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-gray-900">{new Date(selectedAssessment.scheduled_date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Time</label>
                    <p className="mt-1 text-gray-900">{selectedAssessment.scheduled_time}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Psychologist</label>
                    <p className="mt-1 text-gray-900">
                      {selectedAssessment.psychologist ? (
                        <>
                          {selectedAssessment.psychologist.first_name} {selectedAssessment.psychologist.last_name}
                          {selectedAssessment.psychologist.email && (
                            <span className="text-gray-500 text-xs block">{selectedAssessment.psychologist.email}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Client</label>
                    <p className="mt-1 text-gray-900">
                      {selectedAssessment.client ? (
                        <>
                          {selectedAssessment.client.first_name} {selectedAssessment.client.last_name}
                          {selectedAssessment.client.child_name && (
                            <span className="text-gray-500 text-xs block">Child: {selectedAssessment.client.child_name}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </p>
                  </div>
                </div>
                {selectedAssessment.meet_link && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Google Meet Link</label>
                    <div className="mt-1 flex items-center gap-2">
                      <a
                        href={selectedAssessment.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3f2e73] hover:underline flex items-center gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </a>
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

