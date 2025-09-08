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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && session) {
      setSelectedDate('');
      setSelectedTime('');
      setReason('');
      setError(null);
      fetchPsychologistAvailability();
    }
  }, [isOpen, session]);

  const fetchPsychologistAvailability = async () => {
    if (!session?.psychologist_id) return;

    setIsLoadingAvailability(true);
    setError(null);

    try {
      // Get current month and next month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Reschedule Session</h2>
              <p className="text-sm text-gray-600">Select a new date and time for this session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Session Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Client</p>
                <p className="text-sm text-gray-900">
                  {session.clients?.child_name || `${session.clients?.first_name} ${session.clients?.last_name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Psychologist</p>
                <p className="text-sm text-gray-900">
                  {session.psychologists?.first_name} {session.psychologists?.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CalendarDays className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Current Schedule</p>
                <p className="text-sm text-gray-900">
                  {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoadingAvailability ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading availability...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Object.keys(psychologistAvailability).map((date) => {
                    const dayAvailability = psychologistAvailability[date];
                    const isSelected = selectedDate === date;
                    const hasAvailableSlots = dayAvailability?.is_available && 
                      dayAvailability.available_slots?.length > 0;

                    return (
                      <button
                        key={date}
                        onClick={() => handleDateSelect(date)}
                        disabled={!hasAvailableSlots}
                        className={`
                          p-3 text-center rounded-lg border transition-colors
                          ${isSelected 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : hasAvailableSlots
                              ? 'bg-white text-gray-900 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }
                        `}
                      >
                        <div className="text-sm font-medium">
                          {new Date(date).getDate()}
                        </div>
                        <div className="text-xs">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        {hasAvailableSlots && (
                          <div className="text-xs mt-1">
                            {dayAvailability.available_slots.length} slots
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {getAvailableSlots(selectedDate).map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`
                          p-3 text-center rounded-lg border transition-colors
                          ${selectedTime === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-900 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                          }
                        `}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Reschedule (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for rescheduling..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedTime || isLoading}
            className={`
              px-4 py-2 rounded-lg transition-colors flex items-center space-x-2
              ${!selectedDate || !selectedTime || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
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
