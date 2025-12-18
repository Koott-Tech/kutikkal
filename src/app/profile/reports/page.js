"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { clientApi } from "../../../lib/backendApi";
import { FileText, X } from "lucide-react";

export default function ReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const getSummary = (session) => session?.summary || session?.session_summary || '';
  const getReport = (session) => session?.report || session?.session_report || '';
  const getSummaryNotes = (session) => session?.summary_notes || session?.session_notes || '';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
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

  const handleViewFullReport = (session) => {
    setSelectedReport(session);
    setShowReportModal(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#3f2e73' }}></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-gray-900 mb-6">Session Reports</h4>
        
        {sessions.filter(s => s.status === 'completed').length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h5 className="text-gray-900 mb-2">No reports available</h5>
            <p className="text-gray-600">Session reports will appear here after sessions are completed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions
              .filter(s => s.status === 'completed')
              .map((session) => (
                <div 
                  key={session.id} 
                  className="border border-gray-200 rounded-lg p-4 sm:p-5 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3f2e73'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <div className="flex items-center gap-4">
                    {/* Psychologist Avatar - Left side */}
                    <div className="flex-shrink-0">
                      {session.psychologist?.cover_image_url ? (
                        <img 
                          src={session.psychologist.cover_image_url}
                          alt={`${session.psychologist.first_name} ${session.psychologist.last_name}`}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-xl">
                          {session.psychologist?.first_name?.[0]}{session.psychologist?.last_name?.[0]}
                        </div>
                      )}
                    </div>
                    
                    {/* Session Details - Middle */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-gray-900 mb-1 font-semibold">
                        Session with {session.psychologist?.first_name} {session.psychologist?.last_name}
                      </h5>
                      <p className="text-gray-600 text-sm">
                        {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                      </p>
                    </div>
                    
                    {/* View Report Button - Right side, vertically centered */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleViewFullReport(session)}
                        className="text-sm font-medium cursor-pointer transition-colors px-3 py-1.5 rounded-lg border"
                        style={{ color: '#3f2e73', borderColor: '#3f2e73' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#1d1733'; e.currentTarget.style.borderColor = '#1d1733'; e.currentTarget.style.backgroundColor = '#f5f3ff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#3f2e73'; e.currentTarget.style.borderColor = '#3f2e73'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        View Complete Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

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
              <div className="space-y-6">
                {/* Session Details */}
                <div className="border-b border-gray-200 pb-4">
                  <h6 className="text-gray-900 font-semibold mb-2">Session Details</h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-gray-900">{formatDate(selectedReport.scheduled_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-gray-900">{formatTime(selectedReport.scheduled_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Psychologist</p>
                      <p className="text-gray-900">
                        {selectedReport.psychologist?.first_name} {selectedReport.psychologist?.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-gray-900 capitalize">{selectedReport.status}</p>
                    </div>
                  </div>
                </div>
                
                {/* Session Summary */}
                {getSummary(selectedReport) && (
                  <div>
                    <h6 className="text-gray-900 font-semibold mb-2">Session Summary</h6>
                    <p className="text-gray-600 whitespace-pre-wrap">{getSummary(selectedReport)}</p>
                  </div>
                )}

                {/* Session Report */}
                {getReport(selectedReport) && (
                  <div>
                    <h6 className="text-gray-900 font-semibold mb-2">Session Report</h6>
                    <p className="text-gray-600 whitespace-pre-wrap">{getReport(selectedReport)}</p>
                  </div>
                )}

                {/* Additional Notes - NOT VISIBLE TO CLIENT (Psychologist only) */}
                {/* Removed from client view - these are private notes for psychologists only */}

                {/* Client Feedback */}
                {selectedReport.feedback && (
                  <div>
                    <h6 className="text-gray-900 font-semibold mb-2">Your Feedback</h6>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedReport.feedback}</p>
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

