'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Clock,
  Calendar,
  GripVertical
} from 'lucide-react';
import { adminApi } from '@/lib/backendApi';
import DoctorModal from '@/components/DoctorModal';
import PsychologistCalendarView from '@/components/PsychologistCalendarView';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

const getDoctorImageUrl = (doctor) => {
  if (!doctor) return null;

  const possibleFields = [
    doctor.profile_image_url,
    doctor.cover_image_url,
    doctor.profile_image,
    doctor.photo_url,
    doctor.avatar_url,
    doctor.image_url,
    doctor.image,
  ];

  for (const field of possibleFields) {
    if (typeof field === 'string' && field.trim()) {
      return field;
    }
  }

  if (doctor.photos && Array.isArray(doctor.photos) && doctor.photos.length > 0) {
    return doctor.photos.find(Boolean);
  }

  if (doctor.media && doctor.media.profile && doctor.media.profile.url) {
    return doctor.media.profile.url;
  }

  return null;
};

export default function DoctorsPage() {
  const { showError, showSuccess } = useNotification();
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [isFullProfileOpen, setIsFullProfileOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isCalendarViewOpen, setIsCalendarViewOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  useEffect(() => {
    // Check authentication and role
    if (!authLoading) {
      if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
        return;
      }
      
      if (!hasRole('admin') && !hasRole('superadmin')) {
        console.log('User does not have admin privileges, redirecting to profile');
        router.push('/profile');
        return;
      }
      
      // User is authenticated and has admin role, load doctors data
      loadDoctors();
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      // console.log('Loading psychologists directly from psychologists table...');
      
      // Use the dedicated psychologists endpoint
      const response = await adminApi.getPsychologists();
      
      // Avoid logging entire doctor objects in admin console for privacy and performance
      // console.log('API Response OK');
      
      if (response && response.success && response.data && response.data.users) {
        // Backend returns psychologists in users array format
        const doctorsData = response.data.users;
        // console.log('Doctors loaded:', doctorsData.map(d => ({ id: d.id || d.psychologist_id, name: d.name })));
        setDoctors(doctorsData);
      } else {
        console.warn('Invalid response structure:', response);
        setDoctors([]);
      }
    } catch (error) {
      console.error('Failed to load doctors:', error);
      
      // Check if it's an authentication error
      if (error.message && (error.message.includes('401') || error.message.includes('unauthorized') || error.message.includes('token'))) {
        console.log('Authentication error detected, redirecting to login');
        router.push('/login');
        return;
      }
      
      showError('Failed to load doctors', 'Load Error');
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
      showSuccess('Doctor deleted successfully');
      loadDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      showError('Failed to delete doctor', 'Delete Error');
    }
  };

  const handleUpdateAllAvailability = async () => {
    if (!confirm('This will add default availability (8 AM - 10 PM for 3 weeks) to ALL existing psychologists. Continue?')) {
      return;
    }

    try {
      showSuccess('Updating availability for all psychologists...', 'Processing');
      const response = await adminApi.updateAllPsychologistsAvailability();
      if (response && response.success) {
        showSuccess(`Successfully updated ${response.data?.updated || 0} psychologists with default availability`, 'Success');
      } else {
        showError(response?.data?.message || 'Failed to update availability', 'Update Error');
      }
    } catch (error) {
      console.error('Error updating all psychologists availability:', error);
      showError('Failed to update availability for all psychologists', 'Update Error');
    }
  };

  const openFullProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setIsFullProfileOpen(true);
  };

  const openCalendarView = (doctor) => {
    setSelectedDoctor(doctor);
    setIsCalendarViewOpen(true);
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
        showSuccess('Doctor updated successfully');
      } else {
        // Create new doctor
        await adminApi.createPsychologist(doctorData);
        showSuccess('Doctor added successfully');
      }
      
      handleDoctorModalClose();
      console.log('Refreshing doctors data after save...');
      await loadDoctors(); // Wait for the data to load
      console.log('Doctors data refreshed');
    } catch (error) {
      console.error('Error saving doctor:', error);
      showError('Failed to save doctor', 'Save Error');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Work with the full doctors list, not filtered
    const newDoctors = [...doctors];
    
    // Find the actual indices in the full doctors array
    const draggedDoctorInFiltered = filteredDoctors[draggedIndex];
    const dropDoctorInFiltered = filteredDoctors[dropIndex];
    
    const draggedIndexInFull = newDoctors.findIndex(d => d.id === draggedDoctorInFiltered.id);
    const dropIndexInFull = newDoctors.findIndex(d => d.id === dropDoctorInFiltered.id);
    
    if (draggedIndexInFull === -1 || dropIndexInFull === -1) {
      setDraggedIndex(null);
      return;
    }

    // Reorder in the full doctors array
    const draggedDoctor = newDoctors[draggedIndexInFull];
    newDoctors.splice(draggedIndexInFull, 1);
    newDoctors.splice(dropIndexInFull, 0, draggedDoctor);

    // Update display_order for all doctors based on their new position (sequential: 1, 2, 3...)
    setIsUpdatingOrder(true);
    try {
      const updatePromises = newDoctors.map((doctor, index) => {
        const newOrder = index + 1; // Sequential order starting from 1
        const doctorId = doctor.psychologist_id || doctor.id;
        // Always update to ensure sequential ordering without gaps or duplicates
        return adminApi.updatePsychologist(doctorId, { display_order: newOrder });
      });

      await Promise.all(updatePromises);
      showSuccess('Doctor order updated successfully');
      await loadDoctors(); // Reload to get updated order
    } catch (error) {
      console.error('Error updating doctor order:', error);
      showError('Failed to update doctor order', 'Update Error');
      await loadDoctors(); // Reload to revert changes
    } finally {
      setIsUpdatingOrder(false);
      setDraggedIndex(null);
    }
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show loading while checking authentication or loading data
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
          <h6>Doctors Management</h6>
          <p className="mt-1 text-sm text-gray-600">
            Manage psychologists and therapists on the platform
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleAddDoctor}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </button>
          <button
            onClick={handleUpdateAllAvailability}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Add default availability (8 AM - 10 PM for 3 weeks) to all existing psychologists"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Update All Availability
          </button>
        </div>
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

      {/* Doctors List */}
      {(searchTerm || filterSpecialty !== 'all') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <p>⚠️ Drag and drop reordering works with the full list. Clear filters to see all doctors in order.</p>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {filteredDoctors.map((doctor, filteredIndex) => {
          // Find the position in the full doctors array for accurate order number
          const fullIndex = doctors.findIndex(d => d.id === doctor.id);
          const displayOrder = doctor.display_order !== null && doctor.display_order !== undefined 
            ? doctor.display_order 
            : (fullIndex >= 0 ? fullIndex + 1 : filteredIndex + 1);
          const isDragging = draggedIndex === filteredIndex;
          
          return (
          <div
            key={doctor.id}
              draggable={!isUpdatingOrder}
              onDragStart={(e) => handleDragStart(e, filteredIndex)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, filteredIndex)}
              className={`bg-white border-2 transition-all p-6 w-full rounded-[10px] ${
                isDragging 
                  ? 'opacity-50 border-blue-400 shadow-lg cursor-grabbing' 
                  : 'border-gray-200 shadow-sm hover:shadow-md cursor-move hover:border-gray-300'
              } ${isUpdatingOrder ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                  {/* Order Number and Drag Handle */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-300">
                      <span className="text-blue-700 font-bold text-base">{displayOrder}</span>
                    </div>
                    <div className="p-1 rounded hover:bg-gray-100 transition-colors">
                      <GripVertical className="h-5 w-5 text-gray-500 cursor-grab active:cursor-grabbing" />
                    </div>
                  </div>
                  
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {getDoctorImageUrl(doctor) ? (
                    <img
                      src={getDoctorImageUrl(doctor)}
                      alt={doctor.name || 'Doctor photo'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCheck className="h-6 w-6 text-gray-500" />
                )}
            </div>

                <div className="flex-1">
                  <h6 className="text-gray-900" style={{ fontSize: '16px', fontWeight: 600 }}>
                    {doctor.name || 'No Name'}
                  </h6>
                  <p className="text-sm text-gray-600 mt-1">{doctor.email}</p>
                  <div className="mt-3 text-sm">
              {doctor.availability && doctor.availability.length > 0 ? (
                      <span className="flex items-center text-green-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Available for sessions
                      </span>
              ) : (
                      <span className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  No availability schedule set
                      </span>
                    )}
                  </div>
                </div>
            </div>

              <div className="flex flex-wrap justify-start md:justify-end gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); openFullProfile(doctor); }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm"
                style={{ gap: '8px' }}
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openCalendarView(doctor); }}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center text-sm"
                style={{ gap: '8px' }}
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleEditDoctor(doctor); }}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center text-sm"
                style={{ gap: '8px' }}
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteDoctor(doctor); }}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center text-sm"
                style={{ gap: '8px' }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h6>No doctors found</h6>
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
                <h6>Doctor Profile</h6>
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
                  <h6>Basic Information</h6>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Individual Session Price</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDoctor.price ? `₹${selectedDoctor.price}` : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDoctor.experience_years ? `${selectedDoctor.experience_years} years` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h6>Availability</h6>

                  {selectedDoctor.availability && selectedDoctor.availability.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDoctor.availability.map((slot, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">
                            {slot.date}: {
                              slot.time_slots && Array.isArray(slot.time_slots) 
                                ? slot.time_slots.map(ts => {
                                    // Handle both string and object time slots
                                    if (typeof ts === 'string') {
                                      return ts;
                                    } else if (typeof ts === 'object' && ts !== null) {
                                      return ts.displayTime || ts.time || String(ts);
                                    } else {
                                      return String(ts);
                                    }
                                  }).join(', ')
                                : 'Available'
                            }
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

                {/* Pricing & Packages */}
                <div>
                  <h6>Pricing & Packages</h6>
                  
                  {/* Individual Session Pricing */}
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h6>Individual Session</h6>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">Price per session</span>
                      <span className="text-lg font-bold text-green-800">
                        {selectedDoctor.price ? `₹${selectedDoctor.price}` : 'Not set'}
                      </span>
                    </div>
                  </div>

                  {/* Package Information */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h6>Package Information</h6>
                    <p className="text-sm text-blue-700">
                      Package details and pricing are managed through the packages system. 
                      Individual session pricing is set above and used as the base rate for package calculations.
                    </p>
                    <div className="mt-2 text-xs text-blue-600">
                      💡 Packages provide discounts for multiple sessions booked together
                    </div>
                  </div>
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

      {/* Calendar View Modal */}
      {isCalendarViewOpen && selectedDoctor && (
        <PsychologistCalendarView
          psychologistId={selectedDoctor.psychologist_id || selectedDoctor.id}
          psychologistName={selectedDoctor.name || selectedDoctor.email}
          onClose={() => {
            setIsCalendarViewOpen(false);
            setSelectedDoctor(null);
          }}
        />
      )}

    </div>
  );
}
