'use client';

import React, { useState, useEffect } from 'react';
import { psychologistApi } from '../../../lib/backendApi';
import { CheckCircle, XCircle, Clock, Calendar, AlertCircle, Phone, MessageCircle } from 'lucide-react';

export default function PsychologistReschedulingPage() {
  const [rescheduleRequests, setRescheduleRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadRescheduleRequests();
    // Refresh every 30 seconds
    const interval = setInterval(loadRescheduleRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadRescheduleRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await psychologistApi.getNotifications({ limit: 100 });
      if (response.success) {
        // Filter for reschedule requests
        const rescheduleNotifs = response.data.notifications.filter(
          notif => (notif.type === 'warning' || notif.type === 'info') && 
          (notif.message?.includes('reschedule') || notif.title?.includes('Reschedule')) &&
          notif.related_type === 'session'
        );
        setRescheduleRequests(rescheduleNotifs);
      } else {
        setError('Failed to fetch reschedule requests');
      }
    } catch (err) {
      console.error('Error loading reschedule requests:', err);
      setError('Failed to load reschedule requests');
    } finally {
      setLoading(false);
    }
  };

  const parseRescheduleInfo = (message) => {
    const fromMatch = message.match(/from (\d{4}-\d{2}-\d{2}) at (\d{2}:\d{2})/);
    const toMatch = message.match(/to (\d{4}-\d{2}-\d{2}) at (\d{2}:\d{2})/);
    
    return {
      originalDate: fromMatch ? fromMatch[1] : null,
      originalTime: fromMatch ? fromMatch[2] : null,
      newDate: toMatch ? toMatch[1] : null,
      newTime: toMatch ? toMatch[2] : null,
      clientName: message.split(' has requested')[0] || 'Client'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleApprove = async (notification) => {
    if (!confirm('Are you sure you want to approve this reschedule request?')) {
      return;
    }

    setProcessingId(notification.id);
    try {
      await psychologistApi.handleRescheduleRequest(notification.id, 'approve', '');
      await loadRescheduleRequests();
      alert('Reschedule request approved successfully!');
    } catch (err) {
      console.error('Error approving reschedule:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to approve reschedule';
      alert(`Error: ${errorMsg}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (notification) => {
    const reason = prompt('Please provide a reason for declining (optional):') || '';
    
    setProcessingId(notification.id);
    try {
      await psychologistApi.handleRescheduleRequest(notification.id, 'reject', reason);
      await loadRescheduleRequests();
      alert('Reschedule request declined successfully!');
    } catch (err) {
      console.error('Error declining reschedule:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to decline reschedule';
      alert(`Error: ${errorMsg}`);
    } finally {
      setProcessingId(null);
    }
  };

  const isAdminOnly = (notification) => {
    return notification.message?.includes('admin approval') && 
           notification.message?.includes('within 24 hours');
  };

  const operationsPhone = process.env.NEXT_PUBLIC_OPERATIONS_PHONE || '+91 XXXX XXXXXX';
  const operationsWhatsApp = process.env.NEXT_PUBLIC_OPERATIONS_WHATSAPP || operationsPhone;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Rescheduling Requests</h1>
          <p className="text-gray-600 mt-1">Manage and respond to reschedule requests from clients</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {rescheduleRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reschedule Requests</h3>
            <p className="text-gray-500">There are no pending reschedule requests at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rescheduleRequests.map((request) => {
              const info = parseRescheduleInfo(request.message);
              const adminOnly = isAdminOnly(request);
              
              return (
                <div
                  key={request.id}
                  className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${request.is_read ? 'bg-gray-100' : 'bg-orange-100'}`}>
                          <AlertCircle className={`h-5 w-5 ${request.is_read ? 'text-gray-600' : 'text-orange-600'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.title || 'Reschedule Request'}
                          </h3>
                          {!request.is_read && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{request.message}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Current Schedule</span>
                          </div>
                          {info.originalDate && info.originalTime ? (
                            <div className="text-sm text-gray-600">
                              <p>{formatDate(info.originalDate)}</p>
                              <p className="font-medium">{formatTime(info.originalTime)}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Not available</p>
                          )}
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Requested New Schedule</span>
                          </div>
                          {info.newDate && info.newTime ? (
                            <div className="text-sm text-gray-600">
                              <p>{formatDate(info.newDate)}</p>
                              <p className="font-medium">{formatTime(info.newTime)}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Not available</p>
                          )}
                        </div>
                      </div>

                      {adminOnly && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> This request requires admin approval as it's within 24 hours. 
                            Please contact admin for approval or wait for admin decision.
                          </p>
                          <div className="flex gap-3 mt-3">
                            <a
                              href={`tel:${operationsPhone.replace(/\s/g, '')}`}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                            >
                              <Phone className="h-3 w-3" />
                              Call Operations
                            </a>
                            <a
                              href={`https://wa.me/${operationsWhatsApp.replace(/[^\d]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
                            >
                              <MessageCircle className="h-3 w-3" />
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Requested: {new Date(request.created_at).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {!adminOnly && (
                      <div className="ml-4 flex flex-col gap-2">
                        <button
                          onClick={() => handleApprove(request)}
                          disabled={processingId === request.id}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                        >
                          {processingId === request.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDecline(request)}
                          disabled={processingId === request.id}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                        >
                          {processingId === request.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Decline
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

