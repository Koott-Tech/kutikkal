'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, FileText, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicApi } from '@/lib/backendApi';

// Helper to normalize possible image fields and relative URLs
function resolveDoctorImage(doctor) {
  const candidates = [
    doctor?.coverImage,
    doctor?.cover_image,
    doctor?.cover_image_url,
    doctor?.profile_image,
    doctor?.profile_image_url,
    doctor?.profile_picture_url,
    doctor?.avatar_url,
    doctor?.photo_url,
    doctor?.profilePicture,
    doctor?.image_url,
    doctor?.image,
    doctor?.photo,
    doctor?.profile_pic,
    doctor?.photoPath,
    doctor?.picture,
    doctor?.avatar,
    doctor?.profile?.photo_url,
    doctor?.profile?.image_url,
    doctor?.profile?.avatar_url,
  ].filter(Boolean);

  if (candidates.length === 0) return null;
  let url = String(candidates[0]);

  // If it's a relative path, prefix with backend/public origin if available
  try {
    const isAbsolute = /^https?:\/\//i.test(url) || url.startsWith('data:');
    if (!isAbsolute) {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (backend) {
        url = backend.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
      }
    }
  } catch (_) {}

  return url;
}

export default function DoctorModal({ 
  isOpen, 
  onClose, 
  onSave, 
  doctor = null, 
  mode = 'add' 
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    education: {
      ug: '',
      pg: '',
      phd: ''
    },
    description: '',
    price: '',
    experience_years: '',
    packages: [
      { name: 'Individual Session', price: '', sessions: 1 }
    ],
    specializations: [''],
    coverImage: null
  });

  // Simple step-by-step availability state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({});
  const [hasUserModifiedAvailability, setHasUserModifiedAvailability] = useState(false);
  const [step, setStep] = useState(1); // 1: select date, 2: select times, 3: next date or save

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [availablePackages, setAvailablePackages] = useState([
    { id: 2, name: 'Package of 2 Sessions', sessions: 2 },
    { id: 3, name: 'Package of 3 Sessions', sessions: 3 },
    { id: 4, name: 'Package of 4 Sessions', sessions: 4 },
    { id: 5, name: 'Package of 5 Sessions', sessions: 5 },
    { id: 6, name: 'Package of 6 Sessions', sessions: 6 },
    { id: 7, name: 'Package of 7 Sessions', sessions: 7 },
    { id: 8, name: 'Package of 8 Sessions', sessions: 8 }
  ]);

  // Common time slots for selection (1-hour intervals)
  const timeSlots = {
    morning: ['9:00 AM', '10:00 AM', '11:00 AM'],
    noon: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
    evening: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],
    night: ['9:00 PM', '10:00 PM']
  };

  // Fetch packages for a psychologist when editing
  const fetchPsychologistPackages = async (psychologistId) => {
    try {
      console.log('📦 Fetching packages for psychologist:', psychologistId);
      console.log('📦 API URL:', `/public/psychologists/${psychologistId}/packages`);
      
      const response = await publicApi.getPsychologistPackages(psychologistId);
      console.log('📦 API Response:', response);
      
      if (response.success && response.data.packages) {
        console.log('📦 Packages fetched:', response.data.packages);
        // Filter out 1-session packages (individual sessions) and map to form format
        const multiSessionPackages = response.data.packages
          .filter(pkg => pkg.session_count > 1)
          .map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
            sessions: pkg.session_count,
            description: pkg.description,
            discount_percentage: pkg.discount_percentage
          }));
        
        console.log('📦 Multi-session packages:', multiSessionPackages);
        
        // Update form data with fetched packages
        setFormData(prev => ({
          ...prev,
          packages: [
            // Keep the individual session package with the current price
            { name: 'Individual Session', price: prev.price || doctor.price || doctor.individual_session_price || '', sessions: 1 },
            // Add the fetched multi-session packages
            ...multiSessionPackages
          ]
        }));
      } else {
        console.log('📦 No packages found or error:', response);
        // Keep only the individual session package
        setFormData(prev => ({
          ...prev,
          packages: [
            { name: 'Individual Session', price: prev.price || doctor.price || doctor.individual_session_price || '', sessions: 1 }
          ]
        }));
      }
    } catch (error) {
      console.error('📦 Error fetching packages:', error);
      // Keep only the individual session package on error
      setFormData(prev => ({
        ...prev,
        packages: [
          { name: 'Individual Session', price: prev.price || doctor.price || doctor.individual_session_price || '', sessions: 1 }
        ]
      }));
    }
  };

  useEffect(() => {
    if (doctor && mode === 'edit') {
      console.log('🔍 Doctor data for editing:', doctor);
      console.log('🔍 Doctor price field:', doctor.price);
      console.log('🔍 Doctor individual_session_price field:', doctor.individual_session_price);
      
      // Reset the modification flag when opening for edit
      setHasUserModifiedAvailability(false);
      
      setFormData({
        firstName: doctor.first_name || doctor.firstName || '',
        lastName: doctor.last_name || doctor.lastName || '',
        phone: doctor.phone || '',
        email: doctor.email || '',
        password: '', // Don't load password for editing (passwords are hashed)
        education: {
          ug: doctor.ug_college || doctor.education?.ug || '',
          pg: doctor.pg_college || doctor.education?.pg || '',
          phd: doctor.phd_college || doctor.education?.phd || ''
        },
        description: doctor.description || '',
        price: doctor.price || doctor.individual_session_price || '',
        experience_years: doctor.experience_years || '',
        packages: [
          // Start with individual session package
          { name: 'Individual Session', price: doctor.price || doctor.individual_session_price || '', sessions: 1 }
        ],
        specializations: doctor.area_of_expertise || doctor.specializations || [''],
        coverImage: resolveDoctorImage(doctor)
      });
      
      // Fetch packages for this psychologist
      console.log('🔍 Doctor ID for package fetching:', doctor.id);
      console.log('🔍 Doctor psychologist_id:', doctor.psychologist_id);
      if (doctor.id) {
        fetchPsychologistPackages(doctor.id);
      } else {
        console.warn('⚠️ No doctor ID found for package fetching');
      }
      
                    // Load existing availability if editing AND user hasn't modified it
      // This prevents overwriting user changes when they've already modified availability
      if (doctor.availability && Array.isArray(doctor.availability) && !hasUserModifiedAvailability) {
          console.log('Processing array-based availability:', doctor.availability);
          // Convert existing availability to new format
          const convertedAvailability = {};
          doctor.availability.forEach((item, index) => {
            // Handle new structure: {date, time_slots, is_available}
            if (item && item.date && item.time_slots && Array.isArray(item.time_slots)) {
              const dateStr = item.date;
              console.log(`Processing new structure for date ${dateStr}:`, item.time_slots);
              
              // Helper function to normalize time format for comparison
              const normalizeTime = (time) => {
                // Handle object-based time slots
                if (typeof time === 'object' && time !== null) {
                  if (time.time) {
                    time = time.time;
                  } else if (time.displayTime) {
                    time = time.displayTime;
                  } else {
                    console.warn('Time object has no time property:', time);
                    return '';
                  }
                }
                
                // Ensure time is a string
                if (typeof time !== 'string') {
                  console.warn('Time is not a string:', time, typeof time);
                  return String(time || '');
                }
                // Remove AM/PM and convert to 24-hour format for comparison
                const cleanTime = time.replace(/\s*(AM|PM)/i, '').trim();
                return cleanTime;
              };
              
              // Helper function to check if a time slot matches any predefined slot
              const findMatchingSlot = (dbSlot) => {
                const normalizedDbSlot = normalizeTime(dbSlot);
                for (const [period, slots] of Object.entries(timeSlots)) {
                  for (const predefinedSlot of slots) {
                    if (normalizeTime(predefinedSlot) === normalizedDbSlot) {
                      return period;
                    }
                  }
                }
                return null;
              };
              
              // Categorize time slots into periods
              const categorizedSlots = { morning: [], noon: [], evening: [], night: [] };
              item.time_slots.forEach(slot => {
                try {
                  // Convert slot to string if it's an object
                  let slotString = slot;
                  if (typeof slot === 'object' && slot !== null) {
                    if (slot.displayTime) {
                      slotString = slot.displayTime;
                    } else if (slot.time) {
                      slotString = slot.time;
                    } else {
                      console.warn('Time slot object has no displayable time property:', slot);
                      slotString = String(slot);
                    }
                  } else if (typeof slot !== 'string') {
                    slotString = String(slot);
                  }
                  
                  const period = findMatchingSlot(slotString);
                  if (period) {
                    categorizedSlots[period].push(slotString);
                  } else {
                    // If no match found, add to the most appropriate period based on time
                    const hour = parseInt(String(slotString).split(':')[0]);
                    if (isNaN(hour)) {
                      console.warn('Invalid time slot format:', slotString);
                      // Default to noon if we can't parse the hour
                      categorizedSlots.noon.push(slotString);
                    } else if (hour >= 9 && hour < 12) {
                      categorizedSlots.morning.push(slotString);
                    } else if (hour >= 12 && hour < 17) {
                      categorizedSlots.noon.push(slotString);
                    } else if (hour >= 17 && hour < 21) {
                      categorizedSlots.evening.push(slotString);
                    } else if (hour >= 21 || hour < 9) {
                      categorizedSlots.night.push(slotString);
                    }
                  }
                } catch (error) {
                  console.error('Error processing time slot:', slot, error);
                  // Default to noon if there's an error
                  categorizedSlots.noon.push(String(slot));
                }
              });
              
              convertedAvailability[dateStr] = {
                available: item.is_available || true,
                timeSlots: categorizedSlots
              };
              
              console.log(`Categorized slots for ${dateStr}:`, categorizedSlots);
            }
            // Handle legacy structure: {day, slots}
            else if (item && item.day && item.slots && Array.isArray(item.slots)) {
              const nextOccurrence = getNextDayOccurrence(item.day);
              if (nextOccurrence) {
                const dateStr = nextOccurrence.toISOString().split('T')[0];
                console.log(`Processing legacy structure for day ${item.day}:`, item.slots);
                
                // Helper function to normalize time format for comparison
                const normalizeTime = (time) => {
                  // Handle object-based time slots
                  if (typeof time === 'object' && time !== null) {
                    if (time.time) {
                      time = time.time;
                    } else if (time.displayTime) {
                      time = time.displayTime;
                    } else {
                      console.warn('Time object has no time property:', time);
                      return '';
                    }
                  }
                  
                  // Ensure time is a string
                  if (typeof time !== 'string') {
                    console.warn('Time is not a string:', time, typeof time);
                    return String(time || '');
                  }
                  // Remove AM/PM and convert to 24-hour format for comparison
                  const cleanTime = time.replace(/\s*(AM|PM)/i, '').trim();
                  return cleanTime;
                };
                
                // Helper function to check if a time slot matches any predefined slot
                const findMatchingSlot = (dbSlot) => {
                  const normalizedDbSlot = normalizeTime(dbSlot);
                  for (const [period, slots] of Object.entries(timeSlots)) {
                    for (const predefinedSlot of slots) {
                      if (normalizeTime(predefinedSlot) === normalizedDbSlot) {
                        return period;
                      }
                    }
                  }
                  return null;
                };
                
                // Categorize time slots into periods
                const categorizedSlots = { morning: [], noon: [], evening: [], night: [] };
                item.slots.forEach(slot => {
                  try {
                    // Convert slot to string if it's an object
                    let slotString = slot;
                    if (typeof slot === 'object' && slot !== null) {
                      if (slot.displayTime) {
                        slotString = slot.displayTime;
                      } else if (slot.time) {
                        slotString = slot.time;
                      } else {
                        console.warn('Time slot object has no displayable time property:', slot);
                        slotString = String(slot);
                      }
                    } else if (typeof slot !== 'string') {
                      slotString = String(slot);
                    }
                    
                    const period = findMatchingSlot(slotString);
                    if (period) {
                      categorizedSlots[period].push(slotString);
                    } else {
                      // If no match found, add to the most appropriate period based on time
                      const hour = parseInt(String(slotString).split(':')[0]);
                      if (isNaN(hour)) {
                        console.warn('Invalid time slot format:', slotString);
                        // Default to noon if we can't parse the hour
                        categorizedSlots.noon.push(slotString);
                      } else if (hour >= 9 && hour < 12) {
                        categorizedSlots.morning.push(slotString);
                      } else if (hour >= 12 && hour < 17) {
                        categorizedSlots.noon.push(slotString);
                      } else if (hour >= 17 && hour < 21) {
                        categorizedSlots.evening.push(slotString);
                      } else if (hour >= 21 || hour < 9) {
                        categorizedSlots.night.push(slotString);
                      }
                    }
                  } catch (error) {
                    console.error('Error processing time slot:', slot, error);
                    // Default to noon if there's an error
                    categorizedSlots.noon.push(String(slot));
                  }
                });
                
                convertedAvailability[dateStr] = {
                  available: true,
                  timeSlots: categorizedSlots
                };
                
                console.log(`Categorized legacy slots for ${dateStr}:`, categorizedSlots);
              }
            }
            // Skip if item is invalid
            else {
              console.warn('Invalid availability item:', item);
              return;
            }
          });
          console.log('Converted availability:', convertedAvailability);
          setAvailabilityData(convertedAvailability);
      } else if (doctor.availability && typeof doctor.availability === 'object') {
        // Handle case where availability might be in a different format
        console.log('Doctor availability structure (object):', doctor.availability);
        // Try to convert or set empty availability
        setAvailabilityData({});
      } else {
        // No availability data, set empty
        console.log('No availability data found for doctor');
        setAvailabilityData({});
      }
    }
  }, [doctor, mode]);

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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    setSelectedTimes([]);
    setStep(2); // Move to time selection step
  };

  const handleTimeSelect = (timeKey) => {
    setSelectedTimes(prev => {
      if (prev.includes(timeKey)) {
        return prev.filter(t => t !== timeKey);
      } else {
        return prev.concat(timeKey);
      }
    });
    // Mark that user has modified availability
    setHasUserModifiedAvailability(true);
  };

  const getNextDayOccurrence = (dayName) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDay = days.indexOf(dayName);
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilTarget);
    return nextDate;
  };



  const saveCurrentDateAvailability = () => {
    if (selectedTimes.length === 0) {
      setErrors(prev => ({ ...prev, availability: 'Please select at least one time slot' }));
      return;
    }

    // Use IST timezone to avoid date shifting
    const istDate = new Date(selectedDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
    const dateStr = istDate.toISOString().split('T')[0];
    const timeSlotsByPeriod = {
      morning: [],
      noon: [],
      evening: [],
      night: []
    };
    
    // Apply the currently selected time slots to this date
    selectedTimes.forEach(timeKey => {
      const colonIndex = timeKey.indexOf(':');
      const period = timeKey.substring(0, colonIndex);
      const time = timeKey.substring(colonIndex + 1);
      if (timeSlotsByPeriod[period]) {
        timeSlotsByPeriod[period].push(time);
      }
    });
    
    const newAvailability = { ...availabilityData };
    newAvailability[dateStr] = {
      available: true,
      timeSlots: timeSlotsByPeriod
    };
    
    setAvailabilityData(newAvailability);
    setHasUserModifiedAvailability(true);
    setSelectedDate(null);
    setSelectedTimes([]);
    setStep(1); // Back to date selection
    setErrors(prev => ({ ...prev, availability: '' }));
  };

  const goToNextDate = () => {
    if (selectedTimes.length === 0) {
      setErrors(prev => ({ ...prev, availability: 'Please select at least one time slot' }));
      return;
    }
    
    // Save current date availability first
    saveCurrentDateAvailability();
  };

  const saveAllAvailability = () => {
    if (Object.keys(availabilityData).length === 0) {
      setErrors(prev => ({ ...prev, availability: 'Please set at least one availability slot' }));
      return;
    }
    // This will be handled by the main form submission
    setErrors(prev => ({ ...prev, availability: '' }));
  };

  const removeAvailability = (dateStr) => {
    const newAvailability = { ...availabilityData };
    delete newAvailability[dateStr];
    setAvailabilityData(newAvailability);
    setHasUserModifiedAvailability(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEducationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value
      }
    }));
  };




  const handleImageUpload = async (field, file) => {
    try {
      if (!file) return;
      setIsSubmitting(true);
      const { adminApi } = await import('../lib/backendApi');
      const uploadRes = await adminApi.uploadImage(file);
      const imageUrl = uploadRes?.url;
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          [field]: imageUrl
        }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Package management functions
  const addPackage = () => {
    const newPackage = {
      id: `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      price: '',
      sessions: 1,
      discount: 0
    };
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, newPackage]
    }));
  };

  const removePackage = (index) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
    }));
  };

  const updatePackage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }));
  };

  const selectPackageType = (index, sessionCount) => {
    const selectedPackage = availablePackages.find(p => p.sessions === sessionCount);
    if (selectedPackage) {
      updatePackage(index, 'name', selectedPackage.name);
      updatePackage(index, 'sessions', selectedPackage.sessions);
      // Calculate discount based on individual price
      if (formData.price) {
        const individualPrice = parseFloat(formData.price);
        const totalPrice = individualPrice * selectedPackage.sessions;
        const discount = Math.round((totalPrice * 0.1) / selectedPackage.sessions); // 10% discount per session
        updatePackage(index, 'price', (individualPrice - discount).toFixed(2));
        updatePackage(index, 'discount', discount);
      }
    }
  };

  // Legacy package functions for compatibility
  const handlePackageChange = (index, field, value) => {
    updatePackage(index, field, value);
  };

  const addSpecialization = () => {
    setFormData(prev => ({
      ...prev,
      specializations: [...prev.specializations, '']
    }));
  };

  const removeSpecialization = (index) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const handleSpecializationChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.map((spec, i) => 
        i === index ? value : spec
      )
    }));
  };

  const removeImage = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
  };

  // Ensure all packages have unique IDs
  const ensurePackageIds = (packages) => {
    return packages.map((pkg, index) => ({
      ...pkg,
      id: pkg.id || `pkg-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Form submission started');
    console.log('🚀 Form data:', formData);
    console.log('🚀 Availability data:', availabilityData);
    console.log('🚀 Availability keys:', Object.keys(availabilityData));
    console.log('🚀 Price value:', formData.price);
    console.log('🚀 Price type:', typeof formData.price);
    console.log('📦 Packages being sent:', formData.packages);
    console.log('📦 Filtered packages:', formData.packages.filter(pkg => pkg.name && pkg.price && pkg.sessions));
    
    setIsSubmitting(true);
    setErrors({});

    // Validate required fields
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (mode === 'add' && !formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.experience_years || formData.experience_years < 0) newErrors.experience_years = 'Years of experience is required and must be 0 or greater';
    if (Object.keys(availabilityData).length === 0) {
      newErrors.availability = 'Please set at least one availability slot. Click on "Set Availability" below to add your available times.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert availability data to the format expected by the backend
      const convertedAvailability = Object.entries(availabilityData).map(([dateStr, data]) => {
        // Use Indian Standard Time (IST) - UTC+5:30
        const date = new Date(dateStr + 'T00:00:00.000+05:30'); // IST timezone
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' });
        const allSlots = [
          ...data.timeSlots.morning,
          ...data.timeSlots.noon,
          ...data.timeSlots.evening,
          ...data.timeSlots.night
        ];
        
        return {
          day: dayName,
          slots: allSlots
        };
      });

      const resolvedImage = typeof formData.coverImage === 'string' ? formData.coverImage : null;
      const safeImageUrl = resolvedImage && !resolvedImage.startsWith('data:') ? resolvedImage : undefined;
      const doctorData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        ug_college: formData.education.ug,
        pg_college: formData.education.pg,
        phd_college: formData.education.phd,
        description: formData.description,
        experience_years: parseInt(formData.experience_years) || 0,
        price: formData.price ? Number(formData.price) : undefined,
        area_of_expertise: formData.specializations.filter(spec => spec.trim()),
        availability: convertedAvailability,
        packages: formData.packages.filter(pkg => pkg.name && pkg.price && pkg.sessions),
        // Use single field only
        cover_image_url: safeImageUrl,
      };

      // Handle password for edit mode
      if (mode === 'edit' && showPasswordReset && newPassword.trim()) {
        doctorData.password = newPassword;
      } else if (mode === 'add') {
        doctorData.password = formData.password;
      }

      await onSave(doctorData);
      handleClose();
    } catch (error) {
      console.error('Error saving doctor:', error);
      setErrors({ submit: error.message || 'Failed to save doctor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset the modification flag when closing the modal
    setHasUserModifiedAvailability(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <p className="font-bold text-gray-800">
              {mode === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
            </p>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>



        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

                        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'edit' ? 'Password' : 'Password *'}
              </label>
              {mode === 'edit' ? (
                <div className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="px-3 py-2 border border-gray-300 rounded-md bg-green-50">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-700 font-medium">Password is set and secure</span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            Password is encrypted and cannot be displayed for security reasons
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPasswordReset(!showPasswordReset)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        {showPasswordReset ? 'Cancel Reset' : 'Reset Password'}
                      </button>
                    </div>
                  </div>
                  {showPasswordReset && (
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password"
                      />
                      <p className="text-xs text-gray-600">
                        Leave empty to keep current password unchanged
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                />
              )}
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
        </div>

        {/* Cover Image */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Cover Image</h3>
          <div className="flex items-center space-x-4">
            {formData.coverImage ? (
              <div className="relative">
                <img
                  src={formData.coverImage}
                  alt="Cover image preview"
                  className="w-64 h-36 rounded-lg object-cover border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage('coverImage')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-64 h-36 rounded-lg bg-gray-200 flex items-center justify-center">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('coverImage', e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 16:9 ratio, max 5MB</p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Undergraduate *
                </label>
                <input
                  type="text"
                  value={formData.education.ug}
                  onChange={(e) => handleEducationChange('ug', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.ug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Psychology, Stanford University"
                />
                {errors.ug && (
                  <p className="text-red-500 text-sm mt-1">{errors.ug}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postgraduate *
                </label>
                <input
                  type="text"
                  value={formData.education.pg}
                  onChange={(e) => handleEducationChange('pg', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.pg ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Clinical Psychology, Harvard"
                />
                {errors.pg && (
                  <p className="text-red-500 text-sm mt-1">{errors.pg}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PhD (Optional)
                </label>
                <input
                  type="text"
                  value={formData.education.phd}
                  onChange={(e) => handleEducationChange('phd', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Clinical Psychology, Yale"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the doctor's expertise and experience..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Individual Price per Session (₹) *
                </label>
                <input
                  type="text"
                  value={formData.price || ''}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChange('price', value);
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="150"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Price will be stored in the description field temporarily
                </p>
              </div>
            </div>

            {/* Packages Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-700">Session Packages</h4>
                <button
                  type="button"
                  onClick={addPackage}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Package
                </button>
              </div>
              
              <div className="space-y-4">
                {ensurePackageIds(formData.packages).map((pkg, index) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-800">
                        Package {index + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removePackage(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Package Type *
                        </label>
                        <select
                          value={pkg.sessions || ''}
                          onChange={(e) => {
                            const selectedId = parseInt(e.target.value);
                            if (selectedId) {
                              selectPackageType(index, selectedId);
                            } else {
                              // Reset package data when no selection
                              updatePackage(index, 'name', '');
                              updatePackage(index, 'sessions', '');
                              updatePackage(index, 'price', '');
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Package</option>
                          {availablePackages
                            .filter(p => !formData.packages.some((existingPkg, i) => 
                              i !== index && existingPkg.sessions === p.sessions
                            ))
                            .map(p => (
                              <option key={p.id} value={p.sessions}>
                                {p.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sessions
                        </label>
                        <input
                          type="number"
                          value={pkg.sessions}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price per Session (₹)
                        </label>
                        <input
                          type="text"
                          value={pkg.price || ''}
                          onChange={(e) => {
                            // Only allow numbers
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            updatePackage(index, 'price', value);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="150"
                        />
                      </div>
                    </div>
                    
                    {index > 0 && pkg.sessions > 1 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-700">
                            Total Package Price: ₹{(pkg.price * pkg.sessions).toFixed(2)}
                          </span>
                          <span className="text-green-600 font-medium">
                            Save: ₹{((formData.price * pkg.sessions) - (pkg.price * pkg.sessions)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                * Individual session price is set above. Additional packages provide discounts for multiple sessions.
              </p>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience *
            </label>
            <input
              type="number"
              value={formData.experience_years}
              onChange={(e) => handleInputChange('experience_years', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.experience_years ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="5"
              min="0"
              max="50"
              step="1"
            />
            {errors.experience_years && (
              <p className="text-red-500 text-sm mt-1">{errors.experience_years}</p>
            )}
          </div>


          {/* Specializations */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-800">Specializations</h3>
              <button
                type="button"
                onClick={addSpecialization}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add Specialization
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.specializations.map((spec, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => handleSpecializationChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Anxiety, Depression"
                  />
                  {formData.specializations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.specializations && (
              <p className="text-red-500 text-sm mt-1">{errors.specializations}</p>
            )}
          </div>

          {/* Simple Step-by-Step Availability */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Set Doctor Availability</h3>
              {Object.keys(availabilityData).length === 0 && (
                <span className="text-red-500 text-sm font-medium">⚠️ Required</span>
              )}
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <div className="w-8 h-1 bg-gray-200"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <div className="w-8 h-1 bg-gray-200"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
              </div>
            </div>
            
            {/* Step 1: Date Selection */}
            {step === 1 && (
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select a Date</h4>
                
                {/* Simple Calendar */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-xs mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Days of Week */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div key={`day-header-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
                      const calendarDays = [];
                      
                      // Add empty cells for days before the first day of the month
                      for (let i = 0; i < startingDay; i++) {
                        calendarDays.push(
                          <div key={`empty-${i}`} className="h-8"></div>
                        );
                      }
                      
                      // Add days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                        const isToday = isCurrentMonth && day === new Date().getDate();
                        const isAvailable = day >= new Date().getDate() || !isCurrentMonth;
                        
                        const isSet = Object.keys(availabilityData).some(dateStr => {
                          // Use IST timezone for calendar date comparison
                          const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                          const istCalendarDate = new Date(calendarDate.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
                          const istCalendarDateStr = istCalendarDate.toISOString().split('T')[0];
                          return dateStr === istCalendarDateStr;
                        });

                        calendarDays.push(
                          <div
                            key={`day-${day}`}
                            onClick={() => isAvailable && handleDateSelect(day)}
                            className={`text-center py-1 rounded-lg transition-all duration-200 text-xs cursor-pointer ${
                              isSet
                                ? 'bg-green-500 text-white' 
                                : isToday
                                  ? 'bg-blue-100 text-blue-700 font-semibold'
                                  : isAvailable
                                    ? 'hover:bg-gray-100 text-gray-700' 
                                    : 'text-gray-300 cursor-not-allowed'
                            }`}
                            title={isSet ? 'Availability set' : isAvailable ? 'Click to select' : 'Past date'}
                          >
                            {day}
                            {isSet && (
                              <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                        );
                      }
                      
                      return calendarDays;
                    })()}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">Click on any future date to select it</p>
              </div>
            )}
            
            {/* Step 2: Time Selection */}
            {step === 2 && selectedDate && (
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Step 2: Select Time Slots for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h4>
                
                {/* Time Periods */}
                <div className="max-w-md mx-auto space-y-4">
                  {Object.entries(timeSlots).map(([period, times]) => (
                    <div key={period} className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3 capitalize">{period}</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {times.map(time => {
                          const timeKey = `${period}:${time}`;
                          const isSelected = selectedTimes.includes(timeKey);
                          
                          return (
                            <button
                              key={timeKey}
                              type="button"
                              onClick={() => handleTimeSelect(timeKey)}
                              className={`p-2 text-xs rounded-lg border transition-colors ${
                                isSelected
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedTimes([]);
                      setStep(1);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Date Selection
                  </button>
                  
                  <button
                    type="button"
                    onClick={goToNextDate}
                    disabled={selectedTimes.length === 0}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next Date
                  </button>
                  
                  <button
                    type="button"
                    onClick={saveCurrentDateAvailability}
                    disabled={selectedTimes.length === 0}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                    Save & Finish
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Review & Save */}
            {step === 3 && (
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Review & Save</h4>
                
                {Object.keys(availabilityData).length > 0 ? (
                  <div className="max-w-md mx-auto">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 font-medium">
                        {Object.keys(availabilityData).length} date{Object.keys(availabilityData).length > 1 ? 's' : ''} with availability set!
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add More Dates
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-red-600 font-medium mb-2">⚠️ No availability set yet</p>
                    <p className="text-gray-600 mb-4">You must set at least one availability slot to add this doctor.</p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Set Availability Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

            {/* Current Availability Display */}
            {Object.keys(availabilityData).length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3">Current Availability</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(availabilityData).map(([dateStr, data]) => {
                    // Ensure data has the expected structure
                    if (!data || !data.timeSlots) {
                      console.warn('Invalid availability data for date:', dateStr, data);
                      return null;
                    }
                    
                    console.log(`Processing date ${dateStr}:`, data);
                    console.log(`Time slots for ${dateStr}:`, data.timeSlots);
                    
                    const date = new Date(dateStr);
                    const allSlots = [
                      ...(data.timeSlots.morning || []),
                      ...(data.timeSlots.noon || []),
                      ...(data.timeSlots.evening || []),
                      ...(data.timeSlots.night || [])
                    ];
                    
                    console.log(`All slots for ${dateStr}:`, allSlots);
                    
                    return (
                      <div key={dateStr} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-green-800">
                            {date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </h5>
                          <button
                            type="button"
                            onClick={() => removeAvailability(dateStr)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {allSlots.map((slot, slotIndex) => {
                            // Handle both string and object time slots
                            let displayText = slot;
                            if (typeof slot === 'object' && slot !== null) {
                              // If slot is an object, extract the display value
                              if (slot.displayTime) {
                                displayText = slot.displayTime;
                              } else if (slot.time) {
                                displayText = slot.time;
                              } else {
                                displayText = JSON.stringify(slot); // Fallback for debugging
                              }
                            }
                            
                            return (
                              <span key={`${dateStr}-${slotIndex}`} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs mr-1 mb-1">
                                {displayText}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
                </div>
              </div>
            )}

            {errors.availability && (
              <p className="text-red-500 text-sm mt-2">{errors.availability}</p>
            )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Doctor' : 'Update Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
