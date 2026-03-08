'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Loader2, DollarSign, CreditCard, Save, User, UserCheck, Calendar, Clock, Tag, CheckCircle } from 'lucide-react';
import { adminApi } from '@/lib/backendApi';
import { useNotification } from '@/contexts/NotificationContext';

export default function AdminEditSessionModal({ 
  isOpen, 
  onClose, 
  session, 
  onUpdateSuccess 
}) {
  const { showError, showSuccess } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const idsSetRef = useRef(false);
  
  // Session fields state
  const [psychologistId, setPsychologistId] = useState('');
  const [clientId, setClientId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [originalScheduledDate, setOriginalScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [status, setStatus] = useState('');
  const [price, setPrice] = useState('');
  
  // Payment details state
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');

  // Dropdown data
  const [psychologists, setPsychologists] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchPsychologist, setSearchPsychologist] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  // Available statuses (only commonly used ones for admin)
  // Note: 'reschedule_requested' is removed - admins can directly reschedule
  // Note: 'scheduled' and 'confirmed' are redundant with 'booked' and rarely used
  // Note: 'noshow' is an inconsistency - use 'no_show' instead
  const availableStatuses = [
    { value: 'booked', label: 'Booked' },
    { value: 'rescheduled', label: 'Rescheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' }
  ];

  // Load initial data
  useEffect(() => {
    if (isOpen && session) {
      idsSetRef.current = false; // Reset flag when opening new session
      // Reset IDs first
      setPsychologistId('');
      setClientId('');
      
      // Load dropdowns first, then set session data to ensure options are available
      const loadData = async () => {
        await Promise.all([loadPsychologists(), loadClients()]);
        // Wait a bit longer to ensure state is updated
        setTimeout(() => {
          loadSessionData();
        }, 200);
      };
      loadData();
    } else {
      // Reset form when modal closes
      setPsychologistId('');
      setClientId('');
      setSearchPsychologist('');
      setSearchClient('');
      setShowDoctorDropdown(false);
      idsSetRef.current = false;
    }
  }, [isOpen, session]);

  // Ensure IDs are set correctly after psychologists/clients load
  useEffect(() => {
    if (isOpen && session && psychologists.length > 0 && clients.length > 0 && !idsSetRef.current) {
      // Get expected IDs from session
      const expectedPsychId = session.psychologist_id || session.psychologist?.id || '';
      const expectedCliId = session.client_id || session.client?.id || '';
      
      let psychSet = false;
      let clientSet = false;
      
      // Verify and set psychologist ID if it exists in list
      if (expectedPsychId) {
        const psychExists = psychologists.some(p => p.id === expectedPsychId);
        if (psychExists) {
          console.log('useEffect: Setting psychologist ID:', expectedPsychId);
          setPsychologistId(expectedPsychId);
          psychSet = true;
        } else {
          console.warn('Psychologist ID not found in list:', expectedPsychId, 'Available:', psychologists.map(p => p.id));
        }
      }
      
      // Verify and set client ID if it exists in list
      if (expectedCliId) {
        const clientExists = clients.some(c => {
          const cId = c.id || c.client_id || c.profile?.id;
          return cId === expectedCliId;
        });
        if (clientExists) {
          console.log('useEffect: Setting client ID:', expectedCliId);
          setClientId(expectedCliId);
          clientSet = true;
        } else {
          console.warn('Client ID not found in list:', expectedCliId, 'Available:', clients.map(c => c.id || c.client_id || c.profile?.id));
        }
      }
      
      if (psychSet && clientSet) {
        idsSetRef.current = true; // Mark as set if both IDs were processed
      }
    }
  }, [isOpen, psychologists.length, clients.length, session?.id]); // Don't include IDs in deps to avoid loops

  const loadSessionData = () => {
    if (!session) return;

    // Set psychologist ID - handle both direct ID and nested object
    const psychId = session.psychologist_id || session.psychologist?.id || '';
    if (psychId) {
      console.log('loadSessionData: Setting psychologist ID to', psychId);
      setPsychologistId(psychId);
    }
    
    // Set client ID - handle both direct ID and nested object
    const cliId = session.client_id || session.client?.id || '';
    if (cliId) {
      console.log('loadSessionData: Setting client ID to', cliId);
      setClientId(cliId);
    }
    
    // Format date for input (YYYY-MM-DD)
    let formattedDate = '';
    if (session.scheduled_date) {
      const date = new Date(session.scheduled_date);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }
    }
    setScheduledDate(formattedDate);
    
    // Format original scheduled date for input (YYYY-MM-DD)
    let formattedOriginalDate = '';
    if (session.original_scheduled_date) {
      const origDate = new Date(session.original_scheduled_date);
      if (!isNaN(origDate.getTime())) {
        const year = origDate.getFullYear();
        const month = String(origDate.getMonth() + 1).padStart(2, '0');
        const day = String(origDate.getDate()).padStart(2, '0');
        formattedOriginalDate = `${year}-${month}-${day}`;
      }
    } else if (session.scheduled_date) {
      // If original_scheduled_date is not set, use scheduled_date as default
      formattedOriginalDate = formattedDate;
    }
    setOriginalScheduledDate(formattedOriginalDate);
    
    // Format time for input (HH:MM)
    let formattedTime = '';
    if (session.scheduled_time) {
      // Handle both "HH:MM" and "HH:MM:SS" formats
      const timeParts = session.scheduled_time.split(':');
      if (timeParts.length >= 2) {
        formattedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
      }
    }
    setScheduledTime(formattedTime);
    
    setStatus(session.status || 'booked');
    setPrice(session.price || '');

    // Payment details
    if (session.payment) {
      setPaymentMethod(session.payment.payment_method || 'cash');
      setTransactionId(session.payment.transaction_id || '');
      setRazorpayOrderId(session.payment.razorpay_order_id || '');
      setRazorpayPaymentId(session.payment.razorpay_payment_id || '');
    } else {
      setPaymentMethod('cash');
      setTransactionId('');
      setRazorpayOrderId('');
      setRazorpayPaymentId('');
    }
    setError(null);
  };

  const loadPsychologists = async () => {
    try {
      setIsLoadingData(true);
      const response = await adminApi.getPsychologists({ limit: 1000 });
      if (response?.success) {
        // Backend returns an array for /admin/psychologists (not wrapped in { users })
        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.users || [];
        setPsychologists(list);
      } else {
        console.warn('Failed to load psychologists:', response);
      }
    } catch (err) {
      console.error('Error loading psychologists:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadClients = async () => {
    try {
      setIsLoadingData(true);
      const response = await adminApi.getUsers({ role: 'client', limit: 1000 });
      if (response.success && response.data?.users) {
        // Map users to include client profile id
        const clientsWithIds = response.data.users.map(user => {
          // If user has profile, use profile.id (client.id), otherwise use user.id
          const clientId = user.profile?.id || user.id;
          return {
            ...user,
            id: clientId, // Use client.id as the main id for matching
            client_id: clientId, // Store the actual client.id for use in dropdown
            display_name: user.profile?.first_name && user.profile?.last_name
              ? `${user.profile.first_name} ${user.profile.last_name}`
              : user.email || 'Unknown'
          };
        });
        setClients(clientsWithIds);
      }
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!psychologistId || !clientId || !scheduledDate || !scheduledTime || !status) {
      setError('Please fill in all required fields: Psychologist, Client, Date, Time, and Status');
      return;
    }

    // Check if doctor was changed
    const originalPsychId = session.psychologist_id || session.psychologist?.id || '';
    const doctorChanged = psychologistId !== originalPsychId;

    setIsLoading(true);

    try {
      const updateData = {
        psychologist_id: psychologistId,
        client_id: clientId, // Keep original client ID (read-only)
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        // Send original_scheduled_date explicitly - if empty, backend will use scheduled_date as fallback
        original_scheduled_date: originalScheduledDate || scheduledDate, // Use edited original_scheduled_date or fallback to scheduled_date
        status: status,
        price: price ? parseFloat(price) : null,
        payment_method: paymentMethod,
        transaction_id: transactionId.trim() || null,
        razorpay_order_id: razorpayOrderId.trim() || null,
        razorpay_payment_id: razorpayPaymentId.trim() || null,
        notify_doctor: doctorChanged // Flag to send notification to new doctor
      };
      
      console.log('Updating session with original_scheduled_date:', updateData.original_scheduled_date);

      const response = await adminApi.updateSession(session.id, updateData);

      if (response.success) {
        const successMsg = doctorChanged 
          ? 'Session updated successfully. Notification sent to the new doctor.'
          : 'Session updated successfully';
        showSuccess(successMsg, 'Update Success');
        if (onUpdateSuccess) {
          onUpdateSuccess(response.data);
        }
        onClose();
      } else {
        setError(response.message || 'Failed to update session');
      }
    } catch (err) {
      console.error('Error updating session:', err);
      setError(err.message || 'Failed to update session');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter psychologists and clients based on search
  const filteredPsychologists = psychologists.filter(psych =>
    `${psych.first_name || ''} ${psych.last_name || ''} ${psych.email || ''}`.toLowerCase().includes(searchPsychologist.toLowerCase())
  );

  const filteredClients = clients.filter(client => {
    const searchLower = searchClient.toLowerCase();
    return (client.display_name || '').toLowerCase().includes(searchLower) ||
           (client.email || '').toLowerCase().includes(searchLower) ||
           (client.profile?.first_name || '').toLowerCase().includes(searchLower) ||
           (client.profile?.last_name || '').toLowerCase().includes(searchLower);
  });

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600', lineHeight: '1.5rem' }} className="text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              Edit Session
            </div>
            <p className="text-sm text-gray-500 mt-1">Session #{session.id?.slice(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-2 hover:bg-gray-100 transition-all"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Psychologist and Client Selection - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Psychologist Display with Assign Button */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Doctor
                </label>
                {/* Current Doctor Display */}
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium min-h-[42px] flex items-center">
                  {(() => {
                    if (psychologistId) {
                      const selectedPsych = psychologists.find(p => p.id === psychologistId);
                      if (selectedPsych) {
                        return `${selectedPsych.first_name || ''} ${selectedPsych.last_name || ''}`.trim() || selectedPsych.email || 'Unknown';
                      }
                    }
                    // Fallback to session data
                    if (session.psychologist) {
                      return `${session.psychologist.first_name || ''} ${session.psychologist.last_name || ''}`.trim() || 
                             session.psychologist.email || 
                             'Doctor';
                    }
                    return 'No doctor assigned';
                  })()}
                </div>
                
                {/* Assign to Another Doc Button */}
                <button
                  type="button"
                  onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium flex items-center justify-center gap-2"
                  disabled={isLoading || isLoadingData}
                >
                  <UserCheck className="h-4 w-4" />
                  {showDoctorDropdown ? 'Cancel' : 'Assign to Another Doctor'}
                </button>

                {/* Doctor Dropdown (shown when button clicked) */}
                {showDoctorDropdown && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <input
                      type="text"
                      placeholder="Search psychologist..."
                      value={searchPsychologist}
                      onChange={(e) => setSearchPsychologist(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-sm"
                    />
                    <select
                      value={psychologistId}
                      onChange={(e) => {
                        setPsychologistId(e.target.value);
                        if (e.target.value) {
                          setShowDoctorDropdown(false);
                        }
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-sm"
                      disabled={isLoading || isLoadingData}
                    >
                      <option value="">-- Select New Doctor --</option>
                      {filteredPsychologists.map(psych => (
                        <option key={psych.id} value={psych.id}>
                          {psych.first_name} {psych.last_name} {psych.email ? `(${psych.email})` : ''}
                        </option>
                      ))}
                    </select>
                    {psychologistId && (
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Doctor will be changed on save
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Client Display (Read-only) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client
                </label>
                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium min-h-[42px] flex flex-col justify-center">
                  {(() => {
                    // Use same logic as bookings page: first_name + last_name
                    if (session.client) {
                      const clientName = `${session.client.first_name || ''} ${session.client.last_name || ''}`.trim();
                      return clientName || session.client.email || 'Client';
                    }
                    // Fallback: try to get from clients list
                    if (clientId && clients.length > 0) {
                      const selectedClient = clients.find(c => {
                        const cId = c.id || c.client_id || c.profile?.id;
                        return cId === clientId;
                      });
                      if (selectedClient) {
                        const name = `${selectedClient.profile?.first_name || ''} ${selectedClient.profile?.last_name || ''}`.trim();
                        return name || selectedClient.email || 'Unknown';
                      }
                    }
                    return 'Client';
                  })()}
                  {session.client?.child_name && (
                    <div className="text-xs text-gray-500 mt-1">
                      Child: {session.client.child_name} {session.client.child_age ? `(${session.client.child_age} years)` : ''}
                    </div>
                  )}
                </div>
                <input type="hidden" value={clientId} name="client_id" />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-sm"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Time *
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {/* Original Scheduled Date */}
            <div className="mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Scheduled Date
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  The original date when this session was first scheduled (used for finance calculations)
                </p>
                <input
                  type="date"
                  value={originalScheduledDate}
                  onChange={(e) => setOriginalScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-sm"
                  disabled={isLoading}
                >
                  {availableStatuses.map(statusOption => (
                    <option key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-sm"
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="border-t border-gray-200 pt-6">
              <div style={{ fontSize: '16px', fontWeight: '600' }} className="text-gray-900 mb-4">
                Payment Details
              </div>
              
              <div className="space-y-4">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                    disabled={isLoading}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card (Debit/Credit)</option>
                    <option value="upi">UPI (GPay, PhonePe, etc.)</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="wallet">Wallet (Paytm, etc.)</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                    placeholder="Enter transaction ID"
                    disabled={isLoading}
                  />
                </div>

                {/* Razorpay Order ID and Payment ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razorpay Order ID
                    </label>
                    <input
                      type="text"
                      value={razorpayOrderId}
                      onChange={(e) => setRazorpayOrderId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                      placeholder="Enter Razorpay order ID"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razorpay Payment ID
                    </label>
                    <input
                      type="text"
                      value={razorpayPaymentId}
                      onChange={(e) => setRazorpayPaymentId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                      placeholder="Enter Razorpay payment ID"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200 -mx-6 -mb-6 px-6 py-4 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingData}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
