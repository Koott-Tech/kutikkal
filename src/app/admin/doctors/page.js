'use client';

import { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Clock
} from 'lucide-react';
import { adminApi } from '@/lib/backendApi';
import DoctorModal from '@/components/DoctorModal';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [isFullProfileOpen, setIsFullProfileOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      console.log('Loading psychologists directly from psychologists table...');
      
      // Use the dedicated psychologists endpoint
      const response = await adminApi.getPsychologists();
      
      console.log('API Response:', response);
      
      if (response && response.success && response.data && response.data.users) {
        // Backend returns psychologists in users array format
        const doctorsData = response.data.users;
        console.log('Doctors data loaded:', doctorsData);
        setDoctors(doctorsData);
      } else {
        console.warn('Invalid response structure:', response);
        setDoctors([]);
      }
    } catch (error) {
      console.error('Failed to load doctors:', error);
      showNotification('Failed to load doctors', 'error');
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setIsDoctorModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleDeleteDoctor = async (doctor) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doctor.name || doctor.email}?`)) {
      return;
    }

    try {
      const deleteId = doctor.psychologist_id || doctor.id;
      await adminApi.deletePsychologist(deleteId);
      showNotification('Doctor deleted successfully', 'success');
      loadDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      showNotification('Failed to delete doctor', 'error');
    }
  };

  const openFullProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setIsFullProfileOpen(true);
  };

  const handleDoctorModalClose = () => {
    setIsDoctorModalOpen(false);
    setEditingDoctor(null);
  };

  const handleDoctorModalSuccess = async (doctorData) => {
    try {
      if (editingDoctor) {
        // Update existing doctor
        const deleteId = editingDoctor.psychologist_id || editingDoctor.id;
        await adminApi.updatePsychologist(deleteId, doctorData);
        showNotification('Doctor updated successfully', 'success');
      } else {
        // Create new doctor
        await adminApi.createPsychologist(doctorData);
        showNotification('Doctor added successfully', 'success');
      }
      
      handleDoctorModalClose();
      console.log('Refreshing doctors data after save...');
      await loadDoctors(); // Wait for the data to load
      console.log('Doctors data refreshed');
    } catch (error) {
      console.error('Error saving doctor:', error);
      showNotification('Failed to save doctor', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => setNotificationMessage(''), 3000);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doctor.area_of_expertise && Array.isArray(doctor.area_of_expertise) && 
                          doctor.area_of_expertise.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesSpecialty = filterSpecialty === 'all' || 
                            (doctor.area_of_expertise && Array.isArray(doctor.area_of_expertise) && 
                             doctor.area_of_expertise.includes(filterSpecialty));
    
    return matchesSearch && matchesSpecialty;
  });

  // Debug logging
  console.log('Current doctors state:', doctors);
  console.log('Filtered doctors:', filteredDoctors);
  console.log('Search term:', searchTerm);
  console.log('Filter specialty:', filterSpecialty);

  const specialties = [...new Set(doctors.flatMap(d => d.area_of_expertise || []).filter(Boolean))];

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
          <h1 className="text-2xl font-bold text-gray-900">Doctors Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage psychologists and therapists on the platform
          </p>
        </div>
        <button
          onClick={handleAddDoctor}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
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
                placeholder="Search doctors by name, email, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {doctor.name || 'No Name'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{doctor.email}</p>
                {doctor.area_of_expertise && Array.isArray(doctor.area_of_expertise) && doctor.area_of_expertise.length > 0 && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {doctor.area_of_expertise[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Availability Status */}
            <div className="mb-4">
              {doctor.availability && doctor.availability.length > 0 ? (
                <div className="flex items-center text-sm text-green-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Available for sessions
                </div>
              ) : (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  No availability schedule set
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); openFullProfile(doctor); }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleEditDoctor(doctor); }}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteDoctor(doctor); }}
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
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterSpecialty !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first doctor.'
            }
          </p>
          {!searchTerm && filterSpecialty === 'all' && (
            <div className="mt-6">
              <button
                onClick={handleAddDoctor}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Doctor
              </button>
            </div>
          )}
        </div>
      )}

      {/* Doctor Modal */}
      {isDoctorModalOpen && (
        <DoctorModal
          isOpen={isDoctorModalOpen}
          onClose={handleDoctorModalClose}
          onSave={handleDoctorModalSuccess}
          doctor={editingDoctor}
          mode={editingDoctor ? 'edit' : 'add'}
        />
      )}

      {/* Full Profile Modal */}
      {isFullProfileOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Doctor Profile</h2>
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
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDoctor.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDoctor.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialty</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDoctor.specialty || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedDoctor.role}</p>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>

                  {selectedDoctor.availability && selectedDoctor.availability.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDoctor.availability.map((slot, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">
                            {slot.date}: {slot.time_slots?.filter(ts => ts.available).map(ts => ts.displayTime).join(', ') || 'Available'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>No availability schedule set</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsFullProfileOpen(false);
                      handleEditDoctor(selectedDoctor);
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
