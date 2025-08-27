"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Calendar, Users, FileText, Plus, Edit, Trash2, Eye, Shield, Settings, Activity } from 'lucide-react';
import { doctorsApi, usersApi, bookingsApi, dashboardApi } from '@/lib/api';
import DoctorModal from '@/components/DoctorModal';
import UserModal from '@/components/UserModal';

export default function SuperAdminPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalDoctors: 0,
    totalSessions: 0,
    totalAdmins: 0,
    systemHealth: 'excellent'
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admins, setAdmins] = useState([]);
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

  // Helper function to filter bookings by status
  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  // Get counts for each booking status
  const scheduledBookings = getBookingsByStatus('scheduled');
  const noShowBookings = getBookingsByStatus('no_show');
  const completedBookings = getBookingsByStatus('completed');

  useEffect(() => {
    loadDashboardData();
    loadDoctors();
    loadUsers();
    loadBookings();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load dashboard stats
      const statsData = await dashboardApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setStats({
        totalUsers: 0,
        totalBookings: 0,
        totalDoctors: 0,
        totalSessions: 0,
        totalAdmins: 0,
        systemHealth: 'excellent'
      });
    }

    try {
      // Load recent users
      const usersData = await dashboardApi.getRecentUsers();
      setRecentUsers(usersData);
    } catch (error) {
      console.error('Error loading recent users:', error);
      setRecentUsers([]);
    }

    try {
      // Load recent bookings
      const bookingsData = await dashboardApi.getRecentBookings();
      setRecentBookings(bookingsData);
    } catch (error) {
      console.error('Error loading recent bookings:', error);
      setRecentBookings([]);
    }
  };

  const loadDoctors = async () => {
    try {
      const doctorsData = await doctorsApi.getAll();
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
    }
  };

  const loadUsers = async () => {
    try {
      console.log('Loading patients (users) from API...');
      
              // Load only regular users (patients/clients), not psychologists
      const usersData = await usersApi.getAll();
      
      console.log('Users data received:', usersData);
      
      // Filter and transform only regular users (patients)
      const validUsers = (usersData || []).filter(user => 
        user && 
        user.id && 
        typeof user.id === 'string' && 
        user.id.length > 0 &&
        user.name &&
        user.role === 'client' // Only show clients, not psychologists or admins
      ).map(user => ({
        ...user,
        type: 'user',
        displayName: user.name,
        displayRole: 'Patient/Client'
      }));
      
      console.log('Valid patients:', validUsers);
      setUsers(validUsers);
    } catch (error) {
      console.error('Error loading patients:', error);
      setUsers([]);
    }
  };

  const loadBookings = async () => {
    try {
      console.log('Loading bookings from API...');
      const bookingsData = await bookingsApi.getAll();
      console.log('Bookings data received:', bookingsData);
      
      // Ensure we always have an array
      if (!bookingsData) {
        console.log('No bookings data received, setting empty array');
        setBookings([]);
        return;
      }
      
      // Filter out any dummy data and ensure proper structure
      const validBookings = bookingsData.filter(booking => 
        booking && 
        booking.id && 
        typeof booking.id === 'string' && 
        booking.id.length > 0
      );
      
      console.log('Valid bookings after filtering:', validBookings);
      setBookings(validBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      console.log('Setting empty bookings array due to error');
      setBookings([]);
    }
  };

  const handleUserAction = (userId, action) => {
    console.log(`${action} user ${userId}`);
    // Implement user actions
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
        // TODO: Implement reschedule functionality
        alert('Reschedule functionality coming soon!');
        break;
      case 'mark_completed':
        handleUpdateBookingStatus(bookingId, 'completed');
        break;
      case 'mark_no_show':
        handleUpdateBookingStatus(bookingId, 'no_show');
        break;
      case 'mark_scheduled':
        handleUpdateBookingStatus(bookingId, 'scheduled');
        break;
      default:
        console.log('Unknown action:', action);
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
        const result = await bookingsApi.delete(bookingId);
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

      const result = await bookingsApi.update(bookingId, updatedBooking);
      console.log('Booking update response:', result);
      
      console.log('Booking status updated successfully');
      
      // Refresh bookings
      await loadBookings();
      
      alert(`Booking status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert(`Error updating booking status: ${error.message}`);
    }
  };

  // Function to handle booking editing
  const handleEditBooking = async (bookingData) => {
    try {
      console.log('Editing booking with data:', bookingData);
      
      if (!selectedBooking || !selectedBooking.id) {
        alert('No booking selected for editing');
        return;
      }

      const result = await bookingsApi.update(selectedBooking.id, bookingData);
      console.log('Booking edit response:', result);
      
      console.log('Booking updated successfully');
      
      // Close modal and refresh data
      setShowEditBookingModal(false);
      setSelectedBooking(null);
      await loadBookings();
      
      alert('Booking updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(`Error updating booking: ${error.message}`);
    }
  };

  const handleAddDoctor = async (doctorData) => {
    try {
      const newDoctor = await doctorsApi.create(doctorData);
      setDoctors(prev => [...prev, newDoctor]);
      setShowAddDoctorModal(false);
      // Refresh dashboard stats
      loadDashboardData();
    } catch (error) {
      console.error('Error adding doctor:', error);
      throw error;
    }
  };

  const handleEditDoctor = async (doctorData) => {
    try {
      const updatedDoctor = await doctorsApi.update(selectedDoctor.id, doctorData);
      setDoctors(prev => prev.map(doc => 
        doc.id === selectedDoctor.id ? updatedDoctor : doc
      ));
      setShowEditDoctorModal(false);
      setSelectedDoctor(null);
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw error;
    }
  };



  const openEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowEditDoctorModal(true);
  };

  const openFullProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setIsFullProfileOpen(true);
  };

  const handleAddUser = async (userData) => {
    try {
      const newUser = await usersApi.create(userData);
      setUsers(prev => [...prev, newUser]);
      setShowAddUserModal(false);
      // Refresh dashboard stats
      loadDashboardData();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const handleEditUser = async (userData) => {
    try {
      const updatedUser = await usersApi.update(userData.id, userData);
      setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
      setShowEditUserModal(false);
      setSelectedUser(null);
      // Refresh dashboard stats
      loadDashboardData();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersApi.delete(userId);
        setUsers(prev => prev.filter(user => user.id !== userId));
        // Refresh dashboard stats
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!doctorId) {
      console.error('No doctor ID provided for deletion');
      alert('Error: No doctor ID provided');
      return;
    }

    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        console.log('Attempting to delete doctor with ID:', doctorId);
        
        const result = await doctorsApi.delete(doctorId);
        console.log('Delete doctor result:', result);
        
        // Remove doctor from local state
        setUsers(prev => prev.filter(user => user.id !== doctorId));
        setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
        
        // Refresh dashboard data
        await loadDashboardData();
        await loadDoctors();
        
        alert('Staff member deleted successfully');
      } catch (error) {
        console.error('Error deleting doctor:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to delete staff member';
        
        if (error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Permission denied. You cannot delete this staff member.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Staff member not found.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const openEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

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
            Add New User
          </button>
          <button
            onClick={() => setShowAddDoctorModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Staff
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all duration-200 w-full ${
            user.type === 'staff' ? 'border-green-200 bg-green-50' : 'border-gray-200'
          }`}>
            {/* Top Section - User's Identity & Primary Info */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                {/* Avatar with type indicator */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                  user.type === 'staff' ? 'bg-green-200' : 'bg-gray-200'
                }`}>
                  <span className={`text-xl font-semibold ${
                    user.type === 'staff' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {user.displayName ? user.displayName.split(' ').map(n => n.charAt(0)).join('') : 'U'}
                  </span>
                </div>
                
                {/* Name & Email */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{user.displayName || 'Unknown User'}</h3>
                    {/* Type badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'staff' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.type === 'staff' ? '👨‍⚕️ Staff' : '👤 Client'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                <div className="text-base font-bold text-gray-900">{user.displayRole || 'User'}</div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3 text-center">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Status</div>
                <div className="text-base font-bold text-gray-900">
                  {user.type === 'staff' 
                    ? (user.is_active !== false ? 'Active' : 'Inactive')
                    : (user.is_active ? 'Active' : 'Inactive')
                  }
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3 text-center">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Type</div>
                <div className="text-base font-bold text-gray-900">
                  {user.type === 'staff' ? 'Staff Member' : 'Client User'}
                </div>
              </div>
            </div>

            {/* Staff-specific information */}
            {user.type === 'staff' && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Staff Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {user.specializations && (
                    <div>
                      <span className="text-sm font-medium text-green-700">Specializations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Array.isArray(user.specializations) ? user.specializations.map((spec, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {spec}
                          </span>
                        )) : (
                          <span className="text-sm text-gray-600">Not specified</span>
                        )}
                      </div>
                    </div>
                  )}
                  {user.price && (
                    <div>
                      <span className="text-sm font-medium text-green-700">Session Price:</span>
                      <span className="ml-2 text-sm text-green-800">${user.price}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Section - User ID & Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                ID: {user.id?.substring(0, 8) || 'user_no_id'}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => user.type === 'staff' ? openEditDoctor(user) : openEditUser(user)}
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
                    if (user.type === 'staff') {
                      handleDeleteDoctor(user.id);
                    } else {
                      handleDeleteUser(user.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
              {status === 'scheduled' ? 'Upcoming and scheduled sessions' :
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
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {statusTitle.toLowerCase()} bookings found</h3>
              <p className="text-gray-500">
                {status === 'scheduled' ? 'Scheduled bookings will appear here.' :
                 status === 'no_show' ? 'No-show bookings will appear here.' :
                 status === 'completed' ? 'Completed bookings will appear here.' :
                 'Bookings will appear here once they are created.'}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 w-full">
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
                    booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'no_show' ? 'bg-red-100 text-red-800' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status === 'no_show' ? 'No Show' :
                     booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                  </div>

                  {/* Price */}
                  <div className="text-lg font-bold text-green-600">
                    ${booking.amount || 0}
                  </div>

                  {/* Booking ID */}
                  <div className="text-sm text-gray-500">
                    ID: {booking.id?.substring(0, 8) || 'N/A'}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => console.log('View booking details:', booking.id)}
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
                  
                  {booking.status !== 'scheduled' && (
                    <button
                      onClick={() => handleBookingAction(booking.id, 'mark_scheduled')}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Schedule</span>
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

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">System Health</h3>
            <p className="text-gray-600">Overall platform status and performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              stats.systemHealth === 'excellent' ? 'bg-green-500' :
              stats.systemHealth === 'good' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-900 capitalize">{stats.systemHealth}</span>
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
          {recentUsers.map((user) => (
            <div key={user.id} className="px-6 py-4 flex items-center justify-between">
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
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
                <button
                  onClick={() => handleUserAction(user.id, 'view')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{booking.patient}</p>
                <p className="text-sm text-gray-500">with {booking.doctor}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{booking.date}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
                <span className="text-sm font-medium text-gray-900">${booking.amount}</span>
                <button
                  onClick={() => handleBookingAction(booking.id, 'view')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddDoctorModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add New Doctor
          </button>
          <button
            onClick={() => router.push('/users')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Users className="w-4 h-4 inline mr-2" />
            Manage Users
          </button>
          <button
            onClick={() => router.push('/bookings')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            View Bookings
          </button>
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
      <div className="space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 w-full">
              {/* Top Section - Doctor's Identity & Primary Info */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {doctor.coverImage ? (
                      <img
                        src={doctor.coverImage}
                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-600">
                        {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  {/* Name & Specialization */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {doctor.firstName} {doctor.lastName}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full font-medium">
                        {doctor.specializations?.[0] || 'General Psychology'}
                      </span>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {doctor.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section - Pricing Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-100 rounded-md p-2 text-center">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Individual</div>
                  <div className="text-base font-bold text-gray-900">₹{doctor.price}</div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-2 text-center">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Package ×2</div>
                  <div className="text-base font-bold text-gray-900">₹{doctor.price * 2 - 200}</div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-2 text-center">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Package ×4</div>
                  <div className="text-base font-bold text-gray-900">₹{doctor.price * 4 - 800}</div>
                </div>
              </div>

              {/* Lower Middle Section - Skills/Specializations Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations?.map((spec, index) => (
                    <span key={index} className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-full font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability Section */}
              {doctor.availability && Array.isArray(doctor.availability) && doctor.availability.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Availability</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {doctor.availability.slice(0, 6).map((item, index) => (
                      <div key={index} className="bg-blue-50 rounded-md p-2 border border-blue-200">
                        <div className="font-medium text-blue-800 text-sm mb-1">{item.date}</div>
                        <div className="text-blue-600 text-xs">
                          {item.time_slots && Array.isArray(item.time_slots) ? 
                            item.time_slots.filter(ts => ts.available).map(ts => ts.displayTime).join(', ') : 
                            'No slots'}
                        </div>
                      </div>
                    ))}
                    {doctor.availability.length > 6 && (
                      <div className="bg-gray-100 rounded-md p-2 text-gray-600 text-xs font-medium flex items-center justify-center">
                        +{doctor.availability.length - 6} more days
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact & Key Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{doctor.email}</span>
                </div>
                
                {doctor.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{doctor.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <span className="font-medium text-green-600">${doctor.price}/session</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">{doctor.availability && Array.isArray(doctor.availability) && doctor.availability.length > 0 ? `${doctor.availability.length} days` : 'No availability'}</span>
                </div>
              </div>

              {/* Education & Specializations Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Education</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {doctor.education?.ug && (
                      <div className="flex items-center">
                        <span className="font-medium text-blue-600 mr-2">UG:</span>
                        <span className="truncate">{doctor.education.ug}</span>
                      </div>
                    )}
                    {doctor.education?.pg && (
                      <div className="flex items-center">
                        <span className="font-medium text-blue-600 mr-2">PG:</span>
                        <span className="truncate">{doctor.education.pg}</span>
                      </div>
                    )}
                    {doctor.education?.phd && (
                      <div className="flex items-center">
                        <span className="font-medium text-blue-600 mr-2">PhD:</span>
                        <span className="truncate">{doctor.education.phd}</span>
                      </div>
                    )}
                    {!doctor.education?.ug && !doctor.education?.pg && !doctor.education?.phd && (
                      <span className="text-gray-400">No education details</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {doctor.specializations?.map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Row */}
              {doctor.description && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {doctor.description.length > 120 ? `${doctor.description.substring(0, 120)}...` : doctor.description}
                  </p>
                </div>
              )}

              {/* Bottom Section - Doctor ID & Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  ID: {doctor.id?.substring(0, 8) || 'doc_no_id'}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => openFullProfile(doctor)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View full profile</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      {doctors.length === 0 && (
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
        return renderBookings('scheduled');
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600">System-wide management and oversight</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Super Admin Access</span>
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
                📅 Scheduled Bookings
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

      {/* Add Doctor Modal */}
      <DoctorModal
        isOpen={showAddDoctorModal}
        onClose={() => setShowAddDoctorModal(false)}
        onSave={handleAddDoctor}
        mode="add"
      />

      {/* Edit Doctor Modal */}
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

      {/* Full Profile Modal */}
      {isFullProfileOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} - Full Profile
                </h2>
                <button
                  onClick={() => setIsFullProfileOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Profile Image */}
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                      {selectedDoctor.coverImage ? (
                        <img
                          src={selectedDoctor.coverImage}
                          alt={`Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-semibold text-gray-600">
                          {selectedDoctor.firstName?.charAt(0)}{selectedDoctor.lastName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                    </h3>
                    <p className="text-gray-600">{selectedDoctor.specializations?.[0] || 'General Psychology'}</p>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">{selectedDoctor.email}</span>
                      </div>
                      {selectedDoctor.phone && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700">{selectedDoctor.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Individual Session:</span>
                        <span className="font-semibold">₹{selectedDoctor.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package ×2:</span>
                        <span className="font-semibold">₹{selectedDoctor.price * 2 - 200}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package ×4:</span>
                        <span className="font-semibold">₹{selectedDoctor.price * 4 - 800}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Education */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Education</h4>
                    <div className="space-y-2">
                      {selectedDoctor.education?.ug && (
                        <div>
                          <span className="font-medium text-blue-600">UG:</span>
                          <span className="ml-2 text-gray-700">{selectedDoctor.education.ug}</span>
                        </div>
                      )}
                      {selectedDoctor.education?.pg && (
                        <div>
                          <span className="font-medium text-blue-600">PG:</span>
                          <span className="ml-2 text-gray-700">{selectedDoctor.education.pg}</span>
                        </div>
                      )}
                      {selectedDoctor.education?.phd && (
                        <div>
                          <span className="font-medium text-blue-600">PhD:</span>
                          <span className="ml-2 text-gray-700">{selectedDoctor.education.phd}</span>
                        </div>
                      )}
                      {!selectedDoctor.education?.ug && !selectedDoctor.education?.pg && !selectedDoctor.education?.phd && (
                        <span className="text-gray-400">No education details available</span>
                      )}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.specializations?.map((spec, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  {selectedDoctor.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">About</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedDoctor.description}</p>
                    </div>
                  )}

                  {/* Availability */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Availability</h4>
                    {selectedDoctor.availability && Array.isArray(selectedDoctor.availability) && selectedDoctor.availability.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {selectedDoctor.availability.map((item, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="font-semibold text-gray-800 mb-1">{item.date}</div>
                            <div className="text-gray-600">
                              {item.time_slots && Array.isArray(item.time_slots) ? 
                                item.time_slots.filter(ts => ts.available).map(ts => ts.displayTime).join(', ') : 
                                'No slots'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No availability set</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsFullProfileOpen(false);
                    openEditDoctor(selectedDoctor);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setIsFullProfileOpen(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <UserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSave={handleAddUser}
        mode="add"
      />

      {/* Edit User Modal */}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Booking</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Type
                </label>
                <input
                  type="text"
                  defaultValue={selectedBooking.session_type || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="sessionType"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  defaultValue={selectedBooking.date || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="bookingDate"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  defaultValue={selectedBooking.time || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="bookingTime"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  defaultValue={selectedBooking.duration || 60}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="bookingDuration"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  defaultValue={selectedBooking.amount || 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="bookingAmount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  defaultValue={selectedBooking.status || 'scheduled'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="bookingStatus"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  defaultValue={selectedBooking.notes || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="bookingNotes"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
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
                    duration: parseInt(document.getElementById('bookingDuration').value),
                    amount: parseFloat(document.getElementById('bookingAmount').value),
                    status: document.getElementById('bookingStatus').value,
                    notes: document.getElementById('bookingNotes').value
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
    </div>
  );
}
}
