"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { psychologistApi } from "../../../lib/backendApi";
import { 
  Calendar, 
  Clock, 
  User,
  Package,
  CheckCircle,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Trash2
} from "lucide-react";
import SessionCompletionModal from "../../../components/SessionCompletionModal";
import SessionDetailsModal from "../../../components/SessionDetailsModal";
import ScheduleAssessmentSessionModal from "../../../components/ScheduleAssessmentSessionModal";
import { useNotification } from "../../../contexts/NotificationContext";

export default function PsychologistAssessments() {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [assessments, setAssessments] = useState([]);
  const [assessmentProgress, setAssessmentProgress] = useState({}); // { assessmentId: { completed: 1, total: 3, pending: [session1, session2] } }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingSessions, setCompletingSessions] = useState(new Set());
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedCompleteSession, setSelectedCompleteSession] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedScheduleSession, setSelectedScheduleSession] = useState(null);

  useEffect(() => {
    if (user) {
      loadAssessments();
    }
  }, [user]);

  const loadAssessments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch all sessions (includes assessment sessions)
      const sessionsData = await psychologistApi.getSessions({ limit: 1000 });
      const allSessions = sessionsData.data?.sessions || [];
      
      // Filter only assessment sessions
      const assessmentSessions = allSessions.filter(s => 
        s.session_type === 'assessment' || s.type === 'assessment'
      );

      // Group by assessment_id AND client_id (or payment_id) to get correct count per package
      // Each assessment package has exactly 3 sessions (1 booked + 2 pending)
      const TOTAL_SESSIONS_PER_PACKAGE = 3;
      const assessmentMap = new Map();
      const progressMap = {};
      
      assessmentSessions.forEach(session => {
        const assessmentId = session.assessment_id;
        const clientId = session.client_id;
        const paymentId = session.payment_id;
        
        if (!assessmentId || !clientId) return;
        
        // Create a unique key for each assessment package (assessment + client combination)
        // Use payment_id if available (all 3 sessions share the same payment_id)
        const packageKey = paymentId ? `${assessmentId}_${paymentId}` : `${assessmentId}_${clientId}`;
        
        // Initialize progress tracking for this assessment package
        if (!progressMap[packageKey]) {
          progressMap[packageKey] = {
            completed: 0,
            total: TOTAL_SESSIONS_PER_PACKAGE, // fixed denominator 3
            pending: [],
            firstSession: null,
            assessment_id: assessmentId,
            client_id: clientId
          };
        }
        // Do not increment total; keep fixed at 3
        
        // Track completed sessions
        if (session.status === 'completed') {
          progressMap[packageKey].completed++;
        }
        
        // Track pending sessions (for scheduling next session)
        if (session.status === 'pending') {
          progressMap[packageKey].pending.push(session);
        }
        
        // Track the first session (session_number === 1 or earliest scheduled_date)
        if (!progressMap[packageKey].firstSession) {
          progressMap[packageKey].firstSession = session;
        } else {
          const existingSession = progressMap[packageKey].firstSession;
          // Prefer session with session_number === 1
          if (session.session_number === 1) {
            progressMap[packageKey].firstSession = session;
          } else if (existingSession.session_number !== 1) {
            // If neither is session 1, prefer the earliest scheduled date
            const existingDate = existingSession.scheduled_date ? new Date(existingSession.scheduled_date) : new Date(0);
            const currentDate = session.scheduled_date ? new Date(session.scheduled_date) : new Date(0);
            if (currentDate < existingDate) {
              progressMap[packageKey].firstSession = session;
            }
          }
        }
      });
      
      // Convert to array using first session for each assessment package
      const firstSessions = Object.values(progressMap)
        .map(progress => progress.firstSession)
        .filter(session => session !== null)
        .sort((a, b) => {
          const dateA = a.scheduled_date ? new Date(a.scheduled_date) : new Date(0);
          const dateB = b.scheduled_date ? new Date(b.scheduled_date) : new Date(0);
          return dateB - dateA; // Descending order
        });
      
      // Create a map for easy lookup by assessment_id + client_id
      const progressByAssessment = {};
      Object.values(progressMap).forEach(progress => {
        const key = `${progress.assessment_id}_${progress.client_id}`;
        progressByAssessment[key] = progress;
      });
      
      setAssessments(firstSessions);
      // Store progress by assessment_id + client_id for easy lookup
      setAssessmentProgress(progressByAssessment);
    } catch (err) {
      console.error('Error loading assessments:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSession = async (sessionId, sessionData) => {
    try {
      setError(null);
      setCompletingSessions(prev => new Set(prev).add(sessionId));
      
      const mappedData = {
        session_summary: sessionData.summary || sessionData.session_summary || '',
        session_notes: sessionData.summary_notes || sessionData.session_notes || '',
        status: sessionData.status || 'completed'
      };
      
      await psychologistApi.completeSession(sessionId, mappedData);
      showSuccess('Assessment session completed successfully!');
      
      await loadAssessments();
      setShowCompleteModal(false);
      setSelectedCompleteSession(null);
    } catch (err) {
      console.error('Error completing session:', err);
      setError(`Failed to complete session: ${err.message}`);
      showError(`Failed to complete session: ${err.message}`, 'Completion Error');
      throw err;
    } finally {
      setCompletingSessions(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }
  };

  const handleScheduleSuccess = async () => {
    await loadAssessments();
    showSuccess('Assessment session scheduled successfully!');
  };

  const handleDeleteAssessmentSession = async (session) => {
    try {
      if (!confirm('Are you sure you want to delete this assessment session?')) return;
      await psychologistApi.deleteAssessmentSession(session.id);
      await loadAssessments();
      showSuccess('Assessment session deleted successfully');
    } catch (err) {
      console.error('Error deleting assessment session:', err);
      setError(err.message);
      showError(`Failed to delete assessment session: ${err.message}`, 'Delete Error');
    }
  };

  const openScheduleModal = (session) => {
    const packageKey = `${session.assessment_id}_${session.client_id}`;
    const progress = assessmentProgress[packageKey];
    
    // Find the next pending session to schedule
    if (progress && progress.pending.length > 0) {
      // Sort pending sessions by created_at to get the next one
      const sortedPending = [...progress.pending].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateA - dateB;
      });
      
      setSelectedScheduleSession(sortedPending[0]);
      setShowScheduleModal(true);
    } else {
      showError('No pending sessions to schedule', 'Schedule Error');
    }
  };

  const openCompleteSessionModal = (session) => {
    if (session.status === 'completed') {
      showError('This session is already completed', 'Session Status');
      return;
    }
    
    setSelectedCompleteSession(session);
    setShowCompleteModal(true);
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedSession(null);
  };

  const formatTime = (time) => {
    if (!time) return 'Not scheduled';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      booked: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Booked' },
      pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pending' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      reserved: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Reserved' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
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

  const upcomingAssessments = assessments.filter(a => 
    a.status === 'booked' || a.status === 'reserved'
  );
  const completedAssessments = assessments.filter(a => a.status === 'completed');

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h6 className="font-semibold text-gray-900">Assessments</h6>
          <p className="mt-2 text-sm text-gray-700">
            View and manage assessment sessions. This page shows the first session of each assessment package.
          </p>
        </div>
      </div>

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

      {/* Upcoming Assessments */}
      {upcomingAssessments.length > 0 && (
        <div className="mt-8">
          <p className="font-medium text-gray-900 mb-4">
            Upcoming Assessments ({upcomingAssessments.length})
          </p>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {upcomingAssessments.map((session) => (
                <div key={session.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <Package className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-base font-medium text-gray-900">
                            {session.client?.first_name} {session.client?.last_name}
                          </p>
                          {getStatusBadge(session.status)}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Assessment
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-700">
                            {session.assessment_title || session.assessment?.hero_title || 'Assessment'}
                          </p>
                          {assessmentProgress[`${session.assessment_id}_${session.client_id}`] && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {assessmentProgress[`${session.assessment_id}_${session.client_id}`].completed}/{assessmentProgress[`${session.assessment_id}_${session.client_id}`].total} sessions
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(session.scheduled_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(session.scheduled_time)}</span>
                          </div>
                          {session.client?.phone_number && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{session.client.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {session.status !== 'completed' && (
                        <button
                          onClick={() => openCompleteSessionModal(session)}
                          disabled={completingSessions.has(session.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {completingSessions.has(session.id) ? 'Completing...' : 'Complete Session'}
                        </button>
                      )}
                      {assessmentProgress[`${session.assessment_id}_${session.client_id}`]?.pending.length > 0 && (
                        <button
                          onClick={() => openScheduleModal(session)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Book Next Session
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(session)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteAssessmentSession(session)}
                        className="inline-flex items-center px-2 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Delete assessment session"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Assessments */}
      {completedAssessments.length > 0 && (
        <div className="mt-8">
          <p className="font-medium text-gray-900 mb-4">
            Completed Assessments ({completedAssessments.length})
          </p>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {completedAssessments.map((session) => (
                <div key={session.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-base font-medium text-gray-900">
                            {session.client?.first_name} {session.client?.last_name}
                          </p>
                          {getStatusBadge(session.status)}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Assessment
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-700">
                            {session.assessment_title || session.assessment?.hero_title || 'Assessment'}
                          </p>
                          {assessmentProgress[`${session.assessment_id}_${session.client_id}`] && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {assessmentProgress[`${session.assessment_id}_${session.client_id}`].completed}/{assessmentProgress[`${session.assessment_id}_${session.client_id}`].total} sessions
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(session.scheduled_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(session.scheduled_time)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {assessmentProgress[`${session.assessment_id}_${session.client_id}`]?.pending.length > 0 && (
                        <button
                          onClick={() => openScheduleModal(session)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Book Next Session
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(session)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {assessments.length === 0 && (
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-sm font-medium text-gray-900">No assessment sessions</p>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any assessment sessions yet.
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCompleteModal && selectedCompleteSession && (
        <SessionCompletionModal
          isOpen={showCompleteModal}
          onClose={() => {
            setShowCompleteModal(false);
            setSelectedCompleteSession(null);
          }}
          session={selectedCompleteSession}
          onSubmit={async (formData) => {
            await handleCompleteSession(selectedCompleteSession.id, formData);
          }}
        />
      )}

      {showDetailsModal && selectedSession && (
        <SessionDetailsModal
          isOpen={showDetailsModal}
          onClose={closeDetailsModal}
          session={selectedSession}
        />
      )}

      {showScheduleModal && selectedScheduleSession && (
        <ScheduleAssessmentSessionModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedScheduleSession(null);
          }}
          session={selectedScheduleSession}
          onScheduleSuccess={handleScheduleSuccess}
        />
      )}
    </div>
  );
}

