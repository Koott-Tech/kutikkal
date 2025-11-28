'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/lib/backendApi';
import { Calendar, RefreshCw, ExternalLink, Clock } from 'lucide-react';

const PsychologistCalendarView = ({ psychologistId, psychologistName, onClose }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hasGoogleCalendar, setHasGoogleCalendar] = useState(false);

  useEffect(() => {
    fetchCalendarEvents();
  }, [psychologistId, currentMonth]);

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const response = await adminApi.getPsychologistCalendarEvents(
        psychologistId,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      if (response && response.success) {
        setEvents(response.data.events || []);
        setHasGoogleCalendar(response.data.hasGoogleCalendar);
      } else {
        setError('Failed to fetch calendar events');
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setError('Failed to fetch calendar events');
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, month, 1).getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = event.start.dateTime || event.start.date;
      return eventDate.startsWith(dateStr);
    });
  };

  const getEventColor = (summary, source) => {
    if (source === 'little_care') {
      return 'bg-green-50 border-green-200';
    }
    return 'bg-blue-50 border-blue-200';
  };

  const formatEventTime = (event) => {
    const startTime = new Date(event.start.dateTime || event.start.date);
    const endTime = event.end ? new Date(event.end.dateTime || event.end.date) : null;
    
    const startTimeStr = startTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    
    if (endTime) {
      const endTimeStr = endTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      return `${startTimeStr} - ${endTimeStr}`;
    }
    
    return startTimeStr;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              {psychologistName}'s Calendar
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Calendar Status */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  {hasGoogleCalendar ? 'Google Calendar Connected' : 'Google Calendar Not Connected'}
                </span>
              </div>
              <button
                onClick={fetchCalendarEvents}
                disabled={loading}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3" />
                    Refresh
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Month Calendar View */}
          <div className="mb-6">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                
                {(() => {
                  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
                  const days = [];
                  
                  // Empty cells before first day
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(
                      <div key={`empty-${i}`} className="aspect-square p-1"></div>
                    );
                  }
                  
                  // Days of month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    const eventsForDay = getEventsForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    
                    days.push(
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square p-1 text-sm rounded-lg transition-colors ${
                          isToday ? 'bg-blue-100 font-bold' : ''
                        } ${
                          isSelected ? 'ring-2 ring-blue-500' : ''
                        } ${
                          eventsForDay.length > 0 ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className={eventsForDay.length > 0 ? 'text-red-700 font-semibold' : ''}>{day}</span>
                          {eventsForDay.length > 0 && (
                            <div className="flex gap-0.5 mt-0.5">
                              {eventsForDay.slice(0, 3).map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-red-500 rounded-full"></div>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>
          </div>
          
          {/* Selected Date Events */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h4>
            
            {(() => {
              const dayEvents = getEventsForDate(selectedDate);
              return dayEvents.length > 0 ? (
                <div className="space-y-2">
                  {dayEvents.map((event, index) => (
                    <div
                      key={event.id || index}
                      className={`p-3 rounded-lg border ${getEventColor(event.summary, event.source)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-sm">{event.summary || 'Untitled Event'}</h5>
                            {event.source === 'external' && (
                              <ExternalLink className="h-3 w-3 text-blue-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <p className="text-xs text-gray-600">
                              {formatEventTime(event)}
                            </p>
                          </div>
                          {event.location && (
                            <p className="text-xs mt-1 text-gray-600">📍 {event.location}</p>
                          )}
                          {event.description && (
                            <p className="text-xs mt-2 text-gray-600 line-clamp-2">{event.description}</p>
                          )}
                          {event.status && (
                            <p className="text-xs mt-1 text-gray-500">Status: {event.status}</p>
                          )}
                        </div>
                        <div className="ml-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            event.source === 'little_care' 
                              ? 'bg-green-200 text-green-900' 
                              : 'bg-blue-200 text-blue-900'
                          }`}>
                            {event.source === 'little_care' ? 'Little Care' : 'External'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">No events on this date</p>
                </div>
              );
            })()}
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistCalendarView;
