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
  AlertCircle,
  X,
  Phone,
  Mail,
  MapPin,
  Package,
  DollarSign,
  FileText,
  MessageSquare
} from "lucide-react";

import SessionCompletionModal from "../../../components/SessionCompletionModal";
import SessionDetailsModal from "../../../components/SessionDetailsModal";
import SessionNotesModal from "../../../components/SessionNotesModal";
import { useNotification } from "../../../contexts/NotificationContext";

export default function PsychologistSessions() {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [completingSessions, setCompletingSessions] = useState(new Set());
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedRescheduleSession, setSelectedRescheduleSession] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedCompleteSession, setSelectedCompleteSession] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedNotesSession, setSelectedNotesSession] = useState(null);


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
      showError(`Failed to update session: ${err.message}`, 'Update Error');
    }
  };

  const handleCompleteSession = async (sessionId, sessionData) => {
    try {
      setError(null);
      setCompletingSessions(prev => new Set(prev).add(sessionId));
      
      await psychologistApi.completeSession(sessionId, sessionData);
      
      // Show success feedback
      setSuccessMessage('Session finished successfully with summary and notes!');
      showSuccess('Session completed successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Reload sessions to update the UI
      await loadSessions();
    } catch (err) {
      console.error('Error completing session:', err);
      setError(`Failed to finish session: ${err.message}`);
      showError(`Failed to complete session: ${err.message}`, 'Completion Error');
      throw err; // Re-throw to let the modal handle the error
    } finally {
      setCompletingSessions(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }
  };

  const openCompleteSessionModal = (session) => {
    // Only allow finishing for non-completed sessions
    if (session.status === 'completed') {
      setError('This session is already completed');
      showWarning('This session is already completed', 'Session Status');
      return;
    }
    
    setSelectedCompleteSession(session);
    setShowCompleteModal(true);
  };

  const openSessionNotesModal = (session) => {
    setSelectedNotesSession(session);
    setShowNotesModal(true);
  };





  const handleApproveReschedule = async (session) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):', session.scheduled_date);
    const newTime = prompt('Enter new time (HH:MM):', session.scheduled_time);
    
    if (!newDate || !newTime) {
      setError('Date and time are required');
      return;
    }

    try {
      setError(null);
      await psychologistApi.respondToRescheduleRequest(session.id, {
        action: 'approve',
        newDate,
        newTime,
        reason: 'Reschedule approved'
      });
      
      setSuccessMessage('Reschedule request approved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await loadSessions();
      setShowRescheduleModal(false);
    } catch (err) {
      console.error('Error approving reschedule:', err);
      setError(`Failed to approve reschedule: ${err.message}`);
    }
  };

  const handleRejectReschedule = async (session) => {
    const reason = prompt('Enter rejection reason (optional):') || 'Reschedule rejected';
    
    try {
      setError(null);
      await psychologistApi.respondToRescheduleRequest(session.id, {
        action: 'reject',
        reason
      });
      
      setSuccessMessage('Reschedule request rejected successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await loadSessions();
      setShowRescheduleModal(false);
    } catch (err) {
      console.error('Error rejecting reschedule:', err);
      setError(`Failed to reject reschedule: ${err.message}`);
    }
  };

  const handleViewDetails = (session) => {
    console.log('Session data for details:', session);
    console.log('Client data:', session.client);
    console.log('User email:', session.client?.user?.email);
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedSession(null);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
  const pastSessions = sessions.filter(s => 
    s.status === 'completed' || s.status === 'cancelled' || s.status === 'no_show'
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Sessions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your therapy sessions and client appointments.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {sessions.some(s => s.status === 'reschedule_requested') && (
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Reschedule Requests ({sessions.filter(s => s.status === 'reschedule_requested').length})
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Upcoming Sessions ({upcomingSessions.length})
        </h2>
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
                          {session.session_type === 'free_assessment' && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Free Assessment
                            </span>
                          )}
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
                          {session.status === 'reschedule_requested' && (
                            <span className="flex items-center text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Reschedule Requested
                            </span>
                          )}
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
                        onClick={() => handleViewDetails(session)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </button>
                      {/* Only show Finish button for non-completed sessions */}
                      {session.status !== 'completed' && (
                        <button
                          onClick={() => openCompleteSessionModal(session)}
                          disabled={completingSessions.has(session.id)}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md transition-colors duration-200 ${
                            completingSessions.has(session.id)
                              ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                              : 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                          }`}
                          title="Open modal to add summary, notes, and report"
                        >
                          {completingSessions.has(session.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 mr-1 border-b-2 border-white"></div>
                              Finishing...
                            </>
                          ) : (
                            <>
                              Finish
                            </>
                          )}
                        </button>
                      )}
                      
                      {/* Show "Completed" badge for completed sessions */}
                      {session.status === 'completed' && (
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100">
                            Completed
                          </span>
                          <button
                            onClick={() => openSessionNotesModal(session)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            title="View session notes"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View Notes
                          </button>
                        </div>
                      )}
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Past Sessions ({pastSessions.length})
        </h2>
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Completed & Past Sessions</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {pastSessions.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No past sessions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Completed, cancelled, and no-show sessions will appear here.
                </p>
              </div>
            ) : (
              pastSessions.map((session) => (
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
                          {session.status === 'completed' && session.updated_at && (
                            <span className="flex items-center text-sm text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completed {new Date(session.updated_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        session.status === 'no_show' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status === 'no_show' ? 'No Show' : 
                         session.status?.charAt(0).toUpperCase() + session.status?.slice(1) || 'Unknown'}
                      </span>
                      <button
                        onClick={() => handleViewDetails(session)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </button>
                      {/* Only show Finish button for non-completed sessions */}
                      {session.status !== 'completed' && (
                        <button
                          onClick={() => handleFinishSession(session)}
                          disabled={completingSessions.has(session.id)}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md transition-colors duration-200 ${
                            completingSessions.has(session.id)
                              ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                              : 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                          }`}
                          title="Mark session as completed"
                        >
                          {completingSessions.has(session.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 mr-1 border-b-2 border-white"></div>
                              Finishing...
                            </>
                          ) : (
                            <>
                              Finish
                            </>
                          )}
                        </button>
                      )}
                      
                      {/* Show "Completed" badge for completed sessions */}
                      {session.status === 'completed' && (
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100">
                            Completed
                          </span>
                          <button
                            onClick={() => openSessionNotesModal(session)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            title="View session notes"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View Notes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Complete Session Modal */}
      <SessionCompletionModal
        session={selectedCompleteSession}
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setSelectedCompleteSession(null);
        }}
        onSubmit={(formData) => handleCompleteSession(selectedCompleteSession?.id, formData)}
      />

      {/* Session Notes Modal */}
      <SessionNotesModal
        isOpen={showNotesModal}
        onClose={() => {
          setShowNotesModal(false);
          setSelectedNotesSession(null);
        }}
        session={selectedNotesSession}
      />

      {/* Session Details Modal */}
      {showDetailsModal && selectedSession && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Session Details</h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Client Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Client Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Full Name</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.client?.first_name} {selectedSession.client?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-500" />
                      {selectedSession.client?.user?.email || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone Number</p>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-500" />
                      {selectedSession.client?.phone_number || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Child Name</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.client?.child_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Child Age</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.client?.child_age ? `${selectedSession.client.child_age} years` : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Session Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Session Date</p>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {formatDate(selectedSession.scheduled_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Session Time</p>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {formatTime(selectedSession.scheduled_time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedSession.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                      selectedSession.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                      selectedSession.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedSession.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Session ID</p>
                    <p className="text-sm text-gray-900 font-mono">
                      #{selectedSession.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package & Pricing Information */}
              {selectedSession.package && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-green-600" />
                    Package & Pricing
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Package Type</p>
                      <p className="text-sm text-gray-900">
                        {selectedSession.package.package_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Price</p>
                      <p className="text-sm text-gray-900 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        ${selectedSession.price}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedSession.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Additional Notes</h4>
                  <p className="text-sm text-gray-900">{selectedSession.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Request Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reschedule Requests</h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {sessions
                .filter(s => s.status === 'reschedule_requested')
                .map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {session.client?.first_name} {session.client?.last_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Current: {new Date(session.scheduled_date).toLocaleDateString()} at {formatTime(session.scheduled_time)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Client requested reschedule
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Pending
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveReschedule(session)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectReschedule(session)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              
              {sessions.filter(s => s.status === 'reschedule_requested').length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No pending reschedule requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All reschedule requests have been processed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Session Details Modal */}
      <SessionDetailsModal
        session={selectedSession}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedSession(null);
        }}
        isPsychologist={true}
      />
    </div>
  );
}
