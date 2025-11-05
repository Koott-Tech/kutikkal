'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  X, 
  User,
  UserCheck,
  Package,
  DollarSign,
  Loader2,
  CalendarDays,
  CheckCircle
} from 'lucide-react';
import { adminApi } from '@/lib/backendApi';
import { publicApi } from '@/lib/backendApi';
import { useNotification } from '@/contexts/NotificationContext';

export default function AdminManualBookingModal({ 
  isOpen, 
  onClose, 
  onBookingSuccess 
}) {
  const { showError, showSuccess } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);
  
  // Client mode: 'existing' or 'new'
  const [isNewClient, setIsNewClient] = useState(false);
  
  // Form data - Existing client selection
  const [clientId, setClientId] = useState('');
  
  // Form data - New client creation
  const [newClientData, setNewClientData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    country_code: '+91',
    child_name: '',
    child_age: ''
  });
  
  // Form data - Booking
  const [psychologistId, setPsychologistId] = useState('');
  const [packageId, setPackageId] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentReceivedDate, setPaymentReceivedDate] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [notes, setNotes] = useState('');
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  // Dropdown data
  const [clients, setClients] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [packages, setPackages] = useState([]);
  const [psychologistAvailability, setPsychologistAvailability] = useState({});
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateObj, setSelectedDateObj] = useState(null); // Store as Date object
  const [searchClient, setSearchClient] = useState('');
  const [searchPsychologist, setSearchPsychologist] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchInitialData();
    }
  }, [isOpen]);

  // Debug: Log loading states
  useEffect(() => {
    console.log('🔍 Loading states changed:', { isLoading, isLoadingData });
  }, [isLoading, isLoadingData]);

  // Fetch psychologist availability when psychologist changes or month changes
  useEffect(() => {
    if (psychologistId) {
      fetchPsychologistAvailability();
    }
  }, [psychologistId, currentDate]);

  // Fetch packages when psychologist changes
  useEffect(() => {
    if (psychologistId) {
      fetchPackages();
    } else {
      setPackages([]);
      setPackageId('');
    }
  }, [psychologistId]);

  // Update amount when package changes
  useEffect(() => {
    if (packageId && packages.length > 0) {
      const selectedPackage = packages.find(pkg => pkg.id === packageId);
      if (selectedPackage) {
        setAmount(selectedPackage.price.toString());
      }
    }
  }, [packageId, packages]);

  const resetForm = () => {
    setIsNewClient(false);
    setClientId('');
    setNewClientData({
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      country_code: '+91',
      child_name: '',
      child_age: ''
    });
    setPsychologistId('');
    setPackageId('');
    setSelectedDateObj(null);
    setSelectedTime('');
    setAmount('');
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    setPaymentReceivedDate(`${y}-${m}-${d}`);
    setNotes('');
    setError(null);
    setPsychologistAvailability({});
    setCurrentDate(new Date());
    setSearchClient('');
    setSearchPsychologist('');
  };

  const handleNewClientInputChange = (field, value) => {
    setNewClientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateRandomPassword = () => {
    // Generate a secure random password (12 characters)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const fetchInitialData = async () => {
    console.log('🔄 Starting to fetch initial data...');
    setIsLoadingData(true);
    try {
      // Fetch clients and psychologists in parallel
      const [clientsRes, psychologistsRes] = await Promise.all([
        adminApi.getUsers({ role: 'client', limit: 100 }),
        adminApi.getPsychologists({ limit: 100 })
      ]);

      console.log('📦 Initial data fetched:', { clientsSuccess: clientsRes.success, psychologistsSuccess: psychologistsRes.success });

      if (clientsRes.success) {
        // Get all clients (from users and clients table)
        const clientList = clientsRes.data?.users || clientsRes.data || [];
        // Filter to only clients
        const filteredClients = clientList.filter(user => user.role === 'client' || !user.role);
        setClients(filteredClients);
        console.log('✅ Clients set:', filteredClients.length);
      }

      if (psychologistsRes.success) {
        // API returns { users: [...], pagination: {...} }
        const psychologistsList = psychologistsRes.data?.users || psychologistsRes.data?.psychologists;
        if (Array.isArray(psychologistsList)) {
          setPsychologists(psychologistsList);
          console.log('✅ Psychologists set:', psychologistsList.length);
        } else if (Array.isArray(psychologistsRes.data)) {
          setPsychologists(psychologistsRes.data);
          console.log('✅ Psychologists set (alt):', psychologistsRes.data.length);
        } else {
          setPsychologists([]);
          console.log('⚠️ Psychologists set to empty array');
        }
      } else {
        setPsychologists([]);
        console.log('⚠️ Psychologists response failed, set to empty');
      }
    } catch (error) {
      console.error('❌ Error fetching initial data:', error);
      showError('Failed to load clients or psychologists', 'Load Error');
    } finally {
      console.log('✅ Setting isLoadingData to false');
      setIsLoadingData(false);
    }
  };

  const fetchPackages = async () => {
    if (!psychologistId) return;
    
    try {
      const response = await publicApi.getPsychologistPackages(psychologistId);
      if (response.success && response.data.packages) {
        setPackages(response.data.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchPsychologistAvailability = async () => {
    if (!psychologistId) return;

    try {
      setLoadingAvailability(true);
      
      // Get month range using local formatting
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Format start date (first day of month)
      const startYear = year;
      const startMonth = String(month + 1).padStart(2, '0');
      const startDay = '01';
      const startDate = `${startYear}-${startMonth}-${startDay}`;
      
      // Format end date (last day of month)
      const endYear = year;
      const endMonth = String(month + 1).padStart(2, '0');
      const endDay = String(new Date(year, month + 1, 0).getDate()).padStart(2, '0');
      const endDate = `${endYear}-${endMonth}-${endDay}`;

      const response = await adminApi.getPsychologistAvailabilityForReschedule(
        psychologistId, 
        startDate, 
        endDate
      );

      if (response.success) {
        const availabilityObject = {};
        response.data.availability.forEach(dayAvailability => {
          availabilityObject[dayAvailability.date] = dayAvailability;
        });
        setPsychologistAvailability(availabilityObject);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setPsychologistAvailability({});
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Calendar helper functions
  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    setSelectedDateObj(null);
    setSelectedTime('');
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    setSelectedDateObj(null);
    setSelectedTime('');
  };

  const handleDateSelect = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDateObj(newSelectedDate);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const getAvailableSlotsForDate = (dateObj) => {
    if (!dateObj) return [];
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dayStr = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    const dayAvailability = psychologistAvailability[dateStr];
    
    if (!dayAvailability) return [];
    
    // Admin API returns: { date, is_available, time_slots, booked_times, available_slots }
    // Therapist profile uses: { date, timeSlots: [{time, available, displayTime}], availableSlots }
    if (dayAvailability.available_slots && Array.isArray(dayAvailability.available_slots)) {
      // Admin API format - available_slots is already filtered
      return dayAvailability.available_slots;
    } else if (dayAvailability.timeSlots && Array.isArray(dayAvailability.timeSlots)) {
      // Therapist profile format - need to filter
      return dayAvailability.timeSlots
        .filter(slot => slot.available)
        .map(slot => slot.displayTime || slot.time);
    }
    
    return [];
  };

  const formatTime = (timeString) => {
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const convertTo24Hour = (timeString) => {
    if (!timeString.includes('AM') && !timeString.includes('PM')) {
      return timeString;
    }
    const [time, ampm] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (ampm === 'AM' && hour === 12) {
      hour = 0;
    } else if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔵 Form submit triggered', { isLoading, isLoadingData, isNewClient });
    setError(null);

    let finalClientId = clientId;

    // If creating a new client, create it first
    if (isNewClient) {
      // Validate new client data
      if (!newClientData.email || !newClientData.first_name || !newClientData.last_name || 
          !newClientData.phone_number || !newClientData.child_name || !newClientData.child_age) {
        setError('Please fill in all required client details: Email, First Name, Last Name, Phone Number, Child Name, and Child Age');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newClientData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Validate child age
      const childAge = parseInt(newClientData.child_age);
      if (isNaN(childAge) || childAge < 1 || childAge > 18) {
        setError('Child age must be between 1 and 18');
        return;
      }

      setIsLoading(true);

      try {
        // Step 1: Create new client
        console.log('Creating new client...');
        const fullPhoneNumber = newClientData.country_code + newClientData.phone_number;
        const randomPassword = generateRandomPassword();
        
        const clientResponse = await adminApi.createUser({
          email: newClientData.email.trim().toLowerCase(),
          password: randomPassword, // Auto-generated password
          first_name: newClientData.first_name,
          last_name: newClientData.last_name,
          phone_number: fullPhoneNumber,
          child_name: newClientData.child_name,
          child_age: parseInt(newClientData.child_age)
        });

        console.log('🔍 Client creation response:', JSON.stringify(clientResponse, null, 2));

        if (!clientResponse.success) {
          setError(clientResponse.message || 'Failed to create client');
          setIsLoading(false);
          return;
        }

        // Extract client ID from response
        // Response structure: { success: true, data: { user: { id: user.id, email, role, profile: { id: client.id, ... } } } }
        // IMPORTANT: Must use profile.id (client ID), NOT user.id (user ID)
        const profile = clientResponse.data?.user?.profile;
        const userId = clientResponse.data?.user?.id;
        const clientIdFromProfile = profile?.id;
        
        // Use profile.id if available, otherwise fall back to checking if user.id matches (for backwards compatibility)
        finalClientId = clientIdFromProfile || userId;

        console.log('🔍 Client ID extraction:', {
          hasData: !!clientResponse.data,
          hasUser: !!clientResponse.data?.user,
          hasProfile: !!profile,
          userId: userId,
          clientIdFromProfile: clientIdFromProfile,
          finalClientId: finalClientId,
          fullProfile: profile,
          note: clientIdFromProfile ? 'Using profile.id (client ID)' : 'WARNING: Using user.id as fallback - backend will handle lookup'
        });

        if (!finalClientId) {
          console.error('❌ Client creation response structure:', {
            fullResponse: clientResponse,
            data: clientResponse.data,
            user: clientResponse.data?.user,
            profile: clientResponse.data?.user?.profile,
            profileId: profile?.id,
            userId: clientResponse.data?.user?.id,
            note: 'We need profile.id (client ID) or user.id (backend will lookup by user_id)'
          });
          setError('Failed to get client ID after creation. The client profile may not have been created correctly. Please check the console for details.');
          setIsLoading(false);
          return;
        }

        console.log('✅ New client created with ID:', finalClientId, 'Profile:', profile);
      } catch (error) {
        console.error('Create client error:', error);
        setError(error.message || 'Failed to create client');
        setIsLoading(false);
        return;
      }
    } else {
      // Validate existing client selection
      if (!clientId) {
        setError('Please select a client');
        return;
      }
    }

    // Validate booking data
    if (!finalClientId || !psychologistId || !selectedDateObj || !selectedTime || !amount || !paymentReceivedDate) {
      setError('Please fill in all required booking fields');
      setIsLoading(false); // Reset loading state on validation error
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setIsLoading(false); // Reset loading state on validation error
      return;
    }

    // If we get here and we created a new client, isLoading should already be true
    // If we're using an existing client, set loading now
    if (!isNewClient) {
      setIsLoading(true);
    }

    try {
      // Format selected date
      const year = selectedDateObj.getFullYear();
      const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
      const dayStr = String(selectedDateObj.getDate()).padStart(2, '0');
      const scheduledDate = `${year}-${month}-${dayStr}`;

      // Step 2: Create booking
      const bookingData = {
        client_id: finalClientId,
        psychologist_id: psychologistId,
        package_id: packageId || null,
        scheduled_date: scheduledDate,
        scheduled_time: convertTo24Hour(selectedTime),
        amount: parseFloat(amount),
        payment_received_date: paymentReceivedDate,
        notes: notes || null
      };

      console.log('Creating manual booking:', bookingData);
      console.log('Final client ID being used:', finalClientId);

      const response = await adminApi.createManualBooking(bookingData);

      if (response.success) {
        const successMessage = isNewClient 
          ? 'New client created and manual booking created successfully!'
          : 'Manual booking created successfully!';
        showSuccess(successMessage, 'Booking Created');
        onBookingSuccess?.(response.data);
        onClose();
      } else {
        console.error('Booking creation failed:', response);
        setError(response.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Create booking error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        bookingData: {
          client_id: finalClientId,
          psychologist_id: psychologistId,
          scheduled_date: selectedDateObj ? `${selectedDateObj.getFullYear()}-${String(selectedDateObj.getMonth() + 1).padStart(2, '0')}-${String(selectedDateObj.getDate()).padStart(2, '0')}` : null,
          scheduled_time: selectedTime
        }
      });
      setError(error.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = Array.isArray(clients) ? clients.filter(client => {
    const name = `${client.first_name || ''} ${client.last_name || ''} ${client.email || ''}`.toLowerCase();
    return name.includes(searchClient.toLowerCase());
  }) : [];

  const filteredPsychologists = Array.isArray(psychologists) ? psychologists.filter(psych => {
    const name = `${psych.first_name || ''} ${psych.last_name || ''} ${psych.email || ''}`.toLowerCase();
    return name.includes(searchPsychologist.toLowerCase());
  }) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Manual Booking</h2>
              <p className="text-sm text-gray-500">For edge cases where payment/booking couldn't be completed normally</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form id="manual-booking-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Client Selection/Creation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 inline mr-1" />
                  Client *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewClient(!isNewClient);
                    setClientId('');
                    setNewClientData({
                      email: '',
                      first_name: '',
                      last_name: '',
                      phone_number: '',
                      country_code: '+91',
                      child_name: '',
                      child_age: ''
                    });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isNewClient ? '← Select Existing Client' : '+ New Client'}
                </button>
              </div>

              {isNewClient ? (
                /* New Client Form */
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={newClientData.email}
                        onChange={(e) => handleNewClientInputChange('email', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="client@example.com"
                      />
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={newClientData.first_name}
                        onChange={(e) => handleNewClientInputChange('first_name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={newClientData.last_name}
                        onChange={(e) => handleNewClientInputChange('last_name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="flex">
                        <select
                          value={newClientData.country_code}
                          onChange={(e) => handleNewClientInputChange('country_code', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+61">+61</option>
                        </select>
                        <input
                          type="tel"
                          value={newClientData.phone_number}
                          onChange={(e) => handleNewClientInputChange('phone_number', e.target.value.replace(/\D/g, ''))}
                          required
                          className="flex-1 px-3 py-2 border border-gray-300 border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>

                    {/* Child Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Child Name *
                      </label>
                      <input
                        type="text"
                        value={newClientData.child_name}
                        onChange={(e) => handleNewClientInputChange('child_name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Child's name"
                      />
                    </div>

                    {/* Child Age */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Child Age *
                      </label>
                      <input
                        type="number"
                        value={newClientData.child_age}
                        onChange={(e) => handleNewClientInputChange('child_age', e.target.value)}
                        min="1"
                        max="18"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Age (1-18)"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    A new client account will be created automatically. A random password will be generated and can be reset later.
                  </p>
                </div>
              ) : (
                /* Existing Client Selection */
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search client by name or email..."
                    value={searchClient}
                    onChange={(e) => setSearchClient(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a client</option>
                    {filteredClients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.first_name || ''} {client.last_name || ''} {client.child_name ? `(Child: ${client.child_name})` : ''} {client.email ? `(${client.email})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Psychologist Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserCheck className="h-4 w-4 inline mr-1" />
                Psychologist *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search psychologist by name or email..."
                  value={searchPsychologist}
                  onChange={(e) => setSearchPsychologist(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
                <select
                  value={psychologistId}
                  onChange={(e) => setPsychologistId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a psychologist</option>
                  {filteredPsychologists.map(psych => (
                    <option key={psych.id} value={psych.id}>
                      Dr. {psych.first_name} {psych.last_name} {psych.email ? `(${psych.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Package Selection (Optional) */}
            {psychologistId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4 inline mr-1" />
                  Package (Optional)
                </label>
                <select
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Individual Session</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name || pkg.package_type} - ₹{pkg.price} ({pkg.session_count} sessions)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Selection - Calendar */}
            {psychologistId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarDays className="h-4 w-4 inline mr-1" />
                  Session Date *
                </label>
                
                {/* Calendar */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-3">
                    <button 
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </button>
                    <p className="text-sm font-semibold text-gray-800">{getMonthName(currentDate)}</p>
                    <button 
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </div>

                  {loadingAvailability && (
                    <div className="text-center py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  )}

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div key={`header-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                    {(() => {
                      const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
                      const today = new Date();
                      const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                      
                      const calendarDays = [];
                      
                      // Add empty cells for days before the first day of the month
                      for (let i = 0; i < startingDay; i++) {
                        calendarDays.push(<div key={`empty-${i}`} className="text-center py-1 text-xs"></div>);
                      }
                      
                      // Add days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const isToday = isCurrentMonth && day === today.getDate();
                        const isSelected = selectedDateObj && selectedDateObj.getDate() === day && selectedDateObj.getMonth() === currentDate.getMonth() && selectedDateObj.getFullYear() === currentDate.getFullYear();
                        const isAvailable = day >= today.getDate() || !isCurrentMonth;
                        
                        // Check if this specific date is available for the psychologist
                        const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const year = calendarDate.getFullYear();
                        const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
                        const dayStr = String(calendarDate.getDate()).padStart(2, '0');
                        const dateStr = `${year}-${month}-${dayStr}`;
                        const dateAvailability = psychologistAvailability[dateStr];
                        const isPsychologistAvailable = dateAvailability && dateAvailability.is_available && (
                          (dateAvailability.available_slots && Array.isArray(dateAvailability.available_slots) && dateAvailability.available_slots.length > 0) ||
                          (dateAvailability.availableSlots && dateAvailability.availableSlots > 0) ||
                          (dateAvailability.timeSlots && Array.isArray(dateAvailability.timeSlots) && dateAvailability.timeSlots.some(slot => slot.available))
                        );
                        
                        const isActuallyAvailable = isPsychologistAvailable && isAvailable;
                        
                        calendarDays.push(
                          <div
                            key={`day-${day}`}
                            onClick={() => {
                              if (isAvailable) {
                                handleDateSelect(day);
                              }
                            }}
                            className={`text-center py-1 rounded-lg transition-all duration-200 text-xs cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold shadow-lg'
                                : (isToday && isActuallyAvailable)
                                  ? 'bg-green-500 text-white font-semibold shadow-md border-2 border-green-600 hover:bg-green-600'
                                  : isToday
                                    ? 'bg-blue-100 text-blue-700 font-semibold'
                                  : isActuallyAvailable
                                    ? 'bg-green-500 text-white font-semibold shadow-md border-2 border-green-600 hover:bg-green-600'
                                  : isAvailable
                                    ? 'hover:bg-gray-100 text-gray-500'
                                    : 'text-gray-300 cursor-not-allowed'
                            }`}
                            title={isPsychologistAvailable ? (isToday ? 'Today - Available for booking' : 'Available for booking') : isAvailable ? 'Click to check availability' : 'Past date'}
                          >
                            {day}
                            {isActuallyAvailable && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1 shadow-sm"></div>
                            )}
                          </div>
                        );
                      }
                      
                      return calendarDays;
                    })()}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDateObj && (() => {
                  const availableSlots = getAvailableSlotsForDate(selectedDateObj);
                  
                  if (availableSlots.length > 0) {
                    return (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Session Time *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map(time => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => handleTimeSelect(time)}
                              className={`px-3 py-2 rounded-lg border transition-colors text-xs ${
                                selectedTime === time
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                              }`}
                            >
                              {formatTime(time)}
                            </button>
                          ))}
                        </div>
                        {selectedTime && (
                          <p className="mt-2 text-sm text-gray-600">
                            Selected: {formatTime(selectedTime)}
                          </p>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                        No available time slots for this date. Please select another date.
                      </div>
                    );
                  }
                })()}

                {!selectedDateObj && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm text-center">
                    Select a date to see available time slots
                  </div>
                )}
              </div>
            )}

            {!psychologistId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarDays className="h-4 w-4 inline mr-1" />
                  Session Date *
                </label>
                <p className="text-sm text-gray-500">Please select a psychologist first</p>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Amount (₹) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>

            {/* Payment Received Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Payment Received Date *
              </label>
              <input
                type="date"
                value={paymentReceivedDate}
                onChange={(e) => setPaymentReceivedDate(e.target.value)}
                max={(function(){ const n=new Date(); const y=n.getFullYear(); const m=String(n.getMonth()+1).padStart(2,'0'); const d=String(n.getDate()).padStart(2,'0'); return `${y}-${m}-${d}`; })()}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Date when payment was received manually</p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional notes about this booking..."
              />
            </div>
          </div>

          {/* Footer Buttons - Inside Form */}
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
              style={{ cursor: (isLoading || isLoadingData) ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : isLoadingData ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Create Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

