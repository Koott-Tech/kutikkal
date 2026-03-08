'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  X, 
  CheckCircle, 
  AlertCircle,
  User,
  CalendarDays,
  Loader2
} from 'lucide-react';
import { adminApi } from '@/lib/backendApi';
import { useNotification } from '@/contexts/NotificationContext';

export default function AdminRescheduleModal({ 
  isOpen, 
  onClose, 
  session, 
  onRescheduleSuccess 
}) {
  const { showError, showSuccess } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [psychologistAvailability, setPsychologistAvailability] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calendar helpers (match client dashboard style)
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && session) {
      setSelectedDate('');
      setSelectedTime('');
      setReason('');
      setError(null);
      // Reset calendar to current month
      setCurrentDate(new Date());
      fetchPsychologistAvailability();
    }
  }, [isOpen, session]);

  const fetchPsychologistAvailability = async (baseDate = currentDate) => {
    if (!session?.psychologist_id) return;

    setIsLoadingAvailability(true);
    setError(null);

    try {
      // Get current month and next month based on provided date
      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();
      
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 2).padStart(2, '0')}-01`;
      
      console.log('Fetching availability for psychologist:', session.psychologist_id);
      console.log('Date range:', startDate, 'to', endDate);
      
      const response = await adminApi.getPsychologistAvailabilityForReschedule(
        session.psychologist_id, 
        startDate, 
        endDate
      );
      
      if (response.success) {
        // Convert array to object with date keys
        const availabilityObject = {};
        response.data.availability.forEach(dayAvailability => {
          availabilityObject[dayAvailability.date] = dayAvailability;
        });
        
        setPsychologistAvailability(availabilityObject);
        console.log('Availability loaded:', availabilityObject);
      } else {
        console.error('Failed to fetch availability:', response);
        setError('Failed to load availability');
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setError('Failed to load availability');
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const rescheduleData = {
        new_date: selectedDate,
        new_time: convertTo24Hour(selectedTime),
        reason: reason || 'Admin rescheduled'
      };

      console.log('Rescheduling session:', session.id, 'with data:', rescheduleData);
      console.log('Time conversion:', {
        original: selectedTime,
        converted: convertTo24Hour(selectedTime)
      });

      const response = await adminApi.rescheduleSession(session.id, rescheduleData);

      if (response.success) {
        showSuccess('Session rescheduled successfully!', 'Reschedule Success');
        onRescheduleSuccess?.(response.data);
        onClose();
      } else {
        setError(response.message || 'Failed to reschedule session');
      }
    } catch (error) {
      console.error('Reschedule error:', error);
      setError(error.message || 'Failed to reschedule session');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // If the time already contains AM/PM, return it as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // Otherwise, convert from 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const convertTo24Hour = (timeString) => {
    // If the time already doesn't contain AM/PM, return it as is (already 24-hour)
    if (!timeString.includes('AM') && !timeString.includes('PM')) {
      return timeString;
    }
    
    // Convert from 12-hour format to 24-hour format
    const [time, ampm] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (ampm === 'AM' && hour === 12) {
      hour = 0;
    } else if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}:00`;
  };

  const getAvailableSlots = (date) => {
    const dayAvailability = psychologistAvailability[date];
    if (!dayAvailability || !dayAvailability.is_available) {
      return [];
    }
    return dayAvailability.available_slots || [];
  };

  const isSlotAvailable = (date, time) => {
    const slots = getAvailableSlots(date);
    return slots.includes(time);
  };

  const handleDateSelect = (day) => {
    // Convert selected day in current month to YYYY-MM-DD string
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateObj = new Date(year, month, day);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(dateStr);
    setSelectedTime(''); // Reset time when date changes
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    fetchPsychologistAvailability(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    fetchPsychologistAvailability(newDate);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header - fixed */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#3f2e73]/10 rounded-lg">
              <Calendar className="h-5 w-5 text-[#3f2e73]" />
            </div>
            <div>
              <div role="heading" aria-level={2} className="text-sm font-medium text-gray-900 leading-snug">Reschedule Session</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Session Info - fixed */}
        <div className="flex-shrink-0 px-5 py-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700">Client</p>
                <p className="text-sm text-gray-900 truncate">
                  {session.client?.child_name ||
                    `${session.client?.first_name || ''} ${session.client?.last_name || ''}`.trim()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700">Psychologist</p>
                <p className="text-sm text-gray-900 truncate">
                  {session.psychologist?.first_name} {session.psychologist?.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700">Current Schedule</p>
                <p className="text-sm text-gray-900">
                  {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content - scrollable only this section */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {isLoadingAvailability ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#3f2e73]" />
              <span className="ml-2 text-gray-600">Loading availability...</span>
            </div>
          ) : (
            <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Calendar */}
              <div className="lg:sticky lg:top-0">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  </div>
                )}
                <div role="heading" aria-level={3} className="text-xs font-semibold text-gray-900 mb-3">Select Date (IST)</div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 w-full max-w-sm">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <h6 className="text-xs font-semibold text-gray-800">
                      {getMonthName(currentDate)}
                    </h6>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div
                        key={`header-${index}`}
                        className="text-center text-[10px] font-medium text-gray-500 py-1"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
                      const today = new Date();
                      const todayY = today.getFullYear();
                      const todayM = today.getMonth();
                      const todayD = today.getDate();
                      const cells = [];
                      for (let i = 0; i < startingDay; i++) {
                        cells.push(<div key={`empty-${i}`} className="py-1" />);
                      }
                      for (let day = 1; day <= daysInMonth; day++) {
                        const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const dayStr = String(day).padStart(2, '0');
                        const dateStr = `${year}-${month}-${dayStr}`;
                        const isToday = year === todayY && dateObj.getMonth() === todayM && day === todayD;
                        const isSelected = selectedDate === dateStr;
                        const startOfToday = new Date(todayY, todayM, todayD);
                        const startOfCell = new Date(year, dateObj.getMonth(), day);
                        const isPastDate = startOfCell < startOfToday;
                        const availability = psychologistAvailability[dateStr];
                        const hasSlots =
                          !!availability &&
                          availability.is_available &&
                          Array.isArray(availability.available_slots) &&
                          availability.available_slots.length > 0;
                        const isClickable = !isPastDate && hasSlots;
                        let baseClasses = 'text-center py-1 rounded-lg text-xs transition-colors border ';
                        if (isSelected) {
                          baseClasses += 'bg-[#3f2e73] text-white border-[#3f2e73] font-semibold shadow';
                        } else if (isClickable && isToday) {
                          baseClasses += 'bg-[#3f2e73]/10 text-[#3f2e73] border-[#3f2e73]/40 font-semibold cursor-pointer hover:bg-[#3f2e73]/20';
                        } else if (isClickable) {
                          baseClasses += 'bg-white text-gray-900 border-gray-300 cursor-pointer hover:bg-[#3f2e73]/5 hover:border-[#3f2e73]/40';
                        } else if (isPastDate) {
                          baseClasses += 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed';
                        } else {
                          baseClasses += 'bg-white text-gray-400 border-gray-200 cursor-not-allowed';
                        }
                        cells.push(
                          <button
                            key={`day-${day}`}
                            type="button"
                            onClick={() => isClickable && handleDateSelect(day)}
                            disabled={!isClickable}
                            className={baseClasses}
                          >
                            <div className="text-[11px] font-medium">{day}</div>
                            {hasSlots && (
                              <div className="w-1.5 h-1.5 rounded-full mx-auto mt-1 bg-[#3f2e73]" />
                            )}
                          </button>
                        );
                      }
                      return cells;
                    })()}
                  </div>
                </div>
              </div>

              {/* Right: Time slots + Reason */}
              <div className="space-y-4">
                {selectedDate && (
                  <div>
                    <div role="heading" aria-level={3} className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Select Time (IST)
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                      {getAvailableSlots(selectedDate).map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`
                            py-2.5 text-center rounded-lg border text-sm transition-colors
                            ${selectedTime === time
                              ? 'bg-[#3f2e73] text-white border-[#3f2e73]'
                              : 'bg-white text-gray-900 border-gray-300 hover:bg-[#3f2e73]/5 hover:border-[#3f2e73]/40'
                            }
                          `}
                        >
                          {formatTime(time)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Reschedule (Optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for rescheduling..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-[#3f2e73] text-sm resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - fixed, always visible */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedTime || isLoading}
            className={`
              px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium
              ${!selectedDate || !selectedTime || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#3f2e73] text-white hover:bg-[#1d1733]'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Rescheduling...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Reschedule Session</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
