"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { psychologistApi } from "../../lib/backendApi";
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function PsychologistDashboard() {
  const { user, logout, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState("sessions");
  const [sessions, setSessions] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is a psychologist
  useEffect(() => {
    if (user && !hasRole('psychologist')) {
      setError('Access denied. This page is for psychologists only.');
      setIsLoading(false);
      return;
    }
    
    if (user) {
      loadDashboardData();
    }
  }, [user, hasRole]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load all data in parallel
      const [sessionsData, availabilityData, packagesData] = await Promise.all([
        psychologistApi.getSessions(),
        psychologistApi.getAvailability(),
        psychologistApi.getPackages()
      ]);

      setSessions(sessionsData.data?.sessions || []);
      setAvailability(availabilityData.data || []);
      setPackages(packagesData.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleUpdateSession = async (sessionId, updateData) => {
    try {
      await psychologistApi.updateSession(sessionId, updateData);
      // Reload sessions to get updated data
      const sessionsData = await psychologistApi.getSessions();
      setSessions(sessionsData.data?.sessions || []);
    } catch (err) {
      console.error('Error updating session:', err);
      setError(err.message);
    }
  };

  const handleUpdateAvailability = async (availabilityData) => {
    try {
      await psychologistApi.updateAvailability(availabilityData);
      // Reload availability
      const availabilityData = await psychologistApi.getAvailability();
      setAvailability(availabilityData.data || []);
    } catch (err) {
      console.error('Error updating availability:', err);
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user || !hasRole('psychologist')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">This page is for psychologists only.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Psychologist Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, Dr. {user.profile?.last_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("sessions")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === "sessions"
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                Sessions
              </button>
              <button
                onClick={() => setActiveTab("availability")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === "availability"
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Calendar className="h-5 w-5 mr-3" />
                Availability
              </button>
              <button
                onClick={() => setActiveTab("packages")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === "packages"
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FileText className="h-5 w-5 mr-3" />
                Packages
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                Profile
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sessions Tab */}
            {activeTab === "sessions" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Sessions</h2>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      Filter
                    </button>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {sessions.filter(s => s.status === 'booked' || s.status === 'rescheduled').map((session) => (
                      <div key={session.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {session.client?.first_name} {session.client?.last_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Child: {session.client?.child_name} ({session.client?.child_age} years)
                            </p>
                            <p className="text-sm text-gray-500">
                              {session.scheduled_date} at {session.scheduled_time}
                            </p>
                            <p className="text-sm text-gray-500">
                              {session.package?.package_type} - ${session.price}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              session.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                              session.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {session.status}
                            </span>
                            <button
                              onClick={() => handleUpdateSession(session.id, { status: 'completed' })}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg mt-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Completed Sessions</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {sessions.filter(s => s.status === 'completed').map((session) => (
                      <div key={session.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {session.client?.first_name} {session.client?.last_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Child: {session.client?.child_name} ({session.client?.child_age} years)
                            </p>
                            <p className="text-sm text-gray-500">
                              {session.scheduled_date} at {session.scheduled_time}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === "availability" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Availability</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Availability
                  </button>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Weekly Schedule</h3>
                  </div>
                  <div className="p-6">
                    {availability.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No availability set. Add your available time slots.</p>
                    ) : (
                      <div className="space-y-4">
                        {availability.map((day) => (
                          <div key={day.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-gray-900">{day.date}</h4>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {day.time_slots.map((time, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                                >
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === "packages" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Therapy Packages</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Package
                  </button>
                </div>

                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Available Packages</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {pkg.package_type.replace('_', ' ').toUpperCase()}
                            </h4>
                            <p className="text-sm text-gray-500">{pkg.description}</p>
                            <p className="text-sm font-medium text-green-600">${pkg.price}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            type="text"
                            defaultValue={user.profile?.first_name}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            type="text"
                            defaultValue={user.profile?.last_name}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            defaultValue={user.email}
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                          />
                        </div>

                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Undergraduate College</label>
                          <input
                            type="text"
                            defaultValue={user.profile?.ug_college}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Postgraduate College</label>
                          <input
                            type="text"
                            defaultValue={user.profile?.pg_college}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">PhD College (Optional)</label>
                          <input
                            type="text"
                            defaultValue={user.profile?.phd_college}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Expertise</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Areas of Expertise</label>
                        <textarea
                          rows={3}
                          defaultValue={user.profile?.area_of_expertise?.join(', ')}
                          placeholder="Enter areas of expertise separated by commas"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Description</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          rows={4}
                          defaultValue={user.profile?.description}
                          placeholder="Describe your professional background and approach"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
