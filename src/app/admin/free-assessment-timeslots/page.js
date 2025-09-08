'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Plus, Edit, Trash2, Check, X, Save, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '@/lib/backendApi';

export default function FreeAssessmentTimeslotsPage() {
  const { user, token, authLoading } = useAuth();
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTimeslot, setEditingTimeslot] = useState(null);
  
  // Form states
  const [timeSlot, setTimeSlot] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [maxBookingsPerSlot, setMaxBookingsPerSlot] = useState(3);

  // Calendar states (like doctor modal)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({});
  const [step, setStep] = useState(1); // 1: select date, 2: select times, 3: save

  // Time slot categories (exact same as doctor modal)
  const timeSlots = {
    morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    noon: ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'],
    evening: ['4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'],
    night: ['8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM']
  };

  // Fetch availability data for current month
  const fetchAvailabilityData = async (date) => {
    try {
      setLoading(true);
      
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
      
      const data = await adminApi.getDateConfigsRange(startDate, endDate);
      
      if (data.success) {
        setAvailabilityData(data.data);
      } else {
        console.error('Failed to fetch availability:', data);
        setAvailabilityData({});
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailabilityData({});
    } finally {
      setLoading(false);
    }
  };

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  // Convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24h) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Fetch all timeslots
  const fetchTimeslots = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getFreeAssessmentTimeslots();
      
      if (data.success) {
        setTimeslots(data.data);
      } else {
        setError(data.message || 'Failed to fetch timeslots');
      }
    } catch (error) {
      console.error('Error fetching timeslots:', error);
      setError('Failed to fetch timeslots');
    } finally {
      setLoading(false);
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = new Date(year, month, 1).getDay();
    return { daysInMonth, startingDay };
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    fetchAvailabilityData(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    fetchAvailabilityData(newDate);
  };

  const handleDateSelect = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    setSelectedTimes([]);
    setStep(2); // Move to time selection step
  };

  const handleTimeSelect = (timeKey) => {
    setSelectedTimes(prev => {
      if (prev.includes(timeKey)) {
        return prev.filter(t => t !== timeKey);
      } else {
        return prev.concat(timeKey);
      }
    });
  };

  const saveCurrentDateAvailability = async () => {
    if (selectedTimes.length === 0) {
      setError('Please select at least one time slot');
      return;
    }

    try {
      setLoading(true);
      
      // Convert selected times to 24-hour format for backend
      const timeslotsToSave = selectedTimes.map(timeKey => {
        const colonIndex = timeKey.indexOf(':');
        const period = timeKey.substring(0, colonIndex);
        const time = timeKey.substring(colonIndex + 1);
        return convertTo24Hour(time);
      });

      // Save timeslots to backend
      const data = await adminApi.bulkCreateFreeAssessmentTimeslots({
        timeslots: timeslotsToSave.map(time => ({
          time_slot: time,
          is_active: true,
          max_bookings_per_slot: 3
        }))
      });

      if (data.success) {
        // Now save the date-specific configuration
        const dateStr = selectedDate.toISOString().split('T')[0];
        const timeSlotsByPeriod = {
          morning: [],
          noon: [],
          evening: [],
          night: []
        };
        
        // Organize selected times by period
        selectedTimes.forEach(timeKey => {
          const colonIndex = timeKey.indexOf(':');
          const period = timeKey.substring(0, colonIndex);
          const time = timeKey.substring(colonIndex + 1);
          if (timeSlotsByPeriod[period]) {
            timeSlotsByPeriod[period].push(time);
          }
        });

        // Save date configuration
        const dateConfigData = await adminApi.createDateConfig({
          date: dateStr,
          timeSlots: timeSlotsByPeriod
        });

        if (dateConfigData.success) {
          setSuccess('Timeslots saved successfully!');
          
          // Update local availability data
          const newAvailability = { ...availabilityData };
          newAvailability[dateStr] = {
            timeSlots: timeSlotsByPeriod,
            isConfigured: true
          };
          setAvailabilityData(newAvailability);
          
          // Reset selection
          setSelectedDate(null);
          setSelectedTimes([]);
          setStep(1);
          
          // Refresh timeslots list
          fetchTimeslots();
        } else {
          setError(dateConfigData.message || 'Failed to save date configuration');
        }
      } else {
        setError(data.message || 'Failed to save timeslots');
      }
    } catch (error) {
      console.error('Error saving timeslots:', error);
      setError('Failed to save timeslots');
    } finally {
      setLoading(false);
    }
  };

  const goToNextDate = async () => {
    if (selectedTimes.length === 0) {
      setError('Please select at least one time slot');
      return;
    }

    // Save current date and move to next date
    await saveCurrentDateAvailability();
    
    // Move to next day
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
    setCurrentDate(nextDate);
    setSelectedDate(nextDate);
    setSelectedTimes([]);
    setStep(2);
  };

  const removeAvailability = async (dateStr) => {
    try {
      setLoading(true);
      
      const data = await adminApi.deleteDateConfig(dateStr);

      if (data.success) {
        setSuccess('Date configuration removed successfully!');
        
        // Remove from local state
        const newAvailability = { ...availabilityData };
        delete newAvailability[dateStr];
        setAvailabilityData(newAvailability);
      } else {
        setError(data.message || 'Failed to remove date configuration');
      }
    } catch (error) {
      console.error('Error removing availability:', error);
      setError('Failed to remove date configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && token && user) {
      fetchTimeslots();
      fetchAvailabilityData(currentDate);
    }
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

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Free Assessment Timeslots</h1>
            <p className="text-lg text-gray-600">Manage available time slots for free assessments</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Timeslot
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {/* Calendar-based Timeslot Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Calendar-based Timeslot Management
          </h2>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className="w-8 h-1 bg-gray-200"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>
          
          {/* Step 1: Date Selection */}
          {step === 1 && (
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select a Date</h4>
              
              {/* Simple Calendar */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-xs mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`day-header-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
                    const calendarDays = [];
                    
                    // Add empty cells for days before the first day of the month
                    for (let i = 0; i < startingDay; i++) {
                      calendarDays.push(
                        <div key={`empty-${i}`} className="h-8"></div>
                      );
                    }
                    
                    // Add days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                      const isToday = isCurrentMonth && day === new Date().getDate();
                      const isAvailable = day >= new Date().getDate() || !isCurrentMonth;
                      
                      // Check if this date has timeslots configured
                      const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const year = calendarDate.getFullYear();
                      const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
                      const dayStr = String(calendarDate.getDate()).padStart(2, '0');
                      const dateStr = `${year}-${month}-${dayStr}`;
                      const dateAvailability = availabilityData[dateStr];
                      
                      // Only show green if this date has been configured through the calendar (has timeSlots)
                      const hasTimeslots = dateAvailability && dateAvailability.timeSlots;

                      calendarDays.push(
                        <div
                          key={`day-${day}`}
                          onClick={() => isAvailable && handleDateSelect(day)}
                          className={`text-center py-1 rounded-lg transition-all duration-200 text-xs cursor-pointer ${
                            hasTimeslots
                              ? 'bg-green-500 text-white' 
                              : isToday
                                ? 'bg-blue-100 text-blue-700 font-semibold'
                                : isAvailable
                                  ? 'hover:bg-gray-100 text-gray-700' 
                                  : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title={hasTimeslots ? 'Timeslots configured' : isAvailable ? 'Click to select' : 'Past date'}
                        >
                          {day}
                          {hasTimeslots && (
                            <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
                          )}
                        </div>
                      );
                    }
                    
                    return calendarDays;
                  })()}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-4">Click on any future date to select it</p>
            </div>
          )}
          
          {/* Step 2: Time Selection */}
          {step === 2 && selectedDate && (
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Step 2: Select Time Slots for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h4>
              
              {/* Time Periods */}
              <div className="max-w-md mx-auto space-y-4">
                {Object.entries(timeSlots).map(([period, times]) => (
                  <div key={period} className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3 capitalize">{period}</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {times.map(time => {
                        const timeKey = `${period}:${time}`;
                        const isSelected = selectedTimes.includes(timeKey);
                        
                        return (
                          <button
                            key={timeKey}
                            type="button"
                            onClick={() => handleTimeSelect(timeKey)}
                            className={`p-2 text-xs rounded-lg border transition-colors ${
                              isSelected
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedTimes([]);
                    setStep(1);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Date Selection
                </button>
                
                <button
                  type="button"
                  onClick={goToNextDate}
                  disabled={selectedTimes.length === 0 || loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Next Date'}
                </button>
                
                <button
                  type="button"
                  onClick={saveCurrentDateAvailability}
                  disabled={selectedTimes.length === 0 || loading}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save & Finish'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current Availability Display */}
        {Object.keys(availabilityData).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Current Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(availabilityData).map(([dateStr, data]) => {
                // Only show dates that have been configured through the calendar (have timeSlots)
                if (!data || !data.timeSlots) {
                  return null;
                }
                
                const date = new Date(dateStr);
                const allSlots = [
                  ...(data.timeSlots.morning || []),
                  ...(data.timeSlots.noon || []),
                  ...(data.timeSlots.evening || []),
                  ...(data.timeSlots.night || [])
                ];
                
                return (
                  <div key={dateStr} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-green-800">
                        {date.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeAvailability(dateStr)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {allSlots.map((slot, slotIndex) => {
                        let displayText = slot;
                        if (typeof slot === 'object' && slot !== null) {
                          if (slot.displayTime) {
                            displayText = slot.displayTime;
                          } else if (slot.time) {
                            displayText = slot.time;
                          } else {
                            displayText = JSON.stringify(slot);
                          }
                        }
                        
                        return (
                          <span key={`${dateStr}-${slotIndex}`} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs mr-1 mb-1">
                            {displayText}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              }).filter(Boolean)}
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Timeslot</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time (HH:MM:SS)
                </label>
                <input
                  type="time"
                  step="1800"
                  value={timeSlot.slice(0, 5)}
                  onChange={(e) => setTimeSlot(e.target.value + ':00')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Bookings per Slot
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={maxBookingsPerSlot}
                  onChange={(e) => setMaxBookingsPerSlot(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setTimeSlot('');
                  setIsActive(true);
                  setMaxBookingsPerSlot(3);
                }}
                className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
              >
                Add Timeslot
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setTimeSlot('');
                  setIsActive(true);
                  setMaxBookingsPerSlot(3);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTimeslot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Timeslot</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time (HH:MM:SS)
                </label>
                <input
                  type="time"
                  step="1800"
                  value={timeSlot.slice(0, 5)}
                  onChange={(e) => setTimeSlot(e.target.value + ':00')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Bookings per Slot
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={maxBookingsPerSlot}
                  onChange={(e) => setMaxBookingsPerSlot(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTimeslot(null);
                  setTimeSlot('');
                  setIsActive(true);
                  setMaxBookingsPerSlot(3);
                }}
                className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
              >
                Update Timeslot
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTimeslot(null);
                  setTimeSlot('');
                  setIsActive(true);
                  setMaxBookingsPerSlot(3);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
