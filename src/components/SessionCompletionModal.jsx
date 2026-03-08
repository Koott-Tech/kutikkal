"use client";
import { useState, useEffect } from "react";
import { X, FileText, Calendar, Loader2, User } from "lucide-react";

export default function SessionCompletionModal({ 
  isOpen, 
  onClose, 
  session, 
  onSubmit,
  wide = false,
  /** When true (e.g. admin), summary, report, and private notes are optional */
  fieldsOptional = false
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
    if (fieldsOptional) {
      setErrors(newErrors);
      return true;
    }
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

  const formatSessionTime = () => {
    if (!session?.scheduled_time) return "";
    const [hours, minutes] = session.scheduled_time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes || "00"} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={isSubmitting ? undefined : handleClose} aria-hidden="true" />
      <div className={`relative w-full max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#3f2e73]/10 text-[#3f2e73]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900" role="heading" aria-level={1}>
                Complete Session
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {fieldsOptional ? 'Summary, report, and private notes are optional.' : 'Submit summary, report, and private notes'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Session Info */}
        {session && (
          <div className="px-6 py-4 border-b border-slate-200 bg-white">
            <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3" role="heading" aria-level={2}>
                Session
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Client</p>
                  <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    {session.client?.first_name} {session.client?.last_name}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Child</p>
                  <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                    {session.client?.child_name || "—"} {session.client?.child_age ? `(${session.client.child_age}y)` : ""}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Date & time</p>
                  <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900">
                    {session.scheduled_date ? new Date(session.scheduled_date).toLocaleDateString() : "—"} at {formatSessionTime() || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <form id="session-completion-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Summary */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Session summary {!fieldsOptional && <span className="text-red-500">*</span>}
              </label>
              <p className="text-xs text-slate-500 mb-2">Visible to client</p>
              <textarea
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                placeholder="Brief summary the client can read..."
                className={`w-full h-28 px-3 py-2.5 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#3f2e73]/20 focus:border-[#3f2e73] ${
                  errors.summary ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200"
                }`}
                disabled={isSubmitting}
              />
              {errors.summary && <p className="text-xs text-red-600 mt-1.5">{errors.summary}</p>}
            </div>

            {/* Report */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Session report {!fieldsOptional && <span className="text-red-500">*</span>}
              </label>
              <p className="text-xs text-slate-500 mb-2">Visible to client</p>
              <textarea
                value={formData.report}
                onChange={(e) => handleInputChange("report", e.target.value)}
                placeholder="Findings and recommendations..."
                className={`w-full h-28 px-3 py-2.5 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#3f2e73]/20 focus:border-[#3f2e73] ${
                  errors.report ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200"
                }`}
                disabled={isSubmitting}
              />
              {errors.report && <p className="text-xs text-red-600 mt-1.5">{errors.report}</p>}
            </div>

            {/* Private notes */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Private summary notes {!fieldsOptional && <span className="text-red-500">*</span>}
              </label>
              <p className="text-xs text-slate-500 mb-2">Visible only to you</p>
              <textarea
                value={formData.summary_notes}
                onChange={(e) => handleInputChange("summary_notes", e.target.value)}
                placeholder="Private notes for your reference..."
                className={`w-full h-28 px-3 py-2.5 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[#3f2e73]/20 focus:border-[#3f2e73] ${
                  errors.summary_notes ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200"
                }`}
                disabled={isSubmitting}
              />
              {errors.summary_notes && <p className="text-xs text-red-600 mt-1.5">{errors.summary_notes}</p>}
            </div>

            {/* Completion date */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Completion date <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">Date this session was completed</p>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => handleInputChange("completion_date", e.target.value)}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3f2e73]/20 focus:border-[#3f2e73] ${
                    errors.completion_date ? "border-red-500" : "border-slate-200"
                  }`}
                  disabled={isSubmitting}
                  required
                />
              </div>
              {errors.completion_date && <p className="text-xs text-red-600 mt-1.5">{errors.completion_date}</p>}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/30 flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-[#3f2e73] bg-white border border-[#3f2e73]/40 rounded-lg hover:bg-[#3f2e73]/10 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="session-completion-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#3f2e73] hover:bg-[#1d1733] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Completing…
              </>
            ) : (
              "Complete session"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
