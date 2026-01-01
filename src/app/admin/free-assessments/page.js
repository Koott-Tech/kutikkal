'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search,
  Filter,
  Eye,
  Clock,
  User,
  UserCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminApi } from '@/lib/backendApi';
import { useNotification } from '@/contexts/NotificationContext';

export default function FreeAssessmentsPage() {
  const { showError, showSuccess } = useNotification();
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});

  useEffect(() => {
    loadAssessments();
  }, [filterStatus, filterDate]);

  useEffect(() => {
    // Build calendar data from assessments
    const calendar = {};
    assessments.forEach(assessment => {
      if (assessment.scheduledDate) {
        const dateKey = assessment.scheduledDate;
        if (!calendar[dateKey]) {
          calendar[dateKey] = [];
        }
        calendar[dateKey].push(assessment);
      }
    });
    setCalendarData(calendar);
  }, [assessments]);

  const loadAssessments = async () => {
    try {
      setIsLoading(true);
      
      const params = {};
      if (filterStatus && filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (filterDate) {
        params.date = filterDate;
      }

      const response = await adminApi.getFreeAssessments(params);
      
      if (response && response.success) {
        const assessmentsData = response.data?.assessments || [];
        // Map the response data to match expected format
        const mappedAssessments = assessmentsData.map(a => ({
          id: a.id,
          assessmentNumber: a.assessmentNumber,
          scheduled_date: a.scheduledDate,
          scheduled_time: a.scheduledTime,
          scheduledDate: a.scheduledDate,
          scheduledTime: a.scheduledTime,
          status: a.status,
          client: a.client ? {
            first_name: a.client.first_name,
            last_name: a.client.last_name,
            child_name: a.client.child_name
          } : null,
          psychologist: a.psychologist ? {
            first_name: a.psychologist.first_name,
            last_name: a.psychologist.last_name,
            email: a.psychologist.email
          } : null,
          meetLink: a.meetLink
        }));
        setAssessments(mappedAssessments);
      } else {
        setAssessments([]);
      }
      
    } catch (error) {
      console.error('Failed to load free assessments:', error);
      showError('Failed to load free assessments', 'Load Error');
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setIsDetailsOpen(true);
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'booked':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'booked':
        return 'Booked';
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getMonthYearString = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDateKey = (day) => {
    if (!day) return null;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!day) return false;
    const dateKey = getDateKey(day);
    return dateKey === selectedDate;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const dateKey = getDateKey(day);
    setSelectedDate(dateKey);
    setFilterDate(dateKey);
  };

  // Filter assessments by search term
  const filteredAssessments = assessments.filter(assessment => {
    if (!searchTerm) return true;
    
    const clientName = `${assessment.client?.first_name || ''} ${assessment.client?.last_name || ''}`.toLowerCase();
    const psychologistName = `${assessment.psychologist?.first_name || ''} ${assessment.psychologist?.last_name || ''}`.toLowerCase();
    const assessmentNumber = assessment.assessmentNumber?.toString().toLowerCase() || '';
    
    const matchesSearch = 
      clientName.includes(searchTerm.toLowerCase()) ||
      psychologistName.includes(searchTerm.toLowerCase()) ||
      assessmentNumber.includes(searchTerm.toLowerCase()) ||
      assessment.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const statuses = ['all', 'booked', 'completed', 'cancelled'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h6>Free Assessments Management</h6>
            <p className="mt-1 text-sm text-gray-600">
              Manage free assessment sessions across the platform
            </p>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {getMonthYearString(currentMonth)}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dateKey = getDateKey(day);
              const dayAssessments = day ? (calendarData[dateKey] || []) : [];
              const hasAssessments = dayAssessments.length > 0;
              
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    min-h-[60px] p-1 border border-gray-200 rounded cursor-pointer transition-colors
                    ${!day ? 'bg-gray-50' : ''}
                    ${isToday(day) ? 'bg-blue-50 border-blue-300' : ''}
                    ${isSelected(day) ? 'bg-[#3f2e73] text-white border-[#3f2e73]' : 'hover:bg-gray-50'}
                    ${hasAssessments && !isSelected(day) ? 'bg-green-50 border-green-300' : ''}
                  `}
                >
                  {day && (
                    <>
                      <div className={`text-xs font-medium ${isSelected(day) ? 'text-white' : 'text-gray-900'}`}>
                        {day}
                      </div>
                      {hasAssessments && (
                        <div className="mt-1 flex flex-wrap gap-0.5">
                          {dayAssessments.slice(0, 3).map((assessment, idx) => (
                            <div
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected(day) ? 'bg-white' : 
                                assessment.status === 'completed' ? 'bg-green-500' :
                                assessment.status === 'cancelled' ? 'bg-red-500' :
                                'bg-blue-500'
                              }`}
                              title={`${assessment.status} - ${assessment.client?.first_name || 'N/A'}`}
                            />
                          ))}
                          {dayAssessments.length > 3 && (
                            <div className={`text-[8px] ${isSelected(day) ? 'text-white' : 'text-gray-600'}`}>
                              +{dayAssessments.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-semibold text-gray-900">{filteredAssessments.length}</span>{' '}
              assessment{filteredAssessments.length !== 1 ? 's' : ''}
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
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by client name, psychologist, or assessment number..."
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
                {statuses.filter(s => s !== 'all').map(status => (
                  <option key={status} value={status}>
                    {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
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

        {/* Assessments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment Details
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
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Assessment #{assessment.assessmentNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(assessment.scheduled_date)} at {formatTime(assessment.scheduled_time)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {assessment.client?.first_name} {assessment.client?.last_name}
                        </div>
                      </div>
                      {assessment.client?.child_name && (
                        <div className="text-xs text-gray-500">
                          Child: {assessment.client.child_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {assessment.psychologist ? (
                            <>
                              {assessment.psychologist.first_name} {assessment.psychologist.last_name}
                            </>
                          ) : (
                            <span className="text-gray-400">Not assigned</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(assessment.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assessment.status)}`}>
                          {getStatusText(assessment.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewAssessment(assessment)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredAssessments.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h6>No free assessments found</h6>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterDate
                ? 'Try adjusting your search or filter criteria.'
                : 'No free assessment sessions have been booked yet.'
              }
            </p>
          </div>
        )}

        {/* Assessment Details Modal */}
        {isDetailsOpen && selectedAssessment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold text-gray-900">Free Assessment Details</div>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    Assessment Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Assessment Number</p>
                      <p className="text-sm text-gray-900">#{selectedAssessment.assessmentNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <p className="text-sm text-gray-900 capitalize">{selectedAssessment.status}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date</p>
                      <p className="text-sm text-gray-900">{formatDate(selectedAssessment.scheduled_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Time</p>
                      <p className="text-sm text-gray-900">{formatTime(selectedAssessment.scheduled_time)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-green-600" />
                    Client Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p className="text-sm text-gray-900">
                        {selectedAssessment.client?.first_name} {selectedAssessment.client?.last_name}
                      </p>
                    </div>
                    {selectedAssessment.client?.child_name && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Child Name</p>
                        <p className="text-sm text-gray-900">{selectedAssessment.client.child_name}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-purple-600" />
                    Psychologist Information
                  </div>
                  {selectedAssessment.psychologist ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Name</p>
                        <p className="text-sm text-gray-900">
                          {selectedAssessment.psychologist.first_name} {selectedAssessment.psychologist.last_name}
                        </p>
                      </div>
                      {selectedAssessment.psychologist.email && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <p className="text-sm text-gray-900">{selectedAssessment.psychologist.email}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Not assigned</p>
                  )}
                </div>

                {selectedAssessment.meetLink && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-gray-900 mb-2">Google Meet Link</div>
                    <a
                      href={selectedAssessment.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {selectedAssessment.meetLink}
                    </a>
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

