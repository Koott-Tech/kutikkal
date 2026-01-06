"use client";
import { useState } from "react";
import { X, FileText, Stethoscope, Eye, EyeOff } from "lucide-react";

export default function SessionCompletionModal({ 
  isOpen, 
  onClose, 
  session, 
  onSubmit 
}) {
  const [formData, setFormData] = useState({
    summary: "",
    report: "",
    summary_notes: ""
  });
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
        summary_notes: ""
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
      summary_notes: ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Stethoscope className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Complete Session
              </h2>
              <p className="text-sm text-gray-600">
                Submit session summary, report, and notes
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Session Info */}
        {session && (
          <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Client</label>
                <p className="text-sm text-gray-900">
                  {session.client?.first_name} {session.client?.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Child</label>
                <p className="text-sm text-gray-900">
                  {session.client?.child_name} ({session.client?.child_age} years)
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Session Date</label>
                <p className="text-sm text-gray-900">
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
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Summary */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <label className="text-sm font-medium text-gray-700">
                Session Summary
              </label>
              <span className="text-xs text-gray-500">(Visible to client)</span>
            </div>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              placeholder="Provide a brief summary of the session that the client can read..."
              className={`w-full h-24 sm:h-32 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.summary ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.summary && (
              <p className="text-sm text-red-600 mt-1">{errors.summary}</p>
            )}
          </div>

          {/* Report */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-green-600" />
              <label className="text-sm font-medium text-gray-700">
                Session Report
              </label>
              <span className="text-xs text-gray-500">(Visible to client)</span>
            </div>
            <textarea
              value={formData.report}
              onChange={(e) => handleInputChange("report", e.target.value)}
              placeholder="Provide a detailed report of the session findings and recommendations..."
              className={`w-full h-24 sm:h-32 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.report ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.report && (
              <p className="text-sm text-red-600 mt-1">{errors.report}</p>
            )}
          </div>

          {/* Summary Notes */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <EyeOff className="h-5 w-5 text-purple-600" />
              <label className="text-sm font-medium text-gray-700">
                Private Summary Notes
              </label>
              <span className="text-xs text-gray-500">(Psychologist only)</span>
            </div>
            <textarea
              value={formData.summary_notes}
              onChange={(e) => handleInputChange("summary_notes", e.target.value)}
              placeholder="Add private notes about the session that only you can see..."
              className={`w-full h-24 sm:h-32 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.summary_notes ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.summary_notes && (
              <p className="text-sm text-red-600 mt-1">{errors.summary_notes}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              These notes are private and will not be visible to the client.
            </p>
          </div>

          </form>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-white">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
