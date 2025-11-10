"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { clientApi, messagesApi } from "../../../lib/backendApi";
import RescheduleModal from "../../../components/RescheduleModal";
import SessionFeedbackModal from "../../../components/SessionFeedbackModal";
import { 
  Calendar, 
  MessageSquare,
  X
} from "lucide-react";

export default function SessionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [sessionToFeedback, setSessionToFeedback] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const sessionsData = await clientApi.getSessions();
      setSessions(sessionsData.data?.sessions || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isSessionExpired = (session) => {
    if (!session.scheduled_date || !session.scheduled_time) return false;
    
    const now = new Date();
    const sessionDateTime = new Date(`${session.scheduled_date}T${session.scheduled_time}`);
    
    return sessionDateTime < now;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateMobile = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const minute = minutes || '00';
      
      let hour12 = hour;
      let ampm = 'AM';
      
      if (hour === 0) {
        hour12 = 12;
      } else if (hour === 12) {
        ampm = 'PM';
      } else if (hour > 12) {
        hour12 = hour - 12;
        ampm = 'PM';
      }
      
      return `${hour12}:${minute} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const getSummary = (session) => session?.summary || session?.session_summary || '';
  const getReport = (session) => session?.report || session?.session_report || '';
  const getSummaryNotes = (session) => session?.summary_notes || session?.session_notes || '';

  const handleMessageClick = async (session) => {
    try {
      const response = await messagesApi.createConversation(session.id);
      if (response && response.success) {
        router.push('/profile/messages');
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err.message);
    }
  };

  const handleRescheduleClick = (session) => {
    setSessionToReschedule(session);
    setShowRescheduleModal(true);
  };
  const getMeetLink = (session) =>
    session?.google_meet_link || session?.google_meet_join_url || session?.google_meet_start_url || session?.google_calendar_link;

  const handleJoinMeet = (session) => {
    const meetUrl = getMeetLink(session);
    if (!meetUrl) {
      alert('No Google Meet link available for this session yet.');
      return;
    }
    if (typeof window !== 'undefined') {
      const url = meetUrl.startsWith('http') ? meetUrl : `https://${meetUrl}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };


  const handleRescheduleRequest = async (session) => {
    try {
      await clientApi.requestReschedule(session.id);
      await loadSessions();
    } catch (err) {
      console.error('Error requesting reschedule:', err);
      setError(err.message);
    }
  };

  const handleRescheduleSuccess = async () => {
    await loadSessions();
    setShowRescheduleModal(false);
    setSessionToReschedule(null);
  };

  const handleViewFullReport = (session) => {
    setSelectedReport(session);
    setShowReportModal(true);
  };

  const openFeedbackModal = (session) => {
    setSessionToFeedback(session);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (sessionId, feedbackData) => {
    try {
      await clientApi.submitSessionFeedback(sessionId, feedbackData);
      await loadSessions();
      setShowFeedbackModal(false);
      setSessionToFeedback(null);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        {sessions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-4 sm:mb-6">You haven&apos;t booked any sessions yet.</p>
            <button
              onClick={() => router.push('/guide')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">View Therapists</span>
              <span className="sm:hidden">View Therapists</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Scheduled Sessions Section */}
            {sessions.filter(s => ['booked', 'reschedule_requested', 'rescheduled'].includes(s.status)).length > 0 && (
              <div>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    <h5 className="text-gray-900">Scheduled Sessions</h5>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Total: {sessions.length} sessions
                  </div>
                </div>
                {/* Mobile Layout - Single Column Cards */}
                <div className="block lg:hidden space-y-4">
                  {sessions
                    .filter(s => ['booked', 'reschedule_requested', 'rescheduled'].includes(s.status))
                    .map((session) => (
                      <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        {/* Status Badge */}
                        <div className="flex justify-end mb-3 gap-2">
                          {(session.session_type === 'assessment' || session.type === 'assessment') && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Assessment
                            </span>
                          )}
                          {isSessionExpired(session) ? (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('expired')}`}>
                              Time Expired
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status === 'booked' ? 'Scheduled' : 
                               session.status === 'reschedule_requested' ? 'Reschedule Requested' :
                               session.status === 'rescheduled' ? 'Rescheduled' : 'Scheduled'}
                            </span>
                          )}
                        </div>
                        
                        {/* Main Content */}
                        <div className="flex gap-5 items-start">
                          {/* Avatar - Only for regular sessions */}
                          {session.session_type !== 'free_assessment' && session.session_type !== 'assessment' && session.type !== 'assessment' && (
                            <div className="flex-shrink-0">
                              {session.psychologist?.cover_image_url ? (
                                <img 
                                  src={session.psychologist.cover_image_url}
                                  alt={`${session.psychologist.first_name} ${session.psychologist.last_name}`}
                                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl">
                                  {session.psychologist?.first_name?.[0]}{session.psychologist?.last_name?.[0]}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Session Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1">
                              {formatDateMobile(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                            </p>
                            <h6 className="text-gray-900 font-bold mb-2">
                              {session.session_type === 'assessment' || session.type === 'assessment'
                                ? `Assessment: ${session.assessment?.hero_title || session.assessment?.seo_title || 'Assessment Session'}`
                                : session.session_type === 'free_assessment'
                                ? 'Free Assessment'
                                : `Session with ${session.psychologist?.first_name} ${session.psychologist?.last_name}`}
                            </h6>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-6">
                              {/* Action Buttons for booked/rescheduled sessions */}
                              {['booked', 'reschedule_requested', 'rescheduled'].includes(session.status) && !isSessionExpired(session) && (
                            <>
                              <button
                                onClick={() => handleMessageClick(session)}
                                className="flex-1 text-green-600 border border-green-300 px-2 py-1 rounded text-xs font-medium hover:bg-green-50 transition-colors flex items-center justify-center gap-1"
                              >
                                <MessageSquare className="h-3 w-3" />
                                Message
                              </button>
                              <button
                                onClick={() => handleRescheduleClick(session)}
                                className="flex-1 text-blue-600 border border-blue-300 px-2 py-1 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
                              >
                                Reschedule
                              </button>
                                  {getMeetLink(session) && (
                                    <button
                                      onClick={() => handleJoinMeet(session)}
                                      className="flex-1 text-green-700 border border-green-300 px-2 py-1 rounded text-xs font-medium hover:bg-green-50 transition-colors"
                                    >
                                      Join Meet
                                    </button>
                                  )}
                            </>
                          )}
                          
                          {session.session_type !== 'free_assessment' && session.status === 'booked' && isSessionExpired(session) && (
                            <span className="flex-1 text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs text-center">
                              Session time has passed
                            </span>
                          )}
                          
                          {session.session_type === 'free_assessment' && session.status === 'booked' && isSessionExpired(session) && (
                            <span className="flex-1 text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs text-center">
                              Assessment time has passed
                            </span>
                          )}
                          
                          {session.status === 'reschedule_requested' && (
                            <span className="flex-1 text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs text-center">
                              Reschedule Requested
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Desktop Layout - Current Design */}
                <div className="hidden lg:block space-y-4">
                  {sessions
                    .filter(s => ['booked', 'reschedule_requested', 'rescheduled'].includes(s.status))
                    .map((session) => (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-5 sm:p-6 hover:shadow-md transition-shadow bg-blue-50/30">
                        <div className="flex gap-4 items-center">
                          {/* Avatar / Placeholder - Only for regular sessions */}
                          {session.session_type !== 'free_assessment' && session.session_type !== 'assessment' && session.type !== 'assessment' && (
                          <div className="flex-shrink-0">
                              {session.psychologist?.cover_image_url ? (
                                <img 
                                  src={session.psychologist.cover_image_url}
                                  alt={`${session.psychologist.first_name} ${session.psychologist.last_name}`}
                                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl">
                                  {session.psychologist?.first_name?.[0]}{session.psychologist?.last_name?.[0]}
                                </div>
                            )}
                          </div>
                          )}
                          
                          {/* Session Details */}
                          <div className="flex-1 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4">
                                {isSessionExpired(session) ? (
                                  <span className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${getStatusColor('expired')}`}>
                                    Time Expired
                                  </span>
                                ) : (
                                  <span className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                    {session.status === 'booked' ? 'Scheduled' : 
                                     session.status === 'reschedule_requested' ? 'Reschedule Requested' :
                                     session.status === 'rescheduled' ? 'Rescheduled' : 'Scheduled'}
                                  </span>
                                )}
                                <span className="text-xs sm:text-sm text-gray-500">
                                  {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                                </span>
                                {session.reschedule_count > 0 && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Rescheduled {session.reschedule_count} time{session.reschedule_count > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              
                              <h5 className="text-gray-900 font-semibold mb-3">
                                {session.session_type === 'assessment' || session.type === 'assessment'
                                  ? (
                                    <span className="flex items-center gap-2">
                                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Assessment
                                      </span>
                                      {session.assessment?.hero_title || session.assessment?.seo_title || 'Assessment Session'}
                                    </span>
                                  )
                                  : session.session_type === 'free_assessment'
                                  ? (
                                    <span className="flex items-center gap-2">
                                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Free Assessment
                                      </span>
                                      Free assessment (doctor to be assigned)
                                    </span>
                                  )
                                  : `Session with ${session.psychologist?.first_name} ${session.psychologist?.last_name}`}
                              </h5>
                              
                              {session.package && (
                                <p className="text-gray-600 mb-3">
                                  Package: {session.package.package_type?.replace('_', ' ')}
                                </p>
                              )}
                              
                              {session.price && (
                                <p className="text-gray-600 mb-2">
                                  Price: ${session.price}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {/* Action Buttons for booked/rescheduled sessions */}
                              {['booked', 'reschedule_requested', 'rescheduled'].includes(session.status) && !isSessionExpired(session) && (
                                <>
                                  <button
                                    onClick={() => handleMessageClick(session)}
                                    className="text-green-600 hover:text-green-900 text-xs sm:text-sm font-medium border border-green-300 px-2 py-1 rounded-md hover:bg-green-50 transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Message</span>
                                  </button>
                                  <button
                                    onClick={() => handleRescheduleClick(session)}
                                    className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm font-medium border border-blue-300 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                                  >
                                    {session.reschedule_count > 0 ? 'Request Reschedule' : 'Reschedule'}
                                  </button>
                                  {getMeetLink(session) && (
                                    <button
                                      onClick={() => handleJoinMeet(session)}
                                      className="text-green-700 hover:text-green-900 text-xs sm:text-sm font-medium border border-green-300 px-2 py-1 rounded-md hover:bg-green-50 transition-colors cursor-pointer"
                                    >
                                      Join Meet
                                    </button>
                                  )}
                                </>
                              )}
                              
                              {session.session_type !== 'free_assessment' && session.status === 'booked' && isSessionExpired(session) && (
                                <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-md text-xs sm:text-sm">
                                  Session time has passed
                                </span>
                              )}
                              
                              {session.session_type === 'free_assessment' && session.status === 'booked' && isSessionExpired(session) && (
                                <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-md text-xs sm:text-sm">
                                  Assessment time has passed
                                </span>
                              )}
                              
                              {session.status === 'reschedule_requested' && (
                                <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-md text-sm">
                                  Reschedule Requested
                                </span>
                              )}
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Completed Sessions Section */}
            {sessions.filter(s => s.status === 'completed').length > 0 && (
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 sm:h-3 sm:w-3 bg-green-600 rounded-full"></div>
                  </div>
                  <h5 className="text-gray-900">Completed Sessions</h5>
                </div>
                {/* Mobile Layout - Single Column Cards */}
                <div className="block lg:hidden space-y-4">
                  {sessions
                    .filter(s => s.status === 'completed')
                    .map((session) => (
                      <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        {/* Status Badge */}
                        <div className="flex justify-end mb-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                        
                        {/* Main Content */}
                        <div className="flex gap-5 items-start">
                          {/* Avatar - Only for regular sessions */}
                          {session.session_type !== 'free_assessment' && session.session_type !== 'assessment' && session.type !== 'assessment' && (
                            <div className="flex-shrink-0">
                              {session.psychologist?.cover_image_url ? (
                                <img 
                                  src={session.psychologist.cover_image_url}
                                  alt={`${session.psychologist.first_name} ${session.psychologist.last_name}`}
                                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-xl">
                                  {session.psychologist?.first_name?.[0]}{session.psychologist?.last_name?.[0]}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Session Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1">
                              {formatDateMobile(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                            </p>
                            <h6 className="text-gray-900 font-bold mb-2">
                              {session.session_type === 'assessment' || session.type === 'assessment'
                                ? `Assessment: ${session.assessment?.hero_title || session.assessment?.seo_title || 'Assessment Session'}`
                                : session.session_type === 'free_assessment' ? 'Free Assessment' : `Session with ${session.psychologist?.first_name} ${session.psychologist?.last_name}`}
                            </h6>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-6">
                          <button
                            onClick={() => handleViewFullReport(session)}
                            className="flex-1 text-blue-600 border border-blue-300 px-2 py-1 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
                          >
                            View Report
                          </button>
                          {!session.feedback && (
                            <button
                              onClick={() => openFeedbackModal(session)}
                              className="flex-1 text-purple-600 border border-purple-300 px-2 py-1 rounded text-xs font-medium hover:bg-purple-50 transition-colors"
                            >
                              Give Feedback
                            </button>
                          )}
                          {session.feedback && (
                            <span className="flex-1 text-green-600 bg-green-100 px-2 py-1 rounded text-xs text-center">
                              ✓ Feedback Submitted
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Desktop Layout - Current Design */}
                <div className="hidden lg:block space-y-4">
                  {sessions
                    .filter(s => s.status === 'completed')
                    .map((session) => (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-5 sm:p-6 hover:shadow-md transition-shadow bg-green-50/30">
                        <div className="flex gap-4 items-center">
                          {/* Avatar / Placeholder - Only for regular sessions */}
                          {session.session_type !== 'free_assessment' && session.session_type !== 'assessment' && session.type !== 'assessment' && (
                          <div className="flex-shrink-0">
                              {session.psychologist?.cover_image_url ? (
                                <img 
                                  src={session.psychologist.cover_image_url}
                                  alt={`${session.psychologist.first_name} ${session.psychologist.last_name}`}
                                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-xl">
                                  {session.psychologist?.first_name?.[0]}{session.psychologist?.last_name?.[0]}
                                </div>
                            )}
                          </div>
                          )}
                          
                          {/* Session Details */}
                          <div className="flex-1 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4">
                                <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Completed
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500">
                                  {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                                </span>
                                {session.reschedule_count > 0 && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Rescheduled {session.reschedule_count} time{session.reschedule_count > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              
                              <h5 className="text-gray-900 font-semibold mb-3">
                                {session.session_type === 'free_assessment' ? (
                                  <span className="flex items-center gap-2">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                      Free Assessment
                                    </span>
                                    Session with {session.psychologist?.first_name} {session.psychologist?.last_name}
                                  </span>
                                ) : (
                                  `Session with ${session.psychologist?.first_name} ${session.psychologist?.last_name}`
                                )}
                              </h5>
                              
                              {session.package && (
                                <p className="text-gray-600 mb-3">
                                  Package: {session.package.package_type?.replace('_', ' ')}
                                </p>
                              )}
                              
                              {session.price && (
                                <p className="text-gray-600 mb-2">
                                  Price: ${session.price}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleViewFullReport(session)}
                                className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm font-medium border border-blue-300 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                View Complete Report
                              </button>
                              {!session.feedback && (
                                <button
                                  onClick={() => openFeedbackModal(session)}
                                  className="text-purple-600 hover:text-purple-900 text-xs sm:text-sm font-medium border border-purple-300 px-2 py-1 rounded-md hover:bg-purple-50 transition-colors cursor-pointer"
                                >
                                  Give Feedback
                                </button>
                              )}
                              {session.feedback && (
                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md text-xs sm:text-sm">
                                  ✓ Feedback Submitted
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        session={sessionToReschedule}
        onClose={() => {
          setShowRescheduleModal(false);
          setSessionToReschedule(null);
        }}
        onRescheduleSuccess={handleRescheduleSuccess}
      />

      {showFeedbackModal && (
        <SessionFeedbackModal
          isOpen={showFeedbackModal}
          session={sessionToFeedback}
          onClose={() => {
            setShowFeedbackModal(false);
            setSessionToFeedback(null);
          }}
          onSubmit={handleSubmitFeedback}
        />
      )}

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h5 className="text-gray-900">Complete Session Report</h5>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <h6 className="text-gray-900">Session Details</h6>
                  <p className="text-gray-600">
                    {formatDate(selectedReport.scheduled_date)} at {formatTime(selectedReport.scheduled_time)}
                  </p>
                </div>
                
                <div>
                  <h6 className="text-gray-900">Session Summary</h6>
                  {getSummary(selectedReport) ? (
                    <p className="text-gray-600">{getSummary(selectedReport)}</p>
                  ) : (
                    <p className="text-gray-500 italic">No summary available for this session.</p>
                  )}
                </div>

                {getReport(selectedReport) && (
                  <div>
                    <h6 className="text-gray-900">Session Report</h6>
                    <p className="text-gray-600">{getReport(selectedReport)}</p>
                  </div>
                )}

                {getSummaryNotes(selectedReport) && (
                  <div>
                    <h6 className="text-gray-900">Additional Notes</h6>
                    <p className="text-gray-600">{getSummaryNotes(selectedReport)}</p>
                  </div>
                )}

                {selectedReport.feedback && (
                  <div>
                    <h6 className="text-gray-900">Feedback</h6>
                    <p className="text-gray-600">{selectedReport.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

