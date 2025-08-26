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
  const { user, token, login, logout, hasRole } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contact/profile form state for clients
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    child_name: '',
    child_age: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState("");

  useEffect(() => {
    if (user) {
      loadUserData();
      // Prime contact form with existing values
      const p = user.profile || {};
      setProfileForm({
        first_name: p.first_name || '',
        last_name: p.last_name || '',
        phone_number: p.phone_number || '',
        child_name: p.child_name || '',
        child_age: p.child_age || ''
      });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // If query contains ?tab=contact, open Contact tab on arrival
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'contact') {
        setActiveTab('contact');
      }
    }
  }, []);

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

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveContact = async (e) => {
    e?.preventDefault?.();
    setProfileSaveMsg("");
    try {
      setIsSavingProfile(true);
      // Minimal validation
      if (!profileForm.first_name || !profileForm.last_name || !profileForm.phone_number) {
        setProfileSaveMsg('Please fill first name, last name and phone number.');
        return;
      }

      // Persist to backend
      await clientApi.updateProfile({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        phone_number: profileForm.phone_number,
        child_name: profileForm.child_name || null,
        child_age: profileForm.child_age ? Number(profileForm.child_age) : null
      });

      // Refresh auth user from backend and update context/localStorage
      const refreshed = await authApi.getProfile();
      if (refreshed?.data?.user) {
        login(refreshed.data.user, token);
      }
      setProfileSaveMsg('Contact information saved successfully.');
    } catch (err) {
      console.error('Save contact failed:', err);
      setProfileSaveMsg(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
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
                {hasRole('client') && (
                  <button
                    onClick={() => router.push('/guide')}
                    className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors text-green-700 hover:bg-green-50 border-l-4 border-green-500"
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    Browse Therapists
                  </button>
                )}
                
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
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.push('/guide')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Book New Session
                    </button>
                    <div className="text-sm text-gray-600">
                      Total: {sessions.length} sessions
                    </div>
                  </div>
                </div>

                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                    <p className="text-gray-600 mb-6">You haven&apos;t booked any sessions yet.</p>
                    <button
                      onClick={() => router.push('/guide')}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                    >
                      <Calendar className="h-5 w-5" />
                      Browse Therapists & Book Your First Session
                    </button>
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

                <form className="space-y-6" onSubmit={handleSaveContact}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={profileForm.first_name}
                        onChange={handleProfileInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={profileForm.last_name}
                        onChange={handleProfileInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={profileForm.phone_number}
                      onChange={handleProfileInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {hasRole('client') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Child Name (optional)</label>
                        <input
                          type="text"
                          name="child_name"
                          value={profileForm.child_name}
                          onChange={handleProfileInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Your child's name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Child Age (optional)</label>
                        <input
                          type="number"
                          name="child_age"
                          min="1"
                          max="18"
                          value={profileForm.child_age}
                          onChange={handleProfileInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Age"
                        />
                      </div>
                    </div>
                  )}

                  {profileSaveMsg && (
                    <div className="p-3 rounded border text-sm ${profileSaveMsg.includes('successfully') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}">
                      {profileSaveMsg}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Contact'}
                    </button>
                  </div>
                </form>
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
