'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

// Treatment methods data
const TREATMENT_METHODS = {
  "Cognitive Behavioral Therapy (CBT)": {
    description: "A structured, time-limited therapy that focuses on identifying and changing negative thought patterns and behaviors. Helps clients develop coping strategies for anxiety, depression, and other mental health challenges.",
    duration: "12-20 sessions",
    effectiveness: "Highly effective for anxiety, depression, and PTSD"
  },
  "Dialectical Behavior Therapy (DBT)": {
    description: "A comprehensive therapy that combines cognitive-behavioral techniques with mindfulness practices. Focuses on teaching skills for emotion regulation, distress tolerance, interpersonal effectiveness, and mindfulness.",
    duration: "6-12 months",
    effectiveness: "Especially effective for borderline personality disorder and emotion regulation issues"
  },
  "Mindfulness-Based Therapy": {
    description: "Incorporates mindfulness meditation and awareness practices to help clients become more present and develop a non-judgmental attitude toward their thoughts and feelings.",
    duration: "8-12 weeks",
    effectiveness: "Effective for stress reduction, anxiety, and depression"
  },
  "Acceptance & Commitment Therapy (ACT)": {
    description: "Focuses on accepting difficult thoughts and feelings while committing to actions that align with personal values. Helps clients develop psychological flexibility.",
    duration: "8-16 sessions",
    effectiveness: "Effective for anxiety, depression, and chronic pain"
  },
  "Solution-Focused Therapy": {
    description: "A goal-directed approach that focuses on solutions rather than problems. Helps clients identify their strengths and resources to create positive change.",
    duration: "5-8 sessions",
    effectiveness: "Quick and effective for specific problems and goal achievement"
  },
  "Psychodynamic Therapy": {
    description: "Explores unconscious patterns and early life experiences that influence current behavior and relationships. Helps clients gain insight into their emotional world.",
    duration: "6 months to several years",
    effectiveness: "Effective for personality disorders and relationship issues"
  },
  "Interpersonal Therapy (IPT)": {
    description: "Focuses on improving interpersonal relationships and social functioning. Addresses issues like grief, role transitions, interpersonal disputes, and social deficits.",
    duration: "12-16 weeks",
    effectiveness: "Highly effective for depression and interpersonal problems"
  },
  "Trauma-Focused CBT": {
    description: "A specialized form of CBT designed specifically for trauma survivors. Helps clients process traumatic memories and develop coping skills.",
    duration: "12-16 sessions",
    effectiveness: "Highly effective for PTSD and trauma-related disorders"
  },
  "Narrative Therapy": {
    description: "Helps clients separate themselves from their problems by externalizing issues and rewriting their life stories in more empowering ways.",
    duration: "8-12 sessions",
    effectiveness: "Effective for identity issues and personal growth"
  },
  "Family Systems Therapy": {
    description: "Views problems as patterns within the family system rather than individual issues. Works with families to improve communication and resolve conflicts.",
    duration: "10-20 sessions",
    effectiveness: "Effective for family conflicts and systemic issues"
  },
  "EMDR Therapy": {
    description: "Eye Movement Desensitization and Reprocessing therapy uses bilateral stimulation to help clients process traumatic memories and reduce their emotional impact.",
    duration: "6-12 sessions",
    effectiveness: "Highly effective for PTSD and trauma processing"
  }
};

// Doctors data - moved outside component to prevent recreation on every render
const DOCTORS = [
  {
    name: "Dr. Irene Cheriyan",
    title: "Senior Consultant Psychologist",
    expertise: ["Anxiety", "CBT", "Mindfulness"],
    experience: 12,
    languages: ["English", "Malayalam", "Hindi"],
    qualifications: "PhD in Clinical Psychology, University of Mumbai. Certified CBT Practitioner.",
    bio: "Dr. Irene Cheriyan is a passionate psychologist dedicated to helping individuals overcome anxiety and improve their mental wellness through evidence-based therapy.",
    pricing: "₹1600 for 50 mins",
    image: "/irene.jpeg"
  },
  {
    name: "Dr. Rahul Menon",
    title: "Senior Consultant Psychologist",
    expertise: ["Depression", "Adolescents", "Family Therapy"],
    experience: 9,
    languages: ["English", "Tamil"],
    qualifications: "M.Phil in Psychiatry, NIMHANS. Family Therapy Certification.",
    bio: "Dr. Rahul Menon specializes in treating depression and adolescents. He is certified in family therapy and dedicated to helping families navigate through difficult times.",
    pricing: "₹1400 for 50 mins",
    image: "/patient.jpg"
  },
  {
    name: "Dr. Priya Nair",
    title: "Senior Consultant Psychologist",
    expertise: ["Stress", "Relationships", "Trauma"],
    experience: 7,
    languages: ["English", "Hindi", "Kannada"],
    qualifications: "MSc in Counseling Psychology, Christ University. Trauma Specialist.",
    bio: "Dr. Priya Nair is a trauma specialist with expertise in helping individuals cope with stress and improve their relationships.",
    pricing: "₹1200 for 50 mins",
    image: "/irene.jpeg"
  },
  {
    name: "Dr. Arjun Sinha",
    title: "Senior Consultant Psychologist",
    expertise: ["Sleep", "Addiction", "Self-Esteem"],
    experience: 15,
    languages: ["English", "Bengali", "Hindi"],
    qualifications: "PhD in Psychology, Jadavpur University. Addiction Recovery Expert.",
    bio: "Dr. Arjun Sinha specializes in addiction recovery and self-esteem. He is dedicated to helping individuals overcome addiction and improve their self-esteem.",
    pricing: "₹1800 for 50 mins",
    image: "/patient.jpg"
  }
];

// Separate component that uses useSearchParams
const TherapistProfileContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorIndex = searchParams.get('doctor');
  
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

  const [selectedDoctor, setSelectedDoctor] = useState(null);

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
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
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
    if (doctorIndex !== null) {
      setSelectedDoctor(DOCTORS[parseInt(doctorIndex)]);
    }
  }, [doctorIndex]);

  if (!selectedDoctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
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
                  Vishakha Jaiswal
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  Senior Consultant Psychologist
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
                <Image 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Orange-red curved shape behind profile picture */}
              <div className="absolute -bottom-2 -left-2 w-40 h-40 bg-orange-400 rounded-full opacity-60 -z-10"></div>
              
              {/* Experience text at right bottom of image */}
              <div className="absolute bottom-4 -right-8 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                <p className="text-gray-800 text-xs font-medium">
                  <span className="font-semibold">{selectedDoctor.experience}+ years of experience</span>
                </p>
              </div>
              
              {/* Qualifications and Pricing at bottom right of image */}
              <div className="absolute bottom-16 right-[-330px] p-3">
                <div className="mb-1">
                  <p className="text-gray-800 font-medium text-sm">
                    {selectedDoctor.qualifications.split('.')[0]}
                  </p>
                </div>
                <div>
                  <p className="text-gray-800 text-sm">
                    <span className="font-medium">Starts at {selectedDoctor.pricing}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          

          
          <div className="flex justify-end items-start mb-8" style={{ marginTop: '-120px' }}>
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg">
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About Dr. Vishakha Jaiswal</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Dr. Vishakha Jaiswal is a highly qualified Senior Consultant Psychologist with extensive experience in providing compassionate mental health care. She specializes in evidence-based therapeutic approaches and is committed to helping individuals achieve their mental wellness goals.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                With her expertise in various therapeutic modalities, Dr. Jaiswal creates a safe and supportive environment for her clients. She believes in collaborative treatment planning and ensures that each client feels heard and supported throughout their therapeutic journey.
              </p>
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                    Anxiety Disorders
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                    Depression Treatment
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                    Stress Management
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                    Relationship Issues
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                    Trauma & PTSD
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium">
                    English
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium">
                    Hindi
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium">
                    Marathi
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium">
                    Gujarati
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Treatment Methods</h3>
                <div className="flex flex-wrap gap-4">
                  {Object.keys(TREATMENT_METHODS).slice(0, 4).map((treatment) => (
                    <button
                      key={treatment}
                      onClick={() => openTreatmentModal(treatment)}
                      className="text-blue-800 text-sm font-medium hover:text-blue-600 transition-colors duration-200 cursor-pointer flex items-center gap-1"
                    >
                      <span>{treatment}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              
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
                        onClick={() => handlePricingSelect({ type: 'individual', package: 'single', price: 3444, duration: '50 minutes' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'individual' && selectedPricing?.package === 'single'
                            ? 'bg-blue-50 border-2 border-blue-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Single Session</p>
                          <p className="text-sm text-gray-600">50 minutes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">₹3,444</p>
                          <div className="h-4"></div>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handlePricingSelect({ type: 'individual', package: '4', price: 5759, duration: '50 × 4 sessions' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'individual' && selectedPricing?.package === '4'
                            ? 'bg-blue-50 border-2 border-blue-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Package of 4</p>
                          <p className="text-sm text-gray-600">50 × 4 sessions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">₹5,759</p>
                          <p className="text-xs text-green-600 font-medium">Save ₹1,017</p>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handlePricingSelect({ type: 'individual', package: '8', price: 4535, duration: '50 × 8 sessions' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'individual' && selectedPricing?.package === '8'
                            ? 'bg-blue-50 border-2 border-blue-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Package of 8</p>
                          <p className="text-sm text-gray-600">50 × 8 sessions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">₹4,535</p>
                          <p className="text-xs text-green-600 font-medium">Save ₹2,241</p>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Couple Sessions */}
                  <div>
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Couple Sessions</h4>
                      <div className="w-16 h-1 bg-purple-500 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <button 
                        onClick={() => handlePricingSelect({ type: 'couple', package: 'single', price: 4444, duration: '50 minutes' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'couple' && selectedPricing?.package === 'single'
                            ? 'bg-purple-50 border-2 border-purple-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Single Session</p>
                          <p className="text-sm text-gray-600">50 minutes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">₹4,444</p>
                          <div className="h-4"></div>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handlePricingSelect({ type: 'couple', package: '4', price: 6759, duration: '50 × 4 sessions' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'couple' && selectedPricing?.package === '4'
                            ? 'bg-purple-50 border-2 border-purple-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Package of 4</p>
                          <p className="text-sm text-gray-600">50 × 4 sessions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">₹6,759</p>
                          <p className="text-xs text-green-600 font-medium">Save ₹1,017</p>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handlePricingSelect({ type: 'couple', package: '8', price: 5535, duration: '50 × 8 sessions' })}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 min-h-[80px] ${
                          selectedPricing?.type === 'couple' && selectedPricing?.package === '8'
                            ? 'bg-purple-50 border-2 border-purple-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">Package of 8</p>
                          <p className="text-sm text-gray-600">50 × 8 sessions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">₹5,535</p>
                          <p className="text-xs text-green-600 font-medium">Save ₹2,241</p>
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
                      <span className="font-medium text-gray-800">Why did you choose to study psychology?</span>
                      <span className="text-gray-500 text-xl font-bold">
                        {openFAQ === 0 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 0 && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          &ldquo;I was drawn to psychology because I&apos;ve always been fascinated by the human mind and behavior. Growing up, I noticed how people around me struggled with mental health issues but often didn&apos;t have access to proper support. This motivated me to pursue psychology as a way to help others understand themselves better and navigate life&apos;s challenges.&rdquo;
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
                      <span className="font-medium text-gray-800">What makes your approach to therapy unique?</span>
                      <span className="text-gray-500 text-xl font-bold">
                        {openFAQ === 1 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 1 && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          &ldquo;My approach is unique because I combine evidence-based therapeutic techniques with a deeply empathetic and personalized approach. I don&apos;t believe in one-size-fits-all therapy. Each person&apos;s journey is unique, so I adapt my methods to fit their specific needs and cultural background.&rdquo;
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
                      <span className="font-medium text-gray-800">How do you help hesitant clients?</span>
                      <span className="text-gray-500 text-xl font-bold">
                        {openFAQ === 2 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 2 && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          &ldquo;I understand that starting therapy can be intimidating. I always begin by building trust and explaining the process clearly. I encourage clients to ask questions and express their concerns openly. Many people worry about being judged, so I make sure they know this is a collaborative journey.&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* FAQ 4 */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(3)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">What&apos;s most important in successful therapy?</span>
                      <span className="text-gray-500 text-xl font-bold">
                        {openFAQ === 3 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 3 && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          &ldquo;The therapeutic relationship is absolutely crucial. Research consistently shows that the connection between therapist and client is one of the strongest predictors of successful outcomes. Beyond that, I believe in the power of collaboration and client involvement.&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* FAQ 5 */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(4)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">How do you stay updated with psychology?</span>
                      <span className="text-gray-500 text-xl font-bold">
                        {openFAQ === 4 ? '−' : '+'}
                      </span>
                    </button>
                    {openFAQ === 4 && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          &ldquo;I&apos;m committed to continuous learning and professional development. I regularly attend workshops, conferences, and training programs. I also stay current with the latest research through academic journals and professional networks.&rdquo;
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
              </div>
              
              {/* Session Type */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Session Type</h4>
                {selectedPricing ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      {selectedPricing.type === 'individual' ? 'Individual' : 'Couple'} Session
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {selectedPricing.duration} - ₹{selectedPricing.price.toLocaleString()}
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
                    
                    calendarDays.push(
                      <div
                        key={`day-${day}`}
                        onClick={() => isAvailable && handleDateSelect(day)}
                        className={`text-center py-1 rounded-lg cursor-pointer transition-all duration-200 text-xs ${
                          isSelected 
                            ? 'bg-green-500 text-white' 
                            : isToday
                              ? 'bg-blue-100 text-blue-700 font-semibold'
                              : isAvailable 
                                ? 'hover:bg-green-100 text-gray-700' 
                                : 'text-gray-300'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  }
                  
                  return calendarDays;
                })()}
              </div>
              
              {/* Time Slots */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">Available Times</h4>
                
                {/* NOON Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-gray-800 text-sm">NOON</h5>
                    <span className="font-bold text-gray-800 text-sm">12:00 PM - 05:00 PM</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM'].map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-2 rounded-lg border text-xs transition-all duration-200 w-full h-10 flex items-center justify-center ${
                          selectedTime === time
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-300 hover:border-green-300 text-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {['3:30 PM', '4:00 PM'].map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-2 rounded-lg border text-xs transition-all duration-200 w-full h-10 flex items-center justify-center ${
                          selectedTime === time
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-300 hover:border-green-300 text-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Divider */}
                <hr className="border-gray-200" />
                
                {/* EVENING Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-gray-800 text-sm">EVENING</h5>
                    <span className="font-bold text-gray-800 text-sm">05:00 PM - 08:00 PM</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'].map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-2 rounded-lg border text-xs transition-all duration-200 w-full h-10 flex items-center justify-center ${
                          selectedTime === time
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-300 hover:border-green-300 text-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Divider */}
                <hr className="border-gray-200" />
                
                {/* NIGHT Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-gray-800 text-sm">NIGHT</h5>
                    <span className="font-bold text-gray-800 text-sm">08:00 PM - 12:00 AM</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {['8:00 PM'].map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-2 rounded-lg border text-xs transition-all duration-200 w-full h-10 flex items-center justify-center ${
                          selectedTime === time
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-300 hover:border-green-300 text-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Book Button */}
              <button className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 text-sm">
                Book Session
              </button>
              

            </div>
          </div>
        </div>
      </div>
      
      {/* Support Contact Section */}
      <div className="w-full h-[100px] bg-green-500 flex items-center justify-center">
        <p className="text-white text-sm text-center px-4">
          If you didn&apos;t find what you were looking for, please reach out to us at support@amahahealth.com or +912071171501. We&apos;re here for you - for anything you might need.
        </p>
      </div>
      
      {/* Treatment Method Modal */}
      {showTreatmentModal && selectedTreatment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-blue-50 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-8">
              {/* Header with centered title and close button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 text-center flex-1">Know Our Methods</h3>
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
                What is {selectedTreatment}?
              </h4>
              
              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-6">
                {TREATMENT_METHODS[selectedTreatment].description}
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
