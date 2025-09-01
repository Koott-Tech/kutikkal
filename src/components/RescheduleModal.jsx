'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { publicApi, clientApi } from '../lib/backendApi';

export default function RescheduleModal({ isOpen, onClose, session }) {
  // Calendar state - EXACT same as therapist profile
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Availability state - EXACT same as therapist profile
  const [psychologistAvailability, setPsychologistAvailability] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [error, setError] = useState(null);

  // EXACT same helper functions as therapist profile
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
    
    // Refetch availability for new month
    if (session?.psychologist_id) {
      fetchPsychologistAvailability();
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    
    // Refetch availability for new month
    if (session?.psychologist_id) {
      fetchPsychologistAvailability();
    }
  };

  const handleDateSelect = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    // Clear selected time when date changes
    setSelectedTime(null);
    
    // Check if the selected date has availability
    // Use local date formatting to avoid timezone conversion issues
    const year = newSelectedDate.getFullYear();
    const month = String(newSelectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(newSelectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    const dateAvailability = psychologistAvailability[dateStr];
    
    if (!dateAvailability || !dateAvailability.availableSlots || dateAvailability.availableSlots === 0) {
      // No availability for this date
    } else {
      // Date has availability
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // EXACT same availability fetching as therapist profile
  const fetchPsychologistAvailability = async () => {
    if (!session?.psychologist_id) return;

    try {
      setLoadingAvailability(true);
      
      // Get current month dates - EXACT same logic
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
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
      
      console.log('Fetching availability for psychologist:', session.psychologist_id);
      console.log('Date range:', startDate, 'to', endDate);
      
      // Use the exact same API call as therapist profile
      const response = await publicApi.getPsychologistAvailabilityRange(
        session.psychologist_id, 
        startDate, 
        endDate
      );
      
      if (response.success) {
        // Convert array to object with date keys - same as therapist profile
        const availabilityObject = {};
        response.data.data.forEach(dayAvailability => {
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
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    if (isOpen && session) {
      fetchPsychologistAvailability();
    }
  }, [isOpen, session, currentDate]);

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    setIsRescheduling(true);
    setError(null);

    try {
      const rescheduleData = {
        new_date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
        new_time: selectedTime,
        psychologist_id: session.psychologist_id
      };

      const response = await clientApi.rescheduleSession(session.id, rescheduleData);
      
      if (response.success) {
        // Check if this was a direct reschedule or a request
        if (response.message && response.message.includes('request sent')) {
          // This was a reschedule request
          setError('Reschedule request sent to psychologist for approval');
          setTimeout(() => {
            onClose();
          }, 3000);
        } else {
          // This was a direct reschedule
          onClose();
        }
        // You might want to refresh the sessions list here
      } else {
        setError(response.message || 'Failed to reschedule session');
      }
    } catch (error) {
      console.error('Error rescheduling session:', error);
      setError('Failed to reschedule session');
    } finally {
      setIsRescheduling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Reschedule Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Current Session Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Current Session</h3>
            <p className="text-blue-800">
              📅 {new Date(session.scheduled_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-blue-800">
              🕐 {session.scheduled_time}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar - EXACT same structure as therapist profile */}
            <div>
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
                {/* Calendar Header */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Reschedule Session</h3>
                  <p className="text-gray-600 text-sm">Select a new date and time</p>
                  {loadingAvailability && (
                    <div className="mt-2 flex items-center justify-center text-blue-600 text-xs">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                      Loading availability...
                    </div>
                  )}
                </div>
                
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <h4 className="text-sm font-semibold text-gray-800">{getMonthName(currentDate)}</h4>
                  <button 
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
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
                      
                      // Check if this specific date is available for the psychologist
                      // Use local date formatting to avoid timezone conversion issues
                      const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const year = calendarDate.getFullYear();
                      const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
                      const dayStr = String(calendarDate.getDate()).padStart(2, '0');
                      const dateStr = `${year}-${month}-${dayStr}`;
                      const dateAvailability = psychologistAvailability[dateStr];
                      const isPsychologistAvailable = dateAvailability && dateAvailability.availableSlots > 0;
                      
                      // Only show dates as available if they actually have availability data
                      const isActuallyAvailable = isPsychologistAvailable && isAvailable;
                      
                      calendarDays.push(
                        <div
                          key={`day-${day}`}
                          onClick={() => {
                            // Allow clicking on any future date, not just those with availability
                            if (isAvailable) {
                              handleDateSelect(day);
                            }
                          }}
                          className={`text-center py-1 rounded-lg transition-all duration-200 text-xs ${
                            isSelected 
                              ? 'bg-green-600 text-white font-bold shadow-lg cursor-pointer' 
                              : isToday
                                ? 'bg-blue-100 text-blue-700 font-semibold cursor-pointer'
                                : isPsychologistAvailable
                                  ? 'bg-green-500 text-white font-semibold shadow-md cursor-pointer border-2 border-green-600 hover:bg-green-600 hover:scale-105 transform' // Dates with actual availability - highlighted with hover effects
                                : isAvailable
                                  ? 'hover:bg-gray-100 text-gray-500 cursor-pointer' // Future dates without availability (now clickable)
                                  : 'text-gray-300 cursor-not-allowed' // Past dates
                          }`}
                          title={isPsychologistAvailable ? 'Available for booking' : isAvailable ? 'Click to check availability' : 'Past date'}
                        >
                          {day}
                          {isPsychologistAvailable && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1 shadow-sm"></div>
                          )}
                          {!isPsychologistAvailable && isAvailable && (
                            <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto mt-1"></div>
                          )}
                        </div>
                      );
                    }
                    
                    return calendarDays;
                  })()}
                </div>
                
                {/* Calendar Legend */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">Calendar Legend:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded border-2 border-green-600"></div>
                      <span className="font-medium">Available for booking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-100 rounded"></div>
                      <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-100 rounded"></div>
                      <span>Future date (clickable)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span>Past date</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Selection - EXACT same as therapist profile */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select New Time
                  {selectedDate && (
                    <span className="text-sm font-normal text-gray-600">
                      for {selectedDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </h3>

                {!selectedDate ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-sm">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                      </svg>
                      <p>Select a date to see available times</p>
                    </div>
                  </div>
                                 ) : (() => {
                   // EXACT same logic as therapist profile
                   // Use local date formatting to avoid timezone conversion issues
                   const year = selectedDate.getFullYear();
                   const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                   const dayStr = String(selectedDate.getDate()).padStart(2, '0');
                   const dateStr = `${year}-${month}-${dayStr}`;
                   const dateAvailability = psychologistAvailability[dateStr];
                  
                  if (!dateAvailability || !dateAvailability.availableSlots || dateAvailability.availableSlots === 0) {
                    return (
                      <div className="text-center py-8">
                        <div className="text-gray-500 text-sm">
                          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                          </svg>
                          <p>No availability for this date</p>
                          <p className="text-xs mt-1">Please select another date</p>
                        </div>
                      </div>
                    );
                  }
                  
                  // EXACT same time slots calculation as therapist profile
                  const allTimeSlots = dateAvailability.timeSlots || [];
                  const availableSlots = allTimeSlots.filter(slot => slot.available).map(slot => slot.displayTime);
                  const blockedSlots = allTimeSlots.filter(slot => !slot.available).map(slot => slot.displayTime);
                  
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-gray-800 text-sm">TIME SLOTS</h5>
                        <span className="font-bold text-gray-800 text-sm">Available: {availableSlots.length} | Blocked: {blockedSlots.length}</span>
                      </div>
                      
                      {/* Available Time Slots */}
                      {availableSlots.length > 0 && (
                        <div className="space-y-2">
                          <h6 className="text-sm font-medium text-green-700">Available Times:</h6>
                          <div className="grid grid-cols-5 gap-1">
                            {availableSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className={`p-2 rounded-lg border text-xs transition-all duration-200 w-full h-10 flex items-center justify-center ${
                                  selectedTime === time
                                    ? 'border-green-500 bg-green-50 text-green-700' 
                                    : 'border-green-300 bg-green-50 hover:border-green-400 text-green-700'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Blocked Time Slots */}
                      {blockedSlots.length > 0 && (
                        <div className="space-y-2">
                          <h6 className="text-sm font-medium text-red-700">Blocked Times:</h6>
                          <div className="grid grid-cols-5 gap-1">
                            {blockedSlots.map((time) => (
                              <div
                                key={time}
                                className="p-2 rounded-lg border border-red-300 bg-red-50 text-red-700 text-xs w-full h-10 flex items-center justify-center cursor-not-allowed"
                                title="This time slot is not available"
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Reschedule Button */}
              <button
                onClick={handleReschedule}
                disabled={!selectedDate || !selectedTime || isRescheduling}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  selectedDate && selectedTime && !isRescheduling
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isRescheduling ? 'Rescheduling...' : 'Reschedule Session'}
              </button>

              {/* New Session Details Preview */}
              {selectedDate && selectedTime && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">New Session Details</h4>
                  <p className="text-blue-800">
                    📅 {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-blue-800">
                    🕐 {selectedTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

