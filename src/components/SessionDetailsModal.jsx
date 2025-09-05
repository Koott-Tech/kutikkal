import { useState } from 'react';
import { X, FileText, MessageSquare, Eye, EyeOff } from 'lucide-react';

export default function SessionDetailsModal({ 
  session, 
  isOpen, 
  onClose,
  isPsychologist = false
}) {
  const [showNotes, setShowNotes] = useState(false);

  if (!isOpen || !session) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Session Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Session Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-800 mb-4">Session Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Client:</span>
              <span className="ml-2 font-medium text-gray-800">
                {session.client?.first_name} {session.client?.last_name}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2 font-medium text-gray-800">
                {formatDate(session.scheduled_date)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <span className="ml-2 font-medium text-gray-800">
                {formatTime(session.scheduled_time)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-2 font-medium px-2 py-1 rounded-full text-xs ${
                session.status === 'completed' ? 'bg-green-100 text-green-800' :
                session.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {session.status}
              </span>
            </div>
            {session.price && (
              <div>
                <span className="text-gray-600">Price:</span>
                <span className="ml-2 font-medium text-gray-800">
                  ${session.price}
                </span>
              </div>
            )}
            {session.package && (
              <div>
                <span className="text-gray-600">Package:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {session.package.package_type}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Session Summary */}
        {session.summary && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-800">Session Summary</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 text-sm leading-relaxed">
                {session.summary}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This summary is visible to the client
            </p>
          </div>
        )}

        {/* Session Report */}
        {session.report && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-800">Session Report</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-700 text-sm leading-relaxed">
                {session.report}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This report is visible to the client
            </p>
          </div>
        )}

        {/* Session Notes - Only visible to psychologists */}
        {isPsychologist && session.session_notes && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-gray-800">Session Notes</h3>
              </div>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors"
              >
                {showNotes ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showNotes ? 'Hide' : 'Show'} Notes
              </button>
            </div>
            
            {showNotes && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {session.session_notes}
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              These notes are private and only visible to you
            </p>
          </div>
        )}

        {/* Client Feedback */}
        {session.feedback && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-800">Client Feedback</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-700 text-sm leading-relaxed">
                {session.feedback}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
