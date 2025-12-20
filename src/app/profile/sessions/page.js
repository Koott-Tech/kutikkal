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
  X,
  Info
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
  const [showTooltip, setShowTooltip] = useState(null); // Track which tooltip is open

  // Helper function to conditionally apply hover handlers only on desktop
  const getHoverHandlers = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return {}; // No handlers on mobile
    }
    return {
      onMouseEnter: (e) => e.currentTarget.style.borderColor = '#3f2e73',
      onMouseLeave: (e) => e.currentTarget.style.borderColor = '#e5e7eb'
    };
  };
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTooltip && !event.target.closest('.tooltip-container')) {
        setShowTooltip(null);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showTooltip]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const sessionsData = await clientApi.getSessions();
      const sessionsList = sessionsData.data?.sessions || [];
      
      // Sort sessions: upcoming sessions by nearest time first, then completed by most recent
      const now = new Date();
      const sortedSessions = sessionsList.sort((a, b) => {
        // Completed sessions go to the end
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        
        // Both completed - sort by most recent first
        if (a.status === 'completed' && b.status === 'completed') {
          const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time || '00:00:00'}+05:30`);
          const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time || '00:00:00'}+05:30`);
          return dateB - dateA;
        }
        
        // Both upcoming - sort by nearest time first
        const timeA = a.scheduled_time || '00:00:00';
        const timeOnlyA = timeA.split(' ')[0];
        const dateA = new Date(`${a.scheduled_date}T${timeOnlyA}+05:30`);
        
        const timeB = b.scheduled_time || '00:00:00';
        const timeOnlyB = timeB.split(' ')[0];
        const dateB = new Date(`${b.scheduled_date}T${timeOnlyB}+05:30`);
        
        return dateA - dateB; // Nearest first
      });
      
      setSessions(sortedSessions);
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
        // Background will be applied via inline style
        return '';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'reschedule_requested':
        return 'bg-[#f0edff] text-[#3f2e73]'; // Theme color instead of yellow
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusStyle = (status) => {
    if (status?.toLowerCase() === 'scheduled' || status?.toLowerCase() === 'booked') {
      return { backgroundColor: '#3f2e73', color: 'white' };
    }
    if (status?.toLowerCase() === 'reschedule_requested' || status?.toLowerCase() === 'rescheduled') {
      return {};
    }
    // Default fallback for unknown statuses
    if (!status || status.trim() === '') {
      return { backgroundColor: '#3f2e73', color: 'white' };
    }
    return {};
  };

  const isSessionExpired = (session) => {
    if (!session.scheduled_date || !session.scheduled_time) return false;
    
    const now = new Date();
    // Create date in IST timezone (time is already in IST format)
    // Format: "2025-12-31T18:00:00+05:30" to ensure IST timezone
    const timeStr = session.scheduled_time || '00:00:00';
    const timeOnly = timeStr.split(' ')[0]; // Remove any timezone suffix if present
    const sessionDateTime = new Date(`${session.scheduled_date}T${timeOnly}+05:30`);
    
    return sessionDateTime < now;
  };

  // Check if there are any upcoming/scheduled sessions for the same package
  const hasUpcomingSessionsForPackage = (packageId) => {
    if (!packageId) return false;
    return sessions.some(s => 
      s.package_id === packageId && 
      s.status !== 'completed' && 
      !isSessionExpired(s) &&
      ['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(s.status)
    );
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
      // Handle formats: "18:00:00" or "18:00" or "6:00 PM" (shouldn't happen but handle it)
      // First, check if it's already in 12-hour format
      if (typeof timeString === 'string' && (timeString.includes('AM') || timeString.includes('PM'))) {
        // Already formatted, return as is
        return timeString;
      }
      
      // Extract time parts (handle HH:MM:SS or HH:MM)
      const timeOnly = timeString.split(' ')[0]; // Remove any timezone or other text
      const timeParts = timeOnly.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1] || '00';
      
      // Validate hours
      if (isNaN(hours) || hours < 0 || hours > 23) {
        console.error('Invalid time format:', timeString);
        return timeString;
      }
      
      // Convert to 12-hour format
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const displayMinutes = minutes.padStart(2, '0');
      
      return `${displayHour}:${displayMinutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', timeString, error);
      return timeString;
    }
  };

  const getSummary = (session) => session?.summary || session?.session_summary || '';
  const getReport = (session) => session?.report || session?.session_report || '';
  const getSummaryNotes = (session) => session?.summary_notes || session?.session_notes || '';

  const handleMessageClick = async (session) => {
    try {
      const response = await messagesApi.createConversation(session.id);
      
      // Extract conversation ID from response
      // Backend returns: { success: true, message: '...', data: { conversation: {...} } } or { conversationId: '...' }
      let conversationId = null;
      if (response.data?.conversation?.id) {
        conversationId = response.data.conversation.id;
      } else if (response.data?.conversationId) {
        conversationId = response.data.conversationId;
      } else if (response.message?.conversation?.id) {
        conversationId = response.message.conversation.id;
      } else if (response.message?.conversationId) {
        conversationId = response.message.conversationId;
      } else if (response.conversation?.id) {
        conversationId = response.conversation.id;
      } else if (response.conversationId) {
        conversationId = response.conversationId;
      }
      
      // Store conversation ID in sessionStorage so messages page can auto-select it
      if (conversationId) {
        sessionStorage.setItem('selectedConversationId', conversationId);
      }
      
      router.push('/profile/messages');
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err.message);
      // Still navigate to messages page - conversation might already exist
      router.push('/profile/messages');
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
      <div className="absolute inset-0 w-full flex items-center justify-center z-10" style={{ minHeight: 'calc(100vh - 8rem)' }}>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderBottomColor: '#3f2e73' }}></div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6">
        {sessions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-4 sm:mb-6">You haven&apos;t booked any sessions yet.</p>
            <button
              onClick={() => router.push('/psychologists')}
              className="bg-blue-600 lg:hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">View Therapists</span>
              <span className="sm:hidden">View Therapists</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Sessions Section (not expired) */}
            {sessions.filter(s => 
              ['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(s.status) && 
              !isSessionExpired(s)
            ).length > 0 && (
              <div>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#3f2e73' }} />
                    <h5 className="text-gray-900">Upcoming Sessions</h5>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {sessions.filter(s => 
                      ['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(s.status) && 
                      !isSessionExpired(s)
                    ).length} upcoming session{sessions.filter(s => 
                      ['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(s.status) && 
                      !isSessionExpired(s)
                    ).length !== 1 ? 's' : ''}
                  </div>
                </div>
                {/* Mobile Layout - Single Column Cards */}
                <div className="block lg:hidden space-y-4">
                  {sessions
                    .filter(s => 
                      ['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(s.status) && 
                      !isSessionExpired(s)
                    )
                    .map((session) => (
                      <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-colors" {...getHoverHandlers()}>
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
                            <>
                              <span 
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`} 
                                style={getStatusStyle(session.status)}
                              >
                                {session.status === 'booked' || session.status === 'scheduled' ? 'Scheduled' : 
                               session.status === 'reschedule_requested' ? 'Reschedule Requested' :
                                 session.status === 'rescheduled' ? 'Rescheduled' : 
                                 session.status || 'Scheduled'}
                              </span>
                              {((session.package && session.package.package_type) || session.package_id) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {session.package?.completed_sessions !== undefined && session.package?.total_sessions ? (
                                    <span>Package ({session.package.completed_sessions}/{session.package.total_sessions})</span>
                                  ) : (
                                    session.package?.package_type ? `Package - ${session.package.package_type.replace('_', ' ')}` : 'Package Session'
                                  )}
                            </span>
                              )}
                            </>
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
                                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xl">
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
                              {['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(session.status) && !isSessionExpired(session) && (
                            <>
                              <button
                                onClick={() => handleMessageClick(session)}
                                className="flex-1 text-green-600 border border-green-300 px-2 py-1 rounded text-xs font-medium lg:hover:bg-green-50 transition-colors flex items-center justify-center gap-1"
                              >
                                <MessageSquare className="h-3 w-3" />
                                Message
                              </button>
                              {session.status !== 'reschedule_requested' && (
                                <button
                                  onClick={() => handleRescheduleClick(session)}
                                  className="flex-1 px-2 py-1 rounded text-xs font-medium transition-colors text-blue-600 border border-blue-300 lg:hover:bg-blue-50"
                                >
                                  Reschedule
                                </button>
                              )}
                                  {getMeetLink(session) && (
                              <button
                                      onClick={() => handleJoinMeet(session)}
                                      className="flex-1 text-green-700 border border-green-300 px-2 py-1 rounded text-xs font-medium lg:hover:bg-green-50 transition-colors"
                              >
                                      Join Meet
                              </button>
                          )}
                            </>
                          )}
                          
                          {session.session_type !== 'free_assessment' && (session.status === 'booked' || session.status === 'scheduled') && isSessionExpired(session) && (
                            <span className="flex-1 text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs text-center">
                              Session time has passed
                            </span>
                          )}
                          
                          {session.session_type === 'free_assessment' && (session.status === 'booked' || session.status === 'scheduled') && isSessionExpired(session) && (
                            <span className="flex-1 text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs text-center">
                              Assessment time has passed
                            </span>
                          )}
                          
                          
                        </div>
                      </div>
                    ))}
                </div>

                {/* Desktop Layout - Current Design */}
                <div className="hidden lg:block space-y-4">
                  {sessions
                    .filter(s => 
                      ['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(s.status) && 
                      !isSessionExpired(s)
                    )
                    .map((session) => (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-5 sm:p-6 lg:hover:shadow-md transition-all bg-blue-50/30" {...getHoverHandlers()}>
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
                                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xl">
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
                                  <>
                                    <span 
                                      className={`inline-flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)} group`} 
                                      style={getStatusStyle(session.status)}
                                    >
                                      {session.status === 'booked' || session.status === 'scheduled' ? 'Scheduled' : 
                                     session.status === 'reschedule_requested' ? (
                                       <>
                                         Reschedule Requested
                                         <div className="relative tooltip-container">
                                           <Info 
                                             className="h-3.5 w-3.5 text-current cursor-help" 
                                             onClick={(e) => {
                                               e.stopPropagation();
                                               setShowTooltip(showTooltip === session.id ? null : session.id);
                                             }}
                                             onMouseEnter={() => {
                                               if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                                                 setShowTooltip(session.id);
                                               }
                                             }}
                                             onMouseLeave={() => {
                                               if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                                                 setShowTooltip(null);
                                               }
                                             }}
                                           />
                                           {showTooltip === session.id && (
                                             <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-white border-2 border-[#3f2e73] text-gray-900 text-xs rounded-lg shadow-lg z-50 tooltip-container">
                                               <div className="space-y-1.5">
                                                 <p className="font-semibold mb-2 text-[#3f2e73]">Reschedule Request Rules:</p>
                                                 <p>• If reschedule is within 24 hours of session OR</p>
                                                 <p>• If this is your 2nd or more reschedule</p>
                                                 <p className="mt-2 font-semibold">→ Admin approval is required</p>
                                                 <p className="mt-2">If approved by admin, your session will be rescheduled.</p>
                                                 <p className="mt-2 text-[#3f2e73]">If you don't receive a response, please contact us via WhatsApp.</p>
                                               </div>
                                               {/* Tooltip arrow */}
                                               <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#3f2e73]"></div>
                                             </div>
                                           )}
                                         </div>
                                       </>
                                     ) :
                                       session.status === 'rescheduled' ? 'Rescheduled' : 
                                       session.status || 'Scheduled'}
                                    </span>
                                    {((session.package && session.package.package_type) || session.package_id) && (
                                      <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {session.package?.completed_sessions !== undefined && session.package?.total_sessions ? (
                                          <span>Package ({session.package.completed_sessions}/{session.package.total_sessions})</span>
                                        ) : (
                                          session.package?.package_type ? `Package - ${session.package.package_type.replace('_', ' ')}` : 'Package Session'
                                        )}
                                  </span>
                                    )}
                                  </>
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
                                      Free assessment
                                    </span>
                                  )
                                  : `Session with ${session.psychologist?.first_name} ${session.psychologist?.last_name}`}
                              </h5>
                              
                              {session.package && (
                                <p className="text-gray-600 mb-3">
                                  Package: {session.package.package_type?.replace('_', ' ')}
                                </p>
                              )}
                              
                              {Number(session.price) > 0 && (
                                <p className="text-gray-600 mb-2">
                                  Price: ₹{session.price}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {/* Action Buttons for booked/rescheduled sessions */}
                              {['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(session.status) && !isSessionExpired(session) && (
                                <>
                                  <button
                                    onClick={() => handleMessageClick(session)}
                                    className="text-green-600 lg:hover:text-green-900 text-xs sm:text-sm font-medium border border-green-300 px-2 py-1 rounded-md lg:hover:bg-green-50 transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Message</span>
                                  </button>
                                  {session.status !== 'reschedule_requested' && (
                                    <button
                                      onClick={() => handleRescheduleClick(session)}
                                      className="text-blue-600 border border-blue-300 lg:hover:bg-blue-50 lg:hover:text-blue-900 text-xs sm:text-sm font-medium px-2 py-1 rounded-md transition-colors cursor-pointer"
                                    >
                                      {session.reschedule_count > 0 ? 'Request Reschedule' : 'Reschedule'}
                                    </button>
                                  )}
                                  {getMeetLink(session) && (
                                  <button
                                      onClick={() => handleJoinMeet(session)}
                                      className="text-green-700 lg:hover:text-green-900 text-xs sm:text-sm font-medium border border-green-300 px-2 py-1 rounded-md lg:hover:bg-green-50 transition-colors cursor-pointer"
                                  >
                                      Join Meet
                                  </button>
                              )}
                                </>
                              )}
                              
                              {session.session_type !== 'free_assessment' && (session.status === 'booked' || session.status === 'scheduled') && isSessionExpired(session) && (
                                <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-md text-xs sm:text-sm">
                                  Session time has passed
                                </span>
                              )}
                              
                              {session.session_type === 'free_assessment' && (session.status === 'booked' || session.status === 'scheduled') && isSessionExpired(session) && (
                                <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-md text-xs sm:text-sm">
                                  Assessment time has passed
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

            {/* Time Passed Sessions Section */}
            {sessions.filter(s => 
              ['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(s.status) && 
              isSessionExpired(s)
            ).length > 0 && (
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 sm:h-3 sm:w-3 bg-orange-600 rounded-full"></div>
                  </div>
                  <h5 className="text-gray-900">Time Passed Sessions</h5>
                </div>
                {/* Mobile Layout - Single Column Cards */}
                <div className="block lg:hidden space-y-4">
                  {sessions
                    .filter(s => 
                      ['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(s.status) && 
                      isSessionExpired(s)
                    )
                    .map((session) => (
                      <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-colors" {...getHoverHandlers()}>
                        {/* Status Badge */}
                        <div className="flex justify-end mb-3 gap-2">
                          {(session.session_type === 'assessment' || session.type === 'assessment') && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Assessment
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('expired')}`}>
                            Time Expired
                          </span>
                          {((session.package && session.package.package_type) || session.package_id) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {session.package?.completed_sessions !== undefined && session.package?.total_sessions ? (
                                <span>Package ({session.package.completed_sessions}/{session.package.total_sessions})</span>
                              ) : (
                                session.package?.package_type ? `Package - ${session.package.package_type.replace('_', ' ')}` : 'Package Session'
                              )}
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
                                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-xl">
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
                          {session.session_type !== 'free_assessment' && (
                            <span className="flex-1 text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs text-center">
                              Session time has passed
                            </span>
                          )}
                          {session.session_type === 'free_assessment' && (
                            <span className="flex-1 text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs text-center">
                              Assessment time has passed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block space-y-4">
                  {sessions
                    .filter(s => 
                      ['booked', 'scheduled', 'reschedule_requested', 'rescheduled'].includes(s.status) && 
                      isSessionExpired(s)
                    )
                    .map((session) => (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-5 sm:p-6 lg:hover:shadow-md transition-all bg-orange-50/30" {...getHoverHandlers()}>
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
                                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-xl">
                                  {session.psychologist?.first_name?.[0]}{session.psychologist?.last_name?.[0]}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Session Details */}
                          <div className="flex-1 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4">
                                <span className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${getStatusColor('expired')}`}>
                                  Time Expired
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500">
                                  {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                                </span>
                                {((session.package && session.package.package_type) || session.package_id) && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {session.package?.completed_sessions !== undefined && session.package?.total_sessions ? (
                                      <span>Package ({session.package.completed_sessions}/{session.package.total_sessions})</span>
                                    ) : (
                                      session.package?.package_type ? `Package - ${session.package.package_type.replace('_', ' ')}` : 'Package Session'
                                    )}
                                  </span>
                                )}
                              </div>
                              
                              <h5 className="text-gray-900 font-semibold mb-3">
                                {session.session_type === 'free_assessment' ? (
                                  <span className="flex items-center gap-2">
                                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                      Free Assessment
                                    </span>
                                  </span>
                                ) : session.session_type === 'assessment' || session.type === 'assessment' ? (
                                  `Assessment: ${session.assessment?.hero_title || session.assessment?.seo_title || 'Assessment Session'}`
                                ) : (
                                  `Session with ${session.psychologist?.first_name} ${session.psychologist?.last_name}`
                                )}
                              </h5>
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
                      <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-colors" {...getHoverHandlers()}>
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
                            className="flex-1 px-2 py-1 rounded text-xs font-medium transition-colors text-blue-600 border border-blue-300 hover:bg-blue-50"
                          >
                            View Report
                          </button>
                          {!session.feedback && (
                            <button
                              onClick={() => openFeedbackModal(session)}
                              className="flex-1 text-purple-600 border border-purple-300 px-2 py-1 rounded text-xs font-medium lg:hover:bg-purple-50 transition-colors"
                            >
                              Give Feedback
                            </button>
                          )}
                          {session.feedback && (
                            <span className="flex-1 text-green-600 bg-green-100 px-2 py-1 rounded text-xs text-center">
                              ✓ Feedback Submitted
                            </span>
                          )}
                          
                          {/* Book Next Session Button - Only for package sessions with remaining sessions and no upcoming sessions */}
                          {session.package_id && 
                           session.package && 
                           session.package.remaining_sessions > 0 && 
                           !hasUpcomingSessionsForPackage(session.package_id) && (
                            <button
                              onClick={() => {
                                const psychologist = session.psychologist;
                                if (psychologist && session.package_id) {
                                  const doctorIdentifier = psychologist.id;
                                  if (doctorIdentifier) {
                                    router.push(`/therapist-profile?doctor=${doctorIdentifier}&package_id=${session.package_id}`);
                                  }
                                }
                              }}
                              className="flex-1 text-white px-2 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                              style={{ backgroundColor: '#3f2e73' }}
                              {...(typeof window !== 'undefined' && window.innerWidth >= 1024 ? {
                                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#1d1733',
                                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = '#3f2e73'
                              } : {})}
                            >
                              <Calendar className="h-3 w-3" />
                              Book Next Session
                            </button>
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
                      <div key={session.id} className="border border-gray-200 rounded-lg p-5 sm:p-6 lg:hover:shadow-md transition-all bg-green-50/30" {...getHoverHandlers()}>
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
                              
                              {Number(session.price) > 0 && (
                                <p className="text-gray-600 mb-2">
                                  Price: ₹{session.price}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleViewFullReport(session)}
                                className="text-blue-600 border border-blue-300 lg:hover:bg-blue-50 lg:hover:text-blue-900 text-xs sm:text-sm font-medium px-2 py-1 rounded-md transition-colors cursor-pointer"
                              >
                                View Complete Report
                              </button>
                              {!session.feedback && (
                                <button
                                  onClick={() => openFeedbackModal(session)}
                                  className="text-purple-600 lg:hover:text-purple-900 text-xs sm:text-sm font-medium border border-purple-300 px-2 py-1 rounded-md lg:hover:bg-purple-50 transition-colors cursor-pointer"
                                >
                                  Give Feedback
                                </button>
                              )}
                              {session.feedback && (
                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md text-xs sm:text-sm">
                                  ✓ Feedback Submitted
                                </span>
                              )}
                              
                              {/* Book Next Session Button - Only for package sessions with remaining sessions and no upcoming sessions */}
                              {session.package_id && 
                               session.package && 
                               session.package.remaining_sessions > 0 && 
                               !hasUpcomingSessionsForPackage(session.package_id) && (
                                <button
                                  onClick={() => {
                                    const psychologist = session.psychologist;
                                    if (psychologist && session.package_id) {
                                      const doctorIdentifier = psychologist.id;
                                      if (doctorIdentifier) {
                                        router.push(`/therapist-profile?doctor=${doctorIdentifier}&package_id=${session.package_id}`);
                                      }
                                    }
                                  }}
                                  className="text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                                  style={{ backgroundColor: '#3f2e73' }}
                                  {...(typeof window !== 'undefined' && window.innerWidth >= 1024 ? {
                                    onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#1d1733',
                                    onMouseLeave: (e) => e.currentTarget.style.backgroundColor = '#3f2e73'
                                  } : {})}
                                >
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span>Book Next Session</span>
                                </button>
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
                  className="text-gray-400 lg:hover:text-gray-600"
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

