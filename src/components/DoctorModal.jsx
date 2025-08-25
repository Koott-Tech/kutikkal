'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, FileText, Calendar, Clock } from 'lucide-react';

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

  // New calendar-based availability state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({});

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common time slots for selection
  const timeSlots = {
    morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    noon: ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'],
    evening: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'],
    night: ['9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM']
  };

  useEffect(() => {
    if (doctor && mode === 'edit') {
      setFormData({
        firstName: doctor.first_name || doctor.firstName || '',
        lastName: doctor.last_name || doctor.lastName || '',
        phone: doctor.phone || '',
        email: doctor.email || '',
        password: '', // Don't load password for editing
        education: {
          ug: doctor.ug_college || doctor.education?.ug || '',
          pg: doctor.pg_college || doctor.education?.pg || '',
          phd: doctor.phd_college || doctor.education?.phd || ''
        },
        description: doctor.description || '',
        price: doctor.price || '',
        experience_years: doctor.experience_years || '',
        packages: doctor.packages || [{ name: 'Individual Session', price: '', sessions: 1 }],
        specializations: doctor.area_of_expertise || doctor.specializations || [''],
        coverImage: doctor.coverImage || null
      });
      
      // Load existing availability if editing
      if (doctor.availability) {
        // Convert existing availability to new format
        const convertedAvailability = {};
        doctor.availability.forEach(item => {
          // Convert day-based availability to date-based
          const nextOccurrence = getNextDayOccurrence(item.day);
          if (nextOccurrence) {
            const dateStr = nextOccurrence.toISOString().split('T')[0];
            convertedAvailability[dateStr] = {
              available: true,
              timeSlots: {
                morning: item.slots.filter(slot => timeSlots.morning.includes(slot)),
                noon: item.slots.filter(slot => timeSlots.noon.includes(slot)),
                evening: item.slots.filter(slot => timeSlots.evening.includes(slot)),
                night: item.slots.filter(slot => timeSlots.night.includes(slot))
              }
            };
          }
        });
        setAvailabilityData(convertedAvailability);
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
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    setSelectedDates(prev => {
      if (prev.some(d => d.toDateString() === selectedDate.toDateString())) {
        // Remove date if already selected
        return prev.filter(d => d.toDateString() !== selectedDate.toDateString());
      } else {
        // Add date if not selected
        return [...prev, selectedDate];
      }
    });
    
    // Clear selected times when date changes
    setSelectedTimes([]);
  };

  const handleTimeSelect = (time, period) => {
    setSelectedTimes(prev => {
      const timeKey = `${period}:${time}`;
      if (prev.includes(timeKey)) {
        return prev.filter(t => t !== timeKey);
      } else {
        return [...prev, timeKey];
      }
    });
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

  const addAvailabilityForSelectedDates = () => {
    if (selectedDates.length === 0 || selectedTimes.length === 0) {
      setErrors(prev => ({ ...prev, availability: 'Please select at least one date and time slot' }));
      return;
    }

    const newAvailability = { ...availabilityData };
    
    selectedDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      const timeSlotsByPeriod = {
        morning: [],
        noon: [],
        evening: [],
        night: []
      };
      
      selectedTimes.forEach(timeKey => {
        const [period, time] = timeKey.split(':');
        if (timeSlotsByPeriod[period]) {
          timeSlotsByPeriod[period].push(time);
        }
      });
      
      newAvailability[dateStr] = {
        available: true,
        timeSlots: timeSlotsByPeriod
      };
    });
    
    setAvailabilityData(newAvailability);
    setSelectedDates([]);
    setSelectedTimes([]);
    setErrors(prev => ({ ...prev, availability: '' }));
  };

  const removeAvailability = (dateStr) => {
    const newAvailability = { ...availabilityData };
    delete newAvailability[dateStr];
    setAvailabilityData(newAvailability);
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

  const handlePackageChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }));
  };

  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, { name: '', price: '', sessions: 1 }]
    }));
  };

  const removePackage = (index) => {
    if (formData.packages.length > 1) {
      setFormData(prev => ({
        ...prev,
        packages: prev.packages.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSpecializationChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.map((spec, i) => 
        i === index ? value : spec
      )
    }));
  };

  const addSpecialization = () => {
    setFormData(prev => ({
      ...prev,
      specializations: [...prev.specializations, '']
    }));
  };

  const removeSpecialization = (index) => {
    if (formData.specializations.length > 1) {
      setFormData(prev => ({
        ...prev,
        specializations: prev.specializations.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          [field]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
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
      newErrors.availability = 'Please set at least one availability slot';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert availability data to the format expected by the backend
      const convertedAvailability = Object.entries(availabilityData).map(([dateStr, data]) => {
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
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

      const doctorData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        ug_college: formData.education.ug,
        pg_college: formData.education.pg,
        phd_college: formData.education.phd,
        description: formData.description,
        experience_years: parseInt(formData.experience_years) || 0,

        area_of_expertise: formData.specializations.filter(spec => spec.trim()),
        availability: convertedAvailability
      };

      await onSave(doctorData);
      onClose();
    } catch (error) {
      console.error('Error saving doctor:', error);
      setErrors({ submit: error.message || 'Failed to save doctor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
            </h2>
            <button
              onClick={onClose}
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
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
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
                  Base Price per Session ($) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="150"
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
              
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
            </div>

            {/* Packages */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-md font-medium text-gray-700">Session Packages</h4>
                <button
                  type="button"
                  onClick={addPackage}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Package
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.packages.map((pkg, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`package${index}Name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Package name"
                    />
                    <input
                      type="number"
                      value={pkg.price}
                      onChange={(e) => handlePackageChange(index, 'price', e.target.value)}
                      className={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`package${index}Price`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Price"
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={pkg.sessions}
                      onChange={(e) => handlePackageChange(index, 'sessions', parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sessions"
                      min="1"
                    />
                    {formData.packages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePackage(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
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

          {/* New Calendar-Based Availability */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Set Doctor Availability</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Select Dates</h4>
                  <p className="text-sm text-gray-600">Choose dates when the doctor will be available</p>
                </div>
                
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button 
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <h4 className="text-sm font-semibold text-gray-800">{getMonthName(currentDate)}</h4>
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
                    
                    const calendarDays = [];
                    
                    // Add empty cells for days before the first day of the month
                    for (let i = 0; i < startingDay; i++) {
                      calendarDays.push(<div key={`empty-${i}`} className="text-center py-1 text-xs"></div>);
                    }
                    
                    // Add days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const isToday = isCurrentMonth && day === today.getDate();
                      const isAvailable = day >= today.getDate() || !isCurrentMonth;
                      const isSelected = selectedDates.some(date => 
                        date.getDate() === day && 
                        date.getMonth() === currentDate.getMonth() && 
                        date.getFullYear() === currentDate.getFullYear()
                      );
                      const isSet = Object.keys(availabilityData).some(dateStr => {
                        const date = new Date(dateStr);
                        return date.getDate() === day && 
                               date.getMonth() === currentDate.getMonth() && 
                               date.getFullYear() === currentDate.getFullYear();
                      });
                      
                      calendarDays.push(
                        <div
                          key={`day-${day}`}
                          onClick={() => isAvailable && handleDateSelect(day)}
                          className={`text-center py-1 rounded-lg transition-all duration-200 text-xs cursor-pointer ${
                            isSelected 
                              ? 'bg-blue-500 text-white' 
                              : isSet
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
                
                {/* Selected Dates Summary */}
                {selectedDates.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Selected Dates ({selectedDates.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDates.map((date, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {date.toLocaleDateString()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Time Selection Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Select Time Slots</h4>
                  <p className="text-sm text-gray-600">Choose time slots for the selected dates</p>
                </div>
                
                {selectedDates.length > 0 ? (
                  <div className="space-y-4">
                    {/* Morning */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Morning (9:00 AM - 12:00 PM)</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.morning.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeSelect(time, 'morning')}
                            className={`p-2 rounded-lg border text-xs transition-all duration-200 ${
                              selectedTimes.includes(`morning:${time}`)
                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                : 'border-gray-300 hover:border-blue-300 text-gray-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Noon */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Noon (12:00 PM - 5:00 PM)</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.noon.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeSelect(time, 'noon')}
                            className={`p-2 rounded-lg border text-xs transition-all duration-200 ${
                              selectedTimes.includes(`noon:${time}`)
                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                : 'border-gray-300 hover:border-blue-300 text-gray-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Evening */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Evening (5:00 PM - 9:00 PM)</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.evening.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeSelect(time, 'evening')}
                            className={`p-2 rounded-lg border text-xs transition-all duration-200 ${
                              selectedTimes.includes(`evening:${time}`)
                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                : 'border-gray-300 hover:border-blue-300 text-gray-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Night */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Night (9:00 PM - 11:00 PM)</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.night.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeSelect(time, 'night')}
                            className={`p-2 rounded-lg border text-xs transition-all duration-200 ${
                              selectedTimes.includes(`night:${time}`)
                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                : 'border-gray-300 hover:border-blue-300 text-gray-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add Availability Button */}
                    <button
                      type="button"
                      onClick={addAvailabilityForSelectedDates}
                      className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Set Availability for Selected Dates
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Select dates first to choose time slots</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Availability Display */}
            {Object.keys(availabilityData).length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3">Current Availability</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(availabilityData).map(([dateStr, data]) => {
                    const date = new Date(dateStr);
                    const allSlots = [
                      ...data.timeSlots.morning,
                      ...data.timeSlots.noon,
                      ...data.timeSlots.evening,
                      ...data.timeSlots.night
                    ];
                    
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
                          {allSlots.map((slot, index) => (
                            <span key={index} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs mr-1 mb-1">
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {errors.availability && (
              <p className="text-red-500 text-sm mt-2">{errors.availability}</p>
            )}
          </div>

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
              onClick={onClose}
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
