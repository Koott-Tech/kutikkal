'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/backendApi';
import { useNotification } from '@/contexts/NotificationContext';
import { CheckCircle, XCircle, Clock, Calendar, AlertCircle, Phone, MessageCircle } from 'lucide-react';

export default function AdminReschedulingPage() {
  const { showSuccess, showError, showConfirmDialog } = useNotification();
  const [rescheduleRequests, setRescheduleRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    loadRescheduleRequests();
    // Refresh every 30 seconds
    const interval = setInterval(loadRescheduleRequests, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadRescheduleRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = filter === 'all' ? undefined : filter;
      const response = await adminApi.getRescheduleRequests(status);
      if (response.success) {
        setRescheduleRequests(response.data || []);
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

  const parseRescheduleInfo = (message, session) => {
    if (!message) {
      // If no message, try to get from session
      if (session) {
        return {
          originalDate: session.scheduled_date,
          originalTime: session.scheduled_time ? session.scheduled_time.split(':').slice(0, 2).join(':') : null,
          newDate: null,
          newTime: null,
          clientName: 'Client',
          reason: null
        };
      }
      return { originalDate: null, originalTime: null, newDate: null, newTime: null, clientName: 'Client', reason: null };
    }
    
    // Extract reason if present
    let reason = null;
    const reasonMatch = message.match(/Reason provided by client:\s*(.+?)(?:\n\n|$)/i);
    if (reasonMatch) {
      reason = reasonMatch[1].trim();
    }
    
    // Try multiple patterns to match different message formats
    // Pattern 1: "from YYYY-MM-DD at HH:MM:SS" or "from YYYY-MM-DD at HH:MM"
    let fromMatch = message.match(/from\s+(\d{4}-\d{2}-\d{2})\s+at\s+(\d{1,2}:\d{2}(?::\d{2})?)/i);
    
    // Pattern 2: Try without "at" keyword, just space
    if (!fromMatch) {
      fromMatch = message.match(/from\s+(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2}(?::\d{2})?)/i);
    }
    
    // Pattern 3: Try with different spacing
    if (!fromMatch) {
      fromMatch = message.match(/from\s+(\d{4}-\d{2}-\d{2})\s+at\s+(\d{1,2}:\d{2}(?::\d{2})?)\s/i);
    }
    
    // Pattern 1: "to YYYY-MM-DD at HH:MM:SS" or "to YYYY-MM-DD at HH:MM"
    let toMatch = message.match(/to\s+(\d{4}-\d{2}-\d{2})\s+at\s+(\d{1,2}:\d{2}(?::\d{2})?)/i);
    
    // Pattern 2: Try without "at" keyword, just space
    if (!toMatch) {
      toMatch = message.match(/to\s+(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2}(?::\d{2})?)/i);
    }
    
    // Pattern 3: Try with different spacing
    if (!toMatch) {
      toMatch = message.match(/to\s+(\d{4}-\d{2}-\d{2})\s+at\s+(\d{1,2}:\d{2}(?::\d{2})?)\s/i);
    }
    
    // Debug: Log if parsing fails
    if (!toMatch && message) {
      console.log('⚠️ Could not parse new date/time from message:', message);
    }
    
    // Extract dates and times
    let originalDate = fromMatch ? fromMatch[1] : null;
    let originalTime = fromMatch ? fromMatch[2] : null;
    let newDate = toMatch ? toMatch[1] : null;
    let newTime = toMatch ? toMatch[2] : null;
    
    // Fallback: Use session data for original date/time if parsing failed
    if (!originalDate && session) {
      originalDate = session.scheduled_date;
      originalTime = session.scheduled_time;
    }
    
    // Normalize time format (remove seconds, ensure 2-digit hours)
    const normalizeTime = (time) => {
      if (!time) return null;
      const parts = time.split(':');
      if (parts.length >= 2) {
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1];
        return `${hours}:${minutes}`;
      }
      return time;
    };
    
    return {
      originalDate,
      originalTime: normalizeTime(originalTime),
      newDate,
      newTime: normalizeTime(newTime),
      clientName: message.split(' has requested')[0] || 'Client',
      reason: reason
    };
  };

  const getRescheduleRequestType = (session) => {
    if (!session) return 'Unknown';
    
    const rescheduleCount = session.reschedule_count || 0;
    
    // Check if within 24 hours
    if (session.scheduled_date && session.scheduled_time) {
      const sessionDateTime = new Date(`${session.scheduled_date}T${session.scheduled_time}`);
      const now = new Date();
      const hoursUntilSession = (sessionDateTime - now) / (1000 * 60 * 60);
      
      if (hoursUntilSession <= 24 && rescheduleCount >= 1) {
        return 'Within 24 hours & 2nd+ reschedule';
      } else if (hoursUntilSession <= 24) {
        return 'Within 24 hours';
      } else if (rescheduleCount >= 1) {
        return '2nd or more reschedule';
      }
    }
    
    return 'Standard request';
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
    showConfirmDialog({
      title: 'Approve Reschedule Request',
      message: 'Are you sure you want to approve this reschedule request?',
      type: 'warning',
      confirmText: 'Approve',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setProcessingId(notification.id);
        try {
          await adminApi.handleRescheduleRequest(notification.id, 'approve', '');
          await loadRescheduleRequests();
          showSuccess('Reschedule request approved successfully!');
        } catch (err) {
          console.error('Error approving reschedule:', err);
          const errorMsg = err.response?.data?.message || err.message || 'Failed to approve reschedule';
          showError(errorMsg);
        } finally {
          setProcessingId(null);
        }
      }
    });
  };

  const handleDecline = (notification) => {
    setSelectedNotification(notification);
    setDeclineReason('');
    setShowDeclineModal(true);
  };

  const confirmDecline = async () => {
    if (!selectedNotification) return;
    
    setProcessingId(selectedNotification.id);
    try {
      await adminApi.handleRescheduleRequest(selectedNotification.id, 'reject', declineReason);
      await loadRescheduleRequests();
      showSuccess('Reschedule request declined successfully!');
      setShowDeclineModal(false);
      setSelectedNotification(null);
      setDeclineReason('');
    } catch (err) {
      console.error('Error declining reschedule:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to decline reschedule';
      showError(errorMsg);
    } finally {
      setProcessingId(null);
    }
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

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'pending'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              filter === 'approved'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Processed
          </button>
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
            <p className="text-gray-500">
              {filter === 'pending' 
                ? 'There are no pending reschedule requests at this time.'
                : 'There are no reschedule requests at this time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rescheduleRequests.map((request) => {
              const session = request.session;
              const info = parseRescheduleInfo(request.message || '', session);
              const client = request.client || session?.client;
              const psychologist = request.psychologist || session?.psychologist;
              const isProcessed = request.is_read;
              const requestType = getRescheduleRequestType(session);
              
              // Get client email from user relationship if available
              const clientEmail = client?.user?.email || client?.email || 'N/A';
              const clientPhone = client?.phone_number || 'N/A';
              const clientName = client?.child_name || `${client?.first_name || ''} ${client?.last_name || ''}`.trim() || 'N/A';
              const psychologistName = psychologist ? `${psychologist.first_name || ''} ${psychologist.last_name || ''}`.trim() : 'N/A';
              const psychologistEmail = psychologist?.email || 'N/A';
              const psychologistPhone = psychologist?.phone || 'N/A';
              
              // Session details
              const sessionType = session?.session_type === 'free_assessment' ? 'Free Assessment' : 
                                 session?.package_id ? 'Package Session' : 'Individual Session';
              const sessionId = session?.id || 'N/A';
              
              return (
                <div
                  key={request.id}
                  className={`bg-white rounded-lg shadow border ${
                    isProcessed ? 'border-gray-200' : 'border-orange-200'
                  } p-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-col gap-3">
                    {/* Header Row - Client Name, Buttons, Status */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      {/* Left: Client Name */}
                      <h3 className="text-base font-semibold text-gray-900">{clientName}</h3>
                      
                      {/* Right: Buttons and Status Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {!isProcessed && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(request)}
                              disabled={processingId === request.id}
                              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        {!isProcessed && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Pending</span>
                        )}
                        {isProcessed && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Processed</span>
                        )}
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{requestType}</span>
                      </div>
                    </div>
                    
                    {/* All Details */}
                    <div className="flex-1 space-y-2">

                      {/* All Details in Grid */}
                      <div className="space-y-2">
                        {/* Client Info */}
                        <div className="bg-gray-50 rounded p-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5 text-sm">
                            <div><span className="text-gray-600">Client ID:</span> <span className="font-medium text-gray-900 font-mono text-xs">{client?.id || 'N/A'}</span></div>
                            <div><span className="text-gray-600">Client:</span> <span className="font-medium text-gray-900">{clientName}</span></div>
                            {client?.schedule_name && <div><span className="text-gray-600">Schedule:</span> <span className="font-medium text-gray-900">{client.schedule_name}</span></div>}
                            {client?.child_name && <div><span className="text-gray-600">Child:</span> <span className="font-medium text-gray-900">{client.child_name}</span></div>}
                            {client?.child_age && <div><span className="text-gray-600">Age:</span> <span className="font-medium text-gray-900">{client.child_age} yrs</span></div>}
                            <div><span className="text-gray-600">Phone:</span> <span className="font-medium text-gray-900">{clientPhone}</span></div>
                            <div className="sm:col-span-2"><span className="text-gray-600">Email:</span> <span className="font-medium text-gray-900 break-all">{clientEmail}</span></div>
                          </div>
                        </div>
                        
                        {/* Psychologist Info */}
                        {psychologist && (
                          <div className="bg-blue-50 rounded p-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5 text-sm">
                              <div><span className="text-gray-600">Psychologist:</span> <span className="font-medium text-gray-900">{psychologistName}</span></div>
                              <div className="sm:col-span-2"><span className="text-gray-600">P. Email:</span> <span className="font-medium text-gray-900 break-all">{psychologistEmail}</span></div>
                              {psychologistPhone !== 'N/A' && <div><span className="text-gray-600">P. Phone:</span> <span className="font-medium text-gray-900">{psychologistPhone}</span></div>}
                            </div>
                          </div>
                        )}
                        
                        {/* Session Info */}
                        <div className="bg-purple-50 rounded p-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5 text-sm">
                            <div><span className="text-gray-600">Session ID:</span> <span className="font-medium text-gray-900 font-mono text-xs">{sessionId}</span></div>
                            <div><span className="text-gray-600">Type:</span> <span className="font-medium text-gray-900">{sessionType}</span></div>
                          </div>
                        </div>
                        
                        {/* Client Reason (if provided) */}
                        {info.reason && (
                          <div className="bg-amber-50 rounded p-3 border border-amber-200">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900 mb-1">Client's Reason for Reschedule:</p>
                              <p className="text-gray-700 italic">"{info.reason}"</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Schedule Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-100 rounded p-2">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Calendar className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-xs font-medium text-gray-600">Current</span>
                            </div>
                            {info.originalDate && info.originalTime ? (
                              <div className="text-xs">
                                <p className="font-medium text-gray-900">{formatDate(info.originalDate)}</p>
                                <p className="text-gray-600">{formatTime(info.originalTime)}</p>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">N/A</p>
                            )}
                          </div>
                          <div className="bg-green-100 rounded p-2">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Clock className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-xs font-medium text-gray-600">Requested</span>
                            </div>
                            {info.newDate && info.newTime ? (
                              <div className="text-xs">
                                <p className="font-medium text-gray-900">{formatDate(info.newDate)}</p>
                                <p className="text-gray-600">{formatTime(info.newTime)}</p>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">N/A</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 pt-1">Requested: {new Date(request.created_at).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Decline Reason Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Decline Reschedule Request
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for declining this reschedule request (optional):
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Enter reason for declining..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setSelectedNotification(null);
                  setDeclineReason('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDecline}
                disabled={processingId === selectedNotification?.id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === selectedNotification?.id ? 'Processing...' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

