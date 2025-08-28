'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import backendApi, { publicApi } from '../../lib/backendApi';
import { useAuth } from '../../contexts/AuthContext';

// Separate component that uses useSearchParams
const TherapistProfileContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorIndex = searchParams.get('doctor');
  const { user, token, isAuthenticated, hasRole } = useAuth();
  
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
  
  // Availability state
  const [psychologistAvailability, setPsychologistAvailability] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  // Booking state
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch psychologist availability for current month
  const fetchPsychologistAvailability = async (psychologistId) => {
    try {
      setLoadingAvailability(true);
      
      // Get current month dates
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      
      
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
        if (doctorIndex !== null && response.data.psychologists[parseInt(doctorIndex)]) {
          setSelectedDoctor(response.data.psychologists[parseInt(doctorIndex)]);
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
    // Clear selected time when date changes
    setSelectedTime(null);
    
    // Check if the selected date has availability
    // Use Indian Standard Time (IST) - UTC+5:30
    const istNewSelectedDate = new Date(newSelectedDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
    const dateStr = istNewSelectedDate.toISOString().split('T')[0];
    const dateAvailability = psychologistAvailability[dateStr];
    
    if (!dateAvailability || !dateAvailability.availableSlots || dateAvailability.availableSlots === 0) {
      
    } else {
      
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime || !selectedPrice) {
      alert('Please select a date, time, and pricing option');
      return;
    }

    if (!selectedDoctor) {
      alert('Doctor information not available');
      return;
    }

    // Check if user is authenticated and is a client
    if (!isAuthenticated()) {
      alert('Please log in to book a session. Only clients can book sessions.');
      const returnUrl = `/therapist-profile?doctor=${doctorIndex}`;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Check if user is a client
    if (!hasRole('client')) {
      alert('Only clients can book sessions. You are logged in as a ' + user.role);
      return;
    }

    // Require client profile completion before booking
    const profile = user?.profile || {};
    const hasBasicContact = Boolean(profile.first_name) && Boolean(profile.last_name) && Boolean(profile.phone_number);
    if (!hasBasicContact) {
      alert('Please complete your contact profile before booking.');
      router.push('/profile?tab=contact');
      return;
    }

    setIsBooking(true);
    try {
      // Get current date and time in IST
      const now = new Date();
      const istNow = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      
      // Format selected date for scheduled session
      const istSelectedDate = new Date(selectedDate.getTime() + (5.5 * 60 * 60 * 1000));
      const scheduledDate = istSelectedDate.toISOString().split('T')[0];
      
      // Convert time to 24-hour format for database
      const timeStr = selectedTime;
      let scheduledTime;
      if (timeStr.includes('PM') && !timeStr.includes('12')) {
        const hour = parseInt(timeStr.split(':')[0]) + 12;
        const minute = timeStr.split(':')[1].split(' ')[0];
        scheduledTime = `${hour.toString().padStart(2, '0')}:${minute}`;
      } else if (timeStr.includes('AM') && timeStr.includes('12')) {
        scheduledTime = `00:${timeStr.split(':')[1].split(' ')[0]}`;
      } else {
        const hour = timeStr.split(':')[0];
        const minute = timeStr.split(':')[1].split(' ')[0];
        scheduledTime = `${hour.padStart(2, '0')}:${minute}`;
      }

      const bookingData = {
        psychologist_id: selectedDoctor.id,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        price: selectedPrice
      };



      const response = await backendApi.client.bookSession(bookingData);
      
      // Success case - backendApi returns data directly
      setBookingSuccess(true);
      // Reset selections
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedPrice(null);
      // Show success message
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
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
        // Fetch availability for this psychologist

        fetchPsychologistAvailability(doctor.id);
      }
    }
  }, [doctorIndex, doctors]);



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
          <div className="relative bg-gradient-to-r from-green-50 to-green-100 p-12" style={{ minHeight: '160px', zIndex: 0 }}>
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
            
            {/* Name and Title in Green Div */}
            <div className="relative z-10 flex items-center ml-[28rem] h-full" style={{ paddingTop: '130px', pointerEvents: 'auto' }}>
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
        <div className="w-full p-8">
          {/* Profile Picture - Left aligned on border */}
          <div className="flex justify-start -mt-56 mb-8 ml-32">
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
              {/* Orange-red curved shape behind profile picture */}
              <div className="absolute -bottom-2 -left-2 w-40 h-40 bg-orange-400 rounded-full opacity-60 -z-10"></div>
              
              {/* Experience text at right bottom of image */}
              {selectedDoctor.experience_years && (
              <div className="absolute bottom-4 -right-8 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                <p className="text-gray-800 text-xs font-medium">
                    <span className="font-semibold">{selectedDoctor.experience_years}+ years of experience</span>
                </p>
              </div>
              )}
              
              {/* Qualifications and Pricing at bottom right of image */}
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
                    <span className="font-medium">Starts at $150 per session</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end items-start mb-8" style={{ marginTop: '-120px' }}>
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleBookSession}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg"
              >
                BOOK SESSION
              </button>
              <button className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
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
      <div className="w-full p-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - About Description */}
            <div className="space-y-6 mt-[100px]">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About {selectedDoctor.name || `${selectedDoctor.first_name} ${selectedDoctor.last_name}`}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {selectedDoctor.description || "This doctor is passionate about helping people achieve mental wellness through evidence-based therapy and compassionate guidance."}
              </p>
              

              
              {/* Expertise */}
              {selectedDoctor.area_of_expertise && Array.isArray(selectedDoctor.area_of_expertise) && selectedDoctor.area_of_expertise.length > 0 && (
              <div className="p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                    {selectedDoctor.area_of_expertise.map((exp, i) => (
                      <div key={i} className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                        {exp}
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
              
              {/* Pricing Section */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Session Pricing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Individual Sessions */}
                  <div>
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Individual Sessions</h4>
                      <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <button 
                        onClick={() => handlePricingSelect({ type: 'individual', package: 'single', price: 150, duration: '60 minutes' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'individual' && selectedPricing?.package === 'single'
                            ? 'bg-blue-50 border-2 border-blue-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Single Session</p>
                          <p className="text-sm text-gray-600">60 minutes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">$150</p>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handlePricingSelect({ type: 'individual', package: '4', price: 540, duration: '60 × 4 sessions' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'individual' && selectedPricing?.package === '4'
                            ? 'bg-blue-50 border-2 border-blue-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Package of 4</p>
                          <p className="text-sm text-gray-600">60 × 4 sessions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">$540</p>
                          <p className="text-xs text-green-600 font-medium">Save $60</p>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Family/Child Sessions */}
                  <div>
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Family/Child Sessions</h4>
                      <div className="w-16 h-1 bg-purple-500 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <button 
                        onClick={() => handlePricingSelect({ type: 'family', package: 'single', price: 200, duration: '90 minutes' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'family' && selectedPricing?.package === 'single'
                            ? 'bg-purple-50 border-2 border-purple-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Family Session</p>
                          <p className="text-sm text-gray-600">90 minutes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">$200</p>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handlePricingSelect({ type: 'child', package: 'single', price: 120, duration: '45 minutes' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'child' && selectedPricing?.package === 'single'
                            ? 'bg-purple-50 border-2 border-purple-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Child Session</p>
                          <p className="text-sm text-gray-600">45 minutes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">$120</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQ Section */}
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
                
                <div className="space-y-3">
                  {/* FAQ 1 */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(0)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">What makes your approach to therapy unique?</span>
                      <span className="text-gray-500 text-xl font-bold">
                        {openFAQ === 0 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 0 && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          &quot;My approach is unique because I combine evidence-based therapeutic techniques with a deeply empathetic and personalized approach. I don&apos;t believe in one-size-fits-all therapy. Each person&apos;s journey is unique, so I adapt my methods to fit their specific needs and cultural background.&quot;
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* FAQ 2 */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(1)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">How do you help hesitant clients?</span>
                      <span className="text-gray-500 text-xl font-bold">
                        {openFAQ === 1 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 1 && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          &quot;I understand that starting therapy can be intimidating. I always begin by building trust and explaining the process clearly. I encourage clients to ask questions and express their concerns openly. Many people worry about being judged, so I make sure they know this is a collaborative journey.&quot;
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* FAQ 3 */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(2)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">What&apos;s most important in successful therapy?</span>
                      <span className="text-gray-500 text-xl font-bold">
                        {openFAQ === 2 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 2 && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          &quot;The therapeutic relationship is absolutely crucial. Research consistently shows that the connection between therapist and client is one of the strongest predictors of successful outcomes. Beyond that, I believe in the power of collaboration and client involvement.&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Calendar */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full ml-32 sticky top-4 self-start mt-[100px]">
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
                      {selectedPricing.duration} - ${selectedPricing.price}
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
                    // Use Indian Standard Time (IST) - UTC+5:30
                    const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const istCalendarDate = new Date(calendarDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
                    const dateStr = istCalendarDate.toISOString().split('T')[0];
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
              
              {/* Pricing Selection */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">Select Pricing</h4>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setSelectedPrice(50)}
                    className={`p-3 rounded-lg border text-sm transition-all duration-200 w-full text-left ${
                      selectedPrice === 50
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-300 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Single Session</span>
                      <span className="font-semibold">$50</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedPrice(200)}
                    className={`p-3 rounded-lg border text-sm transition-all duration-200 w-full text-left ${
                      selectedPrice === 200
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-300 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Package (4 Sessions)</span>
                      <span className="font-semibold">$200</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">Available Times</h4>
                
                {selectedDate ? (
                  (() => {
                    // Use Indian Standard Time (IST) - UTC+5:30
                    const istSelectedDate = new Date(selectedDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
                    const dateStr = istSelectedDate.toISOString().split('T')[0];
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
                            <div className="grid grid-cols-5 gap-1">
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
                            <div className="grid grid-cols-5 gap-1">
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
                disabled={!selectedDate || !selectedTime || !selectedPrice || isBooking || !isAuthenticated() || !hasRole('client')}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm ${
                  !selectedDate || !selectedTime || !selectedPrice || isBooking || !isAuthenticated() || !hasRole('client')
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isBooking ? 'Booking...' : 'Book Session'}
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
      
      {/* Support Contact Section */}
      <div className="w-full h-[100px] bg-green-500 flex items-center justify-center">
        <p className="text-white text-sm text-center px-4">
          If you didn&apos;t find what you were looking for, please reach out to us at support@kuttikal.com or +1-555-0123. We&apos;re here for you - for anything you might need.
        </p>
      </div>
      
      {/* Treatment Method Modal */}
      {showTreatmentModal && selectedTreatment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-8">
              {/* Header with centered title and close button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 text-center flex-1">Treatment Method</h3>
                <button
                  onClick={closeTreatmentModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 ml-4"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              {/* Treatment title */}
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {selectedTreatment}
              </h4>
              
              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-6">
                This treatment method is designed to help clients achieve their mental wellness goals through evidence-based approaches and compassionate care.
              </p>
              
              {/* Action button */}
              <div className="flex justify-center">
                <button
                  onClick={closeTreatmentModal}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-semibold text-sm uppercase tracking-wide"
                >
                  Got it, thanks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
