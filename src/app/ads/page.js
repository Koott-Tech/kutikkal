'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/backendApi';
import { normalizeImageUrl } from '@/utils/urlNormalizer';
import HowItWorks from '@/components/HowItWorks';
import VideosShowcase from '@/components/VideosShowcase';
import GuideModal from '@/components/GuideModal';
import { Counter } from '@/components/ui/animated-counter';
import { TrendingUp } from 'lucide-react';

// Metadata configuration
const pageMetadata = {
  title: 'Child Psychology Services & Online Counseling | Little Care',
  description: 'Discover professional child psychology services and online counseling for children and families. Expert child psychologists help with anxiety, behavior, ADHD, and emotional support. Book a free assessment today.',
  keywords: [
    'child psychologist',
    'online child counseling',
    'child therapy',
    'child mental health',
    'child psychologist near me',
    'online therapy for kids',
    'child anxiety counseling',
    'ADHD counseling for children',
    'child behavior therapy',
    'family counseling',
    'teen counseling',
    'adolescent therapy',
    'child psychology services',
    'pediatric psychology',
    'child development counseling'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.little.care/ads',
    siteName: 'Little Care',
    title: 'Child Psychology Services & Online Counseling | Little Care',
    description: 'Discover professional child psychology services and online counseling for children and families. Expert child psychologists help with anxiety, behavior, ADHD, and emotional support.',
    images: [
      {
        url: 'https://www.little.care/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Little Care logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Child Psychology Services & Online Counseling | Little Care',
    description: 'Discover professional child psychology services and online counseling for children and families. Expert child psychologists help with anxiety, behavior, ADHD, and emotional support.',
    images: ['https://www.little.care/favicon.png'],
    creator: '@littlecare',
  },
  alternates: {
    canonical: 'https://www.little.care/ads',
  },
};

// Structured Data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Little Care - Child Psychology Services',
  description: 'Professional child psychology services and online counseling for children and families. Expert child psychologists providing therapy for anxiety, behavior, ADHD, and emotional support.',
  url: 'https://www.little.care',
  logo: 'https://www.little.care/mainlogo.webp',
  image: 'https://www.little.care/mainlogo.webp',
  telephone: '+91-XXXXXXXXXX',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressRegion: 'India',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  serviceType: [
    'Child Psychology',
    'Online Counseling',
    'Child Therapy',
    'Family Counseling',
    'ADHD Counseling',
    'Anxiety Therapy',
    'Behavior Therapy',
  ],
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
  },
};

const serviceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Child Psychology Services',
  provider: {
    '@type': 'Organization',
    name: 'Little Care',
    url: 'https://www.little.care',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  description: 'Professional child psychology services including online counseling, therapy for anxiety, ADHD, behavior issues, and family counseling.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
  },
};

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.little.care',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Child Psychology Services',
      item: 'https://www.little.care/ads',
    },
  ],
};

// FAQ Data
const FAQ_DATA = [
  {
    question: 'What is Little Care?',
    answer: 'Little Care is an online child counseling platform that supports children and parents through therapy, assessments, and emotional wellness sessions — all from the comfort of your home.'
  },
  {
    question: 'Who are the therapists at Little Care?',
    answer: 'Our team includes consultant psychologists, clinical psychologists, and child therapists with experience in child behaviour, emotional regulation, and developmental support.'
  },
  {
    question: 'What age group do you work with?',
    answer: 'We primarily work with children aged 4 to 16 years, depending on their emotional and developmental needs.'
  },
  {
    question: 'How does online child counseling work?',
    answer: 'Sessions take place over Google Meet, designed to be interactive and child-friendly using games, stories, and visual tools to make therapy engaging and comfortable.'
  },
  {
    question: 'How do I know which service is right for my child?',
    answer: "If you're unsure where to begin, you can book a free 20-minute consultation with our consultant psychologist. They'll help you understand your child's needs and recommend the best next step."
  },
  {
    question: 'Are parent sessions included?',
    answer: 'Yes. Parent sessions are an important part of our process. They help us understand the child better and guide parents on how to support progress at home.'
  },
  {
    question: 'How many sessions does my child need?',
    answer: 'Every child is unique. The number of sessions depends on the concern and progress.'
  },
  {
    question: 'Is everything discussed confidential?',
    answer: 'Absolutely. We maintain strict confidentiality and privacy for all our clients, in line with ethical standards of psychological practice.'
  },
  {
    question: 'What if my child doesn\'t open up online?',
    answer: 'Our therapists are trained to build comfort and trust through playful, engaging methods. Most children adapt quickly once they feel understood.'
  },
  {
    question: 'How do I book a session?',
    answer: 'You can easily book online through our website or reach out via WhatsApp or email. Our team will guide you through the simple booking process.'
  }
];


export default function AdsLandingPage() {
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorAvailability, setDoctorAvailability] = useState({}); // Store availability for each doctor
  const [loadingAvailability, setLoadingAvailability] = useState(new Set()); // Track which doctors are loading
  const [videos, setVideos] = useState([]); // Store random videos
  const [videosLoading, setVideosLoading] = useState(true); // Track if videos are being loaded
  const [showGuide, setShowGuide] = useState(false);
  const [chooseOptionsShowGuide, setChooseOptionsShowGuide] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState(null);
  const [sessionCount, setSessionCount] = useState(16);
  const [shouldAnimateCounter, setShouldAnimateCounter] = useState(false);
  const counterRef = useRef(null);

  // Add body class for ads page to target footer styles
  useEffect(() => {
    document.body.classList.add('ads-page-body');
    return () => {
      document.body.classList.remove('ads-page-body');
    };
  }, []);

  // Calculate current session count based on IST time
  // Starts at 16, increments every hour by a random value between 1-3
  const calculateSessionCount = () => {
    // Get current IST time
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hours = istTime.getHours();
    
    // At midnight (12:00 AM), count is 16 (starting value)
    if (hours === 0) {
      return 16;
    }
    
    // Start with base value of 16
    let totalCount = 16;
    
    // For each hour that has passed since midnight (excluding hour 0)
    for (let h = 1; h <= hours; h++) {
      // Use hour as seed for pseudo-random (consistent for same hour)
      const seed = h * 7919; // Prime number for better distribution
      const randomValue = (seed % 3) + 1; // Value between 1-3
      totalCount += randomValue;
    }
    
    return totalCount;
  };

  // Intersection Observer for counter animation
  useEffect(() => {
    if (!counterRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger counter animation when it comes into view
            setShouldAnimateCounter(true);
          } else {
            // Reset when out of view
            setShouldAnimateCounter(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [sessionCount]);

  // Initialize and update session count
  useEffect(() => {
    const updateCount = () => {
      const count = calculateSessionCount();
      setSessionCount(count);
      // Reset animation when count changes (new day)
      if (count === 16) {
        setShouldAnimateCounter(false);
      }
    };
    
    // Initial calculation
    updateCount();
    
    // Update every hour to increment the count
    const hourInterval = setInterval(updateCount, 3600000); // 3600 seconds = 1 hour
    
    return () => {
      clearInterval(hourInterval);
    };
  }, []);

  // Override How It Works button to scroll to psychologists section
  useEffect(() => {
    const handleButtonClick = (e) => {
      const button = e.target.closest('#how-it-works button[type="button"]');
      if (button && button.textContent.trim() === 'Get started') {
        e.preventDefault();
        e.stopPropagation();
        const psychologistsSection = document.getElementById('psychologists-section');
        if (psychologistsSection) {
          psychologistsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.addEventListener('click', handleButtonClick);
      return () => {
        howItWorksSection.removeEventListener('click', handleButtonClick);
      };
    }
  }, []);

  const openGuide = (categoryKey) => {
    setDefaultCategory(categoryKey);
    setChooseOptionsShowGuide(true);
  };

  const chooseOptionsCards = [
    {
      id: 1,
      tags: ["Counseling", "Emotions"],
      title: "Child\nCounseling",
      description: "A safe space for your kids to express & grow.",
      image: "/Child Counseling.webp",
      gradient: "from-[#DEEFDC] to-white",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black"
      },
      imageClass: "object-cover object-[50%_100%]"
    },
    {
      id: 2,
      tags: ["Assessments", "Tests"],
      title: "Child\nAssessment", 
      description: "Find your child's needs & strengths to grow.",
      image: "/Child Assessment.webp",
      gradient: "from-[#f1e7f9] to-white",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black"
      },
      imageClass: "object-cover object-[50%_100%]"
    },
    {
      id: 3,
      tags: ["Parents", "Workshops"],
      title: "Better\nParenting",
      description: "Learn, Connect & Build a wonderful home.", 
      image: "/Better parenting.webp",
      gradient: "from-[#fff4e2] to-white",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black"
      },
      imageClass: "object-cover object-[50%_100%] scale-110"
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleGetStartedClick = () => {
    const section = document.getElementById('psychologists-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch psychologists
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        const response = await publicApi.getPsychologists();
        const data = response?.data?.psychologists || response?.message?.psychologists || [];
        if (Array.isArray(data)) {
          // Filter out assessment psychologist
          const filtered = data.filter(psych => {
            const email = (psych.email || '').toLowerCase();
            return !email.includes('assessment');
          });
          setPsychologists(filtered);
        }
      } catch (error) {
        console.error('Error fetching psychologists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPsychologists();
  }, []);

  // Helper functions for time slot filtering
  const parseTimeStringToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const trimmed = timeStr.trim();
    
    // Handle 12-hour format (e.g., "2:30 PM", "10:00 AM")
    const pmMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(PM|pm)/i);
    const amMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|am)/i);
    
    if (pmMatch) {
      let hours = parseInt(pmMatch[1], 10);
      const minutes = parseInt(pmMatch[2], 10);
      if (hours !== 12) hours += 12;
      return hours * 60 + minutes;
    }
    
    if (amMatch) {
      let hours = parseInt(amMatch[1], 10);
      const minutes = parseInt(amMatch[2], 10);
      if (hours === 12) hours = 0;
      return hours * 60 + minutes;
    }
    
    // Handle 24-hour format (e.g., "14:30", "10:00")
    const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
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

  const isSlotInPast = (slot, date) => {
    if (!slot || !date) return false;
    const now = new Date();
    
    // Day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const slotDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (slotDay < today) return true;
    if (slotDay > today) return false;
    
    const slotMinutes = getSlotMinutes(slot);
    if (slotMinutes === null) return false;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return slotMinutes <= nowMinutes;
  };

  // Fetch availability for a single doctor
  const fetchDoctorAvailability = async (doctorId, withSync = false) => {
    try {
      // Mark as loading
      setLoadingAvailability(prev => new Set(prev).add(doctorId));

      const today = new Date();
      
      // Format local dates YYYY-MM-DD
      const getLocalDateStr = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };
      
      const startDate = getLocalDateStr(today); // Today
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 7); // Next 7 days
      const endDateStr = getLocalDateStr(endDate);

      // Timeout after 5 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      const fetchPromise = publicApi.getPsychologistAvailabilityRange(doctorId, startDate, endDateStr, withSync);
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (response.success && response.data && response.data.data) {
        const availabilityArray = response.data.data;
        const collectedSlots = []; // Array of {date, time} objects
        let firstDateWithSlots = null;
        
        // Loop through dates until we have 3 slots
        for (const day of availabilityArray) {
          const [year, month, dayNum] = day.date.split('-');
          const dayDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(dayNum));
          
          // Filter available slots and exclude past time slots if it's today
          const availableSlots = day.timeSlots?.filter(slot => {
            if (!slot.available) return false;
            return !isSlotInPast(slot, dayDate);
          }) || [];

          // Sort available slots by time
          const sortedAvailableSlots = [...availableSlots].sort((a, b) => {
            const aMinutes = getSlotMinutes(a);
            const bMinutes = getSlotMinutes(b);
            if (aMinutes === null && bMinutes === null) return 0;
            if (aMinutes === null) return 1;
            if (bMinutes === null) return -1;
            return aMinutes - bMinutes;
          });
          
          if (sortedAvailableSlots.length > 0) {
            if (!firstDateWithSlots) {
              firstDateWithSlots = day.date;
            }
            
            const slotsNeeded = 3 - collectedSlots.length;
            const slotsToAdd = sortedAvailableSlots
              .slice(0, slotsNeeded)
              .map(slot => ({
                date: day.date,
                time: slot.displayTime || slot.time
              }));
            
            collectedSlots.push(...slotsToAdd);
            
            if (collectedSlots.length >= 3) {
              break;
            }
          }
        }

        if (collectedSlots.length > 0 && firstDateWithSlots) {
          const result = {
            nextDate: firstDateWithSlots,
            timeSlots: collectedSlots.slice(0, 3),
            slotsByDate: collectedSlots
          };
          
          return result;
        }
      }
      
      return { timeSlots: [], nextDate: null };
    } catch (err) {
      if (err.message !== 'Timeout') {
        console.error(`Error fetching availability for doctor ${doctorId}:`, err);
      }
      return { timeSlots: [], nextDate: null };
    } finally {
      setLoadingAvailability(prev => {
        const newSet = new Set(prev);
        newSet.delete(doctorId);
        return newSet;
      });
    }
  };

  // Fetch availability for all doctors
  const fetchAllDoctorsAvailability = async (doctorsList) => {
    if (doctorsList.length === 0) return;
    
    const availabilityPromises = doctorsList.map(async (doctor) => {
      try {
        const availability = await fetchDoctorAvailability(doctor.id);
        return { doctorId: doctor.id, availability, success: true };
      } catch (error) {
        console.error(`Failed to fetch availability for doctor ${doctor.id}:`, error);
        return { doctorId: doctor.id, availability: null, success: false };
      }
    });

    const results = await Promise.allSettled(availabilityPromises);
    
    const updatedAvailability = {};
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        const { doctorId, availability } = result.value;
        if (availability) {
          updatedAvailability[doctorId] = availability;
        }
      }
    });

    setDoctorAvailability(prev => ({
      ...prev,
      ...updatedAvailability
    }));
  };

  // Fetch availability when psychologists are loaded
  useEffect(() => {
    if (psychologists.length > 0) {
      const timeoutId = setTimeout(() => {
        fetchAllDoctorsAvailability(psychologists).catch(err => {
          console.error('Error fetching doctors availability:', err);
        });
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [psychologists.length]);

  // Fetch random videos from database
  useEffect(() => {
    const fetchRandomVideos = async () => {
      try {
        setVideosLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
        const allVideos = [];

        // Fetch videos from counselling pages
        try {
          const counsellingResponse = await fetch(`${baseUrl}/counselling?status=published&limit=50`, {
            cache: 'no-store'
          });
          if (counsellingResponse.ok) {
            const counsellingData = await counsellingResponse.json();
            const pages = counsellingData.data?.pages || counsellingData.data?.services || [];
            if (counsellingData.success && pages.length > 0) {
              pages.forEach(page => {
                if (page.videos && Array.isArray(page.videos)) {
                  page.videos.forEach(video => {
                    if (video.url || video.src) {
                      allVideos.push({
                        url: video.url || video.src,
                        src: video.url || video.src,
                        thumbnailUrl: video.thumbnailUrl || video.poster || '',
                        poster: video.thumbnailUrl || video.poster || '',
                        title: video.title || ''
                      });
                    }
                  });
                }
              });
            }
          }
        } catch (err) {
          console.error('Error fetching counselling videos:', err);
        }

        // Fetch videos from assessments pages
        try {
          const assessmentsResponse = await fetch(`${baseUrl}/assessments?status=published&limit=50`, {
            cache: 'no-store'
          });
          if (assessmentsResponse.ok) {
            const assessmentsData = await assessmentsResponse.json();
            if (assessmentsData.success && assessmentsData.data?.assessments) {
              assessmentsData.data.assessments.forEach(page => {
                if (page.videos && Array.isArray(page.videos)) {
                  page.videos.forEach(video => {
                    if (video.url || video.src) {
                      allVideos.push({
                        url: video.url || video.src,
                        src: video.url || video.src,
                        thumbnailUrl: video.thumbnailUrl || video.poster || '',
                        poster: video.thumbnailUrl || video.poster || '',
                        title: video.title || ''
                      });
                    }
                  });
                }
              });
            }
          }
        } catch (err) {
          console.error('Error fetching assessments videos:', err);
        }

        // Fetch videos from better-parenting pages
        try {
          const betterParentingResponse = await fetch(`${baseUrl}/better-parenting?status=published&limit=50`, {
            cache: 'no-store'
          });
          if (betterParentingResponse.ok) {
            const betterParentingData = await betterParentingResponse.json();
            const pages = betterParentingData.data?.pages || betterParentingData.data?.services || [];
            if (betterParentingData.success && pages.length > 0) {
              pages.forEach(page => {
                if (page.videos && Array.isArray(page.videos)) {
                  page.videos.forEach(video => {
                    if (video.url || video.src) {
                      allVideos.push({
                        url: video.url || video.src,
                        src: video.url || video.src,
                        thumbnailUrl: video.thumbnailUrl || video.poster || '',
                        poster: video.thumbnailUrl || video.poster || '',
                        title: video.title || ''
                      });
                    }
                  });
                }
              });
            }
          }
        } catch (err) {
          console.error('Error fetching better-parenting videos:', err);
        }

        // Remove duplicates based on URL
        const uniqueVideos = Array.from(
          new Map(allVideos.map(v => [v.url || v.src, v])).values()
        );

        // Shuffle and select up to 5 random videos
        const shuffled = uniqueVideos.sort(() => 0.5 - Math.random());
        const selectedVideos = shuffled.slice(0, 5);

        console.log('Total videos fetched:', allVideos.length);
        console.log('Unique videos:', uniqueVideos.length);
        console.log('Selected videos:', selectedVideos.length);
        console.log('Video URLs:', selectedVideos.map(v => v.url || v.src));

        setVideos(selectedVideos);
      } catch (error) {
        console.error('Error fetching random videos:', error);
        setVideos([]); // Set empty array on error to prevent showing default videos
      } finally {
        setVideosLoading(false);
      }
    };

    fetchRandomVideos();
  }, []);

  // No JavaScript scroll needed - using CSS animation like Reviews component

  // Create psychologist slug
  const createSlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Get formatted availability information for the redesigned cards
  const getAvailabilityDisplay = (psychId) => {
    const isLoading = loadingAvailability.has(psychId);
    if (isLoading) {
      return { label: 'Checking...', timeText: 'Loading...' };
    }
    const availability = doctorAvailability[psychId];
    if (!availability || !availability.timeSlots || availability.timeSlots.length === 0) {
      return { label: 'Available', timeText: 'Soon' };
    }
    
    // Find the first slot
    const firstSlot = availability.timeSlots[0];
    let slotDateStr, slotTimeStr;
    if (typeof firstSlot === 'string') {
      slotDateStr = availability.nextDate;
      slotTimeStr = firstSlot;
    } else if (firstSlot && firstSlot.date && firstSlot.time) {
      slotDateStr = firstSlot.date;
      slotTimeStr = firstSlot.time;
    } else {
      slotDateStr = availability.nextDate;
      slotTimeStr = firstSlot.time || firstSlot;
    }
    
    if (!slotDateStr) {
      return { label: 'Available', timeText: slotTimeStr || 'Soon' };
    }
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [year, month, dayNum] = slotDateStr.split('-');
      const slotDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(dayNum));
      
      // Parse time into minutes to compare
      const slotMinutes = getSlotMinutes(firstSlot);
      if (slotMinutes !== null) {
        slotDate.setHours(Math.floor(slotMinutes / 60), slotMinutes % 60, 0, 0);
      }
      
      const now = new Date();
      const diffMs = slotDate.getTime() - now.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins > 0 && diffMins < 60) {
        return { label: 'Available in', timeText: `${diffMins} Mins` };
      }
      
      // Check if it's today, tomorrow, or a future date
      const todayTime = today.getTime();
      const slotDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(dayNum)).getTime();
      
      if (slotDateTime === todayTime) {
        return { label: 'Available', timeText: `Today, ${slotTimeStr}` };
      } else if (slotDateTime === todayTime + 86400000) {
        return { label: 'Available', timeText: `Tomorrow, ${slotTimeStr}` };
      } else {
        const formattedDate = slotDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        return { label: 'Available on', timeText: `${formattedDate}, ${slotTimeStr}` };
      }
    } catch (error) {
      return { label: 'Available', timeText: slotTimeStr || 'Soon' };
    }
  };

  // Handle psychologist card click
  const handlePsychologistClick = (psychologist) => {
    const name = psychologist.name || `${psychologist.first_name} ${psychologist.last_name}`;
    const slug = createSlug(name);
    if (slug) {
      router.push(`/online-child-psychologist/${slug}`);
    }
  };

  return (
    <>
      <Head>
        <title>{pageMetadata.title}</title>
        <meta name="description" content={pageMetadata.description} />
        <meta name="keywords" content={pageMetadata.keywords.join(', ')} />
        <meta property="og:title" content={pageMetadata.openGraph.title} />
        <meta property="og:description" content={pageMetadata.openGraph.description} />
        <meta property="og:type" content={pageMetadata.openGraph.type} />
        <meta property="og:url" content={pageMetadata.openGraph.url} />
        <meta property="og:image" content={pageMetadata.openGraph.images[0].url} />
        <meta name="twitter:card" content={pageMetadata.twitter.card} />
        <meta name="twitter:title" content={pageMetadata.twitter.title} />
        <meta name="twitter:description" content={pageMetadata.twitter.description} />
        <link rel="canonical" href={pageMetadata.alternates.canonical} />
      </Head>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* CRITICAL OVERRIDES - Must override global h2 styles from globals.css (48px on desktop) */
          /* Place at top for maximum priority */
          .ads-page main h2.psychologists-heading,
          .ads-page main h2.reviews-section-heading,
          .ads-page main h2.choose-options-heading,
          .ads-page h2.psychologists-heading,
          .ads-page h2.reviews-section-heading,
          .ads-page h2.choose-options-heading {
            font-size: 24px !important;
            font-weight: 600 !important;
            line-height: 1.1 !important;
          }
          @media (min-width: 1024px) {
            .ads-page main h2.psychologists-heading,
            .ads-page main h2.reviews-section-heading,
            .ads-page main h2.choose-options-heading,
            .ads-page h2.psychologists-heading,
            .ads-page h2.reviews-section-heading,
            .ads-page h2.choose-options-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 1280px) {
            .ads-page main h2.psychologists-heading,
            .ads-page main h2.reviews-section-heading,
            .ads-page main h2.choose-options-heading,
            .ads-page h2.psychologists-heading,
            .ads-page h2.reviews-section-heading,
            .ads-page h2.choose-options-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 1280px) {
            .ads-page .hero-text {
              position: relative;
              top: -40px;
            }
          }
          .ads-page .hero-description {
            font-size: 14px !important;
          }
          @media (min-width: 768px) {
            .ads-page .hero-description {
              font-size: 16px !important;
            }
          }
          .ads-page h1 {
            font-size: 22px !important;
            line-height: 26px !important;
          }
          .ads-page h2 {
            font-size: 1.75rem !important;
            line-height: 1.1 !important;
          }
          .ads-page h3 {
            font-size: 1.125rem !important;
            line-height: 1.1 !important;
          }
          .ads-page h4,
          .ads-page h5,
          .ads-page h6 {
            line-height: 1.1 !important;
          }
          @media (min-width: 640px) {
            .ads-page h1 {
              font-size: 28px !important;
              line-height: 32px !important;
            }
            .ads-page h2 {
              font-size: 2rem !important;
            }
            .ads-page h3 {
              font-size: 1.25rem !important;
            }
          }
          @media (min-width: 768px) {
            .ads-page h1 {
              font-size: 33px !important;
              line-height: 34px !important;
            }
            .ads-page h2 {
              font-size: 2.25rem !important;
            }
            .ads-page h3 {
              font-size: 1.5rem !important;
            }
          }
          @media (max-width: 1279px) {
            .ads-page h1 {
              padding-left: 20px !important;
              padding-right: 20px !important;
              font-weight: 600 !important;
              text-align: center !important;
            }
            .ads-page .hero-description {
              text-align: center !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .guide-cards-container {
            width: 100%;
            max-width: 1400px;
            margin: 3.2rem auto 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 36px clamp(8px, 0.9vw, 12px);
            padding: 0 clamp(1rem, 2vw, 2rem) !important;
            justify-items: center;
          }
          .guide-video-card {
            cursor: pointer;
            will-change: transform;
            transition: transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.2s;
            z-index: 1;
            width: 100%;
            min-width: 300px;
            max-width: 100%;
            height: 360px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: none !important;
            background: #fff;
            border: none;
            position: relative;
            margin: 0 !important;
          }
          .guide-video-card:hover {
            transform: scale(1.04) translateY(-12px);
            z-index: 10;
            box-shadow: none !important;
          }
          @media (max-width: 640px) {
            .guide-cards-container {
              grid-template-columns: 1fr;
              gap: 64px;
              padding: 0 1rem !important;
              max-width: 100% !important;
              width: 100% !important;
              margin-left: auto;
              margin-right: auto;
              justify-items: stretch !important;
            }
            .guide-video-card {
              max-width: 100% !important;
              min-width: 0 !important;
              width: 100% !important;
              height: 420px;
            }
            .guide-video-card:hover {
              transform: none !important;
              box-shadow: none !important;
            }
            .doctor-card-name {
              font-size: 0.95rem !important;
            }
          }
          @media (min-width: 641px) and (max-width: 768px) {
            .guide-cards-container {
              grid-template-columns: 1fr;
              gap: 72px;
              padding: 0 clamp(1.5rem, 4vw, 2rem) !important;
              max-width: 92% !important;
              width: 92% !important;
              margin-left: auto;
              margin-right: auto;
              justify-items: stretch !important;
            }
            .guide-video-card {
              max-width: calc(100% - 0px) !important;
              min-width: 0 !important;
              width: 100% !important;
              height: 460px;
            }
            .guide-video-card:hover {
              transform: none !important;
              box-shadow: none !important;
            }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .guide-cards-container {
              grid-template-columns: repeat(2, 1fr);
              gap: 36px 20px;
              padding: 0 2rem !important;
            }
            .guide-video-card {
              min-width: 270px;
              max-width: 100%;
              width: 100%;
              height: 350px;
            }
          }
          @media (min-width: 1025px) {
            .guide-cards-container {
              grid-template-columns: repeat(3, 1fr) !important;
              max-width: 1240px !important;
              gap: 48px 36px !important;
            }
          }
          .doctor-card-name {
            font-size: 1.05rem;
            font-weight: 700;
            color: #fff;
            text-shadow: 0 2px 8px rgba(0,0,0,0.25);
          }
          .service-card-heading {
            line-height: 1.2 !important;
          }
          .counter-sentence {
            font-size: 0.7rem !important;
          }
          .counter-sentence .font-bold,
          .counter-sentence [class*="font-bold"] {
            font-weight: 400 !important;
          }
          .ads-page h2.text-xl {
            font-size: 1.25rem !important;
          }
          .ads-page h2.text-2xl {
            font-size: 1.5rem !important;
          }
          @media (min-width: 640px) {
            .ads-page h2.text-2xl {
              font-size: 1.5rem !important;
            }
            .ads-page h2.text-3xl {
              font-size: 1.875rem !important;
            }
          }
          @media (min-width: 768px) {
            .ads-page h2.text-3xl {
              font-size: 1.875rem !important;
            }
            .ads-page h2.text-4xl {
              font-size: 2.25rem !important;
            }
          }
          /* Override global h2 styles for reviews heading - use multiple classes for maximum specificity */
          .ads-page h2.reviews-section-heading.text-base,
          .ads-page h2.reviews-section-heading {
            font-size: 24px !important; /* Match choose-options-heading */
            font-weight: 600 !important;
            line-height: 1.1 !important;
            letter-spacing: normal !important;
          }
          @media (min-width: 640px) {
            .ads-page h2.reviews-section-heading.text-base,
            .ads-page h2.reviews-section-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 768px) {
            .ads-page h2.reviews-section-heading.text-base,
            .ads-page h2.reviews-section-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            /* Override global h2 tablet styles (32px) */
            .ads-page h2.reviews-section-heading.text-base,
            .ads-page h2.reviews-section-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 1024px) {
            /* CRITICAL: Override global h2 laptop/desktop styles (48px) */
            .ads-page h2.reviews-section-heading.text-base,
            .ads-page h2.reviews-section-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 1280px) {
            .ads-page h2.reviews-section-heading.text-base,
            .ads-page h2.reviews-section-heading {
              font-size: 24px !important;
            }
          }
          /* Match psychologists heading to choose-options-heading - use multiple classes for maximum specificity */
          .ads-page h2.psychologists-heading.text-base,
          .ads-page h2.psychologists-heading {
            font-size: 24px !important;
            font-weight: 600 !important;
            line-height: 1.1 !important;
          }
          @media (min-width: 640px) {
            .ads-page h2.psychologists-heading.text-base,
            .ads-page h2.psychologists-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 768px) {
            .ads-page h2.psychologists-heading.text-base,
            .ads-page h2.psychologists-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            /* Override global h2 tablet styles (32px) */
            .ads-page h2.psychologists-heading.text-base,
            .ads-page h2.psychologists-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 1024px) {
            /* CRITICAL: Override global h2 laptop/desktop styles (48px) */
            .ads-page h2.psychologists-heading.text-base,
            .ads-page h2.psychologists-heading {
              font-size: 24px !important;
            }
          }
          @media (min-width: 1280px) {
            .ads-page h2.psychologists-heading.text-base,
            .ads-page h2.psychologists-heading {
              font-size: 24px !important;
            }
          }
          /* Override global h2 styles for FAQ heading */
          .ads-page .faq-section-heading {
            font-size: 1.125rem !important;
            line-height: 1.1 !important;
            letter-spacing: normal !important;
          }
          @media (min-width: 640px) {
            .ads-page .faq-section-heading {
              font-size: 1.25rem !important;
            }
          }
          @media (min-width: 768px) {
            .ads-page .faq-section-heading {
              font-size: 1.5rem !important;
            }
          }
          @media (min-width: 1024px) {
            .ads-page .faq-section-heading {
              font-size: 1.875rem !important;
            }
          }
          @media (max-width: 767px) {
            .ads-page .psychologists-description {
              white-space: pre-line;
            }
          }
          @media (min-width: 768px) {
            .ads-page .psychologists-description {
              white-space: normal;
            }
          }
          @media (max-width: 767px) {
            .ads-page .hero-section.hero-home {
              padding-top: 16px !important;
              padding-bottom: 0 !important;
            }
            .ads-page .hero-content-wrapper {
              padding-bottom: 0 !important;
              margin-bottom: 0 !important;
            }
            .ads-page .hero-text {
              padding-top: 3rem !important;
            }
            .ads-page .hero-text .hero-description {
              margin-top: 0.5rem !important;
            }
            .ads-page .hero-mobile-wrapper {
              margin-top: 1.5rem !important;
              margin-bottom: -16px !important;
              margin-left: -16px !important;
              margin-right: -16px !important;
              width: calc(100% + 32px) !important;
            }
            .ads-page .hero-image-box {
              margin-bottom: 0 !important;
              margin-top: 20px !important;
              padding-bottom: 0 !important;
            }
            .ads-page .hero-mobile-image {
              object-position: center bottom !important;
            }
          }
          @media (min-width: 1024px) {
            .ads-page .hero-section.hero-home {
              margin-top: 3rem !important;
            }
            .ads-page .hero-text .hero-description {
              margin-top: 0.5rem !important;
            }
          }
          .ads-page .guide-video-card {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
          }
          @media (max-width: 767px) {
            .ads-page .hero-wrapper {
              margin-bottom: 0 !important;
            }
            .ads-page .hero-section.hero-home {
              border-radius: 0 !important;
            }
            .ads-page .hero-buttons {
              gap: 0.25rem !important;
            }
            .ads-page .counter-container {
              margin-top: 0.1rem !important;
            }
            .ads-page h1,
            .ads-page h2,
            .ads-page h3,
            .ads-page h4,
            .ads-page h5,
            .ads-page h6 {
              line-height: 1.1 !important;
            }
            /* Override .ads-page h2 for specific headings - must come after general h2 rules */
            .ads-page h2.psychologists-heading,
            .ads-page h2.reviews-section-heading,
            .ads-page h2.choose-options-heading {
              font-size: 24px !important;
              font-weight: 600 !important;
              line-height: 1.1 !important;
            }
            .ads-page .choose-guide-section {
              padding-bottom: 3rem !important;
              margin-bottom: 2rem !important;
            }
          }
          /* Match footer heading and description font sizes to hero section */
          body.ads-page-body .footer-heading {
            font-size: 1.875rem !important; /* text-3xl - reduced from text-4xl */
            font-weight: 600 !important;
            line-height: 1.1 !important;
          }
          @media (max-width: 767px) {
            body.ads-page-body .footer-heading {
              white-space: pre-line;
            }
          }
          @media (min-width: 768px) {
            body.ads-page-body .footer-heading {
              white-space: normal;
            }
          }
          body.ads-page-body .footer-description {
            font-size: 1rem !important; /* text-base */
          }
          @media (min-width: 768px) {
            body.ads-page-body .footer-heading {
              font-size: 2.25rem !important; /* text-4xl - reduced from text-5xl */
            }
            body.ads-page-body .footer-description {
              font-size: 1.125rem !important; /* text-lg */
            }
          }
          @media (min-width: 1024px) {
            body.ads-page-body .footer-heading {
              font-size: 2.5rem !important; /* text-5xl - reduced from text-6xl */
            }
          }

          /* Redesigned Therapist Cards Styles */
          .redesigned-therapist-card-wrapper {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
            max-width: 380px;
            margin: 0 auto;
            text-align: left;
          }
          .redesigned-therapist-top-card {
            background: linear-gradient(180deg, #FFF0E5 0%, #FFDEC6 100%);
            border-radius: 28px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
            border: 1px solid #FFEBE0;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            min-height: 290px;
            justify-content: space-between;
          }
          .redesigned-therapist-top-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(63, 46, 115, 0.08);
          }
          .redesigned-therapist-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            width: 100%;
          }
          .redesigned-therapist-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            flex: 1;
            min-width: 0;
          }
          .redesigned-therapist-designation {
            font-size: 12px;
            font-weight: 500;
            color: #3C3C3C;
            line-height: 1.2;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            display: block;
          }
          .redesigned-therapist-name {
            font-size: 28px;
            font-weight: 700;
            color: #000000;
            line-height: 1.1;
            margin-bottom: 36px;
            letter-spacing: -0.5px;
            word-wrap: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 61.6px;
          }
          .redesigned-therapist-sessions-badge {
            background-color: #3F2E73;
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 500;
            padding: 6px 14px;
            border-radius: 9999px;
            display: inline-block;
            line-height: 1.2;
            white-space: nowrap;
          }
          .redesigned-therapist-sessions-badge .italic-text {
            font-style: italic;
            font-weight: 400;
            opacity: 0.9;
          }
          .redesigned-therapist-avatar-container {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background-color: #D6CFFF;
            position: relative;
            flex-shrink: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .redesigned-therapist-avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .redesigned-therapist-avatar-fallback {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
          }
          .redesigned-therapist-pills-section {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-top: 0px;
            width: 100%;
          }
          .redesigned-therapist-pills-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            width: 100%;
            align-items: center;
          }
          .redesigned-therapist-pill {
            background: rgba(205, 196, 255, 0.65);
            color: #3f2e73;
            border-radius: 9999px;
            padding: 6px 14px;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(63, 46, 115, 0.08);
            backdrop-filter: blur(0.5px);
            -webkit-backdrop-filter: blur(0.5px);
            border: 1.5px solid rgba(255, 255, 255, 0.45);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            line-height: 1.2;
            white-space: nowrap;
          }
          .redesigned-therapist-bottom-bar {
            background: linear-gradient(90deg, #FFFDFB 0%, #FFF4ED 100%);
            border-radius: 20px;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #FFE7D6;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
            width: 100%;
          }
          .redesigned-therapist-availability-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
          }
          .redesigned-therapist-availability-label {
            font-size: 13px;
            font-weight: 400;
            color: #4A4A4A;
            line-height: 1.2;
            margin-bottom: 2px;
          }
          .redesigned-therapist-availability-time {
            font-size: 20px;
            font-weight: 600;
            color: #000000;
            line-height: 1.1;
            letter-spacing: -0.3px;
          }
          .redesigned-therapist-book-button {
            background-color: #3F2E73;
            color: #FFFFFF;
            border: none;
            border-radius: 16px;
            font-size: 16px;
            font-weight: 600;
            padding: 10px 24px;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.1s ease;
            white-space: nowrap;
          }
          .redesigned-therapist-book-button:hover {
            background-color: #2D2054;
          }
          .redesigned-therapist-book-button:active {
            transform: scale(0.97);
          }
          .redesigned-therapist-view-profile {
            background-color: transparent;
            color: #3F2E73;
            border: 1px solid #3F2E73;
            border-radius: 9999px;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: background-color 0.2s ease, transform 0.1s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1.2;
            margin-left: auto;
            margin-right: 10px;
            align-self: center;
            margin-top: 6px;
          }
          .redesigned-therapist-view-profile:hover {
            background-color: rgba(63, 46, 115, 0.08);
          }
          .redesigned-therapist-view-profile:active {
            transform: scale(0.97);
          }

          /* Mobile responsive overrides (placed at the end to guarantee override priority) */
          @media (max-width: 767px) {
            .redesigned-therapist-top-card {
              padding: 20px;
              min-height: 250px;
            }
            .redesigned-therapist-avatar-container {
              width: 100px;
              height: 100px;
            }
            .redesigned-therapist-name {
              font-size: 22px;
              margin-bottom: 20px;
              min-height: 48.4px;
            }
            .redesigned-therapist-designation {
              font-size: 11px;
            }
            .redesigned-therapist-bottom-bar {
              padding: 12px 16px;
            }
            .redesigned-therapist-book-button {
              font-size: 14px;
              padding: 8px 16px;
            }
            .redesigned-therapist-availability-label {
              font-size: 11px;
            }
            .redesigned-therapist-availability-time {
              font-size: 15px;
            }
            .redesigned-therapist-view-profile {
              font-size: 10px;
              padding: 3px 8px;
            }
          }
          @media (max-width: 360px) {
            .redesigned-therapist-top-card {
              padding: 16px;
            }
            .redesigned-therapist-avatar-container {
              width: 90px;
              height: 90px;
            }
            .redesigned-therapist-name {
              font-size: 20px;
              margin-bottom: 16px;
              min-height: 44px;
            }
            .redesigned-therapist-availability-label {
              font-size: 10px;
            }
            .redesigned-therapist-availability-time {
              font-size: 13px;
            }
            .redesigned-therapist-view-profile {
              font-size: 9px;
              padding: 2px 6px;
            }
          }
        `
      }} />
      {/* Structured Data */}
      <Script
        id="medical-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <main className="min-h-screen bg-white ads-page">
        {/* Hero Section - Exact copy from homepage */}
        <div className="w-full overflow-hidden mt-12">
          <div className="hero-wrapper mx-auto max-w-[1400px] px-0 md:px-0">
            <section 
              className="hero-section hero-home text-black p-4 sm:px-8 sm:py-8 md:px-[50px] md:py-[50px] overflow-hidden relative"
              style={{ 
                backgroundColor: '#E4E4F9',
                border: 'none',
                outline: 'none',
                margin: 0,
                borderRadius: '10px',
                '--hero-desktop-min-height': 'clamp(540px, 60vh, 780px)',
                '--hero-desktop-image-min-height': '480px'
              }}
            >
              <div className="flex flex-col xl:flex-row w-full hero-content-wrapper" style={{ minHeight: 'inherit', border: 'none', outline: 'none', margin: 0, padding: 0 }}>
                {/* Left: Text */}
                <div className="hero-text flex flex-col justify-center xl:w-[45%] xl:order-1 xl:pl-2 text-center xl:text-left items-center xl:items-start mt-0 px-0 sm:px-0 order-1">
                  {/* Badge */}
                  <div className="hero-badge inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-gray-800 w-fit mx-auto xl:mx-0" style={{ backgroundColor: 'rgba(242, 242, 252, 0.7)' }}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="hero-badge-text text-xs sm:text-sm">Trusted by 840+ families</span>
                  </div>
                  
                  <h1 className="hero-title mt-4 text-4xl md:text-5xl lg:text-6xl font-bold break-words" style={{ color: '#2C1A4A', fontWeight: 700}}>
                    Worried about your child&apos;s behaviour, emotions, or struggling with parenting challenges?
                  </h1>
                  <p className="hero-description p1 mt-3 md:mt-3 text-base md:text-lg">
                    Children often show their struggles through behaviour and emotions. Understanding these signs early can make a big difference in their growth and well-being.
                  </p>
                  <div className="hero-buttons mt-6 md:mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 sm:justify-start">
                    <style dangerouslySetInnerHTML={{__html: `
                      @media (max-width: 767px) {
                        .hero-book-button {
                          width: 100% !important;
                          max-width: 100% !important;
                          min-width: 280px !important;
                        }
                      }
                    `}} />
                    <button
                      onClick={handleGetStartedClick}
                      className="hero-book-button inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-normal text-white shadow-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#593494]/40 flex-shrink-0"
                      style={{ backgroundColor: '#3f2e73' }}
                      type="button"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d1733'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3f2e73'}
                    >
                      <span style={{ fontWeight: 500 }}>Talk to an Expert</span>
                    </button>
                    <div ref={counterRef} className="text-center flex-shrink-0 counter-container">
                      <p className="text-gray-800 counter-sentence flex items-center justify-center gap-1 flex-wrap">
                        <TrendingUp size={14} style={{ color: '#3f2e73', strokeWidth: 2.5 }} />
                        Booked by{' '}
                        <span className="inline-flex items-center" style={{ gap: 0 }}>
                          {shouldAnimateCounter ? (
                            <span className="inline-flex items-center" style={{  color: '#3f2e73', minWidth: '2.5ch' }}>
                              <Counter 
                                key={`counter-${sessionCount}-${shouldAnimateCounter}`}
                                start={0} 
                                end={sessionCount} 
                                duration={8}
                                fontSize={14}
                                className="inline-flex font-normal"
                                style={{ fontWeight: 400 }}
                              />
                            </span>
                          ) : (
                            <span className="inline-block" style={{ fontWeight: 400, color: '#3f2e73', minWidth: '2.5ch' }}>0</span>
                          )}
                          <span style={{ color: '#3f2e73', marginLeft: '-2px' }}>+</span>
                        </span>
                        {' '}parents Today, book yours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile / Tablet / Small-laptop Image */}
                <div className="hero-mobile-wrapper block xl:hidden order-2 mt-6 w-screen relative left-1/2 right-1/2 -translate-x-1/2">
                  <div className="relative w-full hero-image-box overflow-hidden flex items-end" style={{ minHeight: 'auto', border: 'none', outline: 'none', boxShadow: 'none' }}>
                    <Image
                      src="/hee.webp"
                      alt="Hero illustration of a child with a parent during online counseling"
                      fill
                      className="hero-mobile-image object-bottom w-full h-full"
                      sizes="100vw"
                      priority
                      style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                    />
                  </div>
                </div>

                {/* Desktop Image (large laptop and above, aligned with header desktop nav breakpoint) */}
                <div className="desktop-hero-image hidden xl:block xl:w-[55%] xl:h-full xl:order-2 relative overflow-hidden" style={{ border: 'none', outline: 'none', minHeight: 'var(--hero-desktop-image-min-height)', marginRight: '-15px', marginTop: '0px', marginBottom: '-50px', width: 'calc(55% + 15px)', position: 'absolute', right: 0, top: 0, bottom: 0 }}>
                  {/* Responsive image box aligned to bottom of column */}
                  <div className="hero-image-box absolute inset-0 flex items-end justify-center" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
                    <Image
                      src="/hee.webp"
                      alt="Hero illustration showing Little Care's child counseling and parent support"
                      fill
                      className="object-contain object-bottom"
                      sizes="55vw"
                      loading="eager"
                      style={{ border: 'none', outline: 'none', boxShadow: 'none', objectPosition: 'center bottom', transform: 'scale(1.0)', transformOrigin: 'bottom center' }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        {showGuide && (
          <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
        )}

        {/* Support Points Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50/50">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-4">
            <div className="text-center max-w-5xl mx-auto mb-10 md:mb-12">
              <p className="p1 text-base md:text-lg mb-2" style={{ color: '#3f2e73', fontWeight: 500 }}>
                How therapy helps
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2C1A4A', lineHeight: '1.2' }}>
                Sometimes a Little Extra Support Can Make A Difference
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Whether your child is struggling with emotions, behaviour, confidence, learning, or friendships, the right support can help your child feel understood, build confidence, and handle life&apos;s challenges in a healthier way.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 max-w-6xl mx-auto">
              {[
                "Anxiety, Worry & Exam Stress",
                "Anger, Tantrums & Emotional Outbursts",
                "Sadness, Low Mood & Depression",
                "Low Confidence & Self-Esteem",
                "ADHD, Focus & Attention Difficulties",
                "Learning Challenges & School Struggles",
                "Behaviour Changes at Home or School",
                "Trauma, Abuse & Emotional Recovery",
                "Friendship, Social Skills & Peer Challenges",
                "Family Conflict & Relationship Stress",
                "Parenting Support & Guidance",
                "Parent–Child Relationship & Communication"
              ].map((point, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 py-1 px-2"
                >
                  <span className="text-xl flex-shrink-0">✅</span>
                  <span className="text-gray-800 font-medium text-base leading-snug">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Psychologists Section */}
        <section id="psychologists-section" className="pt-8 md:pt-10 lg:pt-12 pb-0 bg-white">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-2 md:px-3 lg:px-3">
              <div className="text-center mb-6 md:mb-8 px-2">
                <p className="text-sm sm:text-base text-gray-600 mb-2 md:mb-3 max-w-2xl mx-auto psychologists-description">
                  Trusted, Certified child psychologists{'\n'}trained for online sessions.
                </p>
                <h2 className="psychologists-heading text-base md:text-xl lg:text-2xl font-semibold text-gray-900" style={{ fontSize: '24px', fontWeight: 600, lineHeight: '1.1' }}>
                  Connect with qualified{'\n'}child psychologists
                </h2>
              </div>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading psychologists...</p>
              </div>
            ) : psychologists.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No psychologists available at the moment.</p>
              </div>
            ) : (
              <div className="guide-cards-container" style={{ padding: 0 }}>
                {psychologists.map((psych, idx) => {
                    const name = psych.name || `${psych.first_name || ''} ${psych.last_name || ''}`.trim();
                    let imageSrc = psych.cover_image_url;
                    
                    // Normalize the image URL
                    if (imageSrc) {
                      imageSrc = normalizeImageUrl(imageSrc);
                    }
                    
                    // Fallback images based on name
                    if (!imageSrc) {
                      const nameLower = name.toLowerCase();
                      if (nameLower.includes('irene') || nameLower.includes('marium')) {
                        imageSrc = '/irene.jpeg';
                      } else if (nameLower.includes('doug') || nameLower.includes('douglas')) {
                        imageSrc = '/doug.png';
                      } else if (nameLower.includes('ashley') || nameLower.includes('ash') || nameLower.includes('sarah')) {
                        imageSrc = '/mainlogo.webp';
                      } else if (nameLower.includes('child') || nameLower.includes('teen') || nameLower.includes('liana')) {
                        imageSrc = '/kids.png';
                      } else {
                        imageSrc = '/mainlogo.webp';
                      }
                    }
                    
                    return (
                      <React.Fragment key={psych.id || idx}>
                        <div className="redesigned-therapist-card-wrapper">
                          {/* Top Peach Card */}
                          <div 
                            className="redesigned-therapist-top-card"
                            onClick={() => handlePsychologistClick(psych)}
                          >
                            <div className="redesigned-therapist-header">
                              <div className="redesigned-therapist-info">
                                <span className="redesigned-therapist-designation">
                                  {psych.designation || 'Consultant Psychologist'}
                                </span>
                                <h3 className="redesigned-therapist-name">
                                  {name || 'Dr. ' + (psych.first_name || 'Unknown')}
                                </h3>
                                <span className="redesigned-therapist-sessions-badge">
                                  {800 + (psych.experience_years || 2) * 100}+ <span className="italic-text">hrs sessions</span>
                                </span>
                              </div>
                              
                              <div className="redesigned-therapist-avatar-container">
                                {imageSrc && (
                                  <img
                                    src={imageSrc}
                                    alt={`${name} - Child psychologist`}
                                    className="redesigned-therapist-avatar-img"
                                    width={140}
                                    height={140}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const sibling = e.target.nextSibling;
                                      if (sibling) {
                                        sibling.style.display = 'flex';
                                      }
                                    }}
                                  />
                                )}
                                <div 
                                  className="redesigned-therapist-avatar-fallback"
                                  style={{ display: imageSrc ? 'none' : 'flex' }}
                                >
                                  {name ? 
                                    name.split(' ').filter(Boolean).map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2) :
                                    'D'
                                  }
                                </div>
                              </div>
                            </div>

                            {/* Pills row at the bottom of the peach card */}
                            <div className="redesigned-therapist-pills-section">
                              {/* Row 1: Experience & Price */}
                              <div className="redesigned-therapist-pills-row">
                                <span className="redesigned-therapist-pill">
                                  ⚡️ {psych.experience_years || 2}+ yrs Experience
                                </span>
                                <span className="redesigned-therapist-pill">
                                  ₹{psych.price || psych.individual_session_price || '1299'}
                                </span>
                              </div>
                              {/* Row 2: Personality Traits & View Profile */}
                              <div className="redesigned-therapist-pills-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', width: '100%' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, minWidth: 0 }}>
                                  {(() => {
                                    const rawTraits = psych.personality_traits || psych.personalityTraits || psych.personalities || null;
                                    let traits = [];
                                    if (Array.isArray(rawTraits)) {
                                      traits = rawTraits;
                                    } else if (typeof rawTraits === 'string' && rawTraits.trim().length > 0) {
                                      traits = rawTraits.split(/[,|/]/).map(t => t.trim()).filter(Boolean);
                                    }
                                    const displayTraits = traits.length > 0 ? traits.slice(0, 2) : ["Friendly", "Empathetic"];
                                    return displayTraits.map((trait, i) => (
                                      <span key={`trait_${i}`} className="redesigned-therapist-pill">
                                        {/^[a-zA-Z0-9]/.test(trait) ? `😇 ${trait}` : trait}
                                      </span>
                                    ));
                                  })()}
                                </div>
                                <span className="redesigned-therapist-view-profile">
                                  View Profile
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bottom bar with availability and CTA */}
                          <div className="redesigned-therapist-bottom-bar">
                            <div className="redesigned-therapist-availability-info">
                              {(() => {
                                const display = getAvailabilityDisplay(psych.id);
                                return (
                                  <>
                                    <span className="redesigned-therapist-availability-label">
                                      {display.label}
                                    </span>
                                    <span className="redesigned-therapist-availability-time">
                                      {display.timeText}
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                            <button
                              className="redesigned-therapist-book-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePsychologistClick(psych);
                              }}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <div className="mt-12 md:mt-16 lg:mt-20 pt-4 md:pt-6 lg:pt-8 pb-12 md:pb-16 lg:pb-20" style={{ backgroundColor: 'rgb(250, 251, 254)' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .ads-page .how-it-works-heading {
              line-height: 1.2 !important;
            }
            @media (max-width: 767px) {
              .ads-page .how-it-works-heading {
                white-space: pre-line;
              }
            }
            @media (min-width: 768px) {
              .ads-page .how-it-works-heading {
                white-space: normal;
              }
            }
            .ads-page #how-it-works button[type="button"] {
              background-color: #6b7280 !important;
            }
            .ads-page #how-it-works button[type="button"]:hover {
              background-color: #4b5563 !important;
            }
          `}} />
          <HowItWorks 
            heading={
              <>
                Your <span style={{ color: '#3f2e73', fontStyle: 'italic' }}>Little one</span> deserves{'\n'}
                <span className="how-it-works-mobile-break">care</span> & support
              </>
            }
          />
        </div>

        {/* Videos Showcase Section */}
        {!videosLoading && videos.length > 0 && (
          <div className="pt-0" style={{ marginTop: '-16px' }}>
            <style dangerouslySetInnerHTML={{__html: `
              .ads-page .videos-showcase-mobile {
                margin-top: 3rem !important;
                padding-top: 3rem !important;
              }
              @media (max-width: 767px) {
                .ads-page .videos-showcase-mobile {
                  margin-top: 2rem !important;
                  padding-top: 2.5rem !important;
                }
                .ads-page .how-it-works-heading {
                  white-space: pre-line;
                }
              }
              @media (min-width: 768px) {
                .ads-page .how-it-works-heading {
                  white-space: normal;
                }
              }
              @media (min-width: 768px) and (max-width: 1180px) {
                .ads-page .videos-showcase-mobile {
                  margin-top: 4.5rem !important;
                  padding-top: 3rem !important;
                }
              }
            `}} />
            <VideosShowcase cmsData={{ 
            videosHeading: "Follow our journey\nto see how we help children and families.",
            videos: videos.map(video => ({
              url: video.url || video.src,
              src: video.url || video.src,
              thumbnailUrl: normalizeImageUrl(video.thumbnailUrl || video.poster || ''),
              poster: normalizeImageUrl(video.thumbnailUrl || video.poster || ''),
              title: video.title
            }))
          }} />
          </div>
        )}

        {/* Reviews Section */}
        <section className="w-screen pt-8 md:pt-10 lg:pt-12 pb-0 bg-white">
          <style dangerouslySetInnerHTML={{__html: `
            .reviews-marquee {
              display: flex;
              gap: 16px;
              width: max-content;
              animation: scroll-reviews 90s linear infinite;
            }
            @media (max-width: 767px) {
              .reviews-marquee {
                animation: scroll-reviews 20s linear infinite;
                gap: 12px;
              }
              .review-card {
                min-width: 260px !important;
                max-width: 280px !important;
              }
            }
            @media (min-width: 768px) and (max-width: 1024px) {
              .review-card {
                min-width: 280px !important;
                max-width: 300px !important;
              }
            }
            .reviews-marquee:hover,
            .reviews-marquee:active { 
              animation-play-state: paused; 
            }
            @media (max-width: 767px) {
              .reviews-marquee:hover,
              .reviews-marquee:active {
                animation-play-state: paused;
              }
            }
            .reviews-container:active .reviews-marquee,
            .reviews-container:hover .reviews-marquee {
              animation-play-state: paused;
            }
            .reviews-container {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .reviews-container::-webkit-scrollbar {
              display: none;
            }
            @keyframes scroll-reviews {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .ads-page .review-card .font-semibold {
              font-size: 1rem !important;
            }
            @media (min-width: 768px) {
              .ads-page .review-card .font-semibold {
                font-size: 1.125rem !important;
              }
            }
            .ads-page .review-card p {
              font-size: 1rem !important;
            }
            @media (min-width: 768px) {
              .ads-page .review-card p {
                font-size: 1.125rem !important;
              }
            }
          `}} />
          <div className="w-full px-4 sm:px-0">
            <div className="text-center" style={{ marginBottom: '20px' }}>
              <p className="text-center md:text-center mt-2 text-sm md:text-base text-gray-600">
                Reviews
              </p>
              <h2 className="reviews-section-heading text-base md:text-xl lg:text-2xl font-semibold text-gray-900 mt-3 mb-8 md:mb-14 px-4" style={{ fontSize: '24px', fontWeight: 600, lineHeight: '1.1', marginTop: '0.75rem', marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Real families, real stories, real impact.
              </h2>
            </div>

            <div className="relative overflow-x-auto reviews-container" style={{ marginBottom: '0px', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              <div className="reviews-marquee">
                {(() => {
                  const reviews = [
                    { name: "Priya Menon", rating: 5, text: "Little Care has been a lifesaver for our family. The online sessions are convenient and our child feels comfortable talking to the psychologist. Highly recommend!" },
                    { name: "Rajesh Nair", rating: 4.5, text: "The free assessment helped us understand our child's needs better. The psychologist was patient, understanding, and provided excellent guidance. Thank you Little Care!" },
                    { name: "Anitha Pillai", rating: 4, text: "Professional service, easy booking, and great results. Our child's anxiety has improved significantly since starting sessions. The online format works perfectly for us." },
                    { name: "Suresh Kumar", rating: 5, text: "Excellent support for our child. The therapists are compassionate and understanding. We've seen remarkable progress in just a few sessions." },
                    { name: "Lakshmi Nair", rating: 4.5, text: "Little Care made it so easy to get help for our daughter. The booking process is simple and the sessions are very effective. Highly satisfied!" },
                    { name: "Vijay Menon", rating: 5, text: "The best decision we made for our child's mental health. The psychologists are professional and our child looks forward to the sessions." }
                  ];
                  const loopReviews = [...reviews, ...reviews, ...reviews];
                  return loopReviews.map((review, idx) => {
                    const fullStars = Math.floor(review.rating);
                    const hasHalfStar = review.rating % 1 !== 0;
                    return (
                      <div key={idx} className="review-card min-w-[280px] max-w-[320px] rounded-[10px] border border-gray-200 bg-white p-4 md:p-6">
                        <div className="mb-3">
                          <div className="font-semibold text-gray-900 text-base md:text-lg mb-1">{review.name}</div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => {
                              if (star <= fullStars) {
                                return (
                                  <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                  </svg>
                                );
                              } else if (star === fullStars + 1 && hasHalfStar) {
                                return (
                                  <div key={star} className="relative w-4 h-4">
                                    <svg className="w-4 h-4 text-gray-300 fill-current absolute" viewBox="0 0 20 20">
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                    <svg className="w-4 h-4 text-yellow-400 fill-current absolute" viewBox="0 0 20 20" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                  </div>
                                );
                              } else {
                                return (
                                  <svg key={star} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                  </svg>
                                );
                              }
                            })}
                          </div>
                        </div>
                        <p className="text-gray-800 text-base md:text-lg leading-relaxed">{review.text}</p>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pt-8 md:pt-10 lg:pt-12 pb-8 md:pb-10 lg:pb-12 bg-white mt-8 md:mt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="faq-section-heading text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-left text-gray-900 mb-8 md:mb-12 px-2 md:px-0">
              FAQ's
            </h2>
            <style dangerouslySetInnerHTML={{__html: `
              @media (max-width: 767px) {
                .faq-heading {
                  font-size: 16px !important;
                  font-weight: 400 !important;
                  line-height: 1.4;
                }
                .faq-answer {
                  font-size: 13px !important;
                  line-height: 1.5;
                }
              }
              @media (min-width: 768px) {
                .faq-answer {
                  font-size: 13px !important;
                  line-height: 1.5;
                }
              }
            `}} />
            <div className="space-y-0">
              {FAQ_DATA.map((faq, index) => {
                const isOpen = openFAQ === index;
                return (
                  <div key={index} className="border-b border-gray-200 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      className="flex w-full items-center justify-between py-3 md:py-4 text-left md:hover:bg-white transition-colors px-2 md:px-0 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="faq-heading text-xs md:text-sm lg:text-base text-gray-900 w-full md:w-auto pr-2 md:pr-3 lg:pr-0">
                        {faq.question}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-800 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : "rotate-0"}`}
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
                        isOpen ? "max-h-96 md:max-h-64 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-2 pb-3 md:px-0 md:pb-4">
                        <p className="faq-answer leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
