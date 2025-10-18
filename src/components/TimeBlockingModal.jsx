"use client";
import { useState } from "react";
import { X, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

export default function TimeBlockingModal({ isOpen, onClose, onBlock }) {
  const { showError, showSuccess } = useNotification();
  const [blockingType, setBlockingType] = useState('whole_day');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    type: 'whole_day',
    date: '',
    startDate: '',
    endDate: '',
    timeSlots: [],
    reason: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const blockingData = {
        type: blockingType,
        reason: formData.reason || 'Personal Time'
      };

      // Add type-specific data
      switch (blockingType) {
        case 'whole_day':
          if (!formData.date) {
            showError('Please select a date');
            return;
          }
          blockingData.date = formData.date;
          break;

        case 'multiple_days':
          if (!formData.startDate || !formData.endDate) {
            showError('Please select start and end dates');
            return;
          }
          blockingData.startDate = formData.startDate;
          blockingData.endDate = formData.endDate;
          break;

        case 'specific_slots':
          if (!formData.date || formData.timeSlots.length === 0) {
            showError('Please select a date and at least one time slot');
            return;
          }
          blockingData.date = formData.date;
          blockingData.timeSlots = formData.timeSlots;
          break;
      }

      await onBlock(blockingData);
      showSuccess('Time slots blocked successfully');
      onClose();
      
      // Reset form
      setFormData({
        type: 'whole_day',
        date: '',
        startDate: '',
        endDate: '',
        timeSlots: [],
        reason: ''
      });

    } catch (error) {
      showError(error.message || 'Failed to block time slots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSlotToggle = (timeSlot) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(timeSlot)
        ? prev.timeSlots.filter(slot => slot !== timeSlot)
        : [...prev.timeSlots, timeSlot]
    }));
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push(timeSlot);
    }
    return slots;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Block Time Slots</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Blocking Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Blocking Type
            </label>
            <div className="space-y-2">
              {[
                { value: 'whole_day', label: 'Whole Day', icon: Calendar },
                { value: 'multiple_days', label: 'Multiple Days', icon: Calendar },
                { value: 'specific_slots', label: 'Specific Time Slots', icon: Clock }
              ].map(({ value, label, icon: Icon }) => (
                <label key={value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="blockingType"
                    value={value}
                    checked={blockingType === value}
                    onChange={(e) => setBlockingType(e.target.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Whole Day */}
          {blockingType === 'whole_day' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          )}

          {/* Multiple Days */}
          {blockingType === 'multiple_days' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Specific Time Slots */}
          {blockingType === 'specific_slots' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {generateTimeSlots().map((timeSlot) => (
                    <label key={timeSlot} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.timeSlots.includes(timeSlot)}
                        onChange={() => handleTimeSlotToggle(timeSlot)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{timeSlot}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason (Optional)
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g., Personal emergency, Vacation, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Warning */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Important</h4>
                <p className="text-sm text-red-700 mt-1">
                  Blocked time slots will be automatically synced to your Google Calendar and will prevent bookings across all platforms.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Blocking...
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Block Time
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
