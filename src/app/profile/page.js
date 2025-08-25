"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { clientApi, authApi } from "../../lib/backendApi";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut,
  FileText,
  User,
  MessageSquare,
  BarChart3,
  AlertCircle,
  X
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout, hasRole } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (hasRole('client')) {
        // Load client sessions
        const sessionsData = await clientApi.getSessions();
        setSessions(sessionsData.data?.sessions || []);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleViewFullReport = (session) => {
    setSelectedReport(session);
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Not Logged In</h2>
          <p className="mt-2 text-gray-600">Please log in to view your profile.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {user.profile?.first_name} {user.profile?.last_name}
                </h2>
                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("sessions")}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "sessions"
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Sessions
                </button>
                
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "contact"
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Contact
                </button>
                
                <button
                  onClick={() => setActiveTab("report")}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "report"
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  Report
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sessions Tab */}
            {activeTab === "sessions" && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Sessions</h2>
                  <div className="text-sm text-gray-600">
                    Total: {sessions.length} sessions
                  </div>
                </div>

                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                    <p className="text-gray-600">You haven&apos;t booked any sessions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                {session.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                              </span>
                            </div>
                            
                            <h3 className="font-medium text-gray-900 mb-1">
                              Session with {session.psychologist?.first_name} {session.psychologist?.last_name}
                            </h3>
                            
                            {session.package && (
                              <p className="text-sm text-gray-600 mb-2">
                                Package: {session.package.package_type?.replace('_', ' ')}
                              </p>
                            )}
                            
                            {session.price && (
                              <p className="text-sm text-gray-600">
                                Price: ${session.price}
                              </p>
                            )}
                          </div>
                          
                          {session.status === 'completed' && (
                            <button
                              onClick={() => handleViewFullReport(session)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              View Report
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  {user.profile?.phone_number && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Phone className="h-6 w-6 text-blue-600 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-600">{user.profile.phone_number}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <User className="h-6 w-6 text-blue-600 mr-4" />
                    <div>
                      <h3 className="font-medium text-gray-900">Name</h3>
                      <p className="text-gray-600">{user.profile?.first_name} {user.profile?.last_name}</p>
                    </div>
                  </div>
                  
                  {hasRole('client') && user.profile?.child_name && (
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <User className="h-6 w-6 text-blue-600 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Child Information</h3>
                        <p className="text-gray-600">{user.profile.child_name} ({user.profile.child_age} years old)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Report Tab */}
            {activeTab === "report" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Session Reports</h2>
                
                {sessions.filter(s => s.status === 'completed').length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reports available</h3>
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
                              <h3 className="font-medium text-gray-900">
                                Session with {session.psychologist?.first_name} {session.psychologist?.last_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_time)}
                              </p>
                            </div>
                            <button
                              onClick={() => handleViewFullReport(session)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              View Full Report
                            </button>
                          </div>
                          
                          {session.session_summary && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Summary</h4>
                              <p className="text-sm text-gray-600">{session.session_summary}</p>
                            </div>
                          )}
                          
                          {session.session_notes && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                              <p className="text-sm text-gray-600">{session.session_notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Session Report</h3>
                <button
                  onClick={handleCloseReportModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Session Details</h4>
                  <p className="text-sm text-gray-600">
                    {selectedReport.scheduled_date} at {selectedReport.scheduled_time}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedReport.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedReport.status}
                  </span>
                </div>

                {selectedReport.session_summary && (
                  <div>
                    <h4 className="font-medium text-gray-900">Session Summary</h4>
                    <p className="text-sm text-gray-600">{selectedReport.session_summary}</p>
                  </div>
                )}

                {selectedReport.session_notes && (
                  <div>
                    <h4 className="font-medium text-gray-900">Session Notes</h4>
                    <p className="text-sm text-gray-600">{selectedReport.session_notes}</p>
                  </div>
                )}

                {selectedReport.feedback && (
                  <div>
                    <h4 className="font-medium text-gray-900">Feedback</h4>
                    <p className="text-sm text-gray-600">{selectedReport.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
