'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  User,
  Mail,
  Calendar
} from 'lucide-react';
import { adminApi } from '@/lib/backendApi';
import UserModal from '@/components/UserModal';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isFullProfileOpen, setIsFullProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getUsers();
      
      if (response && response.success && response.data && response.data.users) {
        // Filter out psychologists (they're managed in doctors page)
        const clientUsers = response.data.users.filter(user => user.role === 'client');
        setUsers(clientUsers);
      } else {
        console.warn('Invalid response structure:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      showNotification('Failed to load users', 'error');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.name || user.email}?`)) {
      return;
    }

    try {
      await adminApi.deleteUser(user.id);
      showNotification('User deleted successfully', 'success');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Failed to delete user', 'error');
    }
  };

  const openFullProfile = (user) => {
    setSelectedUser(user);
    setIsFullProfileOpen(true);
  };

  const handleUserModalClose = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleUserModalSuccess = () => {
    handleUserModalClose();
    loadUsers();
    showNotification(
      editingUser ? 'User updated successfully' : 'User added successfully',
      'success'
    );
  };

  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => setNotificationMessage(''), 3000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile?.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile?.child_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const roles = [...new Set(users.map(u => u.role).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage client users and their accounts on the platform
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or child name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user.name || 'No Name'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              {user.profile?.first_name && user.profile?.last_name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{user.profile.first_name} {user.profile.last_name}</span>
                </div>
              )}
              {user.profile?.phone_number && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user.profile.phone_number}</span>
                </div>
              )}
              {user.profile?.child_name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Child: {user.profile.child_name} ({user.profile.child_age} years)</span>
                </div>
              )}
              {user.created_at && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); openFullProfile(user); }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleEditUser(user); }}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteUser(user); }}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterRole !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first user.'
            }
          </p>
          {!searchTerm && filterRole === 'all' && (
            <div className="mt-6">
              <button
                onClick={handleAddUser}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          )}
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <UserModal
          isOpen={isUserModalOpen}
          onClose={handleUserModalClose}
          onSuccess={handleUserModalSuccess}
          user={editingUser}
        />
      )}

      {/* Full Profile Modal */}
      {isFullProfileOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                <button
                  onClick={() => setIsFullProfileOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUser.profile?.first_name && selectedUser.profile?.last_name 
                          ? `${selectedUser.profile.first_name} ${selectedUser.profile.last_name}`
                          : 'Not provided'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.profile?.phone_number || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.role}</p>
                    </div>
                  </div>
                </div>

                {/* Child Information (for clients) */}
                {selectedUser.role === 'client' && (selectedUser.profile?.child_name || selectedUser.profile?.child_age) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Child Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Child Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.profile?.child_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Child Age</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedUser.profile?.child_age ? `${selectedUser.profile.child_age} years old` : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {selectedUser.created_at && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Member Since</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedUser.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Account Status</label>
                        <p className="mt-1 text-sm text-gray-900">Active</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsFullProfileOpen(false);
                      handleEditUser(selectedUser);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsFullProfileOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notificationMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notificationType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
}
