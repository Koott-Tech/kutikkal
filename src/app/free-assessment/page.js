'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, CheckCircle, XCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import QuickContactModal from '@/components/QuickContactModal';
import { clientApi } from '@/lib/backendApi';
import { isClientContactComplete } from '@/lib/contactValidation';

export default function FreeAssessmentPage() {
  const router = useRouter();
  const { user, token, authLoading } = useAuth();
  const [assessmentStatus, setAssessmentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [showQuickContact, setShowQuickContact] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calendar state (like therapist profile)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [freeAssessmentAvailability, setFreeAssessmentAvailability] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availableTimeslots, setAvailableTimeslots] = useState([]);
  const [loadingTimeslots, setLoadingTimeslots] = useState(false);

  // Show calendar for logged-in users by default, unless we explicitly know they can't book
  // This allows calendar to show even if assessmentStatus hasn't loaded yet or profile doesn't exist
  const canBookFreeAssessment = user 
    ? (assessmentStatus === null ? true : Boolean(assessmentStatus?.canBook))
    : true;

  // Get assessment status
  const fetchAssessmentStatus = async () => {
    if (!token) return;
    try {
      setLoading(true);
      console.log('[FreeAssess] fetchAssessmentStatus:start', { tokenPreview: (token || '').slice(0,10) + '...' });
      const response = await fetch('/api/free-assessments/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('[FreeAssess] fetchAssessmentStatus:response', data);
      
      if (data.success) {
        setAssessmentStatus(data.data);
        setError(''); // Clear any previous errors
      } else {
        // Don't block calendar for "Client profile not found" - it will be created on booking
        const errorMessage = data.message || 'Failed to fetch assessment status';
        if (errorMessage.includes('Client profile not found') || errorMessage.includes('profile not found')) {
          // Set assessmentStatus to allow booking (will be created on booking attempt)
          setAssessmentStatus({ canBook: true, totalAssessments: 3, usedAssessments: 0, availableAssessments: 3 });
          setError(''); // Don't show error - profile will be created when booking
        } else {
          setError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error fetching assessment status:', error);
      setError('Failed to fetch assessment status');
    } finally {
      setLoading(false);
      console.log('[FreeAssess] fetchAssessmentStatus:done');
    }
  };

  // Calendar helper functions (like therapist profile)
  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    fetchFreeAssessmentAvailability(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    fetchFreeAssessmentAvailability(newDate);
  };

  const handleDateSelect = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    setSelectedTime(null);
    fetchAvailableTimeslots(newSelectedDate);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Fetch free assessment availability for current month
  const fetchFreeAssessmentAvailability = async (date) => {
    try {
      setLoadingAvailability(true);
      console.log('[FreeAssess] fetchAvailability:start', { date, iso: date?.toISOString() });
      
      // Get current month dates
      const year = date.getFullYear();
      const month = date.getMonth();
      
      // Format start date (first day of month)
      const startYear = year;
      const startMonth = String(month + 1).padStart(2, '0');
      const startDay = '01';
      const startDate = `${startYear}-${startMonth}-${startDay}`;
      
      // Format end date (last day of month)
      const endYear = year;
      const endMonth = String(month + 1).padStart(2, '0');
      const endDay = String(new Date(year, month + 1, 0).getDate()).padStart(2, '0');
      const endDate = `${endYear}-${endMonth}-${endDay}`;
      
      console.log('🔍 Fetching availability for:', startDate, 'to', endDate);
      
      console.log('[FreeAssess] fetchAvailability:range', { startDate, endDate });
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(
        `/api/free-assessments/availability-range?startDate=${startDate}&endDate=${endDate}`,
        Object.keys(headers).length ? { headers } : undefined
      );
      
      const data = await response.json();
      console.log('🔍 Availability response:', data);
      
      if (data.success) {
        // Convert array to object with date keys
        const availabilityObject = {};
        data.data.forEach(dayAvailability => {
          availabilityObject[dayAvailability.date] = dayAvailability;
        });
        
        console.log('🔍 Processed availability object:', availabilityObject);
        setFreeAssessmentAvailability(availabilityObject);
      } else {
        console.error('Failed to fetch availability:', data);
        setFreeAssessmentAvailability({});
      }
    } catch (error) {
      console.error('Error fetching free assessment availability:', error);
      setFreeAssessmentAvailability({});
    } finally {
      setLoadingAvailability(false);
      console.log('[FreeAssess] fetchAvailability:done');
    }
  };

  // Fetch available timeslots for selected date
  const fetchAvailableTimeslots = async (date) => {
    try {
      setLoadingTimeslots(true);
      console.log('[FreeAssess] fetchAvailableTimeslots:start', { date, iso: date?.toISOString() });
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      console.log('[FreeAssess] fetchAvailableTimeslots:dateStr', dateStr);
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(
        `/api/free-assessments/available-slots?date=${dateStr}`,
        Object.keys(headers).length ? { headers } : undefined
      );
      
      const data = await response.json();
      console.log('[FreeAssess] fetchAvailableTimeslots:response', data);
      
      if (data.success) {
        setAvailableTimeslots(data.data.availableSlots || []);
      } else {
        console.error('Failed to fetch timeslots:', data);
        setAvailableTimeslots([]);
      }
    } catch (error) {
      console.error('Error fetching timeslots:', error);
      setAvailableTimeslots([]);
    } finally {
      setLoadingTimeslots(false);
      console.log('[FreeAssess] fetchAvailableTimeslots:done');
    }
  };

  const performBooking = async (dateObj, time) => {
    if (!dateObj || !time) return;
    if (!token) {
      setShowAuth(true);
      return;
    }
    
    // Start timer immediately when booking starts - show modal after 3 seconds
    const successTimer = setTimeout(() => {
      setShowSuccessModal(true);
      setLoading(false);
    }, 3000);
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const response = await fetch('/api/free-assessments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scheduledDate: dateStr,
          scheduledTime: time
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear selections immediately
        setSelectedDate(null);
        setSelectedTime(null);
        setAvailableTimeslots([]);
        setPendingBooking(null);
        
        // Refresh data
        if (user && token) {
          fetchAssessmentStatus();
        }
        fetchFreeAssessmentAvailability(currentDate);
        
        // Modal will show after 2 seconds (already started timer above)
        // Don't set loading to false here - let the timer handle it
      } else {
        // If booking failed, cancel the success timer and show error
        clearTimeout(successTimer);
        setShowSuccessModal(false);
        setError(data.message || 'Failed to book assessment');
        setLoading(false);
      }
    } catch (error) {
      // If booking failed, cancel the success timer and show error
      clearTimeout(successTimer);
      setShowSuccessModal(false);
      console.error('Error booking assessment:', error);
      setError('Failed to book assessment');
      setLoading(false);
    }
  };

  const ensureContactAndBook = async (dateObj, time) => {
    if (!user || !token) return;

    try {
      const profileResponse = await clientApi.getProfile();
      const profile = profileResponse?.data;
      if (!isClientContactComplete(profile)) {
        setShowQuickContact(true);
        return;
      }
    } catch (err) {
      console.error('Error verifying contact information:', err);
      setShowQuickContact(true);
      return;
    }

    await performBooking(dateObj, time);
  };

  // Book free assessment
  const bookAssessment = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    const bookingDetails = { date: selectedDate, time: selectedTime };
    setPendingBooking(bookingDetails);

    if (!user || !token) {
      setShowAuth(true);
      return;
    }

    await ensureContactAndBook(bookingDetails.date, bookingDetails.time);
  };

  const handleAuthSuccess = async () => {
    setShowAuth(false);
    // Note: AuthModal will reload the page, so we rely on sessionStorage
    // and useEffect to check contact info after reload
  };

  const handleRequireContactInfo = () => {
    setShowAuth(false);
    // Set flag in sessionStorage so contact form shows after page reload
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('showQuickContact', 'true');
    }
    setShowQuickContact(true);
  };

  const handleQuickContactSaved = async () => {
    setShowQuickContact(false);
    await fetchAssessmentStatus();
    await fetchFreeAssessmentAvailability(currentDate);
    if (pendingBooking?.date && pendingBooking?.time) {
      await ensureContactAndBook(pendingBooking.date, pendingBooking.time);
    }
  };

  // Cancel assessment
  const cancelAssessment = async (assessmentId) => {
    if (!confirm('Are you sure you want to cancel this assessment?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/free-assessments/cancel/${assessmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Assessment cancelled successfully');
        fetchAssessmentStatus(); // Refresh status
      } else {
        setError(data.message || 'Failed to cancel assessment');
      }
    } catch (error) {
      console.error('Error cancelling assessment:', error);
      setError('Failed to cancel assessment');
    } finally {
      setLoading(false);
    }
  };

  // Format time for display
  const formatTime = (time) => {
    if (!time) return '';
    try {
      const [h, m] = time.split(':');
      const hour = parseInt(h, 10);
      const minute = parseInt(m, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
    } catch {
      return time;
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (authLoading) return;

    if (user && token) {
      console.log('[FreeAssess] useEffect:init', { user: { id: user?.id, role: user?.role, email: user?.email }, tokenPreview: (token || '').slice(0,10) + '...' });
      fetchAssessmentStatus();
      
      // Check if we need to show contact form (after signup/login)
      const shouldShowContact = typeof window !== 'undefined' && sessionStorage.getItem('showQuickContact') === 'true';
      if (shouldShowContact && user?.role === 'client') {
        // Check contact info completeness
        setTimeout(async () => {
          try {
            const clientProfileResponse = await clientApi.getProfile();
            const clientProfile = clientProfileResponse.data;
            if (!isClientContactComplete(clientProfile)) {
              setShowQuickContact(true);
            }
            // Clear the flag regardless of whether contact is complete
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('showQuickContact');
            }
          } catch (e) {
            console.error('Error checking profile after auth:', e);
            // If check fails and we have the flag, show contact form anyway
            setShowQuickContact(true);
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('showQuickContact');
            }
          }
        }, 500);
      }
    } else {
      setAssessmentStatus(null);
    }

    fetchFreeAssessmentAvailability(currentDate);
  }, [authLoading, token, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h5 className="font-bold text-gray-900 mb-4">Free Assessment Sessions</h5>
        </div>

        {/* Login info for guests */}
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
            Select a date and time that works for you. You'll be prompted to log in or sign up when you click
            <span className="font-semibold"> Book Free Assessment</span>.
          </div>
        )}


        {/* Existing Assessments */}
        {user && assessmentStatus?.assessments && assessmentStatus.assessments.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h5 className="font-semibold text-gray-900 mb-4">Your Booked Assessments</h5>
            <div className="space-y-4">
              {assessmentStatus.assessments.map((assessment) => (
                <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Assessment #{assessment.assessment_number}
                        </span>
                        <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded ${
                          assessment.status === 'booked' ? 'bg-green-100 text-green-800' :
                          assessment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {formatDate(assessment.scheduled_date)} at {formatTime(assessment.scheduled_time)}
                      </p>
                      {assessment.psychologist && (
                        <p className="text-gray-600 text-sm">
                          Therapist: {assessment.psychologist.first_name} {assessment.psychologist.last_name}
                        </p>
                      )}
                    </div>
                    {assessment.status === 'booked' && (
                      <button
                        onClick={() => cancelAssessment(assessment.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {/* Booking Section */}
        {canBookFreeAssessment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Calendar */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="text-center mb-4">
                <h6 className="font-bold text-gray-800 mb-1">Select Your Date</h6>
                {loadingAvailability && (
                  <div className="mt-2 flex items-center justify-center text-blue-600 text-xs">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                    Loading availability...
                  </div>
                )}
              </div>
              
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h6 className="font-semibold text-gray-800">{getMonthName(currentDate)}</h6>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Calendar Legend */}
              <div className="mb-3 text-xs text-gray-600">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#f0edff] border border-[#3f2e73] rounded mr-1"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#eae4ff] rounded mr-1"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#3f2e73] rounded mr-1"></div>
                    <span>Selected</span>
                  </div>
                </div>
                {/* Debug info removed for production */}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={`header-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
                {(() => {
                  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
                  const today = new Date();
                  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                  
                  // Create array for calendar grid
                  const calendarDays = [];
                  
                  // Add empty cells for days before the first day of the month
                  for (let i = 0; i < startingDay; i++) {
                    calendarDays.push(<div key={`empty-${i}`} className="text-center py-1 text-xs"></div>);
                  }
                  
                  // Add days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const isToday = isCurrentMonth && day === today.getDate();
                    const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
                    const isAvailable = day >= today.getDate() || !isCurrentMonth;
                    
                    // Check if this specific date is available for free assessments
                    const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const year = calendarDate.getFullYear();
                    const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
                    const dayStr = String(calendarDate.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${dayStr}`;
                    const dateAvailability = freeAssessmentAvailability[dateStr];
                    
                    // Highlight if the date is configured OR has available slots > 0
                    const shouldHighlight = !!dateAvailability && (
                      (typeof dateAvailability.isConfigured === 'boolean' && dateAvailability.isConfigured) ||
                      (typeof dateAvailability.availableSlots === 'number' && dateAvailability.availableSlots > 0)
                    );
                    
                    // Debug logging for first few days
                    if (day <= 5) {
                      console.log(`🔍 Date ${dateStr}:`, {
                        dateAvailability,
                        shouldHighlight,
                        availableSlots: dateAvailability?.availableSlots,
                        isConfigured: dateAvailability?.isConfigured
                      });
                    }
                    
                    // Only show dates as available if they actually have availability data
                    const isActuallyAvailable = shouldHighlight && isAvailable;
                    
                    calendarDays.push(
                      <div
                        key={`day-${day}`}
                        onClick={() => {
                          if (isAvailable) {
                            handleDateSelect(day);
                          }
                        }}
                        className={`text-center py-1 rounded-lg transition-all duration-200 text-xs ${
                          isSelected
                            ? 'bg-[#3f2e73] text-white font-bold shadow-lg cursor-pointer border border-[#3f2e73]'
                            : (isToday && shouldHighlight)
                              ? 'bg-[#3f2e73] text-white font-semibold shadow-md cursor-pointer border border-[#3f2e73]'
                              : isToday
                                ? 'bg-[#eae4ff] text-[#3f2e73] font-semibold cursor-pointer border border-[#d8ccff]'
                                : shouldHighlight
                                  ? 'bg-[#f0edff] text-[#3f2e73] font-semibold cursor-pointer border border-[#3f2e73] hover:bg-[#e3dcff]'
                                  : isAvailable
                                    ? 'text-[#3f2e73] cursor-pointer border border-transparent hover:bg-[#f6f3ff]'
                                    : 'text-gray-300 cursor-not-allowed'
                        }`}
                        title={shouldHighlight ? (isToday ? 'Today - Available for free assessment' : 'Available for free assessment') : isAvailable ? 'Click to check availability' : 'Past date'}
                      >
                        {day}
                        {shouldHighlight && (
                          <div
                            className={`w-2 h-2 rounded-full mx-auto mt-1 shadow-sm ${
                              isSelected ? 'bg-[#f0edff]' : 'bg-[#3f2e73]'
                            }`}
                          ></div>
                        )}
                      </div>
                    );
                  }
                  
                  return calendarDays;
                })()}
              </div>
            </div>

            {/* Right Side - Time Selection and Booking */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              {/* Available Time Slots */}
              {selectedDate && (
                <div className="mb-6">
                  <h6 className="font-semibold text-gray-800 mb-3">Time Slots</h6>
                  {loadingTimeslots ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading timeslots...</span>
                    </div>
                  ) : (() => {
                    const filteredSlots = availableTimeslots.filter((timeslot) => {
                          if (!selectedDate) return true;
                          const now = new Date();
                      const isToday =
                        selectedDate.getFullYear() === now.getFullYear() &&
                                         selectedDate.getMonth() === now.getMonth() &&
                                         selectedDate.getDate() === now.getDate();
                          if (!isToday) return true;
                          const [hh, mm] = timeslot.time.split(':');
                          const slotMinutes = parseInt(hh, 10) * 60 + parseInt(mm, 10);
                          const nowMinutes = now.getHours() * 60 + now.getMinutes();
                          return slotMinutes > nowMinutes;
                    });

                    if (filteredSlots.length === 0) {
                      return (
                        <div className="flex items-center justify-center h-32 text-gray-500 text-sm italic">
                          No available time slots for this date
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-3 gap-2">
                        {filteredSlots.map((timeslot, index) => {
                        const isSelected = selectedTime === timeslot.time;
                        const isFullyBooked = timeslot.currentBookings >= timeslot.maxBookings;
                        const remainingSlots = timeslot.maxBookings - timeslot.currentBookings;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => !isFullyBooked && handleTimeSelect(timeslot.time)}
                            disabled={isFullyBooked}
                            className={`p-2 text-xs rounded-lg border transition-colors ${
                              isSelected
                                ? 'bg-[#3f2e73] text-white border-[#3f2e73]'
                                : isFullyBooked
                                  ? 'bg-red-100 text-red-600 border-red-300 cursor-not-allowed'
                                  : 'bg-white text-[#3f2e73] border-[#3f2e73] hover:bg-[#f0edff]'
                            }`}
                            title={isFullyBooked ? 'Fully booked' : `Available: ${remainingSlots} slots left`}
                          >
                            <div className="text-center">
                              <div>{timeslot.displayTime || formatTime(timeslot.time)}</div>
                              {isFullyBooked && (
                                <div className="text-xs text-red-500 mt-1">Fully booked</div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    );
                  })()}
                </div>
              )}

              {/* Booking Button */}
              {selectedDate && selectedTime && (
                <div className="mt-6">
                  <button
                    onClick={bookAssessment}
                    disabled={loading}
                    className="w-full bg-[#3f2e73] text-white py-3 px-6 rounded-lg font-semibold transition-colors hover:bg-[#1d1733] disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Booking...' : 'Book Free Assessment'}
                  </button>
                </div>
              )}

              {/* Instructions */}
              {!selectedDate && (
                <div className="text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Select a date from the calendar to see available time slots</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h5 className="font-semibold text-gray-900 mb-4">About Free Assessments</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="font-medium text-gray-900 mb-2">What to Expect</h6>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• 20-minute initial consultation</li>
                <li>• Discussion of your concerns and goals</li>
                <li>• Professional assessment and recommendations</li>
                <li>• No cost or payment required</li>
                <li>• Conducted online via Google Meet</li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium text-gray-900 mb-2">Important Notes</h6>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Limited to 3 free assessments per user</li>
                <li>• Available therapists are assigned automatically</li>
                <li>• Cancellation requires 24-hour notice</li>
                <li>• Join meeting 5 minutes before scheduled time</li>
                <li>• Ensure stable internet connection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showAuth && (
        <AuthModal
          open={showAuth}
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
          onRequireContactInfo={handleRequireContactInfo}
        />
      )}
      {showQuickContact && (
        <QuickContactModal
          open={showQuickContact}
          onClose={() => setShowQuickContact(false)}
          onSaved={handleQuickContactSaved}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
            {/* Close button at top right */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Content */}
            <div className="p-6 pt-12">
              <div className="text-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Session Booked Successfully!
                </h3>
                <p className="text-gray-600 text-sm">
                  The meet link will be shared via WhatsApp and email and also will be listed in the sessions page.
                </p>
              </div>

              {/* Sessions Page Button */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push('/profile/sessions');
                  }}
                  className="w-full py-3 px-4 text-base font-semibold text-white rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: '#3f2e73' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d1733'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3f2e73'}
                >
                  Sessions Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
