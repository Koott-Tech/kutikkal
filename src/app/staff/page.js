'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle, CalendarDays } from 'lucide-react';
import { staffApi } from '@/lib/staffApi';

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState(null);
  
  // For demo purposes, using a hardcoded staff ID - in real app, get from auth context
  const staffId = '1';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dashboardData = await staffApi.getDashboard(staffId);
      setSessions([...dashboardData.upcomingSessions, ...dashboardData.pastSessions]);
      setAvailability(dashboardData.availability);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      
      // Fallback to mock data for demo purposes
      setSessions([
        {
          id: 1,
          patientName: 'John Doe',
          sessionType: 'Individual Therapy',
          date: '2024-01-15',
          time: '10:00 AM',
          duration: 60,
          status: 'completed',
          notes: 'Patient showed improvement in anxiety symptoms'
        },
        {
          id: 2,
          patientName: 'Jane Smith',
          sessionType: 'Couples Therapy',
          date: '2024-01-16',
          time: '2:00 PM',
          duration: 90,
          status: 'scheduled',
          notes: 'First session - relationship communication issues'
        },
        {
          id: 3,
          patientName: 'Mike Johnson',
          sessionType: 'Family Therapy',
          date: '2024-01-17',
          time: '11:00 AM',
          duration: 90,
          status: 'scheduled',
          notes: 'Family conflict resolution'
        }
      ]);
      
      setAvailability([
        { day: 'Monday', slots: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'] },
        { day: 'Tuesday', slots: ['9:00 AM', '11:00 AM', '1:00 PM', '4:00 PM'] },
        { day: 'Wednesday', slots: ['10:00 AM', '12:00 PM', '2:00 PM'] },
        { day: 'Thursday', slots: ['9:00 AM', '10:00 AM', '3:00 PM', '4:00 PM'] },
        { day: 'Friday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionStatusUpdate = async (sessionId, newStatus) => {
    try {
      await staffApi.updateSessionStatus(sessionId, newStatus);
      // Reload data to reflect changes
      await loadDashboardData();
    } catch (err) {
      console.error('Error updating session status:', err);
      setError('Failed to update session status. Please try again.');
    }
  };

  const handleAvailabilityUpdate = async (newAvailability) => {
    try {
      await staffApi.updateAvailability(staffId, newAvailability);
      setAvailability(newAvailability);
    } catch (err) {
      console.error('Error updating availability:', err);
      setError('Failed to update availability. Please try again.');
    }
  };

  const pastSessions = sessions.filter(session => session.status === 'completed');
  const upcomingSessions = sessions.filter(session => session.status === 'scheduled');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your sessions and availability</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Side Menu */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              {/* Navigation Tabs */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'upcoming'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Clock className="w-4 h-4 mr-3" />
                  Upcoming Sessions
                </button>
                
                <button
                  onClick={() => setActiveTab('past')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'past'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-3" />
                  Past Sessions
                </button>
                
                <button
                  onClick={() => setActiveTab('availability')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'availability'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 mr-3" />
                  Availability
                </button>
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Today&apos;s Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Upcoming:</span>
                    <span className="font-medium text-blue-600">{upcomingSessions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium text-green-600">{pastSessions.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Upcoming Sessions Tab */}
            {activeTab === 'upcoming' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
                </div>
                <div className="p-6">
                  {upcomingSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No upcoming sessions scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingSessions.map((session) => (
                        <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <User className="w-5 h-5 text-gray-400" />
                                <h3 className="font-medium text-gray-900">{session.patientName}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                                  {session.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{session.sessionType}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(session.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {session.time} ({session.duration} min)
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                View Details
                              </button>
                              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                                Reschedule
                              </button>
                              <button 
                                onClick={() => handleSessionStatusUpdate(session.id, 'completed')}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                              >
                                Mark Complete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Past Sessions Tab */}
            {activeTab === 'past' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Past Sessions</h2>
                </div>
                <div className="p-6">
                  {pastSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No completed sessions found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastSessions.map((session) => (
                        <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <User className="w-5 h-5 text-gray-400" />
                                <h3 className="font-medium text-gray-900">{session.patientName}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                                  {session.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{session.sessionType}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(session.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {session.time} ({session.duration} min)
                                </span>
                              </div>
                              {session.notes && (
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                  <strong>Notes:</strong> {session.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                                View Report
                              </button>
                              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                                Edit Notes
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Weekly Availability</h2>
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Update Availability
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {availability.map((day, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-3">{day.day}</h3>
                        <div className="flex flex-wrap gap-2">
                          {day.slots.map((slot, slotIndex) => (
                            <span
                              key={slotIndex}
                              className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md border border-green-200"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 text-sm text-gray-500">
                          {day.slots.length} available slots
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Block Time</h4>
                        <p className="text-sm text-gray-600">Mark specific times as unavailable</p>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Clock className="w-6 h-6 text-green-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Add Slots</h4>
                        <p className="text-sm text-gray-600">Add new available time slots</p>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <FileText className="w-6 h-6 text-purple-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Export Schedule</h4>
                        <p className="text-sm text-gray-600">Download your weekly schedule</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
