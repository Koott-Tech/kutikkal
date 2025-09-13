'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { publicApi } from '../../lib/backendApi';
import { clientApi, paymentApi } from '../../lib/backendApi';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { isClientContactComplete, getIncompleteContactFields } from '../../lib/contactValidation';
import ContactCompletionWarning from '../../components/ContactCompletionWarning';

// Separate component that uses useSearchParams
const TherapistProfileContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorIndex = searchParams.get('doctor');
  const packageId = searchParams.get('package_id'); // Add package_id parameter
  const { user, token, isAuthenticated, hasRole } = useAuth();
  const { showError, showWarning, showSuccess } = useNotification();
  
  // State for doctor data and UI
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // FAQ state
  const [openFAQ, setOpenFAQ] = useState(null);
  
  // Treatment modal state
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  
  // Pricing state
  const [selectedPricing, setSelectedPricing] = useState(null);
  
  // Package state
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loadingPackages, setLoadingPackages] = useState(false);
  
  // Client package state (for booking remaining sessions)
  const [clientPackage, setClientPackage] = useState(null);
  const [isBookingRemaining, setIsBookingRemaining] = useState(false);
  const [loadingClientPackage, setLoadingClientPackage] = useState(false);
  
  // Contact completion warning state
  const [showContactWarning, setShowContactWarning] = useState(false);
  const [incompleteContactFields, setIncompleteContactFields] = useState([]);
  
  // Availability state
  const [psychologistAvailability, setPsychologistAvailability] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  // Booking state
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch client package details (for booking remaining sessions)
  const fetchClientPackage = async (packageId) => {
    try {
      setLoadingClientPackage(true);
      const response = await clientApi.getClientPackages();
      if (response.success) {
        const packageData = response.data.clientPackages.find(pkg => pkg.id === packageId);
        if (packageData) {
          setClientPackage(packageData);
          setIsBookingRemaining(true);
          console.log('📦 Client package loaded:', packageData);
        } else {
          console.error('Package not found:', packageId);
          setError('Package not found');
        }
      } else {
        console.error('Failed to fetch client packages:', response);
        setError('Failed to load package information');
      }
    } catch (error) {
      console.error('Error fetching client package:', error);
      setError('Failed to load package information');
    } finally {
      setLoadingClientPackage(false);
    }
  };

  // Fetch psychologist packages
  const fetchPsychologistPackages = async (psychologistId) => {
    try {
      setLoadingPackages(true);
      const response = await publicApi.getPsychologistPackages(psychologistId);
      if (response.success) {
        setPackages(response.data.packages || []);
        console.log('📦 Packages loaded:', response.data.packages);
      } else {
        console.error('Failed to fetch packages:', response);
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  // Fetch psychologist availability for current month
  const fetchPsychologistAvailability = async (psychologistId) => {
    try {
      setLoadingAvailability(true);
      
      // Get current month dates using local formatting to avoid timezone issues
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
      
      
      
      // Use real API call to get psychologist availability range
      const response = await publicApi.getPsychologistAvailabilityRange(psychologistId, startDate, endDate);
      
      if (response.success) {

        
        // Convert array to object with date keys
        const availabilityObject = {};
        response.data.data.forEach(dayAvailability => {
          availabilityObject[dayAvailability.date] = dayAvailability;
        });
        

        setPsychologistAvailability(availabilityObject);
      } else {
        console.error('Failed to fetch availability:', response);
        setPsychologistAvailability({});
      }
    } catch (error) {
      console.error('Error fetching psychologist availability:', error);
      // Set default availability if API fails
      setPsychologistAvailability({});
    } finally {
      setLoadingAvailability(false);
    }
  };



  // Fetch doctors data
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await publicApi.getPsychologists();
      if (response.success) {
        setDoctors(response.data.psychologists);
        
        // Handle both index-based and ID-based doctor parameters
        if (doctorIndex !== null) {
          // Check if doctorIndex is a UUID (psychologist ID) or a number (index)
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorIndex);
          
          if (isUUID) {
            // If it's a UUID, find the psychologist by ID
            const psychologist = response.data.psychologists.find(doc => doc.id === doctorIndex);
            if (psychologist) {
              setSelectedDoctor(psychologist);
            } else {
              setError('Doctor not found');
            }
          } else {
            // If it's a number, use it as an index
            const index = parseInt(doctorIndex);
            if (response.data.psychologists[index]) {
              setSelectedDoctor(response.data.psychologists[index]);
            } else {
              setError('Doctor not found');
            }
          }
        }
      } else {
        setError('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctor information');
    } finally {
      setLoading(false);
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
    
    // Refetch availability for new month
    if (selectedDoctor) {
      fetchPsychologistAvailability(selectedDoctor.id);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    
    // Refetch availability for new month
    if (selectedDoctor) {
      fetchPsychologistAvailability(selectedDoctor.id);
    }
  };

  const handleDateSelect = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    // Clear selected time and package when date changes
    setSelectedTime(null);
    setSelectedPackage(null);
    
    // Check if the selected date has availability
    // Use local date formatting to avoid timezone conversion issues
    const year = newSelectedDate.getFullYear();
    const month = String(newSelectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(newSelectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    const dateAvailability = psychologistAvailability[dateStr];
    
    if (!dateAvailability || !dateAvailability.availableSlots || dateAvailability.availableSlots === 0) {
      
    } else {
      
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    // Clear selected package when time changes
    setSelectedPackage(null);
  };

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime) {
      showWarning('Please select a date and time', 'Selection Required');
      return;
    }

    // If booking from existing package, don't require package selection
    if (!isBookingRemaining && !selectedPackage) {
      showWarning('Please select a package', 'Selection Required');
      return;
    }

    if (!selectedDoctor) {
      showError('Doctor information not available', 'Booking Error');
      return;
    }

    // Check if user is authenticated and is a client
    if (!isAuthenticated) {
      showWarning('Please log in to book a session. Only clients can book sessions.', 'Authentication Required');
      const returnUrl = `/therapist-profile?doctor=${doctorIndex}`;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Check if user is a client
    if (!hasRole('client')) {
      showError('Only clients can book sessions. You are logged in as a ' + user.role, 'Access Denied');
      return;
    }

    // Declare clientProfile at function level so it's accessible throughout
    let clientProfile = null;

    // Check if client contact information is complete
    try {
      const clientProfileResponse = await clientApi.getProfile();
      clientProfile = clientProfileResponse.data; // Extract the actual profile data
      console.log('🔍 Client profile response:', clientProfileResponse);
      console.log('🔍 Client profile data:', clientProfile);
      
      if (!isClientContactComplete(clientProfile)) {
        const incompleteFields = getIncompleteContactFields(clientProfile);
        setIncompleteContactFields(incompleteFields);
        setShowContactWarning(true);
        return;
      }
    } catch (error) {
      console.error('Error checking client profile:', error);
      showError('Unable to verify profile completion. Please try again.', 'Profile Error');
      return;
    }

    setIsBooking(true);
    try {
      // Get current date and time in local timezone
      const now = new Date();
      
      // Format selected date for scheduled session using local formatting
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(selectedDate.getDate()).padStart(2, '0');
      const scheduledDate = `${year}-${month}-${dayStr}`;
      
      // Convert time to 24-hour format for database
      const timeStr = selectedTime;
      let scheduledTime;
      if (timeStr.includes('PM') && !timeStr.includes('12')) {
        const hour = parseInt(timeStr.split(':')[0]) + 12;
        const minute = timeStr.split(':')[1].split(' ')[0];
        scheduledTime = `${hour.toString().padStart(2, '0')}:${minute}:00`;
      } else if (timeStr.includes('AM') && timeStr.includes('12')) {
        scheduledTime = `00:${timeStr.split(':')[1].split(' ')[0]}:00`;
      } else {
        const hour = timeStr.split(':')[0];
        const minute = timeStr.split(':')[1].split(' ')[0];
        scheduledTime = `${hour.padStart(2, '0')}:${minute}:00`;
      }

      // First, reserve the time slot and get payment details
      let slotReservation;
      if (isBookingRemaining && clientPackage) {
        // Book remaining session from package (no payment needed)
        const bookingData = {
          psychologist_id: selectedDoctor.id,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          package_id: clientPackage.id
        };

        sessionResponse = await clientApi.bookRemainingSession(bookingData);
      } else {
        // Reserve slot for payment
        const reservationData = {
          psychologist_id: selectedDoctor.id,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          package_id: selectedPackage.id
        };

        slotReservation = await clientApi.reserveSlot(reservationData);
      }

      if (isBookingRemaining && clientPackage) {
        if (!sessionResponse.success) {
          if (sessionResponse.statusCode === 401) {
            showError('Session expired. Please log in again.', 'Authentication Error');
            router.push('/login');
          } else if (sessionResponse.statusCode === 403) {
            showError('Only clients can book sessions. Please log in with a client account.', 'Access Denied');
            router.push('/login');
          } else if (sessionResponse.statusCode === 404) {
            showError('Client profile not found. Please complete your profile first.', 'Profile Not Found');
            router.push('/profile');
          } else {
            showError(`Booking failed: ${sessionResponse.message || 'Unknown error'}`, 'Booking Error');
          }
          return;
        }

        setBookingSuccess(true);
        // Reset selections
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedPackage(null);
        setSelectedPrice(null);
        // Show success message
        setTimeout(() => setBookingSuccess(false), 5000);
        return;
      }

      // Handle payment flow for new bookings
      if (!slotReservation.success) {
        if (slotReservation.statusCode === 401) {
          showError('Session expired. Please log in again.', 'Authentication Error');
          router.push('/login');
        } else if (slotReservation.statusCode === 403) {
          showError('Only clients can book sessions. Please log in with a client account.', 'Access Denied');
          router.push('/login');
        } else if (slotReservation.statusCode === 404) {
          showError('Client profile not found. Please complete your profile first.', 'Profile Not Found');
          router.push('/profile');
        } else {
          showError(`Slot reservation failed: ${slotReservation.message || 'Unknown error'}`, 'Reservation Error');
        }
        return;
      }

      // Create payment order for new package booking
      const clientId = slotReservation.data.clientId;
      const amount = slotReservation.data.price;
      const sessionType = selectedPackage.session_count > 1 ? 'Package Session' : 'Individual Session';
      
      // Debug logging
      console.log('🔍 Payment Debug Info:', {
        scheduledDate,
        scheduledTime,
        psychologistId: selectedDoctor.id,
        clientId: clientId,
        amount,
        packageId: selectedPackage.id,
        sessionType,
        clientName: `${clientProfile?.first_name || ''} ${clientProfile?.last_name || ''}`,
        clientEmail: user?.email,
        clientPhone: clientProfile?.phone_number,
        user: user,
        clientProfile: clientProfile,
        slotReservation: slotReservation.data
      });
      
      const paymentData = {
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        psychologistId: selectedDoctor.id,
        clientId: clientId,
        amount: amount,
        packageId: selectedPackage.id,
        sessionType: sessionType,
        clientName: `${clientProfile?.first_name || ''} ${clientProfile?.last_name || ''}`,
        clientEmail: user?.email,
        clientPhone: clientProfile?.phone_number
      };

      const paymentResponse = await paymentApi.createPaymentOrder(paymentData);

      console.log('🔍 Payment Response:', paymentResponse);

      if (paymentResponse.success) {
        console.log('✅ Payment response successful, redirecting to PayU...');
        console.log('🔗 Redirect URL:', paymentResponse.data.redirectUrl);
        console.log('📋 PayU Params:', paymentResponse.data.payuParams);
        
        // Validate redirect URL before using it
        if (!paymentResponse.data.redirectUrl) {
          console.error('❌ No redirect URL provided');
          showError('Payment gateway error: No redirect URL');
          return;
        }
        
        try {
          new URL(paymentResponse.data.redirectUrl);
        } catch (urlError) {
          console.error('❌ Invalid redirect URL:', paymentResponse.data.redirectUrl, urlError);
          showError('Payment gateway error: Invalid URL');
          return;
        }
        
        // Add a small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create and submit form to PayU
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentResponse.data.redirectUrl;
        form.target = '_self'; // Changed from '_blank' to '_self' to open in same window
        form.style.display = 'none'; // Hide the form

        // Add PayU parameters
        Object.entries(paymentResponse.data.payuParams).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        // Append form to body and submit
        document.body.appendChild(form);
        console.log('🚀 Submitting form to PayU...');
        form.submit();
        
        // Don't remove the form immediately - let it submit first
        setTimeout(() => {
          if (document.body.contains(form)) {
            document.body.removeChild(form);
          }
        }, 1000);

        // Show success message for session creation
        setBookingSuccess(true);
        // Reset selections
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedPackage(null);
        setSelectedPrice(null);
        // Show success message
        setTimeout(() => setBookingSuccess(false), 5000);
      } else {
        console.error('❌ Payment response failed:', paymentResponse);
        showError(`Payment initiation failed: ${paymentResponse.message || 'Unknown error'}`, 'Payment Error');
      }
    } catch (error) {
      console.error('Booking error:', error);
      showError('Booking failed. Please try again.', 'Booking Error');
    } finally {
      setIsBooking(false);
    }
  };

  // Handle booking remaining session from package
  const handleBookRemainingSession = async () => {
    if (!selectedDate || !selectedTime || !selectedPackage) {
      showWarning('Please select a date and time', 'Selection Required');
      return;
    }

    if (!selectedDoctor) {
      showError('Doctor information not available', 'Booking Error');
      return;
    }

    setIsBooking(true);
    try {
      // Get current date and time in local timezone
      const now = new Date();
      
      // Format selected date for scheduled session using local formatting
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(selectedDate.getDate()).padStart(2, '0');
      const scheduledDate = `${year}-${month}-${dayStr}`;
      
      // Convert time to 24-hour format for database
      const timeStr = selectedTime;
      let scheduledTime;
      if (timeStr.includes('PM') && !timeStr.includes('12')) {
        const hour = parseInt(timeStr.split(':')[0]) + 12;
        const minute = timeStr.split(':')[1].split(' ')[0];
        scheduledTime = `${hour.toString().padStart(2, '0')}:${minute}:00`;
      } else if (timeStr.includes('AM') && timeStr.includes('12')) {
        scheduledTime = `00:${timeStr.split(':')[1].split(' ')[0]}:00`;
      } else {
        const hour = timeStr.split(':')[0];
        const minute = timeStr.split(':')[1].split(' ')[0];
        scheduledTime = `${hour.padStart(2, '0')}:${minute}:00`;
      }

      const bookingData = {
        psychologist_id: selectedDoctor.id,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        package_id: selectedPackage.id
      };

      const response = await clientApi.bookRemainingSession(bookingData);

      if (response.success) {
        setBookingSuccess(true);
        // Reset selections
        setSelectedDate(null);
        setSelectedTime(null);
        // Show success message
        setTimeout(() => setBookingSuccess(false), 5000);
        
        // Refresh client package data
        // The original code had a fetchClientPackage function, but it's not defined.
        // Assuming it would refetch packages or availability if needed.
        // For now, we'll just show a success message.
      } else {
        showError(`Booking failed: ${response.message || 'Unknown error'}`, 'Booking Error');
      }
    } catch (error) {
      console.error('Remaining session booking error:', error);
      showError('Booking failed. Please try again.', 'Booking Error');
    } finally {
      setIsBooking(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const openTreatmentModal = (treatment) => {
    setSelectedTreatment(treatment);
    setShowTreatmentModal(true);
  };

  const closeTreatmentModal = () => {
    setShowTreatmentModal(false);
    setSelectedTreatment(null);
  };

  const handlePricingSelect = (pricing) => {
    setSelectedPricing(pricing);
  };



  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctorIndex !== null && doctors.length > 0) {
      const doctor = doctors[parseInt(doctorIndex)];
      if (doctor) {

        setSelectedDoctor(doctor);
        // Fetch availability and packages for this psychologist

        fetchPsychologistAvailability(doctor.id);
        fetchPsychologistPackages(doctor.id);
      }
    }
  }, [doctorIndex, doctors]);

  // Handle package_id parameter for booking remaining sessions
  useEffect(() => {
    if (packageId && isAuthenticated() && hasRole('client')) {
      fetchClientPackage(packageId);
    }
  }, [packageId, isAuthenticated, hasRole]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading Doctor Profile...</h1>
        </div>
      </div>
    );
  }

  if (error || !selectedDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'Unable to load doctor information'}</p>
          <button 
            onClick={() => router.push('/guide')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Back to Guide
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Profile Card */}
      <div className="bg-white shadow-lg">
        <div className="w-full">
          {/* Top Section with Green Background */}
          <div className="relative bg-gradient-to-r from-green-50 to-green-100 p-6 md:p-12" style={{ minHeight: '120px', zIndex: 0 }}>
            {/* Abstract Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{ pointerEvents: 'none' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                <path d="M50 50 Q100 30 150 50 Q200 70 250 50 Q300 30 350 50" 
                      fill="none" stroke="#27ae60" strokeWidth="2"/>
                <path d="M30 100 Q80 80 130 100 Q180 120 230 100 Q280 80 330 100" 
                      fill="none" stroke="#27ae60" strokeWidth="2"/>
                <path d="M70 150 Q120 130 170 150 Q220 170 270 150 Q320 130 370 150" 
                      fill="none" stroke="#27ae60" strokeWidth="2"/>
              </svg>
            </div>
            
            {/* Mobile: Profile Picture at top */}
            <div className="relative z-10 flex items-center justify-center md:hidden h-full" style={{ paddingTop: '60px', pointerEvents: 'auto' }}>
              <div className="relative">
                <div className="w-48 h-48 rounded-[20px] overflow-hidden relative bg-white">
                  {/* Doctor Profile Picture or Fallback */}
                  {(selectedDoctor.profile_picture_url || selectedDoctor.cover_image_url ||
                    (selectedDoctor.name && (selectedDoctor.name.toLowerCase().includes('irene') ||
                                           selectedDoctor.name.toLowerCase().includes('marium')))) ? (
                    <img 
                      src={selectedDoctor.profile_picture_url || selectedDoctor.cover_image_url ||
                           (() => {
                             const name = selectedDoctor.name?.toLowerCase() || '';
                             if (name.includes('irene') || name.includes('marium')) return '/irene.jpeg';
                             if (name.includes('doug') || name.includes('douglas')) return '/doug.png';
                             if (name.includes('ashley') || name.includes('ash')) return '/hero.png';
                             if (name.includes('child') || name.includes('teen')) return '/kids.png';
                             return null;
                           })()}
                      alt={selectedDoctor.name || selectedDoctor.first_name}
                    className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback: Doctor Initials Avatar */}
                  <div 
                    style={{
                      display: (selectedDoctor.profile_picture_url || selectedDoctor.cover_image_url ||
                                (selectedDoctor.name && (selectedDoctor.name.toLowerCase().includes('irene') || 
                                                       selectedDoctor.name.toLowerCase().includes('marium') ||
                                                       selectedDoctor.name.toLowerCase().includes('doug') ||
                                                       selectedDoctor.name.toLowerCase().includes('ashley') ||
                                                       selectedDoctor.name.toLowerCase().includes('child')))) ? 'none' : 'flex',
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      fontWeight: "bold",
                      color: "#fff",
                      textShadow: "0 4px 16px rgba(0,0,0,0.5)"
                    }}
                  >
                    {selectedDoctor.name ? 
                      selectedDoctor.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() :
                      selectedDoctor.first_name ? 
                        selectedDoctor.first_name.charAt(0).toUpperCase() : 
                        'D'
                    }
                  </div>
                </div>
                
                {/* Experience text - Mobile positioning */}
                {selectedDoctor.experience_years && (
                <div className="absolute bottom-2 -right-2 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
                  <p className="text-gray-800 text-xs font-medium">
                      <span className="font-semibold">{selectedDoctor.experience_years}+ years of experience</span>
                  </p>
                </div>
                )}
              </div>
            </div>

            {/* Desktop: Name and Title - Responsive positioning */}
            <div className="hidden md:flex relative z-10 items-center justify-start md:ml-[28rem] h-full" style={{ paddingTop: '60px', pointerEvents: 'auto' }}>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                  {selectedDoctor.name || `${selectedDoctor.first_name} ${selectedDoctor.last_name}`}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  Psychologist
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Doctor Details Section */}
      <div className="bg-blue-50 shadow-lg">
        <div className="w-full p-4 md:p-8">
          {/* Mobile: Doctor Name below image */}
          <div className="text-center md:hidden mb-6">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              {selectedDoctor.name || `${selectedDoctor.first_name} ${selectedDoctor.last_name}`}
            </h1>
            <p className="text-sm text-gray-600">
              {selectedDoctor.specialization || 'Licensed Psychologist'}
            </p>
          </div>
          
          {/* Desktop: Profile Picture - Left aligned */}
          <div className="hidden md:flex justify-start -mt-56 mb-8 ml-32">
            <div className="relative">
              <div className="w-80 h-80 rounded-[20px] overflow-hidden relative bg-white">
                {/* Doctor Profile Picture or Fallback */}
                {(selectedDoctor.profile_picture_url || selectedDoctor.cover_image_url ||
                  (selectedDoctor.name && (selectedDoctor.name.toLowerCase().includes('irene') ||
                                         selectedDoctor.name.toLowerCase().includes('marium')))) ? (
                  <img 
                    src={selectedDoctor.profile_picture_url || selectedDoctor.cover_image_url ||
                         (() => {
                           const name = selectedDoctor.name?.toLowerCase() || '';
                           if (name.includes('irene') || name.includes('marium')) return '/irene.jpeg';
                           if (name.includes('doug') || name.includes('douglas')) return '/doug.png';
                           if (name.includes('ashley') || name.includes('ash')) return '/hero.png';
                           if (name.includes('child') || name.includes('teen')) return '/kids.png';
                           return null;
                         })()}
                    alt={selectedDoctor.name || selectedDoctor.first_name}
                  className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback: Doctor Initials Avatar */}
                <div 
                  style={{
                    display: (selectedDoctor.profile_picture_url || selectedDoctor.cover_image_url ||
                              (selectedDoctor.name && (selectedDoctor.name.toLowerCase().includes('irene') || 
                                                     selectedDoctor.name.toLowerCase().includes('marium') ||
                                                     selectedDoctor.name.toLowerCase().includes('doug') ||
                                                     selectedDoctor.name.toLowerCase().includes('ashley') ||
                                                     selectedDoctor.name.toLowerCase().includes('child')))) ? 'none' : 'flex',
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "6rem",
                    fontWeight: "bold",
                    color: "#fff",
                    textShadow: "0 4px 16px rgba(0,0,0,0.5)"
                  }}
                >
                  {selectedDoctor.name ? 
                    selectedDoctor.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() :
                    selectedDoctor.first_name ? 
                      selectedDoctor.first_name.charAt(0).toUpperCase() : 
                      'D'
                  }
                </div>
              </div>
              
              {/* Experience text - Desktop positioning */}
              {selectedDoctor.experience_years && (
              <div className="absolute bottom-4 -right-8 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                <p className="text-gray-800 text-xs font-medium">
                    <span className="font-semibold">{selectedDoctor.experience_years}+ years of experience</span>
                </p>
              </div>
              )}
              
              {/* Qualifications and Pricing - Desktop only */}
              <div className="absolute bottom-16 right-[-330px] p-3">
                <div className="mb-1">
                  <p className="text-gray-800 font-medium text-sm">
                    {selectedDoctor.ug_college && selectedDoctor.ug_college !== 'N/A' ? 
                      `Education: ${selectedDoctor.ug_college}` : 
                      'Licensed Professional'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-gray-800 text-sm">
                    <span className="font-medium">
                      {selectedDoctor.price ? `Starts at ₹${selectedDoctor.price} per session` : 'Pricing available upon request'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end items-start mb-8 mt-0 md:-mt-32">
            {/* Action Buttons */}
            <div className="flex gap-2 md:gap-4">
              <button 
                onClick={handleBookSession}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 md:py-3 md:px-8 rounded-full transition-colors duration-200 shadow-lg text-sm md:text-base"
              >
                BOOK SESSION
              </button>
              <button className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200">
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar and About Section */}
      <div className="w-full p-4 md:p-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            {/* Left Side - About Description */}
            <div className="space-y-6 mt-[50px] md:mt-[100px]">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About {selectedDoctor.name || `${selectedDoctor.first_name} ${selectedDoctor.last_name}`}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {selectedDoctor.description || "This doctor is passionate about helping people achieve mental wellness through evidence-based therapy and compassionate guidance."}
              </p>
              

              
              {/* Specialization */}
              {selectedDoctor.area_of_expertise && Array.isArray(selectedDoctor.area_of_expertise) && selectedDoctor.area_of_expertise.length > 0 && (
                <div className="p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Specialization</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.area_of_expertise.map((spec, i) => (
                      <div key={i} className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium">
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Education */}
              {(selectedDoctor.ug_college && selectedDoctor.ug_college !== 'N/A') || 
               (selectedDoctor.pg_college && selectedDoctor.pg_college !== 'N/A') || 
               (selectedDoctor.phd_college && selectedDoctor.phd_college !== 'N/A') ? (
              <div className="p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Education & Qualifications</h3>
                  <div className="space-y-2">
                    {selectedDoctor.ug_college && selectedDoctor.ug_college !== 'N/A' && (
                      <p className="text-gray-700 text-sm">
                        <strong>Education:</strong> {selectedDoctor.ug_college}
                      </p>
                    )}
                    {selectedDoctor.pg_college && selectedDoctor.pg_college !== 'N/A' && (
                      <p className="text-gray-700 text-sm">
                        <strong>Post Graduate:</strong> {selectedDoctor.pg_college}
                      </p>
                    )}
                    {selectedDoctor.phd_college && selectedDoctor.phd_college !== 'N/A' && (
                      <p className="text-gray-700 text-sm">
                        <strong>PhD:</strong> {selectedDoctor.phd_college}
                      </p>
                    )}
                </div>
              </div>
              ) : null}
              
              {/* Languages Section */}
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium">
                    English
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                    Malayalam
                  </div>
                </div>
              </div>
              
              {/* FAQ Section - Desktop/Laptop View */}
              <div className="mt-6 p-4 rounded-lg bg-gray-50 hidden lg:block">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
                
                <div className="space-y-3">
                  {/* FAQ 1 */}
                  <div className="border border-gray-200 rounded-lg bg-white">
                    <button
                      onClick={() => toggleFAQ(0)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800 text-sm">What makes your approach to therapy unique?</span>
                      <span className="text-gray-500 text-lg font-bold">
                        {openFAQ === 0 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 0 && (
                      <div className="px-3 pb-3">
                        <p className="text-gray-700 leading-relaxed text-xs">
                          &quot;My approach is unique because I combine evidence-based therapeutic techniques with a deeply empathetic and personalized approach. I don&apos;t believe in one-size-fits-all therapy. Each person&apos;s journey is unique, so I adapt my methods to fit their specific needs and cultural background.&quot;
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* FAQ 2 */}
                  <div className="border border-gray-200 rounded-lg bg-white">
                    <button
                      onClick={() => toggleFAQ(1)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800 text-sm">How do you help hesitant clients?</span>
                      <span className="text-gray-500 text-lg font-bold">
                        {openFAQ === 1 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 1 && (
                      <div className="px-3 pb-3">
                        <p className="text-gray-700 leading-relaxed text-xs">
                          &quot;I understand that starting therapy can be intimidating. I always begin by building trust and explaining the process clearly. I encourage clients to ask questions and express their concerns openly. Many people worry about being judged, so I make sure they know this is a collaborative journey.&quot;
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* FAQ 3 */}
                  <div className="border border-gray-200 rounded-lg bg-white">
                    <button
                      onClick={() => toggleFAQ(2)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800 text-sm">What&apos;s most important in successful therapy?</span>
                      <span className="text-gray-500 text-lg font-bold">
                        {openFAQ === 2 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 2 && (
                      <div className="px-3 pb-3">
                        <p className="text-gray-700 leading-relaxed text-xs">
                          &quot;The therapeutic relationship is absolutely crucial. Research consistently shows that the connection between therapist and client is one of the strongest predictors of successful outcomes. Beyond that, I believe in the power of collaboration and client involvement.&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Right Side - Calendar */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-md w-full mx-auto md:ml-32 sticky top-4 self-start mt-[50px] md:mt-[100px]">
              {/* Calendar Header */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Book Your Session</h3>
                <p className="text-gray-600 text-sm">Select a date and time that works for you</p>
                {loadingAvailability && (
                  <div className="mt-2 flex items-center justify-center text-blue-600 text-xs">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                    Loading availability...
                  </div>
                )}
              </div>
              
              {/* Session Type */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Session Type</h4>
                {selectedPricing ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      {selectedPricing.type === 'individual' ? 'Individual' : 
                       selectedPricing.type === 'family' ? 'Family' : 'Child'} Session
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {selectedPricing.duration} - ₹{selectedPricing.price}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Select a pricing option from below</p>
                )}
              </div>
              
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <h4 className="text-sm font-semibold text-gray-800">{getMonthName(currentDate)}</h4>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
              
              {/* Calendar Legend */}
              <div className="mb-3 text-xs text-gray-600">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-50 border border-green-200 rounded mr-1"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-100 rounded mr-1"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                    <span>Selected</span>
                  </div>
                </div>
                {/* Debug info */}
                <div className="mt-2 text-center text-xs text-gray-500">
                  <p>Selected: {selectedDate ? selectedDate.toDateString() : 'None'}</p>
                  <p>Availability loaded: {Object.keys(psychologistAvailability).length > 0 ? 'Yes' : 'No'}</p>
                  <button 
                    onClick={() => {
              
                      if (selectedDoctor) {
                        fetchPsychologistAvailability(selectedDoctor.id);
                      }
                    }}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  >
                    Reload Availability
                  </button>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={`header-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
                {(() => {
                  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
                  const today = new Date();
                  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                  
                  // Create array for calendar grid
                  const calendarDays = [];
                  
                  // Add empty cells for days before the first day of the month
                  for (let i = 0; i < startingDay; i++) {
                    calendarDays.push(<div key={`empty-${i}`} className="text-center py-1 text-xs"></div>);
                  }
                  
                  // Add days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const isToday = isCurrentMonth && day === today.getDate();
                    const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
                    const isAvailable = day >= today.getDate() || !isCurrentMonth;
                    
                                          // Check if this specific date is available for the psychologist
                      // Use local date formatting to avoid timezone conversion issues
                      const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const year = calendarDate.getFullYear();
                      const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
                      const dayStr = String(calendarDate.getDate()).padStart(2, '0');
                      const dateStr = `${year}-${month}-${dayStr}`;
                      const dateAvailability = psychologistAvailability[dateStr];
                      const isPsychologistAvailable = dateAvailability && dateAvailability.availableSlots > 0;
                    
                    // Only show dates as available if they actually have availability data
                    const isActuallyAvailable = isPsychologistAvailable && isAvailable;
                    
                    calendarDays.push(
                      <div
                        key={`day-${day}`}
                        onClick={() => {
                          // Allow clicking on any future date, not just those with availability
                          if (isAvailable) {
                            handleDateSelect(day);
                          }
                        }}
                        className={`text-center py-1 rounded-lg transition-all duration-200 text-xs ${
                          isSelected 
                            ? 'bg-green-600 text-white font-bold shadow-lg cursor-pointer' 
                            : isToday
                              ? 'bg-blue-100 text-blue-700 font-semibold cursor-pointer'
                              : isPsychologistAvailable
                                ? 'bg-green-500 text-white font-semibold shadow-md cursor-pointer border-2 border-green-600 hover:bg-green-600 hover:scale-105 transform' // Dates with actual availability - highlighted with hover effects
                              : isAvailable
                                ? 'hover:bg-gray-100 text-gray-500 cursor-pointer' // Future dates without availability (now clickable)
                                : 'text-gray-300 cursor-not-allowed' // Past dates
                        }`}
                        title={isPsychologistAvailable ? 'Available for booking' : isAvailable ? 'Click to check availability' : 'Past date'}
                      >
                        {day}
                        {isPsychologistAvailable && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1 shadow-sm"></div>
                        )}
                        {!isPsychologistAvailable && isAvailable && (
                          <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    );
                  }
                  
                  return calendarDays;
                })()}
              </div>
              
              {/* Calendar Legend */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Calendar Legend:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded border-2 border-green-600"></div>
                    <span className="font-medium">Available for booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-100 rounded"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                    <span>Future date (clickable)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span>Past date</span>
                  </div>
                </div>
              </div>
              
                            {/* Package Selection or Package Information */}
              <div className="space-y-4">
                {isBookingRemaining && clientPackage ? (
                  // Show package information when booking remaining sessions
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Your Package</h4>
                    <div className="p-4 rounded-lg border border-green-500 bg-green-50 text-green-700 shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-left">
                          <span className="font-semibold text-base">{clientPackage.package_type}</span>
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Remaining Sessions
                          </span>
                        </div>
                        <span className="font-bold text-lg">Already Paid</span>
                      </div>
                      <div className="text-left text-gray-600 text-xs">
                        <p>Package purchased on {new Date(clientPackage.purchased_at).toLocaleDateString()}</p>
                        <p className="mt-1 font-medium">
                          {clientPackage.remaining_sessions} of {clientPackage.total_sessions} sessions remaining
                        </p>
                        <p className="mt-1 text-green-600 font-medium">
                          Total paid: ${clientPackage.amount_paid}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show package selection for new bookings
                  <>
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Select Package</h4>
                    
                    {/* Individual Session Option - Always Available */}
                    <button
                      onClick={() => {
                        setSelectedPackage({
                          id: 'individual',
                          name: 'Individual Session',
                          description: 'One therapy session',
                          session_count: 1,
                          price: selectedDoctor.price,
                          package_type: 'individual',
                          discount_percentage: 0
                        });
                        setSelectedPrice(selectedDoctor.price);
                      }}
                      className={`p-2 rounded-lg border text-sm transition-all duration-200 w-full text-left ${
                        selectedPackage?.id === 'individual'
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-md' 
                          : 'border-gray-300 hover:border-green-300 text-gray-700 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <span className="font-semibold text-sm">Individual Session</span>
                        </div>
                        <span className="font-bold text-base">₹{selectedDoctor.price}</span>
                      </div>
                    </button>
                    
                    {/* Dynamic Packages from Database */}
                    {loadingPackages ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                        <p className="text-gray-500 text-xs mt-2">Loading packages...</p>
                      </div>
                    ) : packages.length > 0 ? (
                      <div className="space-y-2">
                        {packages.filter(pkg => pkg.session_count > 1).map((pkg) => (
                          <button
                            key={pkg.id}
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setSelectedPrice(pkg.price);
                            }}
                            className={`p-2 rounded-lg border text-sm transition-all duration-200 w-full text-left ${
                              selectedPackage?.id === pkg.id
                                ? 'border-green-500 bg-green-50 text-green-700 shadow-md' 
                                : 'border-gray-300 hover:border-green-300 text-gray-700 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="text-left">
                                <span className="font-semibold text-sm">{pkg.name}</span>
                                {pkg.discount_percentage > 0 && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded-full">
                                    Save {pkg.discount_percentage}%
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-base">₹{pkg.price}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <p>No additional packages available</p>
                        <p className="text-xs mt-1">Individual session option is always available above</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Time Slots */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">Available Times</h4>
                
                {selectedDate ? (
                                      (() => {
                      // Use local date formatting to avoid timezone conversion issues
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                      const dayStr = String(selectedDate.getDate()).padStart(2, '0');
                      const dateStr = `${year}-${month}-${dayStr}`;
                    const dateAvailability = psychologistAvailability[dateStr];
                    const allTimeSlots = dateAvailability?.timeSlots || [];
                    const availableSlots = allTimeSlots.filter(slot => slot.available).map(slot => slot.displayTime);
                    const blockedSlots = allTimeSlots.filter(slot => !slot.available).map(slot => slot.displayTime);
                    

                    
                    if (!dateAvailability || !allTimeSlots.length) {
                      return (
                        <div className="text-center py-8">
                          <div className="text-gray-500 text-sm">
                            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>No availability for this date</p>
                            <p className="text-xs mt-1">Please select another date</p>
                            <button 
                              onClick={() => {
                                // Find next available date
                                const nextAvailable = Object.entries(psychologistAvailability)
                                  .find(([date, availability]) => 
                                    new Date(date) > selectedDate && availability.available && availability.timeSlots?.length > 0
                                  );
                                if (nextAvailable) {
                                  setSelectedDate(new Date(nextAvailable[0]));
                                }
                              }}
                              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
                            >
                              Find Next Available
                            </button>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-gray-800 text-sm">TIME SLOTS</h5>
                          <span className="font-bold text-gray-800 text-sm">Available: {availableSlots.length} | Blocked: {blockedSlots.length}</span>
                        </div>
                        
                        {/* Available Time Slots */}
                        {availableSlots.length > 0 && (
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-green-700">Available Times:</h6>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-1">
                              {availableSlots.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => handleTimeSelect(time)}
                                  className={`p-2 rounded-lg border text-xs transition-all duration-200 w-full h-10 flex items-center justify-center ${
                                    selectedTime === time
                                      ? 'border-green-500 bg-green-50 text-green-700' 
                                      : 'border-green-300 bg-green-50 hover:border-green-400 text-green-700'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Blocked Time Slots */}
                        {blockedSlots.length > 0 && (
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium text-red-700">Blocked Times:</h6>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-1">
                              {blockedSlots.map((time) => (
                                <div
                                  key={time}
                                  className="p-2 rounded-lg border border-red-300 bg-red-50 text-red-700 text-xs w-full h-10 flex items-center justify-center cursor-not-allowed"
                                  title="This time slot is not available"
                                >
                                  {time}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-sm">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                      </svg>
                      <p>Select a date to see available times</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Login/Role Prompt */}
              {!isAuthenticated() ? (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-sm text-center">
                    🔐 Please <button onClick={() => router.push('/login')} className="underline font-semibold">log in</button> to book a session
                  </p>
                </div>
              ) : !hasRole('client') ? (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700 text-sm text-center">
                    ⚠️ Only clients can book sessions. You are logged in as a {user.role}.
                  </p>
                </div>
              ) : null}

              {/* Book Button */}
              <button 
                onClick={handleBookSession}
                disabled={!selectedDate || !selectedTime || (!selectedPackage && !isBookingRemaining) || isBooking || !isAuthenticated() || !hasRole('client')}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm ${
                  !selectedDate || !selectedTime || (!selectedPackage && !isBookingRemaining) || isBooking || !isAuthenticated() || !hasRole('client')
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isBooking ? 'Booking...' : isBookingRemaining ? 'Book Remaining Session' : `Book ${selectedPackage?.name || 'Session'}`}
              </button>

              {/* Success Message */}
              {bookingSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm text-center">
                    ✅ Session booked successfully! You will receive a confirmation email.
                  </p>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section - Mobile View */}
      <div className="w-full p-4 md:p-8 bg-white lg:hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-3">
              {/* FAQ 1 */}
              <div className="border border-gray-200 rounded-lg bg-white">
                <button
                  onClick={() => toggleFAQ(0)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-sm">What makes your approach to therapy unique?</span>
                  <span className="text-gray-500 text-lg font-bold">
                    {openFAQ === 0 ? '−' : '+'}
                  </span>
                </button>
                {openFAQ === 0 && (
                  <div className="px-3 pb-3">
                    <p className="text-gray-700 leading-relaxed text-xs">
                      &quot;My approach is unique because I combine evidence-based therapeutic techniques with a deeply empathetic and personalized approach. I don&apos;t believe in one-size-fits-all therapy. Each person&apos;s journey is unique, so I adapt my methods to fit their specific needs and cultural background.&quot;
                    </p>
                  </div>
                )}
              </div>
              
              {/* FAQ 2 */}
              <div className="border border-gray-200 rounded-lg bg-white">
                <button
                  onClick={() => toggleFAQ(1)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-sm">How do you help hesitant clients?</span>
                  <span className="text-gray-500 text-lg font-bold">
                    {openFAQ === 1 ? '−' : '+'}
                  </span>
                </button>
                {openFAQ === 1 && (
                  <div className="px-3 pb-3">
                    <p className="text-gray-700 leading-relaxed text-xs">
                      &quot;I understand that starting therapy can be intimidating. I always begin by building trust and explaining the process clearly. I encourage clients to ask questions and express their concerns openly. Many people worry about being judged, so I make sure they know this is a collaborative journey.&quot;
                    </p>
                  </div>
                )}
              </div>
              
              {/* FAQ 3 */}
              <div className="border border-gray-200 rounded-lg bg-white">
                <button
                  onClick={() => toggleFAQ(2)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-sm">What&apos;s most important in successful therapy?</span>
                  <span className="text-gray-500 text-lg font-bold">
                    {openFAQ === 2 ? '−' : '+'}
                  </span>
                </button>
                {openFAQ === 2 && (
                  <div className="px-3 pb-3">
                    <p className="text-gray-700 leading-relaxed text-xs">
                      &quot;The therapeutic relationship is absolutely crucial. Research consistently shows that the connection between therapist and client is one of the strongest predictors of successful outcomes. Beyond that, I believe in the power of collaboration and client involvement.&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Support Contact Section */}
      <div className="w-full h-auto md:h-[100px] bg-green-500 flex items-center justify-center py-4 md:py-0">
        <p className="text-white text-xs md:text-sm text-center px-4">
          If you didn&apos;t find what you were looking for, please reach out to us at support@kuttikal.com or +1-555-0123. We&apos;re here for you - for anything you might need.
        </p>
      </div>
      
      {/* Treatment Method Modal */}
      {showTreatmentModal && selectedTreatment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-4 md:p-8">
              {/* Header with centered title and close button */}
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 text-center flex-1">Treatment Method</h3>
                <button
                  onClick={closeTreatmentModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 ml-4"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              {/* Treatment title */}
              <h4 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">
                {selectedTreatment}
              </h4>
              
              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
                This treatment method is designed to help clients achieve their mental wellness goals through evidence-based approaches and compassionate care.
              </p>
              
              {/* Action button */}
              <div className="flex justify-center">
                <button
                  onClick={closeTreatmentModal}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg transition-colors duration-200 font-semibold text-xs md:text-sm uppercase tracking-wide"
                >
                  Got it, thanks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Completion Warning Modal */}
      <ContactCompletionWarning
        isOpen={showContactWarning}
        onClose={() => setShowContactWarning(false)}
        incompleteFields={incompleteContactFields}
        onCompleteProfile={() => {
          setShowContactWarning(false);
          router.push('/profile?tab=contact');
        }}
      />
    </div>
  );
};

// Loading fallback component
const TherapistProfileLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
    </div>
  </div>
);

// Main component with Suspense boundary
const TherapistProfilePage = () => {
  return (
    <Suspense fallback={<TherapistProfileLoading />}>
      <TherapistProfileContent />
    </Suspense>
  );
};

export default TherapistProfilePage;
