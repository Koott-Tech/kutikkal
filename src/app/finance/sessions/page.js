'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search,
  Filter,
  Eye,
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
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { financeApi } from '@/lib/backendApi';
import { useNotification } from '@/contexts/NotificationContext';
import WheelPagination from '@/components/ui/wheel-pagination';
import DateRangePicker from '@/components/ui/date-range-picker';

export default function FinanceSessionsPage() {
  const { showError } = useNotification();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetailsLoading, setSessionDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [dateRange, setDateRange] = useState(() => {
    try {
      const now = new Date();
      const istString = now.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
      });
      const [month, , year] = istString.split('/').map(Number);
      const startOfMonth = new Date(year, month - 1, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) throw new Error('Invalid date');
      return { from: startOfMonth, to: endOfMonth };
    } catch {
      const today = new Date();
      const s = new Date(today.getFullYear(), today.getMonth(), 1); s.setHours(0,0,0,0);
      const e = new Date(today.getFullYear(), today.getMonth() + 1, 0); e.setHours(23,59,59,999);
      return { from: s, to: e };
    }
  });

  useEffect(() => {
    loadSessions();
  }, [currentPage, filterStatus, dateRange]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filterStatus, searchTerm, dateRange]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort: 'scheduled_date',
        order: 'asc'
      };

      if (filterStatus && filterStatus !== 'all') {
        params.status = filterStatus;
      }

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

      const response = await financeApi.getAllSessions(params);
      
      if (response && response.success) {
        const sessionsData = response.data?.sessions || [];
        const paginationData = response.data?.pagination || {};
        setSessions(sessionsData);
        setTotalSessions(paginationData.total || 0);
        setTotalPages(Math.max(1, Math.ceil((paginationData.total || 0) / itemsPerPage)));
      } else {
        setSessions([]);
        setTotalSessions(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to load finance sessions:', error);
      showError('Failed to load sessions', 'Load Error');
      setSessions([]);
      setTotalSessions(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSession = async (session) => {
    if (!session?.id) return;
    setSelectedSession(null);
    setIsSessionDetailsOpen(true);
    setSessionDetailsLoading(true);
    try {
      const response = await financeApi.getSessionDetails(session.id);
      if (!response?.success) {
        setSelectedSession(session);
        return;
      }
      const sessionData = response.data?.session ?? (response.data && typeof response.data === 'object' && response.data.id ? response.data : null);
      setSelectedSession(sessionData || session);
    } catch (err) {
      console.error('Failed to load session details:', err);
      setSelectedSession(session);
    } finally {
      setSessionDetailsLoading(false);
    }
  };

  const normRel = (r) => (Array.isArray(r) ? r[0] : r) ?? null;

  const getAmountPaid = (session) => {
    if (!session) return null;
    if (session.session_type === 'assessment' || session.type === 'assessment') {
      if (session.amount !== undefined && session.amount !== null) return session.amount;
    }
    if (session.price !== undefined && session.price !== null) return session.price;
    if (session.package && session.package.price !== undefined && session.package.price !== null) return session.package.price;
    return null;
  };

  const getStatusColor = (status, booking) => {
    const isTimePassed = () => {
      if (!booking?.scheduled_date || !booking?.scheduled_time) return false;
      return new Date(`${booking.scheduled_date}T${booking.scheduled_time}`) < new Date();
    };
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-orange-100 text-orange-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return isTimePassed() ? 'bg-slate-100 text-slate-700' : 'bg-[#3f2e73]/10 text-[#3f2e73]';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status, booking) => {
    const isTimePassed = () => {
      if (!booking?.scheduled_date || !booking?.scheduled_time) return false;
      return new Date(`${booking.scheduled_date}T${booking.scheduled_time}`) < new Date();
    };
    switch (status) {
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'no_show': return 'No Show';
      case 'rescheduled': return 'Rescheduled';
      case 'booked': return isTimePassed() ? 'Pending' : 'Booked';
      default: return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
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
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  const normalizeStatus = (s) => (s === 'noshow' ? 'no_show' : (s || ''));

  const filteredSessions = sessions.filter(s => {
    const statusMatch = filterStatus === 'all' || normalizeStatus(s.status) === filterStatus;
    if (!statusMatch) return false;
    if (!searchTerm) return true;
    const clientName = `${s.client?.first_name || ''} ${s.client?.last_name || ''}`.toLowerCase();
    const clientEmail = s.client?.user?.email?.toLowerCase() || '';
    return clientName.includes(searchTerm.toLowerCase()) || clientEmail.includes(searchTerm.toLowerCase());
  });

  const displaySessions = [...filteredSessions].sort((a, b) => {
    const aDt = new Date(`${a.scheduled_date || ''}T${a.scheduled_time || ''}`);
    const bDt = new Date(`${b.scheduled_date || ''}T${b.scheduled_time || ''}`);
    return aDt - bDt;
  });

  const statusTabs = [
    { value: 'all', label: 'All' },
    { value: 'booked', label: 'Booked' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rescheduled', label: 'Rescheduled' },
    { value: 'no_show', label: 'No Show' }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && sessions.length === 0) {
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

        {/* Search */}
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

        {/* Status Tabs */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-1.5">
          <nav className="flex gap-1 overflow-x-auto" aria-label="Filter by status">
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

        {/* Sessions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Psychologist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked at</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                ) : displaySessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <h6 className="mt-2">No sessions found</h6>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || filterStatus !== 'all'
                          ? 'Try adjusting your search or filter criteria.'
                          : 'No therapy sessions have been booked yet.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  displaySessions.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {(() => {
                              if (booking.session_type === 'free_assessment') {
                                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Free Assessment</span>;
                              }
                              if (booking.session_type === 'assessment' || booking.type === 'assessment') {
                                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Assessment</span>;
                              }
                              if (booking.package_id || booking.package) {
                                const pkg = booking.package || {};
                                const totalSessions = pkg.total_sessions ?? pkg.session_count ?? 0;
                                const sessionNumber = pkg.session_number;
                                const raw = (pkg.package_type || 'Package').replace(/_\d+$/, '') || 'Package';
                                const packageType = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
                                const hasTotal = totalSessions > 0;
                                const hasSessionNum = hasTotal && sessionNumber !== undefined && sessionNumber !== null;
                                return (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3f2e73]/10 text-[#3f2e73]">
                                    {packageType}
                                    {hasSessionNum && <span className="ml-1">({sessionNumber}/{totalSessions})</span>}
                                    {hasTotal && !hasSessionNum && <span className="ml-1">({totalSessions})</span>}
                                  </span>
                                );
                              }
                              return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Individual</span>;
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
                            <div className="text-sm text-gray-900">Free Assessment</div>
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
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status, booking)}`}>
                          {getStatusText(booking.status, booking)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatBookedAt(booking.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 pt-6 border-t border-gray-200">
            <WheelPagination
              totalPages={totalPages}
              visibleCount={7}
              currentPage={currentPage - 1}
              onPageChange={(page) => handlePageChange(page + 1)}
              className=""
            />
          </div>
        )}

        {/* Total count */}
        {(displaySessions.length > 0 || totalSessions > 0) && (
          <div className="text-center mt-4 text-sm text-gray-600">
            Showing {displaySessions.length} of {totalSessions} session{totalSessions !== 1 ? 's' : ''}
            {filterStatus !== 'all' && (
              <>
                {' '}with status{' '}
                <span className="font-medium text-gray-900">
                  {filterStatus === 'no_show' ? 'No Show' : filterStatus.replace('_', ' ')}
                </span>
              </>
            )}
            {searchTerm && ` matching "${searchTerm}"`}
            {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
          </div>
        )}

        {/* Enhanced Session Details Modal (matches admin bookings) */}
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
                                const sessionNumber = pkg.session_number;
                                if (totalSessions > 0 && sessionNumber !== undefined && sessionNumber !== null) {
                                  return <>Package <span className="text-slate-600">(Session {sessionNumber}/{totalSessions})</span></>;
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
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50/30 flex-shrink-0">
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
      </div>
    </div>
  );
}
