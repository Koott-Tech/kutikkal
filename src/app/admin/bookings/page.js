'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  Loader2,
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
  MoreVertical,
  FileText,
  Video
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
import AdminBookNextPackageSessionModal from '@/components/AdminBookNextPackageSessionModal';
import AdminEditSessionModal from '@/components/AdminEditSessionModal';
import SessionCompletionModal from '@/components/SessionCompletionModal';
import ConfirmModal from '@/components/ConfirmModal';
import { cache } from '@/lib/cache';
import WheelPagination from '@/components/ui/wheel-pagination';
import DateRangePicker from '@/components/ui/date-range-picker';
import { getSessionCompletionFields } from '@/utils/sessionCompletionFields';

export default function BookingsPage() {
  const { showError, showSuccess } = useNotification();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('booked');
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetailsLoading, setSessionDetailsLoading] = useState(false);
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
  const [isBookNextOpen, setIsBookNextOpen] = useState(false);
  const [packagesList, setPackagesList] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    if (filterStatus === 'packages') {
      loadPackages();
    } else {
      loadBookings();
    }
  }, [currentPage, filterStatus, dateRange]); // Reload when page, status, or date range change

  // Reset pagination when filters change (but not on initial load)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filterStatus, searchTerm, dateRange]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      
      // Build query parameters for server-side pagination
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort: 'scheduled_date',
        order: 'asc'
      };

      // Add filters
      if (filterStatus && filterStatus !== 'all') {
        params.status = filterStatus;
      }

      // Date range filter (same behavior as finance sessions page)
      if (dateRange && dateRange.from && dateRange.to) {
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
        params.dateFrom = formatDateToIST(dateRange.from);
        params.dateTo = formatDateToIST(dateRange.to);
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

  const loadPackages = async () => {
    try {
      setPackagesLoading(true);
      const response = await adminApi.getPackagesWithRemaining();
      if (response?.success && response.data?.packages) {
        setPackagesList(response.data.packages);
      } else {
        setPackagesList([]);
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
      showError('Failed to load packages with remaining sessions', 'Load Error');
      setPackagesList([]);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handleViewSession = async (session) => {
    if (!session?.id) return;
    setSelectedSession(null);
    setIsSessionDetailsOpen(true);
    setSessionDetailsLoading(true);
    try {
      const response = await sessionsApi.getSessionDetails(session.id);
      if (!response?.success) {
        setSelectedSession(session);
        showError('Could not load full session details', 'Load Error');
        return;
      }
      // Backend may return { data: { session } } or (legacy) { data: session }
      const sessionData = response.data?.session ?? (response.data && typeof response.data === 'object' && response.data.id ? response.data : null);
      if (sessionData) {
        setSelectedSession(sessionData);
      } else {
        setSelectedSession(session);
        showError('Could not load full session details', 'Load Error');
      }
    } catch (err) {
      console.error('Failed to load session details:', err);
      setSelectedSession(session);
      showError('Failed to load session details', 'Load Error');
    } finally {
      setSessionDetailsLoading(false);
    }
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

  // Normalize relation from API (Supabase may return object or array)
  const normRel = (r) => (Array.isArray(r) ? r[0] : r) ?? null;

  // Helper: derive amount/price paid for a session/booking
  const getAmountPaid = (session) => {
    if (!session) return null;

    // Assessment sessions use 'amount'
    if (session.session_type === 'assessment' || session.type === 'assessment') {
      if (session.amount !== undefined && session.amount !== null) {
        return session.amount;
      }
    }

    // Regular sessions often store price directly on the session
    if (session.price !== undefined && session.price !== null) {
      return session.price;
    }

    // Fallback: package price (total) if available
    if (session.package && session.package.price !== undefined && session.package.price !== null) {
      return session.package.price;
    }

    return null;
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

  const handleBookNextSuccess = () => {
    if (filterStatus === 'packages') {
      loadPackages();
    } else {
      loadBookings();
      setIsSessionDetailsOpen(false);
      setSelectedSession(null);
    }
    setIsBookNextOpen(false);
    setSelectedSession(null);
  };

  const openBookNextFromPackage = (pkg) => {
    setSelectedSession(pkg);
    setIsBookNextOpen(true);
  };

  const getMeetLink = (session) =>
    session?.google_meet_link ||
    session?.google_meet_join_url ||
    session?.google_meet_start_url ||
    session?.google_calendar_link;

  const handleOpenMeet = (session) => {
    const meetUrl = getMeetLink(session);
    if (!meetUrl) {
      showError('No Google Meet link is available for this session yet.', 'Meet Link');
      return;
    }
    if (typeof window !== 'undefined') {
      const url = meetUrl.startsWith('http') ? meetUrl : `https://${meetUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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
          return <Clock className="h-4 w-4 text-slate-500" />;
        }
        return <Clock className="h-4 w-4 text-[#3f2e73]" />;
      default:
        return <Clock className="h-4 w-4 text-[#3f2e73]" />;
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
          return 'bg-slate-100 text-slate-700';
        }
        return 'bg-[#3f2e73]/10 text-[#3f2e73]';
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
          return 'Pending';
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
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBookedAt = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Normalize status for comparison (backend may return 'noshow' or 'no_show')
  const normalizeStatus = (s) => (s === 'noshow' ? 'no_show' : (s || ''));

  // Client-side: filter by selected status tab (so Booked tab never shows no_show etc.) and by search
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || normalizeStatus(booking.status) === filterStatus;
    if (!statusMatch) return false;

    if (!searchTerm) return true;
    const clientName = `${booking.client?.first_name || ''} ${booking.client?.last_name || ''}`.toLowerCase();
    const clientEmail = booking.client?.user?.email?.toLowerCase() || '';
    const matchesSearch =
      clientName.includes(searchTerm.toLowerCase()) ||
      clientEmail.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort by nearest slot first (scheduled_date then scheduled_time ascending)
  const displayBookings = [...filteredBookings].sort((a, b) => {
    const aDate = a.scheduled_date || '';
    const aTime = a.scheduled_time || '';
    const bDate = b.scheduled_date || '';
    const bTime = b.scheduled_time || '';
    const aDt = new Date(`${aDate}T${aTime}`);
    const bDt = new Date(`${bDate}T${bTime}`);
    return aDt - bDt;
  });

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

  const statusTabs = [
    { value: 'all', label: 'All' },
    { value: 'booked', label: 'Booked' },
    { value: 'completed', label: 'Completed' },
    { value: 'packages', label: 'Packages' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rescheduled', label: 'Rescheduled' },
    { value: 'no_show', label: 'No Show' }
  ];

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showPackagesView = filterStatus === 'packages';
  const isLoadingView = showPackagesView ? packagesLoading : isLoading;

  if (isLoadingView && (showPackagesView ? packagesList.length === 0 : bookings.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3f2e73]"></div>
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
        </div>
        <button
          onClick={() => setIsManualBookingOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#3f2e73] text-white text-sm font-medium rounded-lg hover:bg-[#1d1733] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3f2e73] transition-colors"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Create Manual Booking
        </button>
      </div>

      {!showPackagesView && (
        <>
          {/* Date Range Filter (like finance dashboard) */}
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

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by client name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showPackagesView && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{packagesList.length}</span>{' '}
            package{packagesList.length !== 1 ? 's' : ''} — upcoming sessions and book next when eligible
          </p>
        </div>
      )}

      {/* Status Tabs */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-1.5">
        <nav
          className="flex gap-1 overflow-x-auto"
          aria-label="Filter by status"
        >
          {statusTabs.map((tab) => {
            const isActive = filterStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilterStatus(tab.value)}
                className={`
                  relative px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap
                  transition-all duration-200 ease-out
                  ${isActive
                    ? 'bg-[#3f2e73] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#3f2e73] hover:bg-[#3f2e73]/8 active:bg-[#3f2e73]/12'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bookings List or Packages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {showPackagesView ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Psychologist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upcoming sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packagesLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <div className="inline-flex flex-col items-center gap-3 text-gray-500">
                        <Loader2 className="h-8 w-8 animate-spin text-[#3f2e73]" />
                        <span className="text-sm font-medium">Processing...</span>
                      </div>
                    </td>
                  </tr>
                ) : packagesList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No packages with sessions.
                    </td>
                  </tr>
                ) : (
                  packagesList.map((pkg) => {
                    const completed = pkg.package?.completed_sessions ?? 0;
                    const total = pkg.package?.total_sessions ?? pkg.package?.session_count ?? 0;
                    const remaining = pkg.package?.remaining_sessions ?? 0;
                    const canBookNext = pkg.package?.can_book_next === true;
                    const upcomingSessions = pkg.upcoming_sessions ?? [];
                    return (
                      <tr key={`${pkg.client_id}-${pkg.package_id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {pkg.client?.first_name} {pkg.client?.last_name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserCheck className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {pkg.psychologist?.first_name} {pkg.psychologist?.last_name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {completed}/{total} completed · {remaining} remaining
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {upcomingSessions.length === 0 ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <ul className="space-y-1">
                              {upcomingSessions.map((s) => (
                                <li key={s.id} className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                  <span>{formatDate(s.scheduled_date)} at {formatTime(s.scheduled_time)}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {canBookNext ? (
                            <button
                              onClick={() => openBookNextFromPackage(pkg)}
                              className="inline-flex items-center px-3 py-1.5 bg-[#3f2e73] text-white text-sm font-medium rounded-lg hover:bg-[#1d1733] transition-colors"
                            >
                              Book next session
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
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
                  Booked at
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="inline-flex flex-col items-center gap-3 text-gray-500">
                      <Loader2 className="h-8 w-8 animate-spin text-[#3f2e73]" />
                      <span className="text-sm font-medium">Processing...</span>
                    </div>
                  </td>
                </tr>
              ) : (
              displayBookings.map((booking) => (
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
                          // Package session (use package_id so we show Package even when package object is missing)
                          if (booking.package_id || booking.package) {
                            const pkg = booking.package || {};
                            const totalSessions = pkg.total_sessions ?? pkg.session_count ?? 0;
                            const completedSessions = pkg.completed_sessions;
                            const raw = (pkg.package_type || 'Package').replace(/_\d+$/, '') || 'Package';
                            const packageType = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
                            const hasTotal = totalSessions > 0;
                            const hasProgress = hasTotal && completedSessions !== undefined && completedSessions !== null;
                            return (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3f2e73]/10 text-[#3f2e73]">
                                {packageType}
                                {hasProgress && <span className="ml-1">({completedSessions}/{totalSessions})</span>}
                                {hasTotal && !hasProgress && <span className="ml-1">({totalSessions})</span>}
                              </span>
                            );
                          }
                          // Individual session
                          return (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Individual
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status, booking)}`}>
                        {getStatusText(booking.status, booking)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatBookedAt(booking.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Feedback - icon only when feedback exists */}
                      {booking.status === 'completed' && (booking.feedback || booking.rating || booking.client_feedback) && (
                        <button
                          onClick={() => setFeedbackToView(booking)}
                          title="View feedback"
                          className="inline-flex items-center justify-center p-2 rounded-lg text-purple-600 border border-purple-300 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" />
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
                          {getMeetLink(booking) && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                            <>
                              <DropdownMenuItem onClick={() => handleOpenMeet(booking)} className="cursor-pointer">
                                <Video className="h-4 w-4 mr-2" />
                                Open Meet
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
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
              )))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!showPackagesView && displayBookings.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h6>No bookings found</h6>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all'
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
              <div className="text-sm font-semibold text-gray-900" role="heading" aria-level={6}>Client Feedback</div>
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
      {!showPackagesView && totalPages > 1 && (
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
      
      {/* Show total count - under the table */}
      {!showPackagesView && (displayBookings.length > 0 || totalBookings > 0) && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Showing {displayBookings.length} of {totalBookings} booking{totalBookings !== 1 ? 's' : ''}
          {filterStatus !== 'all' && filterStatus !== 'packages' && (
            <>
              {' '}with status{' '}
              <span className="font-medium text-gray-900">
                {filterStatus === 'no_show' ? 'No Show' : filterStatus.replace('_', ' ')}
              </span>
            </>
          )}
          {searchTerm && ` matching "${searchTerm}"`}
          {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
        </div>
      )}

      {/* Enhanced Session Details Modal */}
      {isSessionDetailsOpen && (selectedSession || sessionDetailsLoading) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-slate-200/80">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3f2e73]/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-[#3f2e73]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 tracking-tight" role="heading" aria-level={2}>Session Details</div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedSession ? `#${selectedSession.id?.slice(0, 8)}` : 'Loading...'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsSessionDetailsOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {sessionDetailsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-[#3f2e73]" />
                </div>
              ) : selectedSession ? (
              <div className="space-y-5">
                {/* Session Information */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3" role="heading" aria-level={3}>Session Information</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Session ID</p>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono">
                        #{selectedSession.id}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Status</p>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(selectedSession.status, selectedSession)}`}>
                          {getStatusText(selectedSession.status, selectedSession)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Session Type</p>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                        {selectedSession.package_id || selectedSession.package ? (
                          (() => {
                            const pkg = selectedSession.package || {};
                            let totalSessions = pkg.total_sessions ?? pkg.session_count ?? 0;
                            if (totalSessions === 0 && pkg.package_type) {
                              const match = String(pkg.package_type).match(/\d+/);
                              if (match) totalSessions = parseInt(match[0], 10);
                            }
                            const completedSessions = pkg.completed_sessions;
                            if (totalSessions > 0 && completedSessions !== undefined && completedSessions !== null) {
                              return <>Package <span className="text-slate-600">({completedSessions}/{totalSessions} sessions)</span></>;
                            }
                            if (totalSessions > 0) return <>Package <span className="text-slate-600">({totalSessions} sessions)</span></>;
                            return 'Package';
                          })()
                        ) : (
                          'Individual'
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Date</p>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                        {formatDate(selectedSession.scheduled_date)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Time</p>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                        {formatTime(selectedSession.scheduled_time)}
                      </div>
                    </div>
                    {selectedSession.status === 'rescheduled' && selectedSession.original_scheduled_date && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Original Scheduled Date</p>
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
                          {formatDate(selectedSession.original_scheduled_date)}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Booked at</p>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                        {formatBookedAt(selectedSession.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3" role="heading" aria-level={3}>Client Information</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Full Name</p>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                        {(() => { const c = normRel(selectedSession.client); return c ? `${(c.first_name || '').trim()} ${(c.last_name || '').trim()}`.trim() || '—' : '—'; })()}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Email</p>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                        {normRel(selectedSession.client)?.user?.email || 'Not provided'}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</p>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                        {normRel(selectedSession.client)?.phone_number || 'Not provided'}
                      </div>
                    </div>
                    {normRel(selectedSession.client)?.child_name && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Child Name</p>
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                          {normRel(selectedSession.client).child_name}
                        </div>
                      </div>
                    )}
                    {normRel(selectedSession.client)?.child_age != null && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Child Age</p>
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                          {normRel(selectedSession.client).child_age} years
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Psychologist Information */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3" role="heading" aria-level={3}>Psychologist</div>
                  <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                    {(() => { const p = normRel(selectedSession.psychologist); return p ? `${(p.first_name || '').trim()} ${(p.last_name || '').trim()}`.trim() || '—' : '—'; })()}
                  </div>
                </div>

                {/* Package & Pricing Information */}
                {selectedSession.package && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3" role="heading" aria-level={3}>Package & Pricing</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Package Type</p>
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                          {(() => {
                            const raw = (selectedSession.package.package_type || 'Package').replace(/_\d+$/, '') || 'Package';
                            return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
                          })()}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Package Price</p>
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                          ₹{selectedSession.package.price}
                        </div>
                      </div>
                      {selectedSession.package.description && (
                        <div className="md:col-span-2">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Description</p>
                          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                            {selectedSession.package.description}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment / Amount Paid */}
                {(() => {
                  const amountPaid = getAmountPaid(selectedSession);
                  if (amountPaid === null || amountPaid === undefined) return null;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3" role="heading" aria-level={3}>Payment</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Amount Paid</p>
                          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium">
                            ₹{amountPaid}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Session completion fields */}
                {(() => {
                  const { summary, report, privateNotes } = getSessionCompletionFields(selectedSession);
                  const hasAny = summary || report || privateNotes;
                  if (!hasAny) return null;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 space-y-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider" role="heading" aria-level={3}>Session completion notes</div>
                      {summary && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Session summary — visible to client</p>
                          <div className="bg-[#3f2e73]/5 border border-[#3f2e73]/20 rounded-lg p-3">
                            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
                          </div>
                        </div>
                      )}
                      {report && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Session report — visible to client</p>
                          <div className="bg-[#3f2e73]/5 border border-[#3f2e73]/20 rounded-lg p-3">
                            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{report}</p>
                          </div>
                        </div>
                      )}
                      {privateNotes && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Private session notes — therapist only</p>
                          <div className="bg-slate-100 border border-slate-200 rounded-lg p-3">
                            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{privateNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/30 flex-shrink-0">
              <div>
                {selectedSession?.status === 'completed' &&
                  selectedSession?.package_id &&
                  (selectedSession?.package?.remaining_sessions ?? 0) > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsBookNextOpen(true)}
                    className="px-4 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#1d1733] transition-colors text-sm font-medium"
                  >
                    Book next session
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsSessionDetailsOpen(false)}
                className="px-4 py-2 text-[#3f2e73] bg-white border border-[#3f2e73]/40 rounded-lg hover:bg-[#3f2e73]/10 transition-colors text-sm font-medium"
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

      {/* Book next package session modal */}
      <AdminBookNextPackageSessionModal
        isOpen={isBookNextOpen}
        onClose={() => setIsBookNextOpen(false)}
        session={selectedSession}
        onSuccess={handleBookNextSuccess}
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
                <div className="text-sm font-semibold text-gray-900" role="heading" aria-level={3}>Confirm No Show</div>
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
        fieldsOptional
        wide
      />

      </div>
    </div>
  );
}

