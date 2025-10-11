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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <h5 className="text-gray-900 mb-6">Session Reports</h5>
        
        {sessions.filter(s => s.status === 'completed').length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h6 className="text-gray-900 mb-2">No reports available</h6>
            <p className="text-gray-600">Session reports will appear here after sessions are completed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions
              .filter(s => s.status === 'completed')
              .map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-gray-900">
                        Session with {session.psychologist?.first_name} {session.psychologist?.last_name}
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewFullReport(session)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium cursor-pointer"
                    >
                      View Complete Report
                    </button>
                  </div>
                  
                  {session.summary && (
                    <div className="mb-3">
                      <h4 className="text-gray-700 mb-1">Summary</h4>
                      <p className="text-gray-600">{session.summary}</p>
                    </div>
                  )}
                  
                  {session.report && (
                    <div className="mb-3">
                      <h4 className="text-gray-700 mb-1">Report</h4>
                      <p className="text-gray-600">{session.report}</p>
                    </div>
                  )}
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
                <h3 className="text-gray-900">Complete Session Report</h3>
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
                  <h4 className="text-gray-900">Session Details</h4>
                  <p className="text-gray-600">
                    {formatDate(selectedReport.scheduled_date)} at {formatTime(selectedReport.scheduled_time)}
                  </p>
                </div>
                
                {selectedReport.summary && (
                  <div>
                    <h4 className="text-gray-900">Session Summary</h4>
                    <p className="text-gray-600">{selectedReport.summary}</p>
                  </div>
                )}

                {selectedReport.report && (
                  <div>
                    <h4 className="text-gray-900">Session Report</h4>
                    <p className="text-gray-600">{selectedReport.report}</p>
                  </div>
                )}

                {selectedReport.feedback && (
                  <div>
                    <h4 className="text-gray-900">Feedback</h4>
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

