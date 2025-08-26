"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { psychologistApi } from "../../../lib/backendApi";
import { 
  Calendar, 
  Clock, 
  User,
  CheckCircle,
  Edit,
  AlertCircle
} from "lucide-react";

export default function PsychologistSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sessionsData = await psychologistApi.getSessions();
      setSessions(sessionsData.data?.sessions || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSession = async (sessionId, updateData) => {
    try {
      await psychologistApi.updateSession(sessionId, updateData);
      await loadSessions(); // Reload sessions
    } catch (err) {
      console.error('Error updating session:', err);
      setError(err.message);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const upcomingSessions = sessions.filter(s => 
    s.status === 'booked' || s.status === 'rescheduled'
  );
  const completedSessions = sessions.filter(s => s.status === 'completed');

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Sessions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your therapy sessions and client appointments.
          </p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Sessions</h2>
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Scheduled Appointments</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingSessions.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming sessions</h3>
                              <p className="mt-1 text-sm text-gray-500">
                You don&apos;t have any scheduled sessions at the moment.
              </p>
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div key={session.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {session.client?.first_name} {session.client?.last_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Child: {session.client?.child_name} ({session.client?.child_age} years)
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(session.scheduled_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(session.scheduled_time)}
                          </span>
                        </div>
                        {session.package && (
                          <p className="text-sm text-gray-500 mt-1">
                            Package: {session.package.package_type} - ${session.price}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                        session.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                      <button
                        onClick={() => handleUpdateSession(session.id, { status: 'completed' })}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Mark as completed"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Completed Sessions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Completed Sessions</h2>
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Past Sessions</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {completedSessions.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No completed sessions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Completed sessions will appear here.
                </p>
              </div>
            ) : (
              completedSessions.map((session) => (
                <div key={session.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {session.client?.first_name} {session.client?.last_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Child: {session.client?.child_name} ({session.client?.child_age} years)
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(session.scheduled_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(session.scheduled_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
