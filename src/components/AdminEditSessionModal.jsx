'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, DollarSign, CreditCard, Save, User, UserCheck, Calendar, Clock, Tag } from 'lucide-react';
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
  
  // Session fields state
  const [psychologistId, setPsychologistId] = useState('');
  const [clientId, setClientId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
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
      loadSessionData();
      loadPsychologists();
      loadClients();
    }
  }, [isOpen, session]);

  const loadSessionData = () => {
    if (!session) return;

    setPsychologistId(session.psychologist_id || '');
    setClientId(session.client_id || '');
    setScheduledDate(session.scheduled_date || '');
    setScheduledTime(session.scheduled_time || '');
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
      if (response.success && response.data?.users) {
        setPsychologists(response.data.users);
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

    setIsLoading(true);

    try {
      const updateData = {
        psychologist_id: psychologistId,
        client_id: clientId,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        status: status,
        price: price ? parseFloat(price) : null,
        payment_method: paymentMethod,
        transaction_id: transactionId.trim() || null,
        razorpay_order_id: razorpayOrderId.trim() || null,
        razorpay_payment_id: razorpayPaymentId.trim() || null
      };

      const response = await adminApi.updateSession(session.id, updateData);

      if (response.success) {
        showSuccess('Session updated successfully', 'Update Success');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Session</h2>
            <p className="text-sm text-gray-500 mt-1">Session #{session.id?.slice(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Psychologist Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserCheck className="h-4 w-4 inline mr-1" />
                Psychologist *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search psychologist..."
                  value={searchPsychologist}
                  onChange={(e) => setSearchPsychologist(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
                <select
                  value={psychologistId}
                  onChange={(e) => setPsychologistId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || isLoadingData}
                >
                  <option value="">Select a psychologist</option>
                  {filteredPsychologists.map(psych => (
                    <option key={psych.id} value={psych.id}>
                      {psych.first_name} {psych.last_name} {psych.email ? `(${psych.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Client *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search client..."
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || isLoadingData}
                >
                  <option value="">Select a client</option>
                  {filteredClients.map(client => (
                    <option key={client.id} value={client.client_id || client.profile?.id || client.id}>
                      {client.display_name || client.email || 'Unknown'} {client.email ? `(${client.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Scheduled Time *
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="h-4 w-4 inline mr-1" />
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter session price"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Details</h3>
              
              <div className="space-y-4">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="h-4 w-4 inline mr-1" />
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Razorpay payment ID"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
