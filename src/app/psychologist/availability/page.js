"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { psychologistApi } from "../../../lib/backendApi";
import { 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from "lucide-react";

export default function PsychologistAvailability() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Availability management state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [newAvailability, setNewAvailability] = useState({
    date: '',
    time_slots: []
  });

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

  const handleAddAvailability = async () => {
    try {
      if (!newAvailability.date || newAvailability.time_slots.length === 0) {
        setError('Please select a date and at least one time slot');
        return;
      }

      await psychologistApi.addAvailability(newAvailability);

      // Reset form and close modal
      setNewAvailability({ date: '', time_slots: [] });
      setShowAddModal(false);
      
      // Reload availability data
      await loadAvailability();
      
      setError(null);
    } catch (err) {
      console.error('Error adding availability:', err);
      setError(err.message);
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
      
      await psychologistApi.updateAvailability(availabilityData);
      
      // Reset edit state and close modal
      setEditingAvailability(null);
      
      // Reload availability data
      await loadAvailability();
      
      setError(null);
    } catch (err) {
      console.error('Error updating availability (frontend catch):', err);
      setError(err.message);
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

  const openAddModal = () => {
    setShowAddModal(true);
    setNewAvailability({ date: '', time_slots: [] });
    setError(null);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewAvailability({ date: '', time_slots: [] });
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
          <h1 className="text-2xl font-semibold text-gray-900">Availability Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Set your available time slots for client bookings.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
          <button
            onClick={cleanupDuplicates}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Clean Duplicates
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Availability
          </button>
        </div>
      </div>

      {/* Current Availability */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Availability</h2>
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Your Available Time Slots</h3>
          </div>
          <div className="p-6">
            {availability.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No availability set</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Click &quot;Add New Availability&quot; to add your available time slots.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availability.map((day) => (
                  <div key={day.id} className="border rounded-lg p-4">
                    {editingAvailability?.id === day.id ? (
                      // Edit Mode
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-900">
                            {new Date(day.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h4>
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
                          <div className="grid grid-cols-3 gap-2">
                            {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                              <button
                                key={time}
                                onClick={() => {
                                  const slots = editingAvailability.time_slots.includes(time)
                                    ? editingAvailability.time_slots.filter(t => t !== time)
                                    : [...editingAvailability.time_slots, time];
                                  setEditingAvailability({...editingAvailability, time_slots: slots});
                                }}
                                className={`p-2 text-sm rounded border transition-colors ${
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
                          <h4 className="font-medium text-gray-900">
                            {new Date(day.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h4>
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
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
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
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Availability</h3>
              <button
                onClick={closeAddModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newAvailability.date}
                  onChange={(e) => setNewAvailability({...newAvailability, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slots</label>
                <p className="text-sm text-gray-600 mb-2">Click on time slots to select/deselect them</p>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        const slots = newAvailability.time_slots.includes(time)
                          ? newAvailability.time_slots.filter(t => t !== time)
                          : [...newAvailability.time_slots, time];
                        setNewAvailability({...newAvailability, time_slots: slots});
                      }}
                      className={`p-2 text-sm rounded border transition-colors ${
                        newAvailability.time_slots.includes(time)
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

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAvailability}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Availability
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
