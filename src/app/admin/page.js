"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Calendar, Users, FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { adminApi, psychologistApi, clientApi, sessionsApi, dashboardApi } from '../../lib/backendApi';
import DoctorModal from '@/components/DoctorModal';
import UserModal from '@/components/UserModal';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalDoctors: 0,
    totalSessions: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isFullProfileOpen, setIsFullProfileOpen] = useState(false);

  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [selectedSessionForDetails, setSelectedSessionForDetails] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    duration: 60
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Helper function to filter bookings by status
  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  // Get counts for each booking status
  const scheduledBookings = getBookingsByStatus('booked'); // Changed from 'scheduled' to 'booked'
  const noShowBookings = getBookingsByStatus('no_show');
  const completedBookings = getBookingsByStatus('completed');

  // Check authentication and role
  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    if (!hasRole('admin') && !hasRole('superadmin')) {
      router.push('/profile');
      return;
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  useEffect(() => {
    console.log('=== useEffect triggered ===');
    console.log('authLoading:', authLoading);
    console.log('isAuthenticated():', isAuthenticated());
    console.log('hasRole admin:', hasRole('admin'));
    console.log('hasRole superadmin:', hasRole('superadmin'));
    
    // Debug authentication state
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      console.log('Auth token in localStorage:', token ? 'Present' : 'Missing');
      console.log('User object:', user);
    }
    
    if (authLoading || !isAuthenticated() || (!hasRole('admin') && !hasRole('superadmin'))) {
      console.log('Early return from useEffect');
      return;
    }
    
    console.log('Loading all data...');
    loadDashboardData();
    loadDoctors();
    loadUsers();
    loadBookings();
  }, [authLoading, isAuthenticated, hasRole, user]);

  const loadDashboardData = async () => {
    try {
      // Check if user is authenticated before making API calls
      if (!isAuthenticated()) {
        console.log('User not authenticated, skipping dashboard data load');
        setStats({
          totalUsers: 0,
          totalBookings: 0,
          totalDoctors: 0,
          totalSessions: 0
        });
        setRecentUsers([]);
        setRecentBookings([]);
        return;
      }

      try {
        console.log('Calling adminApi.getPlatformStats()...');
        const statsData = await adminApi.getPlatformStats();
        console.log('Platform stats received:', statsData);
        setStats({
          totalUsers: statsData.data?.users?.total || 0,
          totalBookings: statsData.data?.sessions?.total || 0,
          totalDoctors: statsData.data?.users?.by_role?.psychologist || 0,
          totalSessions: statsData.data?.sessions?.total || 0
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        setStats({
          totalUsers: 0,
          totalBookings: 0,
          totalDoctors: 0,
          totalSessions: 0
        });
      }

      try {
        console.log('Calling dashboardApi.getRecentUsers()...');
        const usersData = await dashboardApi.getRecentUsers();
        console.log('Recent users received:', usersData);
        setRecentUsers(usersData);
      } catch (error) {
        console.error('Error loading recent users:', error);
        setRecentUsers([]);
      }

      try {
        console.log('Calling dashboardApi.getRecentBookings()...');
        const bookingsData = await dashboardApi.getRecentBookings();
        console.log('Recent bookings received:', bookingsData);
        setRecentBookings(bookingsData);
      } catch (error) {
        console.error('Error loading recent bookings:', error);
        setRecentBookings([]);
      }
    } catch (error) {
      console.error('Error in loadDashboardData:', error);
      
      // Check if it's an authentication error
      if (error.message && error.message.includes('Access token required')) {
        console.log('Authentication error detected, redirecting to login');
        router.push('/login');
        return;
      }
    }
  };

  const loadDoctors = async () => {
    try {
      // Check if user is authenticated before making API calls
      if (!isAuthenticated()) {
        console.log('User not authenticated, skipping doctors load');
        setDoctors([]);
        return;
      }

      console.log('Calling adminApi.getUsers({ role: "psychologist" })...');
      const doctorsData = await adminApi.getUsers({ role: 'psychologist' });
      console.log('Doctors data received:', doctorsData);
      const psychologists = doctorsData?.data?.users || [];
      
      // Filter out test/dummy doctors
      const realDoctors = psychologists.filter(doctor => {
        // Filter out test emails
        const testEmails = [
          'psychologist@test.com',
          'dr.sarah@example.com',
          'sarah.johnson@test.com',
          'test@example.com'
        ];
        return !testEmails.includes(doctor.email);
      });
      
      console.log('Filtered real doctors:', realDoctors);
      setDoctors(realDoctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
      
      // Check if it's an authentication error
      if (error.message && error.message.includes('Access token required')) {
        console.log('Authentication error detected, redirecting to login');
        router.push('/login');
        return;
      }
      
      setDoctors([]);
    }
  };

  const loadUsers = async () => {
    try {
      // Check if user is authenticated before making API calls
      if (!isAuthenticated()) {
        console.log('User not authenticated, skipping users load');
        setUsers([]);
        return;
      }

      console.log('Loading patients (users) from API...');
      
              // Load only regular users (patients/clients), not psychologists
      const usersData = await adminApi.getUsers();
      
      console.log('Users data received:', usersData);
      
      // Extract users from the response structure
      const users = usersData?.data?.users || [];
      
      // Filter and transform only regular users (patients)
      const validUsers = users.filter(user => 
        user && 
        user.id && 
        typeof user.id === 'string' && 
        user.id.length > 0 &&
        user.email &&
        user.role === 'client' // Only show clients, not psychologists or admins
      ).map(user => ({
        ...user,
        type: 'user',
        displayName: user.email, // Use email as display name for now
        displayRole: 'Patient/Client'
      }));
      
      console.log('Valid patients:', validUsers);
      setUsers(validUsers);
    } catch (error) {
      console.error('Error loading patients:', error);
      
      // Check if it's an authentication error
      if (error.message && error.message.includes('Access token required')) {
        console.log('Authentication error detected, redirecting to login');
        router.push('/login');
        return;
      }
      
      setUsers([]);
    }
  };

  const loadBookings = async () => {
    try {
      console.log('=== loadBookings called ===');
      console.log('isAuthenticated():', isAuthenticated());
      
      // Check if user is authenticated before making API calls
      if (!isAuthenticated()) {
        console.log('User not authenticated, skipping bookings load');
        setBookings([]);
        return;
      }

      console.log('Loading bookings from API...');
      const bookingsData = await sessionsApi.getAllSessions();
      console.log('Bookings data received:', bookingsData);
      
      // Extract sessions from the response structure
      const sessions = bookingsData?.data?.sessions || [];
      
      // Ensure we always have an array
      if (!sessions || sessions.length === 0) {
        console.log('No sessions data received, setting empty array');
        setBookings([]);
        return;
      }
      
      // Transform session data to match the expected display format
      const transformedBookings = sessions.map(session => ({
        id: session.id,
        date: session.scheduled_date,
        time: session.scheduled_time,
        duration: 60, // Default duration since it's not in the API response
        status: session.status,
        price: session.price,
        session_type: 'Therapy Session',
        patient_name: `${session.client?.first_name || ''} ${session.client?.last_name || ''}`.trim() || 'N/A',
        patient_email: session.client?.email || 'N/A',
        patient_phone: session.client?.phone_number || 'N/A',
        doctor_name: `${session.psychologist?.first_name || ''} ${session.psychologist?.last_name || ''}`.trim() || 'N/A',
        doctor_id: session.psychologist?.id || 'N/A',
        client: session.client,
        psychologist: session.psychologist,
        // Keep original fields for compatibility
        scheduled_date: session.scheduled_date,
        scheduled_time: session.scheduled_time,
        client_id: session.client_id,
        psychologist_id: session.psychologist_id
      }));
      
      console.log('Transformed bookings:', transformedBookings);
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      
      // Check if it's an authentication error
      if (error.message && error.message.includes('Access token required')) {
        console.log('Authentication error detected, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('Setting empty bookings array due to error');
      setBookings([]);
    }
  };





  // Function to delete a booking
  const handleDeleteBooking = async (bookingId) => {
    if (!bookingId) {
      alert('No booking ID provided');
      return;
    }

    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        console.log('Deleting booking with ID:', bookingId);
        const result = await sessionsApi.deleteSession(bookingId);
        console.log('Booking delete response:', result);
        
        // Handle successful deletion (even if response is empty)
        console.log('Booking deleted successfully');
        
        // Refresh bookings
        await loadBookings();
        
        alert('Booking deleted successfully!');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert(`Error deleting booking: ${error.message}`);
      }
    }
  };

  // Function to update booking status
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    if (!bookingId) {
      alert('No booking ID provided');
      return;
    }

    try {
      console.log('Updating booking status:', { bookingId, newStatus });
      
      // Find the current booking to get all its data
      const currentBooking = bookings.find(b => b.id === bookingId);
      if (!currentBooking) {
        alert('Booking not found');
        return;
      }

      // Update the booking with new status
      const updatedBooking = {
        ...currentBooking,
        status: newStatus
      };

      // Also update the scheduled fields if changing to booked status
      if (newStatus === 'booked') {
        updatedBooking.scheduled_date = currentBooking.date || currentBooking.scheduled_date;
        updatedBooking.scheduled_time = currentBooking.time || currentBooking.scheduled_time;
      }

      // Use the correct API function for status updates
      const result = await sessionsApi.updateSessionStatus(bookingId, newStatus, updatedBooking.notes || '');
      console.log('Booking update response:', result);
      
      console.log('Booking status updated successfully');
      
      // Refresh bookings
      await loadBookings();
      
      showNotificationMessage(`Booking status updated to ${newStatus}!`, 'success');
    } catch (error) {
      console.error('Error updating booking status:', error);
      showNotificationMessage(`Error updating booking status: ${error.message}`, 'error');
    }
  };

  // Function to handle booking actions
  const handleViewSessionDetails = (booking) => {
    setSelectedSessionForDetails(booking);
    setShowSessionDetailsModal(true);
  };

  const handleReschedule = (booking) => {
    setSelectedSessionForDetails(booking);
    setRescheduleData({
      date: booking.date || '',
      time: booking.time || '',
      duration: booking.duration || 60
    });
    setShowRescheduleModal(true);
    setShowSessionDetailsModal(false);
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleRescheduleSubmit = async () => {
    try {
      if (!selectedSessionForDetails || !rescheduleData.date || !rescheduleData.time) {
        showNotificationMessage('Please fill in all required fields', 'error');
        return;
      }

      // Use the correct API function for rescheduling
      const result = await sessionsApi.rescheduleSession(
        selectedSessionForDetails.id, 
        rescheduleData.date, 
        rescheduleData.time
      );
      console.log('Reschedule response:', result);
      
      // Close modal and refresh data
      setShowRescheduleModal(false);
      setSelectedSessionForDetails(null);
      setRescheduleData({ date: '', time: '', duration: 60 });
      await loadBookings();
      
      showNotificationMessage('Session rescheduled successfully!', 'success');
    } catch (error) {
      console.error('Error rescheduling session:', error);
      showNotificationMessage(`Error rescheduling session: ${error.message}`, 'error');
    }
  };

  const handleBookingAction = (bookingId, action) => {
    console.log(`${action} booking ${bookingId}`);
    
    switch (action) {
      case 'delete':
        handleDeleteBooking(bookingId);
        break;
      case 'edit':
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
          setSelectedBooking(booking);
          setShowEditBookingModal(true);
        }
        break;
      case 'reschedule':
        const rescheduleBooking = bookings.find(b => b.id === bookingId);
        if (rescheduleBooking) {
          handleReschedule(rescheduleBooking);
        }
        break;
      case 'mark_completed':
        handleUpdateBookingStatus(bookingId, 'completed');
        break;
      case 'mark_no_show':
        handleUpdateBookingStatus(bookingId, 'no_show');
        break;
      case 'mark_booked':
        handleUpdateBookingStatus(bookingId, 'booked');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Function to handle booking editing
  const handleEditBooking = async (bookingData) => {
    try {
      console.log('Editing booking with data:', bookingData);
      
      if (!selectedBooking || !selectedBooking.id) {
        showNotificationMessage('No booking selected for editing', 'error');
        return;
      }

      // Since there's no general update function, we'll use multiple API calls
      // First update the status if it changed
      if (bookingData.status !== selectedBooking.status) {
        try {
          await sessionsApi.updateSessionStatus(selectedBooking.id, bookingData.status, bookingData.notes || '');
        } catch (error) {
          console.error('Error updating status:', error);
          showNotificationMessage(`Error updating status: ${error.message}`, 'error');
          return;
        }
      }

      // Then reschedule if date/time changed
      if (bookingData.date !== selectedBooking.date || bookingData.time !== selectedBooking.time) {
        try {
          await sessionsApi.rescheduleSession(selectedBooking.id, bookingData.date, bookingData.time);
        } catch (error) {
          console.error('Error rescheduling:', error);
          showNotificationMessage(`Error rescheduling: ${error.message}`, 'error');
          return;
        }
      }

      console.log('Booking updated successfully');
      
      // Close modal and refresh data
      setShowEditBookingModal(false);
      setSelectedBooking(null);
      await loadBookings();
      
      showNotificationMessage('Booking updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating booking:', error);
      showNotificationMessage(`Error updating booking: ${error.message}`, 'error');
    }
  };

  const handleAddDoctor = async (doctorData) => {
    try {
      const newDoctor = await adminApi.createPsychologist(doctorData);
      console.log('New doctor created:', newDoctor);
      
      // Refresh the doctors list to get the updated data
      await loadDoctors();
      setShowAddDoctorModal(false);
      showNotificationMessage('Doctor added successfully!', 'success');
    } catch (error) {
      console.error('Error adding doctor:', error);
      showNotificationMessage(`Error adding doctor: ${error.message}`, 'error');
      throw error;
    }
  };

  const handleEditDoctor = async (doctorData) => {
    try {
      const updatedDoctor = await adminApi.updatePsychologist(selectedDoctor.id, doctorData);
      console.log('Doctor updated:', updatedDoctor);
      
      // Refresh the doctors list to get the updated data
      await loadDoctors();
      setShowEditDoctorModal(false);
      setSelectedDoctor(null);
      showNotificationMessage('Doctor updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating doctor:', error);
      showNotificationMessage(`Error updating doctor: ${error.message}`, 'error');
      throw error;
    }
  };



  const handleAddUser = async (userData) => {
    try {
      const newUser = await adminApi.createUser(userData);
      const user = newUser?.data?.user || newUser;
      setUsers(prev => [...prev, user]);
      setShowAddUserModal(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const handleEditUser = async (userData) => {
    try {
              const updatedUser = await adminApi.updateUser(userData.id, userData);
      setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
      setShowEditUserModal(false);
      setSelectedUser(null);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      console.error('No user ID provided for deletion');
      alert('Error: No user ID provided');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('Attempting to delete user with ID:', userId);
        
        // Check if user is trying to delete themselves
        if (userId === user?.id) {
          showNotificationMessage('You cannot delete your own account', 'error');
          return;
        }

        const result = await adminApi.deleteUser(userId);
        console.log('Delete result:', result);
        
        // Remove user from local state
        setUsers(prev => prev.filter(user => user.id !== userId));
        
        // Refresh dashboard data
        await loadDashboardData();
        
        showNotificationMessage('User deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to delete user';
        
        if (error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Permission denied. You cannot delete this user.';
        } else if (error.message.includes('404')) {
          errorMessage = 'User not found.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!doctorId) {
      console.error('No doctor ID provided for deletion');
      showNotificationMessage('Error: No doctor ID provided', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this psychologist?')) {
      try {
        console.log('Attempting to delete doctor with ID:', doctorId);
        
        const result = await adminApi.deletePsychologist(doctorId);
        console.log('Delete doctor result:', result);
        
        // Refresh the doctors list to get the updated data
        await loadDoctors();
        
        showNotificationMessage('Psychologist deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting doctor:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to delete psychologist';
        
        if (error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Permission denied. You cannot delete this psychologist.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Psychologist not found.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        showNotificationMessage(`Error: ${errorMessage}`, 'error');
      }
    }
  };

  const openEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const openEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowEditDoctorModal(true);
  };



  // Render functions for different menu items
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{scheduledBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">No Show</p>
              <p className="text-2xl font-bold text-red-600">{noShowBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedBookings.length}</p>
            </div>
          </div>
        </div>
      </div>



      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentUsers && recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div key={user.id || `user-${Math.random()}`} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No recent users found
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentBookings && recentBookings.length > 0 ? (
            recentBookings.map((booking) => (
              <div key={booking.id || `booking-${Math.random()}`} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.patient_name || 'Unknown Patient'}</p>
                  <p className="text-sm text-gray-500">with {booking.doctor_name || 'Unknown Doctor'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'no_show' ? 'bg-red-100 text-red-800' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status === 'no_show' ? 'No Show' :
                     booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                  </span>
                  <span className="text-sm text-gray-500">${booking.amount || 0}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No recent bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDoctors = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Doctors</h2>
          <p className="text-gray-600">Add, edit, and manage doctor profiles</p>
        </div>
        <button
          onClick={() => setShowAddDoctorModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* Doctors Grid */}
      {doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <style>{`
            .admin-doctor-card {
              cursor: pointer;
              transition: all 0.2s ease-in-out;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              background: #fff;
              border: 1px solid #e5e7eb;
              position: relative;
              min-height: 400px;
            }
            .admin-doctor-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              border-color: #3b82f6;
            }
          `}</style>
          {doctors.map((doctor, idx) => (
            <div
              className="admin-doctor-card p-6"
              key={doctor.id || `doctor-${idx}`}
            >
              {/* Top Section - Doctor's Identity & Primary Info */}
              <div className="flex items-start space-x-4 mb-6">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  {(() => {
                    // First try actual image URLs from database
                    let imageSrc = doctor.cover_image_url || doctor.profile_picture_url;
                    
                    // If no database image, use fallback based on name
                    if (!imageSrc) {
                      const name = (doctor.name || '').toLowerCase();
                      if (name.includes('irene') || name.includes('marium')) {
                        imageSrc = '/irene.jpeg';
                      } else if (name.includes('doug') || name.includes('douglas')) {
                        imageSrc = '/doug.png';
                      } else if (name.includes('ashley') || name.includes('ash') || name.includes('sarah')) {
                        imageSrc = '/hero.png';
                      } else if (name.includes('child') || name.includes('teen') || name.includes('liana')) {
                        imageSrc = '/kids.png';
                      }
                    }
                    
                    if (imageSrc) {
                      return (
                        <img
                          src={imageSrc}
                          alt={doctor.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      );
                    }
                    
                    return (
                      <span className="text-xl font-semibold text-white">
                        {doctor.name ? doctor.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : 'D'}
                      </span>
                    );
                  })()}
                </div>
                
                {/* Name & Email */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                    {doctor.name || 'Unknown Doctor'}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="truncate">{doctor.phone || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics Section */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Role</div>
                  <div className="text-sm font-bold text-blue-900">{doctor.role || 'N/A'}</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                  <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Experience</div>
                  <div className="text-sm font-bold text-green-900">{doctor.experience_years ? `${doctor.experience_years} years` : 'N/A'}</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                  <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Phone</div>
                  <div className="text-sm font-bold text-purple-900">{doctor.phone || 'N/A'}</div>
                </div>
              </div>

              {/* Education */}
              {(doctor.ug_college || doctor.pg_college || doctor.phd_college) && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Education</h4>
                  <div className="space-y-2">
                    {doctor.ug_college && (
                      <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                        <div className="text-xs font-semibold text-blue-700">Undergraduate</div>
                        <div className="text-sm text-blue-900">{doctor.ug_college}</div>
                      </div>
                    )}
                    {doctor.pg_college && (
                      <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                        <div className="text-xs font-semibold text-green-700">Postgraduate</div>
                        <div className="text-sm text-green-900">{doctor.pg_college}</div>
                      </div>
                    )}
                    {doctor.phd_college && (
                      <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                        <div className="text-xs font-semibold text-purple-700">PhD</div>
                        <div className="text-sm text-purple-900">{doctor.phd_college}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {doctor.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Bio</h4>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-700 text-sm">{doctor.description}</p>
                  </div>
                </div>
              )}

              {/* Specializations */}
              {doctor.area_of_expertise && Array.isArray(doctor.area_of_expertise) && doctor.area_of_expertise.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.area_of_expertise.slice(0, 3).map((spec, index) => (
                      <span key={`${doctor.id || 'unknown'}-spec-${index}`} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full font-medium">
                        {spec}
                      </span>
                    ))}
                    {doctor.area_of_expertise.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                        +{doctor.area_of_expertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Availability Section */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Availability</h4>
                {doctor.availability && Array.isArray(doctor.availability) && doctor.availability.length > 0 ? (
                  <div className="space-y-2">
                    {doctor.availability.slice(0, 2).map((item, index) => (
                      <div key={`${doctor.id || 'unknown'}-avail-${index}`} className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                        <div className="font-semibold text-amber-800 text-sm">{item.day}</div>
                        <div className="text-amber-700 text-sm text-xs">
                          {item.slots && Array.isArray(item.slots) ? item.slots.slice(0, 3).join(', ') : 'No slots'}
                          {item.slots && item.slots.length > 3 && ` +${item.slots.length - 3} more`}
                        </div>
                      </div>
                    ))}
                    {doctor.availability.length > 2 && (
                      <div className="text-center text-xs text-gray-500">
                        +{doctor.availability.length - 2} more days
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <p className="text-gray-500 text-sm">No availability set</p>
                  </div>
                )}
              </div>

              {/* Bottom Section - Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-400 font-mono">
                  ID: {doctor.id?.substring(0, 8) || 'unknown'}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditDoctor(doctor); }}
                    className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-1 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteDoctor(doctor.id); }}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first doctor</p>
          <button
            onClick={() => setShowAddDoctorModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add First Doctor
          </button>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Patients (Users)</h2>
          <p className="text-gray-600">Add, edit, and manage patient accounts</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </button>
        </div>
      </div>

      {/* Users Grid */}
      {users && users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id || `user-${Math.random()}`} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all duration-200 w-full border-gray-200">
              {/* Top Section - User's Identity & Primary Info */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
                    <span className="text-xl font-semibold text-gray-600">
                      {user.displayName ? user.displayName.split(' ').map(n => n.charAt(0)).join('') : 'U'}
                    </span>
                  </div>
                  
                  {/* Name & Email */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{user.displayName || 'Unknown User'}</h3>
                      {/* Type badge */}
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        👤 Patient
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section - User Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Role</div>
                  <div className="text-base font-bold text-gray-900">Patient</div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Status</div>
                  <div className="text-base font-bold text-gray-900">
                    {user.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Type</div>
                  <div className="text-base font-bold text-gray-900">Patient</div>
                </div>
              </div>



              {/* Bottom Section - User ID & Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  ID: {user.id?.substring(0, 8) || 'user_no_id'}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => openEditUser(user)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      console.log('Delete button clicked for user:', user);
                      console.log('User ID:', user.id);
                      console.log('User ID type:', typeof user.id);
                      handleDeleteUser(user.id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first user</p>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add First User
          </button>
        </div>
      )}
    </div>
  );

  const renderBookings = (status = null) => {
    const filteredBookings = status ? getBookingsByStatus(status) : bookings;
    const statusTitle = status ? status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All';
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{statusTitle} Bookings</h2>
            <p className="text-gray-600">
              {status === 'booked' ? 'Upcoming and booked sessions' :
               status === 'no_show' ? 'Sessions where patients did not show up' :
               status === 'completed' ? 'Successfully completed sessions' :
               'View and manage all platform bookings'}
            </p>
            {status && (
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {filteredBookings.length} {statusTitle} {filteredBookings.length === 1 ? 'Booking' : 'Bookings'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="space-y-4">

          
          {!filteredBookings || filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {statusTitle.toLowerCase()} bookings found</h3>
              <p className="text-gray-500">
                {status === 'booked' ? 'Booked sessions will appear here.' :
                 status === 'no_show' ? 'No-show sessions will appear here.' :
                 status === 'completed' ? 'Completed sessions will appear here.' :
                 'Sessions will appear here once they are created.'}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id || `booking-${Math.random()}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 w-full">
                {/* Top Section - Booking Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {/* Booking Icon */}
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    {/* Booking Details */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {booking.session_type || 'Therapy Session'}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {booking.date} at {booking.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {booking.duration} minutes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Section - Patient & Doctor Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Patient Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Patient Details
                    </h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-gray-900">{booking.patient_name}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-gray-900">{booking.patient_email}</span>
                      </div>
                      {booking.patient_phone && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Phone:</span>
                          <span className="ml-2 text-gray-900">{booking.patient_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Doctor Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Doctor Details
                    </h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-gray-900">{booking.doctor_name}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">ID:</span>
                        <span className="ml-2 text-gray-900">{booking.doctor_id?.substring(0, 8) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Status, Price & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'no_show' ? 'bg-red-100 text-red-800' :
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status === 'no_show' ? 'No Show' :
                       booking.status === 'booked' ? 'Booked' :
                       booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                    </div>

                    {/* Price */}
                    <div className="text-lg font-bold text-green-600">
                      ${booking.price || 0}
                    </div>

                    {/* Booking ID */}
                    <div className="text-sm text-gray-500">
                      ID: {booking.id?.substring(0, 8) || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewSessionDetails(booking)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    
                    <button
                      onClick={() => handleBookingAction(booking.id, 'edit')}
                      className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    
                    {/* Status Update Buttons */}
                    {booking.status !== 'completed' && (
                      <button
                        onClick={() => handleBookingAction(booking.id, 'mark_completed')}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Complete</span>
                      </button>
                    )}
                    
                    {booking.status !== 'no_show' && (
                      <button
                        onClick={() => handleBookingAction(booking.id, 'mark_no_show')}
                        className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <User className="w-4 h-4" />
                        <span>No Show</span>
                      </button>
                    )}
                    
                    {booking.status !== 'booked' && (
                      <button
                        onClick={() => handleBookingAction(booking.id, 'mark_booked')}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Mark as Booked</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleBookingAction(booking.id, 'reschedule')}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Reschedule</span>
                    </button>
                    
                    <button
                      onClick={() => handleBookingAction(booking.id, 'delete')}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Notes Section */}
                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Notes:</h5>
                    <p className="text-gray-600 text-sm">{booking.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return renderDashboard();
      case 'doctors':
        return renderDoctors();
      case 'users':
        return renderUsers();
      case 'bookings':
        return renderBookings();
      case 'scheduled_bookings':
        return renderBookings('booked'); // Changed from 'scheduled' to 'booked'
      case 'no_show_bookings':
        return renderBookings('no_show');
      case 'completed_bookings':
        return renderBookings('completed');
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notificationType === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notificationType === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your mental health platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name || 'Admin'}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('userData');
                  router.push('/login');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveMenu('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'dashboard' ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveMenu('doctors')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'doctors' ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                👨‍⚕️ Doctors
              </button>
              <button
                onClick={() => setActiveMenu('users')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'users' ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                👥 Users (Patients)
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {users.filter(u => u.type === 'user').length}
                </span>
              </button>
              <button
                onClick={() => setActiveMenu('bookings')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'bookings' ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📋 All Bookings
              </button>
              
              {/* Scheduled Bookings */}
              <button
                onClick={() => setActiveMenu('scheduled_bookings')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'scheduled_bookings' ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📅 Booked Sessions
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {scheduledBookings.length}
                </span>
              </button>
              
              {/* No Show Bookings */}
              <button
                onClick={() => setActiveMenu('no_show_bookings')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'no_show_bookings' ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ❌ No Show Bookings
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {noShowBookings.length}
                </span>
              </button>
              
              {/* Completed Bookings */}
              <button
                onClick={() => setActiveMenu('completed_bookings')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === 'completed_bookings' ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ✅ Completed Bookings
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {completedBookings.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      <DoctorModal
        isOpen={showAddDoctorModal}
        onClose={() => setShowAddDoctorModal(false)}
        onSave={handleAddDoctor}
        mode="add"
      />

      <DoctorModal
        isOpen={showEditDoctorModal}
        onClose={() => {
          setShowEditDoctorModal(false);
          setSelectedDoctor(null);
        }}
        onSave={handleEditDoctor}
        doctor={selectedDoctor}
        mode="edit"
      />

      <UserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSave={handleAddUser}
        mode="add"
      />

      <UserModal
        isOpen={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setSelectedUser(null);
        }}
        onSave={handleEditUser}
        user={selectedUser}
        mode="edit"
      />

      {/* Edit Booking Modal */}
      {showEditBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Session Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Type
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedBooking.session_type || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="sessionType"
                    placeholder="e.g., Therapy Session, Consultation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedBooking.date || selectedBooking.scheduled_date || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="bookingDate"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    defaultValue={selectedBooking.time || selectedBooking.scheduled_time || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="bookingTime"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedBooking.duration || 60}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="bookingDuration"
                    min="15"
                    max="180"
                    step="15"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    defaultValue={selectedBooking.status || 'booked'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="bookingStatus"
                  >
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="no_show">No Show</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    defaultValue={selectedBooking.notes || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="bookingNotes"
                    placeholder="Additional notes about the session..."
                  />
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p><strong>Note:</strong> Only session date, time, duration, status, and notes can be edited.</p>
                  <p>Patient and doctor information cannot be modified after session creation.</p>
                </div>
              </div>
            </div>


            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditBookingModal(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const formData = {
                    session_type: document.getElementById('sessionType').value,
                    date: document.getElementById('bookingDate').value,
                    time: document.getElementById('bookingTime').value,
                    duration: parseInt(document.getElementById('bookingDuration').value) || 60,
                    status: document.getElementById('bookingStatus').value,
                    notes: document.getElementById('bookingNotes').value,
                    // Also update scheduled fields for consistency
                    scheduled_date: document.getElementById('bookingDate').value,
                    scheduled_time: document.getElementById('bookingTime').value
                  };
                  handleEditBooking(formData);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Details Modal */}
      {showSessionDetailsModal && selectedSessionForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Session Details</h2>
              <button
                onClick={() => {
                  setShowSessionDetailsModal(false);
                  setSelectedSessionForDetails(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Session Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedSessionForDetails.session_type || 'Therapy Session'}
                    </h3>
                    <div className="flex items-center space-x-6 text-lg">
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                        </svg>
                        {selectedSessionForDetails.date}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {selectedSessionForDetails.time}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {selectedSessionForDetails.duration} minutes
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Price */}
              <div className="flex items-center justify-between">
                <div className={`px-4 py-2 rounded-full text-lg font-medium ${
                  selectedSessionForDetails.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                  selectedSessionForDetails.status === 'no_show' ? 'bg-red-100 text-red-800' :
                  selectedSessionForDetails.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedSessionForDetails.status === 'no_show' ? 'No Show' :
                   selectedSessionForDetails.status === 'booked' ? 'Booked' :
                   selectedSessionForDetails.status?.charAt(0).toUpperCase() + selectedSessionForDetails.status?.slice(1) || 'Unknown'}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  ${selectedSessionForDetails.price || 0}
                </div>
              </div>

              {/* Patient and Doctor Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    Patient Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold text-gray-700">Full Name:</span>
                      <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.patient_name}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Email:</span>
                      <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.patient_email}</p>
                    </div>
                    {selectedSessionForDetails.patient_phone && (
                      <div>
                        <span className="font-semibold text-gray-700">Phone:</span>
                        <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.patient_phone}</p>
                      </div>
                    )}
                    {selectedSessionForDetails.child_name && (
                      <div>
                        <span className="font-semibold text-gray-700">Child Name:</span>
                        <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.child_name}</p>
                      </div>
                    )}
                    {selectedSessionForDetails.child_age && (
                      <div>
                        <span className="font-semibold text-gray-700">Child Age:</span>
                        <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.child_age} years</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Doctor Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold text-gray-700">Full Name:</span>
                      <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.doctor_name}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Doctor ID:</span>
                      <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.doctor_id}</p>
                    </div>
                    {selectedSessionForDetails.psychologist && selectedSessionForDetails.psychologist.area_of_expertise && (
                      <div>
                        <span className="font-semibold text-gray-700">Areas of Expertise:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedSessionForDetails.psychologist.area_of_expertise.map((expertise, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {expertise}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="font-semibold text-gray-700">Session ID:</span>
                    <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.id}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Scheduled Date:</span>
                    <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.scheduled_date || selectedSessionForDetails.date}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Scheduled Time:</span>
                    <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.scheduled_time || selectedSessionForDetails.time}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Session Type:</span>
                    <p className="text-lg text-gray-900 mt-1">{selectedSessionForDetails.session_type}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowSessionDetailsModal(false);
                    handleBookingAction(selectedSessionForDetails.id, 'edit');
                  }}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Session</span>
                </button>
                
                {selectedSessionForDetails.status !== 'completed' && (
                  <button
                    onClick={() => {
                      setShowSessionDetailsModal(false);
                      handleBookingAction(selectedSessionForDetails.id, 'mark_completed');
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Mark Complete</span>
                  </button>
                )}
                
                {selectedSessionForDetails.status !== 'no_show' && (
                  <button
                    onClick={() => {
                      setShowSessionDetailsModal(false);
                      handleBookingAction(selectedSessionForDetails.id, 'mark_no_show');
                    }}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                  >
                    <User className="w-5 h-5" />
                    <span>Mark No Show</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleReschedule(selectedSessionForDetails)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Reschedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedSessionForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reschedule Session</h2>
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedSessionForDetails(null);
                  setRescheduleData({ date: '', time: '', duration: 60 });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSessionForDetails.patient_name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSessionForDetails.doctor_name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Date *
                </label>
                <input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Time *
                </label>
                <input
                  type="time"
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={rescheduleData.duration}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, duration: parseInt(e.target.value) || 60 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="15"
                  max="180"
                  step="15"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedSessionForDetails(null);
                    setRescheduleData({ date: '', time: '', duration: 60 });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Reschedule Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
