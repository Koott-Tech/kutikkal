"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { psychologistApi } from "../../../lib/backendApi";
import { useNotification } from "../../../contexts/NotificationContext";
import TimeBlockingModal from "../../../components/TimeBlockingModal";
import BlockedTimeSlots from "../../../components/BlockedTimeSlots";
import AvailabilityModal from "../../../components/AvailabilityModal";
import { 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Shield
} from "lucide-react";

export default function PsychologistAvailability() {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [availability, setAvailability] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Availability management state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState(null);

  // Time blocking state
  const [showBlockingModal, setShowBlockingModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadAvailability();
    }
  }, [user]);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const availabilityData = await psychologistApi.getAvailability();
      console.log('Raw availability data from backend:', availabilityData);
      
      // Clean up duplicate time slots for each date
      const cleanedAvailability = (availabilityData.data || []).map(day => ({
        ...day,
        time_slots: Array.from(new Set(day.time_slots)).sort()
      }));
      
      console.log('Cleaned availability data:', cleanedAvailability);
      setAvailability(cleanedAvailability);
    } catch (err) {
      console.error('Error loading availability:', err);
      setError(err.message);
      showError(`Failed to load availability: ${err.message}`, 'Load Error');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clean up duplicates in the database
  const cleanupDuplicates = async () => {
    try {
      const availabilityData = await psychologistApi.getAvailability();
      const cleanedData = (availabilityData.data || []).map(day => ({
        ...day,
        time_slots: Array.from(new Set(day.time_slots)).sort()
      }));
      
      // Update each availability entry to remove duplicates
      for (const day of cleanedData) {
        if (day.time_slots.length > 0) {
          await psychologistApi.updateAvailability({
            date: day.date,
            time_slots: day.time_slots
          });
        }
      }
      
      // Reload the data
      await loadAvailability();
      setError(null);
    } catch (err) {
      console.error('Error cleaning up duplicates:', err);
      setError('Failed to clean up duplicate time slots');
    }
  };

  // Time blocking function
  const handleBlockTimeSlots = async (blockingData) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        showError('Please log in to block time slots');
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api'}/psychologists/block-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blockingData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          showError('Please log in to block time slots');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to block time slots');
      }

      // Reload availability to reflect blocked slots
      await loadAvailability();
    } catch (error) {
      console.error('Error blocking time slots:', error);
      throw error;
    }
  };

  const handleAddAvailability = async (availabilityData, isUpdate = false) => {
    try {
      let response;
      if (isUpdate) {
        response = await psychologistApi.updateAvailability(availabilityData);
      } else {
        response = await psychologistApi.addAvailability(availabilityData);
      }

      // Check if any slots were blocked due to Google Calendar conflicts
      if (response.data?.blocked_count > 0) {
        showError(
          `⚠️ ${response.data.blocked_count} slot(s) were automatically blocked due to Google Calendar conflicts: ${response.data.blocked_slots.join(', ')}`,
          'Calendar Conflict Detected'
        );
      } else {
        showSuccess(isUpdate ? 'Availability updated successfully' : 'Availability added successfully', 'Success');
      }

      // Reload availability data
      await loadAvailability();
      
      setError(null);
    } catch (err) {
      console.error('Error adding availability:', err);
      setError(err.message);
      showError(err.message || 'Failed to add availability', 'Add Error');
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleEditAvailability = async (updatedData) => {
    try {
      // Guard: require at least one time slot
      if (!updatedData.time_slots || updatedData.time_slots.length === 0) {
        setError('Please select at least one time slot');
        return;
      }

      // Normalize date to YYYY-MM-DD (ISO8601 date)
      const normalizedDate = (() => {
        try {
          const d = new Date(updatedData.date);
          if (Number.isNaN(d.getTime())) return updatedData.date; // fallback
          return d.toISOString().split('T')[0];
        } catch (_) {
          return updatedData.date;
        }
      })();

      // Sanitize time slots to HH:MM and ensure uniqueness
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      const sanitizedSlots = Array.from(
        new Set(
          (updatedData.time_slots || [])
            .map((t) => (typeof t === 'string' ? t.trim() : String(t)))
            .filter((t) => timeRegex.test(t))
        )
      ).sort(); // Sort for consistent display

      if (sanitizedSlots.length === 0) {
        setError('Invalid time slots. Please pick valid HH:MM times.');
        return;
      }

      // Extract only the required fields for the API
      const availabilityData = {
        date: normalizedDate,
        time_slots: sanitizedSlots
      };
      // Debug payload
      console.log('Updating availability with payload:', availabilityData);
      
      const response = await psychologistApi.updateAvailability(availabilityData);
      
      // Check if any slots were blocked due to Google Calendar conflicts
      if (response.data?.blocked_count > 0) {
        showError(
          `⚠️ ${response.data.blocked_count} slot(s) were automatically blocked due to Google Calendar conflicts: ${response.data.blocked_slots.join(', ')}`,
          'Calendar Conflict Detected'
        );
      } else {
        showSuccess('Availability updated successfully', 'Success');
      }
      
      // Reset edit state and close modal
      setEditingAvailability(null);
      
      // Reload availability data
      await loadAvailability();
      
      setError(null);
    } catch (err) {
      console.error('Error updating availability (frontend catch):', err);
      setError(err.message);
      showError(err.message || 'Failed to update availability', 'Update Error');
    }
  };

  const handleDeleteAvailability = async (availabilityId) => {
    if (!confirm('Are you sure you want to delete this availability?')) {
      return;
    }

    try {
      await psychologistApi.deleteAvailability(availabilityId);
      
      // Reload availability data
      await loadAvailability();
      
      setError(null);
    } catch (err) {
      console.error('Error deleting availability:', err);
      setError(err.message);
    }
  };

  const openEditMode = (availability) => {
    setEditingAvailability(availability);
  };

  const closeEditMode = () => {
    setEditingAvailability(null);
    setError(null);
  };


  const formatTimeForDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h6 className="font-semibold text-gray-900">Availability Management</h6>
          <p className="mt-2 text-sm text-gray-700">
            Set your available time slots for client bookings.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex flex-wrap gap-2">
          <button
            onClick={cleanupDuplicates}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Clean Duplicates
          </button>
          <button
            onClick={() => setShowBlockingModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Shield className="h-4 w-4 mr-2" />
            Block Time
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Availability
          </button>
        </div>
      </div>

      {/* Current Availability */}
      <div className="mt-8">
        <p className="font-medium text-gray-900 mb-4">Current Availability</p>
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="font-medium text-gray-900">Your Available Time Slots</p>
          </div>
          <div className="p-6">
            {availability.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">No availability set</p>
                <p className="mt-1 text-sm text-gray-500">
                  Click &quot;Add New Availability&quot; to add your available time slots.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availability.map((day) => (
                  <div key={day.id} className="border rounded-lg p-3 sm:p-4">
                    {editingAvailability?.id === day.id ? (
                      // Edit Mode
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-medium text-gray-900">
                            {new Date(day.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditAvailability(editingAvailability)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Save changes"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={closeEditMode}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                              title="Cancel edit"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Time Slots Editor */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time Slots</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                              <button
                                key={time}
                                onClick={() => {
                                  const slots = editingAvailability.time_slots.includes(time)
                                    ? editingAvailability.time_slots.filter(t => t !== time)
                                    : [...editingAvailability.time_slots, time];
                                  setEditingAvailability({...editingAvailability, time_slots: slots});
                                }}
                                className={`p-2 text-xs sm:text-sm rounded border transition-colors ${
                                  editingAvailability.time_slots.includes(time)
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                                }`}
                              >
                                {formatTimeForDisplay(time)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-medium text-gray-900">
                            {new Date(day.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openEditMode(day)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Edit availability"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAvailability(day.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete availability"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {day.time_slots.map((time, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800"
                            >
                              {formatTimeForDisplay(time)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Availability Modal */}
      <AvailabilityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddAvailability={handleAddAvailability}
      />

      {/* Blocked Time Slots */}
      <div className="mt-8">
        <BlockedTimeSlots psychologistId={user?.id} />
      </div>

      {/* Time Blocking Modal */}
      <TimeBlockingModal
        isOpen={showBlockingModal}
        onClose={() => setShowBlockingModal(false)}
        onBlock={handleBlockTimeSlots}
      />
    </div>
  );
}
