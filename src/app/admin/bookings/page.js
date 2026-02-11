'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  User,
  UserCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Phone,
  Mail,
  Package,
  DollarSign,
  MapPin,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MessageSquare,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminApi, sessionsApi } from '@/lib/backendApi';
import { useNotification } from '@/contexts/NotificationContext';
import AdminRescheduleModal from '@/components/AdminRescheduleModal';
import AdminManualBookingModal from '@/components/AdminManualBookingModal';
import AdminEditSessionModal from '@/components/AdminEditSessionModal';
import SessionCompletionModal from '@/components/SessionCompletionModal';
import ConfirmModal from '@/components/ConfirmModal';
import { cache } from '@/lib/cache';
import WheelPagination from '@/components/ui/wheel-pagination';

export default function BookingsPage() {
  const { showError, showSuccess } = useNotification();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isEditSessionOpen, setIsEditSessionOpen] = useState(false);
  const [feedbackToView, setFeedbackToView] = useState(null);
  const [showNoShowConfirm, setShowNoShowConfirm] = useState(false);
  const [sessionToMarkNoShow, setSessionToMarkNoShow] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedCompleteSession, setSelectedCompleteSession] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    loadBookings();
  }, [currentPage, filterStatus, filterDate]); // Reload when page or filters change

  // Reset pagination when filters change (but not on initial load)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filterStatus, filterDate, searchTerm]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      
      // Build query parameters for server-side pagination
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort: 'created_at',
        order: 'desc'
      };

      // Add filters
      if (filterStatus && filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (filterDate) {
        params.date = filterDate;
      }

      // Load sessions with pagination from backend
      const response = await sessionsApi.getAllSessions(params);
      
      if (response && response.success) {
        console.log('Bookings data received:', response);
        const bookingsData = response.data?.sessions || [];
        const paginationData = response.data?.pagination || {};
        
        console.log('Pagination data:', paginationData);
        console.log('Calculated totalPages:', Math.max(1, Math.ceil((paginationData.total || 0) / itemsPerPage)));
        
        setBookings(bookingsData);
        setTotalBookings(paginationData.total || 0);
        setTotalPages(Math.max(1, Math.ceil((paginationData.total || 0) / itemsPerPage)));
      } else {
        setBookings([]);
        setTotalBookings(0);
        setTotalPages(1);
      }
      
    } catch (error) {
      console.error('Failed to load bookings:', error);
      showError('Failed to load bookings', 'Load Error');
      setBookings([]);
      setTotalBookings(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setIsSessionDetailsOpen(true);
  };

  const handleReschedule = (session) => {
    setSelectedSession(session);
    setIsRescheduleOpen(true);
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setIsEditSessionOpen(true);
  };

  const handleEditSuccess = () => {
    loadBookings(); // Reload bookings after successful edit
  };

  const openCompleteSessionModal = (session) => {
    // Only allow completing for non-completed sessions
    if (session.status === 'completed') {
      showError('This session is already completed', 'Session Status');
      return;
    }
    setSelectedCompleteSession(session);
    setIsCompleteModalOpen(true);
  };

  const handleCompleteSession = async (sessionId, sessionData) => {
    try {
      // Map the form data from SessionCompletionModal to backend expected format
      const mappedData = {
        summary: sessionData.summary?.trim?.() || '',
        report: sessionData.report?.trim?.() || '',
        summary_notes: sessionData.summary_notes?.trim?.() || '',
        completion_date: sessionData.completion_date || ''
      };
      
      if (!mappedData.summary || !mappedData.report || !mappedData.summary_notes) {
        throw new Error('Summary, report, and summary notes are required.');
      }
      
      await adminApi.completeSession(sessionId, mappedData);
      
      showSuccess('Session completed successfully!', 'Completion Success');
      
      // Reload bookings to update the UI
      await loadBookings();
      
      // Close modal
      setIsCompleteModalOpen(false);
      setSelectedCompleteSession(null);
    } catch (err) {
      console.error('Error completing session:', err);
      showError(`Failed to complete session: ${err.message}`, 'Completion Error');
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleDeleteSessionClick = (session) => {
    setSessionToDelete(session);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete || isDeleting) return; // Prevent double-clicks

    console.log('🗑️ [DELETE] Starting delete operation, setting isDeleting to true');
    setIsDeleting(true);
    
    try {
      let response;
      // Check if it's an assessment session or regular session
      if (sessionToDelete.session_type === 'assessment' || sessionToDelete.type === 'assessment') {
        console.log('🗑️ [DELETE] Deleting assessment session');
        // Delete assessment session via admin API
        response = await adminApi.deleteAssessmentSession(sessionToDelete.id);
      } else {
        console.log('🗑️ [DELETE] Deleting regular session');
        // Delete regular session
        response = await sessionsApi.deleteSession(sessionToDelete.id);
      }

      // Check if deletion was successful
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to delete session');
      }

      console.log('🗑️ [DELETE] Session deleted, reloading bookings...');
      // Reload bookings to get fresh data from server
      await loadBookings();
      
      showSuccess('Session deleted successfully!', 'Delete Success');
      
      // Close details modal if it's open for this session
      if (selectedSession && selectedSession.id === sessionToDelete.id) {
        setIsSessionDetailsOpen(false);
        setSelectedSession(null);
      }

      console.log('🗑️ [DELETE] Closing modal and resetting state');
      // Close confirmation modal AFTER loading completes
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
      setIsDeleting(false);
    } catch (error) {
      console.error('❌ [DELETE] Error deleting session:', error);
      showError(`Failed to delete session: ${error.message || error.error || 'Unknown error'}`, 'Delete Error');
      // Keep modal open on error so user can see the error and try again
      setIsDeleting(false);
      // Don't close modal on error - let user see the error message
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return; // Prevent canceling while deleting
    setShowDeleteConfirm(false);
    setSessionToDelete(null);
    setIsDeleting(false);
  };

  const handleMarkAsNoShowClick = (session) => {
    setSessionToMarkNoShow(session);
    setShowNoShowConfirm(true);
  };

  const handleNoShowConfirm = async () => {
    if (!sessionToMarkNoShow) return;

    try {
      await sessionsApi.markSessionAsNoShow(sessionToMarkNoShow.id, '');
      
      // Update the booking in the list
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === sessionToMarkNoShow.id ? { ...booking, status: 'no_show' } : booking
        )
      );
      
      showSuccess('Session marked as no-show successfully!', 'No-Show Success');
      
      // Close details modal if it's open for this session
      if (selectedSession && selectedSession.id === sessionToMarkNoShow.id) {
        setIsSessionDetailsOpen(false);
        setSelectedSession(null);
      }

      // Close confirmation modal
      setShowNoShowConfirm(false);
      setSessionToMarkNoShow(null);
    } catch (error) {
      console.error('Error marking session as no-show:', error);
      showError(`Failed to mark session as no-show: ${error.message}`, 'No-Show Error');
      setShowNoShowConfirm(false);
      setSessionToMarkNoShow(null);
    }
  };

  const handleNoShowCancel = () => {
    setShowNoShowConfirm(false);
    setSessionToMarkNoShow(null);
  };

  const handleRescheduleSuccess = (updatedSession) => {
    // Update the booking in the list
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === updatedSession.id ? updatedSession : booking
      )
    );
    showSuccess('Session rescheduled successfully!', 'Reschedule Success');
  };

  const handleManualBookingSuccess = (newBooking) => {
    // Add new booking to the list and refresh
    loadBookings();
    showSuccess('Manual booking created successfully!', 'Booking Created');
  };


  const getStatusIcon = (status, booking) => {
    // Check if session time has passed but status is still 'booked'
    const isTimePassed = () => {
      if (!booking.scheduled_date || !booking.scheduled_time) return false;
      const sessionDateTime = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
      return sessionDateTime < new Date();
    };

    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'no_show':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'rescheduled':
        return <RefreshCw className="h-4 w-4 text-yellow-500" />;
      case 'booked':
        if (isTimePassed()) {
          return <AlertCircle className="h-4 w-4 text-orange-500" />;
        }
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status, booking) => {
    // Check if session time has passed but status is still 'booked'
    const isTimePassed = () => {
      if (!booking.scheduled_date || !booking.scheduled_time) return false;
      const sessionDateTime = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
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

  const getStatusText = (status, booking) => {
    // Check if session time has passed but status is still 'booked'
    const isTimePassed = () => {
      if (!booking.scheduled_date || !booking.scheduled_time) return false;
      const sessionDateTime = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
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


  // Client-side search filtering (status and date filters are now server-side)
  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true; // No search filter, show all
    
    const clientName = `${booking.client?.first_name || ''} ${booking.client?.last_name || ''}`.toLowerCase();
    const clientEmail = booking.client?.user?.email?.toLowerCase() || '';
    
    const matchesSearch = 
      clientName.includes(searchTerm.toLowerCase()) ||
      clientEmail.includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Use filtered bookings (search is client-side, pagination is server-side)
  const displayBookings = filteredBookings;

  // Debug logging
  useEffect(() => {
    console.log('Pagination state:', {
      currentPage,
      totalPages,
      totalBookings,
      displayBookingsLength: displayBookings.length,
      shouldShowPagination: totalPages > 1
    });
  }, [currentPage, totalPages, totalBookings, displayBookings.length]);

  // Get unique statuses from all bookings (for filter dropdown)
  // Note: For better UX, you might want to fetch distinct statuses from backend
  const statuses = ['all', 'booked', 'completed', 'cancelled', 'rescheduled', 'no_show'];

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h6>Bookings Management</h6>
          <p className="mt-1 text-sm text-gray-600">
            Manage therapy sessions and appointments across the platform
          </p>
        </div>
        <button
          onClick={() => setIsManualBookingOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Create Manual Booking
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold text-gray-900">{displayBookings.length}</span>{' '}
            of <span className="font-semibold text-gray-900">{totalBookings}</span>{' '}
            booking{totalBookings !== 1 ? 's' : ''}
            {filterStatus !== 'all' && (
              <>
                {' '}with status{' '}
                <span className="font-medium text-gray-900">
                  {filterStatus === 'no_show'
                    ? 'No Show'
                    : filterStatus.replace('_', ' ')}
                </span>
              </>
            )}
            {filterDate && (
              <>
                {' '}on{' '}
                <span className="font-medium text-gray-900">
                  {new Date(filterDate).toLocaleDateString()}
                </span>
              </>
            )}
            {searchTerm && (
              <>
                {' '}matching "
                <span className="font-medium text-gray-900">
                  {searchTerm}
                </span>
                "
              </>
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {statuses.filter(status => status !== 'all').map(status => (
                <option key={status} value={status}>
                  {status === 'no_show' ? 'No Show' : 
                   status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Psychologist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {(() => {
                          // Show session type instead of session ID
                          if (booking.session_type === 'free_assessment') {
                            return (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Free Assessment
                              </span>
                            );
                          }
                          if (booking.session_type === 'assessment' || booking.type === 'assessment') {
                            return (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Assessment
                              </span>
                            );
                          }
                          // Check if it's a package session
                          if (booking.package || booking.package_id) {
                            const pkg = booking.package || {};
                            const totalSessions = pkg.total_sessions || pkg.session_count || 0;
                            const completedSessions = pkg.completed_sessions;
                            const packageType = pkg.package_type || 'Package';
                            
                            return (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {packageType}
                                {totalSessions > 0 && (
                                  <span className="ml-1">
                                    {completedSessions !== undefined && completedSessions !== null
                                      ? `(${completedSessions}/${totalSessions})`
                                      : `(${totalSessions})`}
                                  </span>
                                )}
                              </span>
                            );
                          }
                          // Default: Individual session
                          return (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Individual Session
                            </span>
                          );
                        })()}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(booking.scheduled_date)} at {formatTime(booking.scheduled_time)}
                      </div>
                      {booking.status === 'rescheduled' && booking.original_scheduled_date && (
                        <div className="text-xs text-amber-600 mt-0.5">
                          Originally: {formatDate(booking.original_scheduled_date)}
                        </div>
                      )}
                      {(booking.session_type === 'assessment' || booking.type === 'assessment') && booking.assessment_title && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {booking.assessment_title}
                        </div>
                      )}
                      {booking.package && (
                        <div className="text-xs text-gray-600 mt-1">
                          {(() => {
                            const pkg = booking.package || {};
                            const totalSessions = pkg.total_sessions || pkg.session_count || 0;
                            const completedSessions = pkg.completed_sessions;
                            
                            if (totalSessions > 0 && completedSessions !== undefined && completedSessions !== null) {
                              return `Package: ${completedSessions}/${totalSessions} sessions completed`;
                            } else if (totalSessions > 0) {
                              return `Package: ${totalSessions} sessions`;
                            }
                            return `Package: ${pkg.package_type || 'Package'}`;
                          })()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {booking.client?.first_name} {booking.client?.last_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.session_type === 'free_assessment' ? (
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          Free Assessment
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {booking.psychologist?.first_name} {booking.psychologist?.last_name}
                        </div>
                      </div>
                    )}
                    {booking.session_type !== 'free_assessment' && booking.psychologist?.area_of_expertise && (
                      <div className="text-xs text-gray-500">
                        {booking.psychologist.area_of_expertise.join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status, booking)}`}>
                        {getStatusText(booking.status, booking)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Feedback Button - Outside 3 dots menu, only if feedback exists */}
                      {booking.status === 'completed' && (booking.feedback || booking.rating || booking.client_feedback) && (
                        <button
                          onClick={() => setFeedbackToView(booking)}
                          className="inline-flex items-center px-3 py-1.5 border border-purple-300 text-xs font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          View Feedback
                        </button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleViewSession(booking)} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditSession(booking)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {['booked', 'rescheduled', 'confirmed'].includes(booking.status) && (
                            <>
                              <DropdownMenuItem onClick={() => handleReschedule(booking)} className="cursor-pointer">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {booking.status !== 'completed' && booking.status !== 'no_show' && booking.status !== 'noshow' && (
                            <>
                              <DropdownMenuItem onClick={() => openCompleteSessionModal(booking)} className="cursor-pointer text-green-600">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleMarkAsNoShowClick(booking)} className="cursor-pointer text-orange-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Mark No Show
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteSessionClick(booking)} 
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {displayBookings.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h6>No bookings found</h6>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' || filterDate
              ? 'Try adjusting your search or filter criteria.'
              : 'No therapy sessions have been booked yet.'
            }
          </p>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackToView && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h6 className="text-sm font-semibold text-gray-900">Client Feedback</h6>
              <button
                onClick={() => setFeedbackToView(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Client</p>
                <p className="text-sm text-gray-800">
                  {feedbackToView.client?.first_name} {feedbackToView.client?.last_name}
                </p>
              </div>
              {feedbackToView.rating && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Rating</p>
                  <p className="text-sm text-gray-800">
                    {feedbackToView.rating} out of 5 stars
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Submitted Feedback</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {feedbackToView.feedback || 'No feedback provided.'}
                </p>
              </div>
            </div>
            <div className="flex justify-end px-5 py-4 border-t border-gray-200">
              <button
                onClick={() => setFeedbackToView(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 pt-6 border-t border-gray-200">
          <WheelPagination
            totalPages={totalPages}
            visibleCount={7}
            currentPage={currentPage - 1} // Convert 1-indexed to 0-indexed
            onPageChange={(page) => handlePageChange(page + 1)} // Convert back to 1-indexed
            className="bg-white"
          />
        </div>
      )}
      
      {/* Show total count */}
      {displayBookings.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Showing {displayBookings.length} of {totalBookings} booking{totalBookings !== 1 ? 's' : ''}
          {searchTerm && ` (filtered by search)`}
          {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
        </div>
      )}

      {/* Enhanced Session Details Modal */}
      {isSessionDetailsOpen && selectedSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', lineHeight: '1.5rem' }} className="text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  Session Details
                </div>
                <p className="text-sm text-gray-500 mt-1">Session #{selectedSession.id?.slice(0, 8)}</p>
              </div>
              <button
                onClick={() => setIsSessionDetailsOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-2 hover:bg-gray-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 pb-0">
              <div className="space-y-6 pb-6">
                {/* Session Information */}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }} className="text-gray-900 mb-4">
                    Session Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Session ID</p>
                      <p className="text-sm text-gray-900 font-mono">
                        #{selectedSession.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status, selectedSession)}`}>
                        {getStatusText(selectedSession.status, selectedSession)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Session Type</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.package || selectedSession.package_id ? (
                          (() => {
                            const pkg = selectedSession.package || {};
                            
                            // Get total sessions from various possible fields
                            let totalSessions = pkg.total_sessions 
                              || pkg.session_count 
                              || 0;
                            
                            // If still 0, try to extract from package_type (e.g., "3_session", "package_6")
                            if (totalSessions === 0 && pkg.package_type) {
                              const match = String(pkg.package_type).match(/\d+/);
                              if (match) {
                                totalSessions = parseInt(match[0], 10);
                              }
                            }
                            
                            const completedSessions = pkg.completed_sessions;
                            
                            // Always show count if it's a package
                            if (totalSessions > 0) {
                              return (
                                <>
                                  Package
                                  <span className="ml-1 text-gray-600">
                                    ({completedSessions !== undefined && completedSessions !== null
                                      ? `${completedSessions}/${totalSessions}`
                                      : totalSessions} sessions)
                                  </span>
                                </>
                              );
                            } else {
                              // Package exists but no count available - still show Package
                              return 'Package';
                            }
                          })()
                        ) : (
                          'Individual'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Date</p>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedSession.scheduled_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Time</p>
                      <p className="text-sm text-gray-900">
                        {formatTime(selectedSession.scheduled_time)}
                      </p>
                    </div>
                    {selectedSession.status === 'rescheduled' && selectedSession.original_scheduled_date && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Original Scheduled Date</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(selectedSession.original_scheduled_date)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Client Information */}
                <div className="border-t border-gray-200 pt-6">
                  <div style={{ fontSize: '16px', fontWeight: '600' }} className="text-gray-900 mb-4">
                    Client Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Full Name</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.client?.first_name} {selectedSession.client?.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.client?.user?.email || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Phone Number</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.client?.phone_number || 'Not provided'}
                      </p>
                    </div>
                    {selectedSession.client?.child_name && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Child Name</p>
                        <p className="text-sm text-gray-900">
                          {selectedSession.client.child_name}
                        </p>
                      </div>
                    )}
                    {selectedSession.client?.child_age && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Child Age</p>
                        <p className="text-sm text-gray-900">
                          {selectedSession.client.child_age} years
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Psychologist Information */}
                <div className="border-t border-gray-200 pt-6">
                  <div style={{ fontSize: '16px', fontWeight: '600' }} className="text-gray-900 mb-4">
                    Psychologist Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Full Name</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.psychologist?.first_name} {selectedSession.psychologist?.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.psychologist?.email}
                      </p>
                    </div>
                    {selectedSession.psychologist?.area_of_expertise && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Areas of Expertise</p>
                        <p className="text-sm text-gray-900">
                          {selectedSession.psychologist.area_of_expertise.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Package & Pricing Information */}
                {selectedSession.package && (
                  <div className="border-t border-gray-200 pt-6">
                    <div style={{ fontSize: '16px', fontWeight: '600' }} className="text-gray-900 mb-4">
                      Package & Pricing
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Package Type</p>
                        <p className="text-sm text-gray-900">
                          {selectedSession.package.package_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Price</p>
                        <p className="text-sm text-gray-900">
                          ₹{selectedSession.package.price}
                        </p>
                      </div>
                      {selectedSession.package.description && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
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
                  <div className="border-t border-gray-200 pt-6">
                    <div style={{ fontSize: '16px', fontWeight: '600' }} className="text-gray-900 mb-2">
                      Session Notes
                    </div>
                    <p className="text-sm text-gray-900">{selectedSession.session_notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
              <button
                onClick={() => setIsSessionDetailsOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Reschedule Modal */}
      <AdminRescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        session={selectedSession}
        onRescheduleSuccess={handleRescheduleSuccess}
      />

      {/* Admin Manual Booking Modal */}
      <AdminManualBookingModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        onBookingSuccess={handleManualBookingSuccess}
      />

      {/* Edit Session Modal */}
      <AdminEditSessionModal
        isOpen={isEditSessionOpen}
        onClose={() => {
          setIsEditSessionOpen(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
        onUpdateSuccess={handleEditSuccess}
      />

      {/* No Show Confirmation Modal */}
      {showNoShowConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Confirm No Show</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to mark this session as no-show? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleNoShowCancel}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNoShowConfirm}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Mark as No Show
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteSession}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        disabled={isDeleting}
      />

      {/* Complete Session Modal */}
      <SessionCompletionModal
        session={selectedCompleteSession}
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setSelectedCompleteSession(null);
        }}
        onSubmit={(formData) => handleCompleteSession(selectedCompleteSession?.id, formData)}
      />

      </div>
    </div>
  );
}

