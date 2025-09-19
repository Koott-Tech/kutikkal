"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { clientApi, authApi, messagesApi } from "../../lib/backendApi";
import RescheduleModal from "../../components/RescheduleModal";
import SessionFeedbackModal from "../../components/SessionFeedbackModal";
import MessagesPage from "../../components/MessagesPage";
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
  X,
  Receipt,
  Menu
} from "lucide-react";

export default function ProfilePage() {
  const { user, token, login, logout, hasRole, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("sessions");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSummaryView, setIsSummaryView] = useState(false); // true for summary, false for report
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Changed to false - no auto loading
  const [error, setError] = useState(null);
  
  // Individual loading states for each section
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [packagesLoading, setPackagesLoading] = useState(false);
  
  // Reschedule modal state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState(null);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [sessionToFeedback, setSessionToFeedback] = useState(null);

  // Messages state
  const [selectedSession, setSelectedSession] = useState(null);


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

  // Packages state for clients
  const [clientPackages, setClientPackages] = useState([]);

  useEffect(() => {
    if (user) {
      // Prime contact form with existing values from user object
      const p = user.profile || user;
      setProfileForm({
        first_name: p.first_name || '',
        last_name: p.last_name || '',
        phone_number: p.phone_number || '',
        child_name: p.child_name || '',
        child_age: p.child_age || ''
      });
      
      // Load sessions by default since it's the default tab
      if (activeTab === 'sessions' && isAuthenticated()) {
        console.log('🔍 User authenticated, loading sessions');
        loadSessions();
      }
    }
  }, [user, activeTab]);

  // Load profile data when contact tab is active
  useEffect(() => {
    if (activeTab === 'contact' && user && isAuthenticated()) {
      loadProfileData();
    }
  }, [activeTab, user]);

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



  // Load profile data for contact tab
  const loadProfileData = async () => {
    try {
      console.log('🔍 Loading profile data for contact tab');
      const profileData = await clientApi.getProfile();
      if (profileData?.data) {
        const profile = profileData.data;
        setProfileForm({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone_number: profile.phone_number || '',
          child_name: profile.child_name || '',
          child_age: profile.child_age || ''
        });
        console.log('🔍 Profile data loaded:', profile);
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
    }
  };

  // Lazy load sessions only when sessions tab is active
  const loadSessions = async () => {
    if (sessions.length > 0) return; // Already loaded
    
    // Check if user is authenticated before making API call
    if (!user || !isAuthenticated()) {
      console.log('🔍 User not authenticated, skipping sessions load');
      return;
    }
    
    try {
      setSessionsLoading(true);
      setError(null);

      if (hasRole('client')) {
        console.log('🔍 Loading sessions for client:', user.email);
        const sessionsData = await clientApi.getSessions();
        setSessions(sessionsData.data?.sessions || []);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError(err.message);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Lazy load packages only when packages tab is active
  const loadPackages = async () => {
    if (clientPackages.length > 0) return; // Already loaded
    
    try {
      setPackagesLoading(true);
      setError(null);

      if (hasRole('client')) {
        const packagesData = await clientApi.getClientPackages();
        setClientPackages(packagesData.data?.clientPackages || []);
      }
    } catch (err) {
      console.error('Error loading packages:', err);
      setError(err.message);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Home', href: '/', icon: User, show: true },
    { name: 'Browse Therapists', href: '/guide', icon: Calendar, show: hasRole('client') },
    { name: 'Sessions', href: '#', icon: Calendar, action: () => handleTabChange("sessions") },
    { name: 'Messages', href: '#', icon: MessageSquare, action: () => handleTabChange("messages") },
    { name: 'Contact', href: '#', icon: MessageSquare, action: () => handleTabChange("contact") },
    { name: 'Report', href: '#', icon: BarChart3, action: () => handleTabChange("report") },
    { name: 'Packages', href: '#', icon: FileText, action: () => handleTabChange("packages"), show: hasRole('client') },
    { name: 'Receipts', href: '/profile/receipts', icon: Receipt, show: hasRole('client') },
  ];

  // Handle tab change with lazy loading
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close mobile menu after tab change

    // Load data for tabs that need it, without showing loading screen
    if (tab === 'sessions') {
      if (sessions.length === 0) {
        loadSessions();
      }
      return;
    }

    if (tab === 'packages') {
      if (clientPackages.length === 0) {
        loadPackages();
      }
      return;
    }
  };

  // Handle navigation click
  const handleNavigationClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.href && item.href !== '#') {
      // Redirect immediately, then close menu
      router.push(item.href);
      setSidebarOpen(false);
    }
  };

  const openFeedbackModal = (session) => {
    setSessionToFeedback(session);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (sessionId, feedbackData) => {
    try {
      await clientApi.submitSessionFeedback(sessionId, feedbackData);
      
      // Show success message
      setProfileSaveMsg('Feedback submitted successfully!');
      setTimeout(() => setProfileSaveMsg(''), 3000);
      
      // Reload sessions to update the UI
      await loadUserData();
      
      // Close modal
      setShowFeedbackModal(false);
      setSessionToFeedback(null);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(`Failed to submit feedback: ${err.message}`);
      throw err;
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleViewFullReport = (session) => {
    setSelectedReport(session);
    setIsSummaryView(false);
    setShowReportModal(true);
  };

  const handleViewSummary = (session) => {
    setSelectedReport(session);
    setIsSummaryView(true);
    setShowReportModal(true);
  };

  const handleRescheduleRequest = async (session) => {
    try {
      setError(null);
      await clientApi.requestReschedule(session.id);
      setProfileSaveMsg('Reschedule request sent successfully!');
      setTimeout(() => setProfileSaveMsg(''), 3000);
      await loadUserData(); // Reload to update session status
    } catch (err) {
      console.error('Error requesting reschedule:', err);
      setError(`Failed to send reschedule request: ${err.message}`);
    }
  };

  const handleRescheduleClick = (session) => {
    setSessionToReschedule(session);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSuccess = async (updatedSession) => {
    setProfileSaveMsg('Session rescheduled successfully!');
    setTimeout(() => setProfileSaveMsg(''), 3000);
    await loadUserData(); // Reload sessions to show updated data
    setShowRescheduleModal(false);
    setSessionToReschedule(null);
  };

  const handleRescheduleModalClose = () => {
    setShowRescheduleModal(false);
    setSessionToReschedule(null);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
    setIsSummaryView(false);
  };

  const handleMessageClick = async (session) => {
    try {
      console.log('Creating conversation for session:', session);
      console.log('Session details:', {
        id: session.id,
        psychologist: session.psychologist,
        scheduled_date: session.scheduled_date,
        scheduled_time: session.scheduled_time
      });
      
      // Create conversation if it doesn't exist
      const response = await messagesApi.createConversation(session.id);
      console.log('Conversation created:', response);
      
      // Check if conversation was created successfully
      if (response && response.success && response.message) {
        // Handle both new conversation and existing conversation responses
        let conversationId = null;
        
        if (response.message.conversation) {
          // New conversation created
          conversationId = response.message.conversation.id;
        } else if (response.message.conversationId) {
          // Conversation already exists
          conversationId = response.message.conversationId;
        }
        
        if (conversationId) {
          // Store the session info to pass to MessagesPage component
          session.conversationId = conversationId;
          console.log('Session with conversation ID:', session);
          setSelectedSession(session);
          setActiveTab("messages");
        } else {
          console.error('Failed to create conversation: No conversation ID found', response);
          setError('Failed to create conversation. Please try again.');
        }
      } else {
        console.error('Failed to create conversation: Invalid response format', response);
        setError('Failed to create conversation. Please try again.');
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err.message || 'Failed to create conversation. Please try again.');
    }
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
      // Enhanced validation for all required fields
      if (!profileForm.first_name || !profileForm.last_name || !profileForm.phone_number || 
          !profileForm.child_name || !profileForm.child_age) {
        setProfileSaveMsg('Please fill in all required fields: First Name, Last Name, Phone Number, Child Name, and Child Age.');
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
        
        // Update profileForm with the refreshed data
        const refreshedProfile = refreshed.data.user.profile || {};
        setProfileForm({
          first_name: refreshedProfile.first_name || '',
          last_name: refreshedProfile.last_name || '',
          phone_number: refreshedProfile.phone_number || '',
          child_name: refreshedProfile.child_name || '',
          child_age: refreshedProfile.child_age || ''
        });
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
    // Convert 24-hour format (HH:MM:SS) to 12-hour format with AM/PM
    try {
      // Extract hours and minutes from time string
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const minute = minutes || '00';
      
      // Convert to 12-hour format
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
      // Fallback to original string if parsing fails
      return timeString;
    }
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

  // Show loading screen while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 right-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                {user.profile?.first_name} {user.profile?.last_name}
              </h2>
              <p className="text-xs text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.filter(item => item.show !== false).map((item) => {
              const Icon = item.icon;
              const isActive = (item.action && activeTab === item.name.toLowerCase()) || 
                              (item.href === '/profile/receipts' && router.pathname === '/profile/receipts');
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          
          {/* Logout button at bottom of sidebar */}
          <div className="border-t border-gray-200 p-4 mb-8">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:top-4 lg:bottom-0 lg:left-0 lg:flex lg:w-64 lg:flex-col z-30">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">Little Care</h1>
          </div>
          
          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                {user.profile?.first_name} {user.profile?.last_name}
              </h2>
              <p className="text-xs text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.filter(item => item.show !== false).map((item) => {
              const Icon = item.icon;
              const isActive = (item.action && activeTab === item.name.toLowerCase()) || 
                              (item.href === '/profile/receipts' && router.pathname === '/profile/receipts');
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop header - full width, overlaps sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 w-full">
        <div className="flex h-16 items-center justify-end px-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Get started
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header - Company name left, menu right */}
        <div className="lg:hidden flex h-16 items-center justify-between px-4 border-b border-gray-200 bg-white w-full">
          <h1 className="text-lg font-semibold text-gray-900">Little Care</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="py-6 lg:pt-24">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Sessions Tab */}
            {activeTab === "sessions" && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Sessions</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => router.push('/messages')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">View All Messages</span>
                      <span className="sm:hidden">Messages</span>
                    </button>
                    <button
                      onClick={() => router.push('/guide')}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Book New Session</span>
                      <span className="sm:hidden">Book Session</span>
                    </button>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Total: {sessions.length} sessions
                    </div>
                  </div>
                </div>

                {sessionsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading sessions...</p>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">You haven&apos;t booked any sessions yet.</p>
                    <button
                      onClick={() => router.push('/guide')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Browse Therapists & Book Your First Session</span>
                      <span className="sm:hidden">Browse Therapists</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Scheduled Sessions Section */}
                    {sessions.filter(s => ['booked', 'reschedule_requested', 'rescheduled'].includes(s.status)).length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Scheduled Sessions</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full">
                            {sessions.filter(s => ['booked', 'reschedule_requested', 'rescheduled'].includes(s.status)).length}
                          </span>
                        </div>
                        <div className="space-y-4">
                          {sessions
                            .filter(s => ['booked', 'reschedule_requested', 'rescheduled'].includes(s.status))
                            .map((session) => (
                              <div key={session.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow bg-blue-50/30">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                                  <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                                      <span className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                        {session.status === 'booked' ? 'Scheduled' : 
                                         session.status === 'reschedule_requested' ? 'Reschedule Requested' :
                                         session.status === 'rescheduled' ? 'Rescheduled' : 'Scheduled'}
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
                                    
                                    <h3 className="font-medium text-gray-900 mb-1">
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
                                  
                                  <div className="flex flex-wrap gap-2">
                                    {session.status === 'booked' && (
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
                                          title={session.reschedule_count > 0 ? 'Second reschedule requires psychologist approval' : 'First reschedule - direct if >24h before session'}
                                        >
                                          {session.reschedule_count > 0 ? 'Request Reschedule' : 'Reschedule'}
                                        </button>
                                        <button
                                          onClick={() => handleRescheduleRequest(session)}
                                          className="text-orange-600 hover:text-orange-900 text-xs sm:text-sm font-medium border border-orange-300 px-2 py-1 rounded-md hover:bg-orange-50 transition-colors cursor-pointer"
                                        >
                                          Request Help
                                        </button>
                                      </>
                                    )}
                                    
                                    {session.status === 'reschedule_requested' && (
                                      <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-md text-sm">
                                        Reschedule Requested
                                      </span>
                                    )}
                                    
                                    {/* Show summary button for any session with summary */}
                                    {session.session_summary && (
                                      <button
                                        onClick={() => handleViewSummary(session)}
                                        className="text-green-600 hover:text-green-900 text-sm font-medium border border-green-300 px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                                        title="View session summary only"
                                      >
                                        View Summary Only
                                      </button>
                                    )}
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
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Completed Sessions</h3>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full">
                            {sessions.filter(s => s.status === 'completed').length}
                          </span>
                        </div>
                        <div className="space-y-4">
                          {sessions
                            .filter(s => s.status === 'completed')
                            .map((session) => (
                              <div key={session.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow bg-green-50/30">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                                  <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
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
                                    
                                    <h3 className="font-medium text-gray-900 mb-1">
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
                                  
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => handleViewFullReport(session)}
                                      className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm font-medium border border-blue-300 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                                      title="View complete session details including summary, report, and feedback"
                                    >
                                      View Complete Report
                                    </button>
                                    {session.summary && (
                                      <button
                                        onClick={() => handleViewSummary(session)}
                                        className="text-green-600 hover:text-green-900 text-xs sm:text-sm font-medium border border-green-300 px-2 py-1 rounded-md hover:bg-green-50 transition-colors cursor-pointer"
                                        title="View session summary only"
                                      >
                                        View Summary Only
                                      </button>
                                    )}
                                    {!session.feedback && (
                                      <button
                                        onClick={() => openFeedbackModal(session)}
                                        className="text-purple-600 hover:text-purple-900 text-xs sm:text-sm font-medium border border-purple-300 px-2 py-1 rounded-md hover:bg-purple-50 transition-colors cursor-pointer"
                                        title="Provide feedback for this session"
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
                            ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Required Information</h3>
                  <p className="text-sm text-blue-700">
                    All fields below are required to book therapy sessions. This information helps us provide personalized care for your child.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSaveContact}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={profileForm.first_name}
                        onChange={handleProfileInputChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !profileForm.first_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={profileForm.last_name}
                        onChange={handleProfileInputChange}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !profileForm.last_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={profileForm.phone_number}
                      onChange={handleProfileInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !profileForm.phone_number ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {hasRole('client') && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Child Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Child Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="child_name"
                            value={profileForm.child_name}
                            onChange={handleProfileInputChange}
                            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              !profileForm.child_name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Your child's name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Child Age <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="child_age"
                            min="1"
                            max="18"
                            value={profileForm.child_age}
                            onChange={handleProfileInputChange}
                            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              !profileForm.child_age ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Age"
                            required
                          />
                        </div>
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
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium cursor-pointer"
                            >
                              View Complete Report
                            </button>
                          </div>
                          
                          {session.summary && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Summary</h4>
                              <p className="text-sm text-gray-600">{session.summary}</p>
                            </div>
                          )}
                          
                          {session.report && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Report</h4>
                              <p className="text-sm text-gray-600">{session.report}</p>
                            </div>
                          )}
                          
                          {/* Session notes are private and not visible to clients */}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === "packages" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Packages</h2>
                {packagesLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading packages...</p>
                  </div>
                ) : clientPackages.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No packages purchased yet</h3>
                    <p className="text-gray-600">You can browse therapists and purchase packages from the guide page.</p>
                    <button
                      onClick={() => router.push('/guide')}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Browse Therapists
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clientPackages.map((pkg) => (
                      <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {pkg.package_type ? pkg.package_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Package'}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Total Sessions:</span> {pkg.total_sessions}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Remaining:</span> 
                                  <span className={`ml-1 ${pkg.remaining_sessions > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {pkg.remaining_sessions}
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Total Amount:</span> ${pkg.total_amount}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Status:</span> 
                                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                    pkg.status === 'active' ? 'bg-green-100 text-green-800' : 
                                    pkg.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {pkg.status}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              Purchased: {new Date(pkg.purchased_at).toLocaleDateString()}
                            </p>
                            {pkg.psychologist && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Therapist:</span> {pkg.psychologist.first_name} {pkg.psychologist.last_name}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            {pkg.remaining_sessions > 0 && pkg.status === 'active' ? (
                              <button
                                onClick={() => router.push(`/therapist-profile?doctor=${pkg.psychologist?.id || 0}&package_id=${pkg.id}`)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                              >
                                <Calendar className="h-4 w-4" />
                                Book Remaining Sessions
                              </button>
                            ) : (
                              <span className="text-gray-500 text-sm px-3 py-2 bg-gray-100 rounded-lg">
                                {pkg.status === 'completed' ? 'Package Completed' : 'No sessions remaining'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <MessagesPage session={selectedSession} />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showRescheduleModal && (
        <RescheduleModal
          session={sessionToReschedule}
          onClose={() => {
            setShowRescheduleModal(false);
            setSessionToReschedule(null);
          }}
          onSuccess={handleRescheduleSuccess}
        />
      )}

      {showFeedbackModal && (
        <SessionFeedbackModal
          session={sessionToFeedback}
          onClose={() => {
            setShowFeedbackModal(false);
            setSessionToFeedback(null);
          }}
          onSuccess={handleFeedbackSuccess}
        />
      )}

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <div key={`${isSummaryView ? 'summary' : 'report'}-${selectedReport.id}`} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {isSummaryView ? 'Session Summary' : 'Complete Session Report'}
                </h3>
                <button
                  onClick={handleCloseReportModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">

              
              {isSummaryView ? (
                // Summary View - Only show the summary
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Session Summary</h4>
                    {selectedReport.summary ? (
                      <p className="text-gray-700 leading-relaxed">{selectedReport.summary}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No summary available for this session.</p>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    This summary was provided by your therapist after the session.
                  </div>
                </div>
              ) : !isSummaryView ? (
                // Full Report View - Show comprehensive information
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Session Details</h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(selectedReport.scheduled_date)} at {formatTime(selectedReport.scheduled_time)}
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

                    {selectedReport.summary && (
                      <div>
                        <h4 className="font-medium text-gray-900">Session Summary</h4>
                        <p className="text-sm text-gray-600">{selectedReport.summary}</p>
                      </div>
                    )}

                    {selectedReport.report && (
                      <div>
                        <h4 className="font-medium text-gray-900">Session Report</h4>
                        <p className="text-sm text-gray-600">{selectedReport.report}</p>
                      </div>
                    )}

                    {/* Session notes are private and not visible to clients */}

                    {selectedReport.feedback && (
                      <div>
                        <h4 className="font-medium text-gray-900">Feedback</h4>
                        <p className="text-sm text-gray-600">{selectedReport.feedback}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Fallback - should not happen
                  <div className="text-center text-red-600">
                    Error: Unknown view mode &quot;{isSummaryView ? 'summary' : 'report'}&quot;
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <SessionFeedbackModal
        session={sessionToFeedback}
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setSessionToFeedback(null);
        }}
        onSubmit={handleSubmitFeedback}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        session={sessionToReschedule}
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setSessionToReschedule(null);
        }}
        onRescheduleSuccess={handleRescheduleSuccess}
      />

    </div>
  );
}
