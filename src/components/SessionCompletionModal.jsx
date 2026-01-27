"use client";
import { useState, useEffect } from "react";
import { X, FileText, Calendar } from "lucide-react";

export default function SessionCompletionModal({ 
  isOpen, 
  onClose, 
  session, 
  onSubmit 
}) {
  // Initialize completion_date with scheduled_date (default to scheduled date)
  const [formData, setFormData] = useState({
    summary: "",
    report: "",
    summary_notes: "",
    completion_date: ""
  });

  // Set default completion_date when session changes
  useEffect(() => {
    if (session && session.scheduled_date) {
      // Format scheduled_date to YYYY-MM-DD for date input
      const scheduledDate = new Date(session.scheduled_date);
      const formattedDate = scheduledDate.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        completion_date: prev.completion_date || formattedDate
      }));
    }
  }, [session]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    }
    
    if (!formData.report.trim()) {
      newErrors.report = "Report is required";
    }
    
    if (!formData.summary_notes.trim()) {
      newErrors.summary_notes = "Summary notes are required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        summary: "",
        report: "",
        summary_notes: "",
        completion_date: session?.scheduled_date ? new Date(session.scheduled_date).toISOString().split('T')[0] : ""
      });
      onClose();
    } catch (error) {
      console.error("Error submitting session completion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      summary: "",
      report: "",
      summary_notes: "",
      completion_date: session?.scheduled_date ? new Date(session.scheduled_date).toISOString().split('T')[0] : ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600', lineHeight: '1.5rem' }} className="text-gray-900">
              Complete Session
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Submit session summary, report, and notes
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Session Info */}
        {session && (
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Client</label>
                <p className="text-sm text-gray-900 mt-1">
                  {session.client?.first_name} {session.client?.last_name}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Child</label>
                <p className="text-sm text-gray-900 mt-1">
                  {session.client?.child_name} {session.client?.child_age ? `(${session.client.child_age} years)` : ''}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Session Date</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(session.scheduled_date).toLocaleDateString()} at {(() => {
                    const [hours, minutes] = session.scheduled_time.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    return `${displayHour}:${minutes} ${ampm}`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Summary */}
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Session Summary <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Visible to client</p>
              <textarea
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                placeholder="Provide a brief summary of the session that the client can read..."
                className={`w-full h-32 px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                  errors.summary ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.summary && (
                <p className="text-sm text-red-600 mt-1">{errors.summary}</p>
              )}
            </div>

            {/* Report */}
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Session Report <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Visible to client</p>
              <textarea
                value={formData.report}
                onChange={(e) => handleInputChange("report", e.target.value)}
                placeholder="Provide a detailed report of the session findings and recommendations..."
                className={`w-full h-32 px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                  errors.report ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.report && (
                <p className="text-sm text-red-600 mt-1">{errors.report}</p>
              )}
            </div>

            {/* Summary Notes */}
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Private Summary Notes <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Private notes visible only to you</p>
              <textarea
                value={formData.summary_notes}
                onChange={(e) => handleInputChange("summary_notes", e.target.value)}
                placeholder="Add private notes about the session that only you can see..."
                className={`w-full h-32 px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                  errors.summary_notes ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.summary_notes && (
                <p className="text-sm text-red-600 mt-1">{errors.summary_notes}</p>
              )}
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Completion Date <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Select the date when this session was completed (defaults to scheduled date)</p>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => handleInputChange("completion_date", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                    errors.completion_date ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {errors.completion_date && (
                <p className="text-sm text-red-600 mt-1">{errors.completion_date}</p>
              )}
            </div>
          </form>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Completing...</span>
              </div>
            ) : (
              "Complete Session"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
