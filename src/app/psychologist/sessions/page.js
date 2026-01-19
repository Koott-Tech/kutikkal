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
  MessageSquare,
  Trash2,
  MoreVertical,
  Eye,
  Video,
  CheckCircle2,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SessionCompletionModal from "../../../components/SessionCompletionModal";
import SessionDetailsModal from "../../../components/SessionDetailsModal";
import SessionNotesModal from "../../../components/SessionNotesModal";
import ScheduleAssessmentSessionModal from "../../../components/ScheduleAssessmentSessionModal";
import WheelPagination from "../../../components/ui/wheel-pagination";
// Removed RescheduleRequestPopup import - reschedule requests are handled on rescheduling page
import { useNotification } from "../../../contexts/NotificationContext";

export default function PsychologistSessions() {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [completingSessions, setCompletingSessions] = useState(new Set());
  const [markingNoShowSessions, setMarkingNoShowSessions] = useState(new Set());
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // Reschedule requests are now handled on the rescheduling page
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedCompleteSession, setSelectedCompleteSession] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedNotesSession, setSelectedNotesSession] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedScheduleSession, setSelectedScheduleSession] = useState(null);
  const [feedbackToView, setFeedbackToView] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'completed'
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 10;
  // Removed reschedule notification state - notifications are only handled on rescheduling page


  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Request a high limit to ensure we get all sessions including pending ones
      const sessionsData = await psychologistApi.getSessions({ limit: 1000 });
      setSessions(sessionsData.data?.sessions || []);
      // Reset to first page when sessions are reloaded
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Removed loadRescheduleNotifications - notifications are only fetched on rescheduling page

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

  const handleDeleteSession = async (session) => {
    try {
      if (!confirm('Are you sure you want to delete this session?')) return;
      await psychologistApi.deleteSession(session.id);
      await loadSessions();
      showSuccess('Session deleted successfully');
    } catch (err) {
      console.error('Error deleting session:', err);
      setError(err.message);
      showError(`Failed to delete session: ${err.message}`, 'Delete Error');
    }
  };

  const handleCompleteSession = async (sessionId, sessionData) => {
    try {
      setError(null);
      setCompletingSessions(prev => new Set(prev).add(sessionId));
      
      // Map the form data from SessionCompletionModal to backend expected format
      const mappedData = {
        summary: sessionData.summary?.trim?.() || '',
        report: sessionData.report?.trim?.() || '',
        summary_notes: sessionData.summary_notes?.trim?.() || ''
      };
      
      if (!mappedData.summary || !mappedData.report || !mappedData.summary_notes) {
        throw new Error('Summary, report, and summary notes are required.');
      }
      
      await psychologistApi.completeSession(sessionId, mappedData);
      
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

  const handleMarkAsNoShow = async (sessionId, reason = '') => {
    if (!confirm('Are you sure you want to mark this session as no-show? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      setMarkingNoShowSessions(prev => new Set(prev).add(sessionId));
      
      await psychologistApi.markSessionAsNoShow(sessionId, reason);
      
      showSuccess('Session marked as no-show successfully');
      setSuccessMessage('Session marked as no-show');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Reload sessions to update the UI
      await loadSessions();
    } catch (err) {
      console.error('Error marking session as no-show:', err);
      setError(`Failed to mark session as no-show: ${err.message}`);
      showError(`Failed to mark session as no-show: ${err.message}`, 'No-Show Error');
    } finally {
      setMarkingNoShowSessions(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }
  };

  const openSessionNotesModal = (session) => {
    setSelectedNotesSession(session);
    setShowNotesModal(true);
  };

  const getMeetLink = (session) =>
    session?.google_meet_link || session?.google_meet_join_url || session?.google_meet_start_url || session?.google_calendar_link;

  const handleJoinMeet = (session) => {
    const meetUrl = getMeetLink(session);
    if (!meetUrl) {
      alert('No Google Meet link is available for this session yet.');
      return;
    }
    if (typeof window !== 'undefined') {
      const url = meetUrl.startsWith('http') ? meetUrl : `https://${meetUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };





  // Removed reschedule popup handlers - reschedule requests are now handled on the rescheduling page

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

  const isAssignedToCurrentPsychologist = (session) => {
    // Regular therapy sessions always have psychologist_id; ensure it matches current user
    if (session.psychologist_id && session.psychologist_id !== user?.id) {
      return false;
    }
    // Assessment sessions that are still unassigned shouldn't appear in the main sessions list
    if ((session.session_type === 'assessment' || session.type === 'assessment') && !session.psychologist_id) {
      return false;
    }
    return true;
  };

  // Exclude free assessment items from psychologist panel
  const excludeFreeAssessment = (s) => s.session_type !== 'free_assessment';
  // Include all sessions (booked, rescheduled, and pending) in upcoming sessions
  // Pending assessment sessions will also appear here, not in a separate section
  // But only include pending sessions that don't have a scheduled date/time yet (truly need scheduling)
  const allUpcomingSessions = sessions.filter(s => {
    if (!isAssignedToCurrentPsychologist(s)) return false;
    if (!excludeFreeAssessment(s)) return false;
    // Include booked and rescheduled sessions
    if (s.status === 'booked' || s.status === 'rescheduled') return true;
    // For pending sessions, only include if they don't have scheduled_date and scheduled_time
    // If they have both, they're already scheduled (just status hasn't been updated yet)
    if (s.status === 'pending') {
      return !s.scheduled_date || !s.scheduled_time;
    }
    return false;
  });

  // Sort upcoming sessions by date/time (nearest first)
  const sortedUpcomingSessions = [...allUpcomingSessions].sort((a, b) => {
    // Sessions without scheduled_date/time go to the end
    if (!a.scheduled_date || !a.scheduled_time) return 1;
    if (!b.scheduled_date || !b.scheduled_time) return -1;
    
    const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`);
    const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
    return dateA - dateB; // Ascending order (nearest first)
  });

  // Calculate pagination for upcoming sessions
  const totalUpcomingPages = Math.max(1, Math.ceil(sortedUpcomingSessions.length / sessionsPerPage));
  const upcomingStartIndex = (currentPage - 1) * sessionsPerPage;
  const upcomingEndIndex = upcomingStartIndex + sessionsPerPage;
  const paginatedUpcomingSessions = sortedUpcomingSessions.slice(upcomingStartIndex, upcomingEndIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage + 1); // WheelPagination uses 0-indexed, we use 1-indexed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedSessions = sessions.filter(s => s.status === 'completed' && excludeFreeAssessment(s));
  const pastSessions = sessions.filter(s => 
    (s.status === 'completed' || s.status === 'cancelled' || s.status === 'no_show') && 
    excludeFreeAssessment(s) && 
    isAssignedToCurrentPsychologist(s)
  );

  // Sort past sessions by date/time (most recent first)
  const sortedPastSessions = [...pastSessions].sort((a, b) => {
    if (!a.scheduled_date || !a.scheduled_time) return 1;
    if (!b.scheduled_date || !b.scheduled_time) return -1;
    
    const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`);
    const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
    return dateB - dateA; // Descending order (most recent first)
  });

  // Calculate pagination for completed sessions
  const totalCompletedPages = Math.max(1, Math.ceil(sortedPastSessions.length / sessionsPerPage));
  const completedStartIndex = (currentPage - 1) * sessionsPerPage;
  const completedEndIndex = completedStartIndex + sessionsPerPage;
  const paginatedPastSessions = sortedPastSessions.slice(completedStartIndex, completedEndIndex);
  
  // Get current sessions based on active tab
  const currentSessions = activeTab === 'upcoming' ? paginatedUpcomingSessions : paginatedPastSessions;
  const totalPages = activeTab === 'upcoming' ? totalUpcomingPages : totalCompletedPages;
  const totalSessions = activeTab === 'upcoming' ? sortedUpcomingSessions.length : sortedPastSessions.length;


  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h6 className="font-semibold text-gray-900">Sessions</h6>
          <p className="mt-2 text-sm text-gray-700">
            Manage your therapy sessions and client appointments.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Reschedule notifications are now only shown on the rescheduling page */}
          {/* If there are unread reschedule notifications, they will show in the popup automatically */}
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

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('upcoming')}
              className={`${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming
              {sortedUpcomingSessions.length > 0 && (
                <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {sortedUpcomingSessions.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('completed')}
              className={`${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Completed
              {sortedPastSessions.length > 0 && (
                <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                  activeTab === 'completed'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {sortedPastSessions.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Sessions List */}
        <div className="bg-white shadow rounded-lg mt-4">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <p className="font-medium text-gray-900 text-sm sm:text-base">
              {activeTab === 'upcoming' ? 'Scheduled Appointments' : 'Completed & Past Sessions'}
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {currentSessions.length === 0 ? (
              <div className="px-4 sm:px-6 py-8 text-center">
                {activeTab === 'upcoming' ? (
                  <>
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-900">No upcoming sessions</p>
                    <p className="mt-1 text-sm text-gray-500">
                      You don&apos;t have any scheduled sessions at the moment.
                    </p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-900">No past sessions</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Completed, cancelled, and no-show sessions will appear here.
                    </p>
                  </>
                )}
              </div>
            ) : (
              currentSessions.map((session) => (
                <div key={session.id} className="px-4 sm:px-6 py-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {session.client?.first_name} {session.client?.last_name}
                          {session.session_type === 'free_assessment' && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Free Assessment
                            </span>
                          )}
                          {(session.session_type === 'assessment' || session.type === 'assessment') && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Assessment
                            </span>
                          )}
                        </p>
                        {(session.session_type === 'assessment' || session.type === 'assessment') ? (
                          <p className="text-sm text-gray-500">
                            Assessment: {session.assessment_title || session.assessment?.hero_title || 'Assessment'}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Child: {session.client?.child_name} ({session.client?.child_age} years)
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                          {session.scheduled_date && session.scheduled_time ? (
                            <>
                              <span className="flex items-center text-xs sm:text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(session.scheduled_date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center text-xs sm:text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatTime(session.scheduled_time)}
                              </span>
                            </>
                          ) : (session.status === 'pending' && (!session.scheduled_date || !session.scheduled_time)) ? (
                            <span className="flex items-center text-xs sm:text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Pending Schedule
                            </span>
                          ) : null}
                          {session.status === 'reschedule_requested' && (
                            <span className="flex items-center text-xs sm:text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Reschedule Requested
                            </span>
                          )}
                        </div>
                        {session.package && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Package: {session.package.package_type} - ${session.price}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        session.status === 'no_show' ? 'bg-orange-100 text-orange-800' :
                        session.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                        session.status === 'booked' ? (
                          // Check if session time has passed
                          (() => {
                            if (!session.scheduled_date || !session.scheduled_time) return 'bg-blue-100 text-blue-800';
                            const sessionDateTime = new Date(`${session.scheduled_date}T${session.scheduled_time}`);
                            return sessionDateTime < new Date() ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
                          })()
                        ) :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status === 'completed' ? 'Completed' :
                         session.status === 'cancelled' ? 'Cancelled' :
                         session.status === 'no_show' ? 'No Show' :
                         session.status === 'rescheduled' ? 'Rescheduled' :
                         session.status === 'booked' ? (
                           // Check if session time has passed
                           (() => {
                             if (!session.scheduled_date || !session.scheduled_time) return 'Booked';
                             const sessionDateTime = new Date(`${session.scheduled_date}T${session.scheduled_time}`);
                             return sessionDateTime < new Date() ? 'No Show' : 'Booked';
                           })()
                         ) :
                         session.status}
                      </span>
                      {/* View Feedback Button - Outside 3 dots menu, only if feedback exists */}
                      {session.status === 'completed' && (session.feedback || session.rating || session.client_feedback) && (
                        <button
                          onClick={() => setFeedbackToView(session)}
                          className="inline-flex items-center px-3 py-1.5 border border-purple-300 text-xs font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          View Feedback
                        </button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleViewDetails(session)} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {getMeetLink(session) && (
                            <>
                              <DropdownMenuItem onClick={() => handleJoinMeet(session)} className="cursor-pointer">
                                <Video className="h-4 w-4 mr-2" />
                                Join Meet
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {/* Show Schedule Session button only for pending assessment sessions that don't have date/time yet */}
                          {session.status === 'pending' && 
                           (session.session_type === 'assessment' || session.type === 'assessment') &&
                           (!session.scheduled_date || !session.scheduled_time) && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedScheduleSession(session);
                                  setShowScheduleModal(true);
                                }} 
                                className="cursor-pointer"
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Session
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {/* Only show Finish button for non-completed sessions */}
                          {session.status !== 'completed' && session.status !== 'no_show' && session.status !== 'noshow' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => openCompleteSessionModal(session)}
                                disabled={completingSessions.has(session.id)}
                                className="cursor-pointer"
                              >
                                {completingSessions.has(session.id) ? (
                                  <>
                                    <div className="h-4 w-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                                    Finishing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Finish Session
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleMarkAsNoShow(session.id)}
                                disabled={markingNoShowSessions.has(session.id)}
                                className="cursor-pointer text-orange-600"
                              >
                                {markingNoShowSessions.has(session.id) ? (
                                  <>
                                    <div className="h-4 w-4 mr-2 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                                    Marking...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Mark No Show
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {/* Completed session actions */}
                          {session.status === 'completed' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => openSessionNotesModal(session)} 
                                className="cursor-pointer"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Notes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteSession(session)} 
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {totalSessions > sessionsPerPage && (
            <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200 px-4 sm:px-6">
              <WheelPagination
                totalPages={totalPages}
                visibleCount={7}
                currentPage={currentPage - 1} // Convert 1-indexed to 0-indexed
                onPageChange={handlePageChange}
                className="bg-white"
              />
            </div>
          )}
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

      {/* Schedule Assessment Session Modal */}
      <ScheduleAssessmentSessionModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setSelectedScheduleSession(null);
        }}
        session={selectedScheduleSession}
        onScheduleSuccess={() => {
          loadSessions(); // Reload sessions after scheduling
        }}
      />

      {/* Session Details Modal */}
      {showDetailsModal && selectedSession && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <p className="font-medium text-gray-900">Session Details</p>
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
                <p className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Client Information
                </p>
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
                <p className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Session Information
                </p>
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
                  <p className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-green-600" />
                    Package & Pricing
                  </p>
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
                  <p className="font-semibold text-gray-900 mb-3">Additional Notes</p>
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

      {/* Feedback Modal */}
      {feedbackToView && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h5 className="text-sm font-semibold text-gray-900">Client Feedback</h5>
              <button
                onClick={() => setFeedbackToView(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {feedbackToView.rating && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Rating</p>
                  <p className="text-sm text-gray-800">
                    {feedbackToView.rating} out of 5 stars
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Submitted Feedback</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {feedbackToView.feedback || 'No feedback provided.'}
                </p>
              </div>
            </div>
            <div className="flex justify-end px-5 py-4 border-t border-gray-200">
              <button
                onClick={() => setFeedbackToView(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
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

      {/* Reschedule requests are now handled on the rescheduling page */}
    </div>
  );
}
