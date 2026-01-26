'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  X,
  Phone,
  Mail,
  Package,
  DollarSign,
  Clock,
  User,
  UserCheck,
  Filter
} from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useNotification } from '@/contexts/NotificationContext';
import SessionsFilterTable from '@/components/ui/sessions-filter-table';
import DateRangePicker from '@/components/ui/date-range-picker';

export default function FinanceSessionsPage() {
  const { showError } = useNotification();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  // Date range filter (default to current month in IST)
  const [dateRange, setDateRange] = useState(() => {
    try {
      // Get current date in IST timezone
      const now = new Date();
      const istString = now.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      // Parse MM/DD/YYYY format from IST
      const [month, day, year] = istString.split('/').map(Number);
      
      // Create dates for start and end of month in IST
      const startOfMonth = new Date(year, month - 1, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      // Get last day of month
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) {
        // Fallback to current month in local timezone
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
      // Fallback to current month in local timezone
      const today = new Date();
      const fallbackStart = new Date(today.getFullYear(), today.getMonth(), 1);
      fallbackStart.setHours(0, 0, 0, 0);
      const fallbackEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      fallbackEnd.setHours(23, 59, 59, 999);
      return { from: fallbackStart, to: fallbackEnd };
    }
  });

  useEffect(() => {
    loadSessions();
  }, [dateRange]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      
      // Format dates for API (YYYY-MM-DD format)
      // Use IST timezone (Asia/Kolkata) for date formatting
      let dateFrom = null;
      let dateTo = null;
      
      if (dateRange && dateRange.from && dateRange.to) {
        // Convert dates to IST timezone and format as YYYY-MM-DD
        const formatDateToIST = (date) => {
          if (!date) return null;
          
          // Convert to IST timezone explicitly
          const istString = new Date(date).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          
          // Parse MM/DD/YYYY format from toLocaleString and convert to YYYY-MM-DD
          const [month, day, year] = istString.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };
        
        dateFrom = formatDateToIST(dateRange.from);
        dateTo = formatDateToIST(dateRange.to);
      }
      
      // Load sessions with date range filter
      const params = {
        page: 1,
        limit: 1000, // Load more sessions for client-side filtering
        sort: 'created_at',
        order: 'desc',
        dateFrom,
        dateTo
      };

      const response = await financeApi.getAllSessions(params);
      
      if (response && response.success) {
        const sessionsData = response.data?.sessions || [];
        setSessions(sessionsData);
      } else {
        setSessions([]);
      }
      
    } catch (error) {
      console.error('Failed to load sessions:', error);
      showError('Failed to load sessions', 'Load Error');
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setIsSessionDetailsOpen(true);
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status, session) => {
    const isTimePassed = () => {
      if (!session.scheduled_date || !session.scheduled_time) return false;
      const sessionDateTime = new Date(`${session.scheduled_date}T${session.scheduled_time}`);
      return sessionDateTime < new Date();
    };

    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        if (isTimePassed()) {
          return 'bg-orange-100 text-orange-800';
        }
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status, session) => {
    const isTimePassed = () => {
      if (!session.scheduled_date || !session.scheduled_time) return false;
      const sessionDateTime = new Date(`${session.scheduled_date}T${session.scheduled_time}`);
      return sessionDateTime < new Date();
    };

    switch (status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no_show':
        return 'No Show';
      case 'rescheduled':
        return 'Rescheduled';
      case 'booked':
        if (isTimePassed()) {
          return 'No Show';
        }
        return 'Booked';
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
    }
  };

  return (
    <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h6>Sessions</h6>
            <p className="mt-1 text-sm text-gray-600">
              View all therapy sessions and appointments
            </p>
          </div>
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

        {/* Sessions Filter Table */}
        <SessionsFilterTable
          sessions={sessions}
          isLoading={isLoading}
          onViewSession={handleViewSession}
        />

        {/* Session Details Modal */}
        {isSessionDetailsOpen && selectedSession && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold text-gray-900">Session Details</div>
                <button
                  onClick={() => setIsSessionDetailsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Session Information */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    Session Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Session ID</p>
                      <p className="text-sm text-gray-900 font-mono">
                        #{selectedSession.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status, selectedSession)}`}>
                        {getStatusText(selectedSession.status, selectedSession)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Session Type</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Package className="h-4 w-4 mr-1 text-gray-500" />
                        {selectedSession.package || selectedSession.package_id ? (
                          (() => {
                            const pkg = selectedSession.package || {};
                            let totalSessions = pkg.total_sessions || pkg.session_count || 0;
                            if (totalSessions === 0 && pkg.package_type) {
                              const match = String(pkg.package_type).match(/\d+/);
                              if (match) {
                                totalSessions = parseInt(match[0], 10);
                              }
                            }
                            const completedSessions = pkg.completed_sessions;
                            if (totalSessions > 0) {
                              return (
                                <>
                                  Package
                                  <span className="ml-1">
                                    ({completedSessions !== undefined && completedSessions !== null
                                      ? `${completedSessions}/${totalSessions}`
                                      : totalSessions} sessions)
                                  </span>
                                </>
                              );
                            } else {
                              return 'Package';
                            }
                          })()
                        ) : (
                          'Individual'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {formatDate(selectedSession.scheduled_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Time</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {formatTime(selectedSession.scheduled_time)}
                      </p>
                    </div>
                    {selectedSession.status === 'rescheduled' && selectedSession.original_scheduled_date && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Original scheduled date</p>
                        <p className="text-sm text-amber-700 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-amber-500" />
                          {formatDate(selectedSession.original_scheduled_date)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Client Information */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Client Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Full Name</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.client?.first_name} {selectedSession.client?.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-500" />
                        {selectedSession.client?.user?.email || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone Number</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-500" />
                        {selectedSession.client?.phone_number || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Child Name</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.client?.child_name || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Child Age</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.client?.child_age ? `${selectedSession.client.child_age} years` : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Psychologist Information */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                    Psychologist Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Full Name</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.psychologist?.first_name} {selectedSession.psychologist?.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-500" />
                        {selectedSession.psychologist?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Areas of Expertise</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.psychologist?.area_of_expertise?.join(', ') || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Package & Pricing Information */}
                {selectedSession.package && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-yellow-600" />
                      Package & Pricing
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Package Type</p>
                        <p className="text-sm text-gray-900">
                          {selectedSession.package.package_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Price</p>
                        <p className="text-sm text-gray-900 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                          ${selectedSession.package.price}
                        </p>
                      </div>
                      {selectedSession.package.description && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-700">Description</p>
                          <p className="text-sm text-gray-900">
                            {selectedSession.package.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Session Notes */}
                {selectedSession.session_notes && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-gray-900 mb-2">Session Notes</div>
                    <p className="text-sm text-gray-900">{selectedSession.session_notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsSessionDetailsOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
