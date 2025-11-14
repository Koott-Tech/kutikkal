'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { publicApi } from '../../lib/backendApi';
import { clientApi, paymentApi } from '../../lib/backendApi';
import backendApi from '../../lib/backendApi';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { isClientContactComplete, getIncompleteContactFields } from '../../lib/contactValidation';
import ContactCompletionWarning from '../../components/ContactCompletionWarning';
import AuthModal from '@/components/AuthModal';
import QuickContactModal from '@/components/QuickContactModal';

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

  // Share tooltip state
  const [showShareTooltip, setShowShareTooltip] = useState(false);

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

  // Fetch psychologist availability for a given month (defaults to currentDate) with Google Calendar sync
  const fetchPsychologistAvailability = async (psychologistId, baseDate = null) => {
    try {
      setLoadingAvailability(true);
      
      // Use provided baseDate or fallback to currentDate
      const targetDate = baseDate instanceof Date ? baseDate : currentDate;
      
      // Get month range using local formatting to avoid timezone issues
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      
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
      
      // First, trigger Google Calendar sync to get latest external bookings
      try {
        console.log('🔄 Syncing Google Calendar for psychologist:', psychologistId);
        const syncResponse = await fetch(`/api/availability-controller/sync-google-calendar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            psychologist_id: psychologistId,
            start_date: startDate,
            end_date: endDate
          })
        });
        
        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          console.log('✅ Google Calendar sync completed:', syncData);
        } else {
          console.log('⚠️ Google Calendar sync failed, continuing with cached data');
        }
      } catch (syncError) {
        console.log('⚠️ Google Calendar sync error, continuing with cached data:', syncError);
        // Continue with availability fetch even if sync fails
      }
      
      // Use real API call to get psychologist availability range (now includes Google Calendar data)
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
        const assessmentEmail = (process.env.NEXT_PUBLIC_FREE_ASSESSMENT_PSYCHOLOGIST_EMAIL || 'koottfordeveloper@gmail.com').toLowerCase();
        const allPsychologists = response.data.psychologists || [];
        const filteredPsychologists = allPsychologists.filter(
          (psych) => (psych.email || '').toLowerCase() !== assessmentEmail
        );
        setDoctors(filteredPsychologists);
        
        // Handle both index-based and ID-based doctor parameters
        if (doctorIndex !== null) {
          // Check if doctorIndex is a UUID (psychologist ID) or a number (index)
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorIndex);
          
          if (isUUID) {
            // If it's a UUID, find the psychologist by ID
            const psychologist = filteredPsychologists.find(doc => doc.id === doctorIndex);
            if (psychologist) {
              setSelectedDoctor(psychologist);
            } else {
              setError('Doctor not found');
            }
          } else {
            // If it's a number, use it as an index
            const index = parseInt(doctorIndex);
            if (!Number.isNaN(index) && filteredPsychologists[index]) {
              setSelectedDoctor(filteredPsychologists[index]);
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
    // Clear current day/time selection when changing months
    setSelectedDate(null);
    setSelectedTime(null);
    // Refetch availability for the new month (use the updated date)
    if (selectedDoctor) {
      fetchPsychologistAvailability(selectedDoctor.id, newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    // Clear current day/time selection when changing months
    setSelectedDate(null);
    setSelectedTime(null);
    // Refetch availability for the new month (use the updated date)
    if (selectedDoctor) {
      fetchPsychologistAvailability(selectedDoctor.id, newDate);
    }
  };

  const handleDateSelect = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    // Clear selected time when date changes (keep selected package)
    setSelectedTime(null);
    
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
    if (selectedTime === time) {
      // Toggle off if clicking the already selected time
      setSelectedTime(null);
    } else {
      setSelectedTime(time);
    }
    // Keep selected package intact when time changes
  };

  const parseTimeStringToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const trimmed = timeStr.trim();

    // Match 12-hour format e.g., "10:30 AM"
    const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
      let hours = parseInt(match12[1], 10);
      const minutes = parseInt(match12[2], 10);
      const period = match12[3].toUpperCase();
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      }
      if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      return hours * 60 + minutes;
    }

    // Match 24-hour format e.g., "14:30" or "14:30:00"
    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (match24) {
      const hours = parseInt(match24[1], 10);
      const minutes = parseInt(match24[2], 10);
      return hours * 60 + minutes;
    }

    return null;
  };

  const getSlotMinutes = (slot) => {
    if (!slot) return null;
    if (typeof slot === 'string') {
      return parseTimeStringToMinutes(slot);
    }
    const possibleKeys = ['time', 'time_slot', 'startTime', 'start_time', 'displayTime'];
    for (const key of possibleKeys) {
      if (slot[key]) {
        const minutes = parseTimeStringToMinutes(slot[key]);
        if (minutes !== null) return minutes;
      }
    }
    return null;
  };

  const formatSlotDisplayTime = (slot) => {
    if (!slot) return '';
    if (typeof slot === 'string') return slot;
    if (slot.displayTime) return slot.displayTime;
    const minutes = getSlotMinutes(slot);
    if (minutes === null) return slot.time || '';
    const hours24 = Math.floor(minutes / 60);
    const minutesPart = String(minutes % 60).padStart(2, '0');
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutesPart} ${period}`;
  };

  const isSlotInPast = (slot, date) => {
    if (!slot || !date) return false;
    const now = new Date();
    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
    if (!isSameDay) return false;
    const slotMinutes = getSlotMinutes(slot);
    if (slotMinutes === null) return false;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return slotMinutes <= nowMinutes;
  };

  const [showAuth, setShowAuth] = useState(false);
  const [showQuickContact, setShowQuickContact] = useState(false);

  const scrollToCalendar = () => {
    const calendarSection = document.getElementById('calendar-section');
    if (calendarSection) {
      const elementPosition = calendarSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset from top
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setShowShareTooltip(true);
      setTimeout(() => {
        setShowShareTooltip(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowShareTooltip(true);
      setTimeout(() => {
        setShowShareTooltip(false);
      }, 2000);
    }
  };

  const handleBookSession = async () => {
    // 1) Auth check first → show login/signup popup if needed
    if (!isAuthenticated() || !user) {
      setShowAuth(true);
      return;
    }

    // 2) Role check (avoid reading user.role directly)
    if (!hasRole('client')) {
      showError('Only clients can book sessions.', 'Access Denied');
      return;
    }

    // 3) Basic selections
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

    // Declare clientProfile at function level so it's accessible throughout
    let clientProfile = null;

    // Check if client contact information is complete
    try {
      const clientProfileResponse = await clientApi.getProfile();
      clientProfile = clientProfileResponse.data; // Extract the actual profile data
      console.log('🔍 Client profile response:', clientProfileResponse);
      console.log('🔍 Client profile data:', clientProfile);
      
      if (!isClientContactComplete(clientProfile)) {
        setShowQuickContact(true);
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

      // Real-time Google Calendar check before booking (call backend with auth)
      try {
        console.log('🔍 Performing real-time Google Calendar check before booking...');
        const checkData = await backendApi.get(`/availability-controller/google-calendar-busy-times?psychologist_id=${selectedDoctor.id}&start_date=${scheduledDate}&end_date=${scheduledDate}`);
        if (checkData?.success && Array.isArray(checkData.data) && checkData.data.length > 0) {
          const sessionStart = new Date(`${scheduledDate}T${scheduledTime}`);
          const sessionEnd = new Date(sessionStart.getTime() + 60 * 60 * 1000);
          const hasConflict = checkData.data.some(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            return (sessionStart < eventEnd && sessionEnd > eventStart);
          });
          if (hasConflict) {
            showError('This time slot is no longer available due to an external booking. Please select another time.', 'Time Slot Unavailable');
            setIsBooking(false);
            return;
          }
        }
      } catch (checkError) {
        console.log('⚠️ Real-time Google Calendar check failed, proceeding with booking:', checkError);
        // Continue with booking even if check fails
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
            setShowAuth(true);
          } else if (sessionResponse.statusCode === 403) {
            showError('Only clients can book sessions. Please log in with a client account.', 'Access Denied');
            setShowAuth(true);
          } else if (sessionResponse.statusCode === 404) {
            showError('Client profile not found. Please complete your profile first.', 'Profile Not Found');
            router.push('/profile');
          } else {
            showError(`Booking failed: ${sessionResponse.message || 'Unknown error'}`, 'Booking Error');
          }
          return;
        }

        setBookingSuccess(true);
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedPackage(null);
        setSelectedPrice(null);

      // Redirect to sessions page after booking succeeds
      router.push('/profile/sessions');
        return;
      }

      // Handle payment flow for new bookings
      if (!slotReservation.success) {
        if (slotReservation.statusCode === 401) {
          showError('Session expired. Please log in again.', 'Authentication Error');
          setShowAuth(true);
        } else if (slotReservation.statusCode === 403) {
          showError('Only clients can book sessions. Please log in with a client account.', 'Access Denied');
          setShowAuth(true);
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
        clientEmail: user?.email || clientProfile?.email || `${clientId}@little.care`,
        clientPhone: clientProfile?.phone_number
      };

      const paymentResponse = await paymentApi.createPaymentOrder(paymentData);

      console.log('🔍 Payment Response:', paymentResponse);

      if (paymentResponse.success) {
        console.log('✅ Payment response successful, opening PayU popup...');
        console.log('🔗 Redirect URL:', paymentResponse.data.redirectUrl);
        console.log('📋 PayU Params:', paymentResponse.data.payuParams);

        if (!paymentResponse.data.redirectUrl) {
          console.error('❌ No redirect URL provided');
          showError('Payment gateway error: No redirect URL');
          setIsBooking(false);
          return;
        }

        try {
          new URL(paymentResponse.data.redirectUrl);
        } catch (urlError) {
          console.error('❌ Invalid redirect URL:', paymentResponse.data.redirectUrl, urlError);
          showError('Payment gateway error: Invalid URL');
          setIsBooking(false);
          return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentResponse.data.redirectUrl;
        form.style.display = 'none';

        Object.entries(paymentResponse.data.payuParams || {}).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value ?? '';
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

        setTimeout(() => {
          if (document.body.contains(form)) {
            document.body.removeChild(form);
          }
        }, 1000);
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



  // Scroll to top on page load/refresh and disable automatic scroll restoration
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top
    window.scrollTo(0, 0);
    
    // Cleanup: restore default behavior when component unmounts
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctorIndex !== null && doctors.length > 0) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorIndex);
      let doctor = null;

      if (isUUID) {
        doctor = doctors.find(doc => doc.id === doctorIndex);
      } else {
        const index = parseInt(doctorIndex, 10);
        if (!Number.isNaN(index)) {
          doctor = doctors[index];
        }
      }

      if (doctor) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSelectedDoctor(doctor);
      }
    }
  }, [doctorIndex, doctors]);

  useEffect(() => {
    if (selectedDoctor) {
      fetchPsychologistAvailability(selectedDoctor.id);
      fetchPsychologistPackages(selectedDoctor.id);
    }
  }, [selectedDoctor]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3f2e73] mx-auto mb-4"></div>
          <p className="font-bold text-gray-800 mb-4">Loading Psychologist Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="font-bold text-gray-800 mb-4">Doctor Not Found</p>
          <p className="text-gray-600 mb-4">{error || 'Unable to load doctor information'}</p>
          <button 
            onClick={() => router.push('/psychologists')}
            className="bg-[#3f2e73] hover:bg-[#1d1733] text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Back to Psychologists
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white -mt-0" style={{ marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}>
      <style jsx>{`
        @media (min-width: 768px) and (max-width: 1023px) {
          .therapist-header-padding {
            padding: 6rem 1.5rem 3rem !important;
          }
          .therapist-profile-image {
            width: 18rem !important;
            height: 18rem !important;
          }
          .therapist-content-padding {
            padding: 1.5rem !important;
          }
          .therapist-about-section {
            margin-top: 3rem !important;
          }
          .therapist-calendar-section {
            margin-top: 3rem !important;
            margin-left: 1.5rem !important;
          }
        }
      `}</style>
      {/* Header Section - Profile Card */}
      <div className="bg-white shadow-lg" style={{ marginTop: 0, paddingTop: 0 }}>
        <div className="w-full">
          {/* Top Section with Green Background */}
          <div className="w-screen max-w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-6 md:px-12 pt-2 md:pt-3 pb-2 md:pb-3 therapist-header-padding" style={{ zIndex: 0, background: 'linear-gradient(to bottom, #f5f1ff, #eae4ff)', marginTop: 0, paddingTop: '24px' }}>
            {/* Abstract Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{ pointerEvents: 'none' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                <path d="M50 50 Q100 30 150 50 Q200 70 250 50 Q300 30 350 50" 
                      fill="none" stroke="#3f2e73" strokeWidth="2"/>
                <path d="M30 100 Q80 80 130 100 Q180 120 230 100 Q280 80 330 100" 
                      fill="none" stroke="#3f2e73" strokeWidth="2"/>
                <path d="M70 150 Q120 130 170 150 Q220 170 270 150 Q320 130 370 150" 
                      fill="none" stroke="#3f2e73" strokeWidth="2"/>
              </svg>
            </div>
            
            {/* Mobile: Profile Picture at top */}
            <div className="relative z-10 flex items-center justify-center md:hidden h-full mt-20" style={{ pointerEvents: 'auto' }}>
              <div className="relative">
                <div className="w-48 h-52 rounded-[20px] overflow-hidden relative bg-white" style={{ paddingTop: '0', border: 'none' }}>
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
                <div className="absolute bottom-2 -right-2 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-0.5 shadow-lg min-w-[90px]">
                  <p className="text-[10px] font-medium" style={{ color: '#3f2e73' }}>
                      <span className="font-semibold">{selectedDoctor.experience_years}+ yrs</span>
                  </p>
                </div>
                )}
              </div>
            </div>

          {/* Mobile: Doctor Name below image */}
            <div className="text-center md:hidden mb-6 mt-4">
              <h2 className="text-3xl font-semibold mb-2">
              {selectedDoctor.name || `${selectedDoctor.first_name} ${selectedDoctor.last_name}`}
              </h2>
              <p className="text-sm text-gray-600" style={{ marginBottom: '0', marginTop: '0', lineHeight: '1.2' }}>
              {selectedDoctor.specialization || 'Licensed Psychologist'}
            </p>
              <p className="text-sm text-gray-800" style={{ marginTop: '0px', marginBottom: '0', lineHeight: '1.2' }}>
                {selectedDoctor.price ? `Starts at ₹${selectedDoctor.price} per session` : 'Pricing available upon request'}
              </p>
          </div>
          
            {/* Desktop: Image and Name Section - Side by side */}
            <div className="hidden md:flex items-center gap-8 ml-32 mt-20">
          {/* Desktop: Profile Picture - Left aligned */}
              <div className="relative flex-shrink-0">
                <div className="w-80 h-88 rounded-[20px] overflow-hidden relative bg-white therapist-profile-image" style={{ border: 'none' }}>
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
                <div className="absolute bottom-4 -right-8 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg min-w-[140px]">
                  <p className="text-xs font-medium" style={{ color: '#3f2e73' }}>
                    <span className="font-semibold">{selectedDoctor.experience_years}+ years of experience</span>
                </p>
              </div>
              )}
              </div>
              
              {/* Desktop: Name, Designation, and Pricing - Stacked */}
              <div className="flex-1">
                <div className="text-left">
                  <h3 className="font-semibold mb-2">
                    {selectedDoctor.name || `${selectedDoctor.first_name} ${selectedDoctor.last_name}`}
                  </h3>
                  <p className="text-lg text-gray-600 ">
                    Psychologist
                  </p>
                  <p className="text-gray-800 text-sm">
                    <span className="font-medium">
                      {selectedDoctor.price ? `Starts at ₹${selectedDoctor.price} per session` : 'Pricing available upon request'}
                    </span>
                  </p>
              </div>
            </div>
          </div>
          
            <div className="flex justify-center md:justify-end items-start mb-8 mt-4">
            {/* Action Buttons */}
            <div className="flex gap-2 md:gap-4">
              <button 
                  onClick={scrollToCalendar}
                  className="bg-[#3f2e73] hover:bg-[#1d1733] text-white font-semibold py-2 px-4 md:py-3 md:px-8 rounded-full transition-colors duration-200 shadow-lg text-sm md:text-base"
              >
                BOOK SESSION
              </button>
                <button 
                  onClick={handleShare}
                  className="relative w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200 border border-gray-300"
                >
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                  {showShareTooltip && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-gray-900 text-xs rounded-lg whitespace-nowrap z-50 shadow-lg border border-gray-200 animate-fade-in">
                      Link copied!
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                    </div>
                  )}
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar and About Section */}
      <div className="w-full p-4 md:p-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            {/* Left Side - About Description */}
            <div className="space-y-6 mt-[20px] md:mt-[40px] therapist-about-section">
              <p className="font-bold text-gray-800 mb-4">About {selectedDoctor.name || `${selectedDoctor.first_name} ${selectedDoctor.last_name}`}</p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {selectedDoctor.description || "This doctor is passionate about helping people achieve mental wellness through evidence-based therapy and compassionate guidance."}
              </p>
              

              
              {/* Specialization */}
              {selectedDoctor.area_of_expertise && Array.isArray(selectedDoctor.area_of_expertise) && selectedDoctor.area_of_expertise.length > 0 && (
                <div className="p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-3">Specialization</p>
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
                  <p className="font-semibold text-gray-800 mb-3">Education & Qualifications</p>
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
                <p className="font-semibold text-gray-800 mb-3">Languages</p>
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
              <div className="mt-6 hidden lg:block">
                <p className="font-semibold text-gray-800 mb-4">Frequently Asked Questions</p>
                
                <div className="space-y-0">
                  {/* FAQ 1 */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => toggleFAQ(0)}
                      className="flex w-full items-center justify-between py-3 md:py-4 text-left hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="faq-heading text-xs md:text-sm lg:text-base text-gray-900 w-full md:w-auto pr-2 md:pr-3 lg:pr-0">
                        What makes your approach to therapy unique?
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-800 transition-transform flex-shrink-0 ${openFAQ === 0 ? "rotate-180" : "rotate-0"}`}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.19l3.71-2.96a.75.75 0 11.94 1.17l-4.24 3.38a.75.75 0 01-.94 0L5.27 8.34a.75.75 0 01-.04-1.13z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        openFAQ === 0 ? "max-h-96 md:max-h-64 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-0 pb-3 md:pb-4">
                        <p className="faq-answer md:text-sm leading-relaxed text-gray-700">
                          &quot;My approach is unique because I combine evidence-based therapeutic techniques with a deeply empathetic and personalized approach. I don&apos;t believe in one-size-fits-all therapy. Each person&apos;s journey is unique, so I adapt my methods to fit their specific needs and cultural background.&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* FAQ 2 */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => toggleFAQ(1)}
                      className="flex w-full items-center justify-between py-3 md:py-4 text-left hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="faq-heading text-xs md:text-sm lg:text-base text-gray-900 w-full md:w-auto pr-2 md:pr-3 lg:pr-0">
                        How do you help hesitant clients?
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-800 transition-transform flex-shrink-0 ${openFAQ === 1 ? "rotate-180" : "rotate-0"}`}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.19l3.71-2.96a.75.75 0 11.94 1.17l-4.24 3.38a.75.75 0 01-.94 0L5.27 8.34a.75.75 0 01-.04-1.13z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        openFAQ === 1 ? "max-h-96 md:max-h-64 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-0 pb-3 md:pb-4">
                        <p className="faq-answer md:text-sm leading-relaxed text-gray-700">
                          &quot;I understand that starting therapy can be intimidating. I always begin by building trust and explaining the process clearly. I encourage clients to ask questions and express their concerns openly. Many people worry about being judged, so I make sure they know this is a collaborative journey.&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* FAQ 3 */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => toggleFAQ(2)}
                      className="flex w-full items-center justify-between py-3 md:py-4 text-left hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="faq-heading text-xs md:text-sm lg:text-base text-gray-900 w-full md:w-auto pr-2 md:pr-3 lg:pr-0">
                        What&apos;s most important in successful therapy?
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-800 transition-transform flex-shrink-0 ${openFAQ === 2 ? "rotate-180" : "rotate-0"}`}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.19l3.71-2.96a.75.75 0 11.94 1.17l-4.24 3.38a.75.75 0 01-.94 0L5.27 8.34a.75.75 0 01-.04-1.13z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        openFAQ === 2 ? "max-h-96 md:max-h-64 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-0 pb-3 md:pb-4">
                        <p className="faq-answer md:text-sm leading-relaxed text-gray-700">
                          &quot;The therapeutic relationship is absolutely crucial. Research consistently shows that the connection between therapist and client is one of the strongest predictors of successful outcomes. Beyond that, I believe in the power of collaboration and client involvement.&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Right Side - Calendar */}
            <div id="calendar-section" className="bg-white rounded-2xl p-4 md:p-6 max-w-md w-full mx-auto md:ml-32 self-start mt-[20px] md:mt-[40px] therapist-calendar-section" style={{ boxShadow: '0 25px 50px -12px rgba(63, 46, 115, 0.35), 0 10px 25px -5px rgba(63, 46, 115, 0.2)' }}>
              {/* Calendar Header */}
              <div className="text-center mb-4">
                <p className="font-bold text-gray-800 mb-1">Book Your Session</p>
                <p className="text-gray-600 text-sm">Select a date and time that works for you</p>
                {loadingAvailability && (
                  <div className="mt-2 flex items-center justify-center text-xs" style={{ color: '#3f2e73' }}>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 mr-2" style={{ borderColor: '#3f2e73' }}></div>
                    Loading availability...
                  </div>
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
                <p className="text-sm font-semibold text-gray-800">{getMonthName(currentDate)}</p>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
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
                    
                                          // Check if this specific date is available for the psychologist
                      // Use local date formatting to avoid timezone conversion issues
                      const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const year = calendarDate.getFullYear();
                      const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
                      const dayStr = String(calendarDate.getDate()).padStart(2, '0');
                      const dateStr = `${year}-${month}-${dayStr}`;
                      const dateAvailability = psychologistAvailability[dateStr];
                    
                    // Properly check if date is in the past
                    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    todayStart.setHours(0, 0, 0, 0);
                    calendarDate.setHours(0, 0, 0, 0);
                    const isPastDate = calendarDate < todayStart;
                    const isAvailable = !isPastDate;
                    
                    const isPsychologistAvailable = dateAvailability && (
                      (typeof dateAvailability.availableSlots === 'number' && dateAvailability.availableSlots > 0) ||
                      (Array.isArray(dateAvailability.timeSlots) && dateAvailability.timeSlots.some(slot => slot.available))
                    );
                    
                    // Only show highlight/available indicator if it's not a past date
                    const shouldHighlight = !!isPsychologistAvailable && !isPastDate;
                    const isActuallyAvailable = shouldHighlight && isAvailable;
                    
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
                            ? 'bg-[#3f2e73] text-white font-bold shadow-lg cursor-pointer border border-[#3f2e73]'
                            : (isToday && isActuallyAvailable)
                              ? 'bg-[#3f2e73] text-white font-semibold shadow-md cursor-pointer border border-[#3f2e73]'
                              : isToday
                                ? 'bg-[#eae4ff] text-[#3f2e73] font-semibold cursor-pointer border border-[#d8ccff]'
                              : isActuallyAvailable
                                ? 'bg-[#f0edff] text-[#3f2e73] font-semibold cursor-pointer border border-[#3f2e73] hover:bg-[#e3dcff]'
                              : isAvailable
                                ? 'text-[#3f2e73] cursor-pointer border border-transparent hover:bg-[#f6f3ff]'
                                : 'text-gray-300 cursor-not-allowed'
                        }`}
                        title={isPsychologistAvailable && !isPastDate ? (isToday ? 'Today - Available for booking' : 'Available for booking') : isAvailable ? 'Click to check availability' : 'Past date'}
                      >
                        {day}
                        {shouldHighlight && (
                          <div
                            className={`w-2 h-2 rounded-full mx-auto mt-1 shadow-sm ${
                              isSelected ? 'bg-[#f0edff]' : 'bg-[#3f2e73]'
                            }`}
                          ></div>
                        )}
                      </div>
                    );
                  }
                  
                  return calendarDays;
                })()}
              </div>
              
              {/* Calendar Legend */}
              

              {/* Time Slots */}
              <div className="space-y-4">
                {selectedDate ? (
                                      (() => {
                      // Use local date formatting to avoid timezone conversion issues
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                      const dayStr = String(selectedDate.getDate()).padStart(2, '0');
                      const dateStr = `${year}-${month}-${dayStr}`;
                    const dateAvailability = psychologistAvailability[dateStr];
                    const allTimeSlots = dateAvailability?.timeSlots || [];
                    const availableSlots = allTimeSlots
                      .filter(slot => slot.available && !isSlotInPast(slot, selectedDate))
                      .map(slot => formatSlotDisplayTime(slot))
                      .filter(Boolean);
                    const hadAvailableSlots = allTimeSlots.some(slot => slot.available);
                    

                    
                    if (!dateAvailability || !allTimeSlots.length) {
                      return (
                        <div className="text-center py-8">
                          <div className="text-gray-500 text-sm">
                            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>No available time slot for this date</p>
                            <p className="text-xs mt-1">Please select another date</p>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-2">
                        {/* Available Time Slots */}
                        {availableSlots.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-[#3f2e73]">Available Times:</p>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-1">
                              {availableSlots.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => handleTimeSelect(time)}
                                  className={`p-2 rounded-lg border text-xs transition-all duration-200 w-full h-10 flex items-center justify-center ${
                                    selectedTime === time
                                      ? 'border-[#3f2e73] bg-[#f5f1ff] text-[#3f2e73]' 
                                      : 'border-gray-300 bg-white hover:border-[#3f2e73] text-gray-700'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : hadAvailableSlots ? (
                          <div className="text-center py-6 text-xs text-gray-500">
                            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>All earlier slots for today have passed.</p>
                            <p className="mt-1">Please pick another time or date.</p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

                {/* Package Selection or Package Information */}
                <div className="space-y-4 mb-4">
                {isBookingRemaining && clientPackage ? (
                  // Show package information when booking remaining sessions
                  <div>
                    <p className="font-semibold text-gray-800 mb-3 text-sm">Your Package</p>
                    <div className="p-4 rounded-lg border border-[#3f2e73] bg-[#f5f1ff] text-[#3f2e73] shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-left">
                          <span className="font-semibold text-base">
                            {clientPackage.display_name ||
                              (clientPackage.package_type
                                ? clientPackage.package_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                                : 'Package')}
                          </span>
                          <span className="ml-2 text-xs bg-[#eae4ff] text-[#3f2e73] px-2 py-1 rounded-full">
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
                        <p className="mt-1 text-[#3f2e73] font-medium">
                          Total paid: ${clientPackage.amount_paid}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show package selection for new bookings
                  <>
                    <p className="font-semibold text-gray-800 mb-3 text-sm">Select Package</p>
                    
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
                          ? 'border-[#3f2e73] bg-[#f5f1ff] text-[#3f2e73] shadow-md' 
                          : 'border-gray-300 hover:border-[#3f2e73] text-gray-700 hover:shadow-sm'
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
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3f2e73] mx-auto"></div>
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
                                ? 'border-[#3f2e73] bg-[#f5f1ff] text-[#3f2e73] shadow-md' 
                                : 'border-gray-300 hover:border-[#3f2e73] text-gray-700 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="text-left">
                                <span className="font-semibold text-sm">{pkg.name}</span>
                                {pkg.discount_percentage > 0 && (
                                  <span className="ml-2 text-xs bg-[#eae4ff] text-[#3f2e73] px-1 py-0.5 rounded-full">
                                    Save {pkg.discount_percentage}%
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-base">₹{pkg.price}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              {/* Book Button */}
              <button 
                onClick={handleBookSession}
                disabled={isBooking}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm ${
                  isBooking
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-[#3f2e73] text-white hover:bg-[#1d1733]'
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
      <div className="w-full px-4 lg:px-6 pb-0 bg-white lg:hidden" style={{ marginTop: '3rem' }}>
        <div className="max-w-6xl mx-auto">
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 767px) {
              .faq-heading {
                font-size: 16px !important;
                font-weight: 400 !important;
                line-height: 1.4;
              }
              .faq-answer {
                font-size: 14px !important;
                line-height: 1.5;
              }
            }
          `}} />
          <div className="mt-6">
            <p className="font-semibold text-gray-800 mb-4">Frequently Asked Questions</p>
            
            <div className="space-y-0">
              {/* FAQ 1 */}
              <div className="border-b border-gray-200 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleFAQ(0)}
                  className="flex w-full items-center justify-between py-3 md:py-4 text-left hover:bg-white transition-colors px-2 md:px-0 cursor-pointer"
                >
                  <span className="faq-heading text-xs md:text-sm lg:text-base text-gray-900 w-full md:w-auto pr-2 md:pr-3 lg:pr-0">
                    What makes your approach to therapy unique?
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-800 transition-transform flex-shrink-0 ${openFAQ === 0 ? "rotate-180" : "rotate-0"}`}
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.19l3.71-2.96a.75.75 0 11.94 1.17l-4.24 3.38a.75.75 0 01-.94 0L5.27 8.34a.75.75 0 01-.04-1.13z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    openFAQ === 0 ? "max-h-96 md:max-h-64 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-2 pb-3 md:px-0 md:pb-4">
                    <p className="faq-answer md:text-sm leading-relaxed text-gray-700">
                      &quot;My approach is unique because I combine evidence-based therapeutic techniques with a deeply empathetic and personalized approach. I don&apos;t believe in one-size-fits-all therapy. Each person&apos;s journey is unique, so I adapt my methods to fit their specific needs and cultural background.&quot;
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ 2 */}
              <div className="border-b border-gray-200 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleFAQ(1)}
                  className="flex w-full items-center justify-between py-3 md:py-4 text-left hover:bg-white transition-colors px-2 md:px-0 cursor-pointer"
                >
                  <span className="faq-heading text-xs md:text-sm lg:text-base text-gray-900 w-full md:w-auto pr-2 md:pr-3 lg:pr-0">
                    How do you help hesitant clients?
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-800 transition-transform flex-shrink-0 ${openFAQ === 1 ? "rotate-180" : "rotate-0"}`}
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.19l3.71-2.96a.75.75 0 11.94 1.17l-4.24 3.38a.75.75 0 01-.94 0L5.27 8.34a.75.75 0 01-.04-1.13z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    openFAQ === 1 ? "max-h-96 md:max-h-64 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-2 pb-3 md:px-0 md:pb-4">
                    <p className="faq-answer md:text-sm leading-relaxed text-gray-700">
                      &quot;I understand that starting therapy can be intimidating. I always begin by building trust and explaining the process clearly. I encourage clients to ask questions and express their concerns openly. Many people worry about being judged, so I make sure they know this is a collaborative journey.&quot;
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FAQ 3 */}
              <div className="border-b border-gray-200 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleFAQ(2)}
                  className="flex w-full items-center justify-between py-3 md:py-4 text-left hover:bg-white transition-colors px-2 md:px-0 cursor-pointer"
                >
                  <span className="faq-heading text-xs md:text-sm lg:text-base text-gray-900 w-full md:w-auto pr-2 md:pr-3 lg:pr-0">
                    What&apos;s most important in successful therapy?
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-800 transition-transform flex-shrink-0 ${openFAQ === 2 ? "rotate-180" : "rotate-0"}`}
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.19l3.71-2.96a.75.75 0 11.94 1.17l-4.24 3.38a.75.75 0 01-.94 0L5.27 8.34a.75.75 0 01-.04-1.13z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    openFAQ === 2 ? "max-h-96 md:max-h-64 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-2 pb-3 md:px-0 md:pb-4">
                    <p className="faq-answer md:text-sm leading-relaxed text-gray-700">
                      &quot;The therapeutic relationship is absolutely crucial. Research consistently shows that the connection between therapist and client is one of the strongest predictors of successful outcomes. Beyond that, I believe in the power of collaboration and client involvement.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Support Contact Section */}
      <div className="w-screen max-w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-auto md:h-[100px] bg-[#3f2e73] flex items-center justify-center py-4 md:py-0 mt-8 md:mt-12" style={{ marginBottom: 0 }}>
        <p className="text-white text-xs md:text-sm text-center px-4 support-contact-text">
          If you didn&apos;t find what you were looking for, please reach out to us at hey@little.care or +91-9539007766. We&apos;re here for you - for anything you might need.
        </p>
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 767px) {
            .support-contact-text {
              line-height: 1.2 !important;
              font-size: 10px !important;
            }
          }
        `}} />
      </div>
      {/* Treatment Method Modal */}
      {showTreatmentModal && selectedTreatment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-4 md:p-8">
              {/* Header with centered title and close button */}
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <p className="font-bold text-gray-800 text-center flex-1">Treatment Method</p>
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
              <p className="font-bold text-gray-800 mb-3 md:mb-4">
                {selectedTreatment}
              </p>
              
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
      {/* Legacy warning kept but unused in flow; quick contact replaces it */}
      <ContactCompletionWarning
        isOpen={false}
        onClose={() => {}}
        incompleteFields={[]}
        onCompleteProfile={() => {}}
      />

      {/* Auth modal for unauthenticated booking */}
      {showAuth && (
      <AuthModal
        open={showAuth}
        onAuthSuccess={async () => {
            // After successful signup/login, check if contact details are complete
            setShowAuth(false);
            setTimeout(async () => {
              try {
                const clientProfileResponse = await clientApi.getProfile();
                const clientProfile = clientProfileResponse.data;
                if (!isClientContactComplete(clientProfile)) {
                  // Show quick contact modal to collect profile details
                  setShowQuickContact(true);
                } else {
                  // Profile complete → proceed with booking if selections made; otherwise just stay
                  if (selectedDate && selectedTime && selectedDoctor && (isBookingRemaining || selectedPackage)) {
                    handleBookSession();
                  }
                }
              } catch (e) {
                // If check fails, do nothing; user can retry booking
                console.error('Error checking profile after auth:', e);
              }
            }, 300);
          }}
          onClose={() => {
            setShowAuth(false);
          }}
        />
      )}

      {/* Quick contact modal to collect minimal details */}
      {showQuickContact && (
        <QuickContactModal
          open={showQuickContact}
          onClose={() => setShowQuickContact(false)}
          onSaved={() => {
            setShowQuickContact(false);
            // After saving contact details, proceed with booking if selections made; else user can click Book again
            if (selectedDate && selectedTime && selectedDoctor && (isBookingRemaining || selectedPackage)) {
              handleBookSession();
            }
          }}
        />
      )}

    </div>
  );
};

// Loading fallback component
const TherapistProfileLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <p className="font-bold text-gray-800 mb-4">Loading...</p>
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
