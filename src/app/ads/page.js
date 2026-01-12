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
        url: 'https://www.little.care/mainlogo.webp',
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
    images: ['https://www.little.care/mainlogo.webp'],
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
  const [sessionCount, setSessionCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isCounterVisible, setIsCounterVisible] = useState(false);
  const counterRef = useRef(null);

  // Calculate current session count based on IST time
  // Increments every minute by a random value between 1-3
  const calculateSessionCount = () => {
    // Get current IST time
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // At midnight (12:00 AM), count is 0
    if (totalMinutes === 0) {
      return 0;
    }
    
    // Calculate count: each minute adds a random value between 1-3
    // Use a deterministic random based on minute to ensure consistency
    let totalCount = 0;
    
    // For each minute that has passed since midnight
    for (let m = 1; m <= totalMinutes; m++) {
      // Use minute as seed for pseudo-random (consistent for same minute)
      const seed = m * 7919; // Prime number for better distribution
      const randomValue = (seed % 3) + 1; // Value between 1-3
      totalCount += randomValue;
    }
    
    // No cap - can grow beyond 100
    return totalCount;
  };

  // Intersection Observer for counter animation
  useEffect(() => {
    if (!counterRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset and animate from 0 to current count
            setDisplayCount(0);
            setIsCounterVisible(true);
            
            // Animate from 0 to current count
            const targetCount = sessionCount;
            if (targetCount === 0) {
              setDisplayCount(0);
              return;
            }
            
            const duration = 4000; // 4 seconds (slower animation)
            const steps = 60;
            const increment = targetCount / steps;
            let current = 0;
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= targetCount) {
                setDisplayCount(targetCount);
                clearInterval(timer);
              } else {
                setDisplayCount(Math.floor(current));
              }
            }, duration / steps);
            
            return () => clearInterval(timer);
          } else {
            // Reset when out of view
            setIsCounterVisible(false);
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
      // Reset display count when count changes (new day)
      if (count === 0) {
        setDisplayCount(0);
        setIsCounterVisible(false);
      }
    };
    
    // Initial calculation
    updateCount();
    
    // Update every minute to increment the count
    const minuteInterval = setInterval(updateCount, 60000); // 60 seconds = 1 minute
    
    return () => {
      clearInterval(minuteInterval);
    };
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
    router.push('/free-assessment');
  };

  const handleHowItWorksClick = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
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

  // Fetch availability for a single doctor
  const fetchDoctorAvailability = async (doctorId, withSync = false) => {
    try {
      // Mark as loading
      setLoadingAvailability(prev => new Set(prev).add(doctorId));

      const today = new Date();
      const startDate = today.toISOString().split('T')[0]; // Today
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 7); // Next 7 days
      const endDateStr = endDate.toISOString().split('T')[0];

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
          const counsellingResponse = await fetch(`${baseUrl}/counselling?status=published&limit=50`);
          if (counsellingResponse.ok) {
            const counsellingData = await counsellingResponse.json();
            if (counsellingData.success && counsellingData.data?.pages) {
              counsellingData.data.pages.forEach(page => {
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
          const assessmentsResponse = await fetch(`${baseUrl}/assessments?status=published&limit=50`);
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
          const betterParentingResponse = await fetch(`${baseUrl}/better-parenting?status=published&limit=50`);
          if (betterParentingResponse.ok) {
            const betterParentingData = await betterParentingResponse.json();
            if (betterParentingData.success && betterParentingData.data?.pages) {
              betterParentingData.data.pages.forEach(page => {
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

  // Handle psychologist card click
  const handlePsychologistClick = (psychologist) => {
    const name = psychologist.name || `${psychologist.first_name} ${psychologist.last_name}`;
    const slug = createSlug(name);
    if (slug) {
      router.push(`/online-child-psycologist/${slug}`);
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
          .ads-page h1 {
            font-size: 2rem !important;
            line-height: 1.1 !important;
          }
          .ads-page h2 {
            font-size: 1.75rem !important;
            line-height: 1.4 !important;
          }
          .ads-page h3 {
            font-size: 1.125rem !important;
            line-height: 1.5 !important;
          }
          @media (min-width: 640px) {
            .ads-page h1 {
              font-size: 2.5rem !important;
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
              font-size: 3rem !important;
            }
            .ads-page h2 {
              font-size: 2.25rem !important;
            }
            .ads-page h3 {
              font-size: 1.5rem !important;
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
              gap: 32px;
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
              gap: 40px;
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
          .doctor-card-name {
            font-size: 1.05rem;
            font-weight: 700;
            color: #fff;
            text-shadow: 0 2px 8px rgba(0,0,0,0.25);
          }
          .service-card-heading {
            line-height: 1.2 !important;
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
        {/* Hero Section - Rebuilt from home page */}
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
                {/* Mobile / Tablet / Small-laptop Image - Top on Mobile */}
                <div className="hero-mobile-wrapper block xl:hidden" style={{ order: 1, width: '100vw', position: 'relative', left: '50%', right: '50%', transform: 'translateX(-50%)', marginBottom: '1.5rem' }}>
                  <div className="relative w-full hero-image-box overflow-hidden flex items-end" style={{ minHeight: 'auto', border: 'none', outline: 'none', boxShadow: 'none', height: '300px' }}>
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

                {/* Text Section - Below Image on Mobile */}
                <div className="hero-text flex flex-col justify-center xl:w-[45%] xl:order-1 xl:pl-2 text-center xl:text-left items-center xl:items-start mt-0 px-0 sm:px-0" style={{ order: 2 }}>
                  {/* Badge */}
                  <div className="hero-badge inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-gray-800 w-fit mx-auto xl:mx-0" style={{ backgroundColor: 'rgba(242, 242, 252, 0.7)' }}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="hero-badge-text text-xs sm:text-sm">Convenient, proven online care for brighter future</span>
                  </div>
                  
                  <h1 className="hero-title mt-4 text-4xl md:text-5xl lg:text-6xl font-medium break-words" style={{ color: '#2C1A4A', fontWeight: 600}}>
                    Your Partner in <br /> Child Counseling <br /> & Parenting Support
                  </h1>
                  <p className="hero-description p1 mt-6 md:mt-6 text-base md:text-lg">
                     Connect with a trusted child psychologist online for gentle, child-friendly counselling from the comfort of your home, helping your child feel safe, supported, and understood without the stress of travel.
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
                      className="hero-book-button inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-normal text-white shadow-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#593494]/40"
                      style={{ backgroundColor: '#3f2e73' }}
                      type="button"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d1733'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3f2e73'}
                    >
                      <span style={{ fontWeight: 500 }}>Book a Free Assessment</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleHowItWorksClick}
                      className="inline-flex items-center justify-center gap-3 text-base font-normal text-black hover:text-gray-800 group relative cursor-pointer"
                    >
                      <span className="relative">
                        How does it work?
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 ease-out group-hover:w-full"></span>
                      </span>
                      <div className="w-5 h-5 border border-gray-800 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-2.5 w-2.5 text-gray-800"
                          aria-hidden="true"
                        >
                          <path d="M12 5v14M19 12l-7 7-7-7"/>
                        </svg>
                      </div>
                    </button>
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

        {/* Session Counter Section */}
        <div ref={counterRef} className="w-full py-4 md:py-6 mt-8 md:mt-12 lg:mt-16 text-center">
          <p className="text-xs sm:text-sm text-gray-800" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
            <span className="font-semibold" style={{ fontWeight: 600, color: '#3f2e73' }}>{displayCount}</span><span style={{ color: '#3f2e73' }}>+</span> free sessions booked today
          </p>
        </div>

        {/* Services Section - Choose Options (Rebuilt from component) */}
        <section className="pt-0 pb-0 bg-white">
          <section
            id="choose-your-guide"
            className="w-full py-2 px-4 md:px-4 mt-12 md:mt-20 scroll-mt-48"
          >
            <style jsx>{`
              @media (max-width: 479px) {
                .cards-grid {
                  gap: 20px !important;
                  max-width: 100% !important;
                  width: 100% !important;
                  padding: 0 16px !important;
                }
                .card-container {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 450px !important;
                  min-height: 450px !important;
                  max-height: 450px !important;
                }
                .card-image {
                  height: 310px !important;
                  top: 160px !important;
                }
                .read-more-button {
                  bottom: 75px !important;
                  left: 20px !important;
                }
                h2.choose-options-heading {
                  font-size: 24px !important;
                  font-weight: 600 !important;
                  line-height: 1.1 !important;
                  text-align: center;
                  padding-left: 0;
                  padding-right: 0;
                }
              }
              @media (min-width: 480px) and (max-width: 599px) {
                .cards-grid {
                  gap: 22px !important;
                  max-width: 100% !important;
                  width: 100% !important;
                  padding: 0 20px !important;
                }
                .card-container {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 480px !important;
                  min-height: 480px !important;
                  max-height: 480px !important;
                }
                .card-image {
                  height: 370px !important;
                  top: 165px !important;
                }
                .read-more-button {
                  bottom: 85px !important;
                  left: 22px !important;
                }
                h2.choose-options-heading {
                  font-size: 24px !important;
                  font-weight: 600 !important;
                  line-height: 1.1 !important;
                  text-align: center;
                  padding-left: 0;
                  padding-right: 0;
                }
              }
              @media (min-width: 600px) and (max-width: 767px) {
                .cards-grid {
                  gap: 24px !important;
                  max-width: 100% !important;
                  width: 100% !important;
                  padding: 0 24px !important;
                }
                .card-container {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 500px !important;
                  min-height: 500px !important;
                  max-height: 500px !important;
                }
                .card-image {
                  height: 410px !important;
                  top: 170px !important;
                }
                .read-more-button {
                  bottom: 95px !important;
                  left: 24px !important;
                }
                h2.choose-options-heading {
                  font-size: 24px !important;
                  font-weight: 600 !important;
                  line-height: 1.1 !important;
                  text-align: center;
                  padding-left: 0;
                  padding-right: 0;
                }
              }
              @media (max-width: 767px) {
                .choose-options-heading {
                  max-width: 100% !important;
                }
                .card-content {
                  padding: 20px !important;
                  padding-bottom: 0 !important;
                }
                .card-title {
                  font-size: 24px !important;
                  margin-bottom: 8px !important;
                  line-height: 1.1 !important;
                  max-width: none !important;
                  width: 100% !important;
                  white-space: nowrap !important;
                  overflow: hidden !important;
                  text-overflow: ellipsis !important;
                }
                .card-description {
                  font-size: 14px !important;
                }
                .card-image img {
                  transform: scale(0.9) !important;
                  object-position: center center !important;
                }
              }
                @media (min-width: 768px) {
                  .card-container {
                    height: 500px !important;
                    min-height: 500px !important;
                    max-height: 500px !important;
                    align-self: stretch !important;
                  }
                  .cards-grid {
                    grid-template-rows: 500px !important;
                    align-items: stretch !important;
                  }
                  .card-image {
                    top: 180px !important;
                  }
                }
                /* Override h3 tag font size to match original span size */
                .card-tag-pill {
                  font-size: 12px !important;
                  line-height: 1 !important;
                  margin: 0 !important;
                  font-weight: 300 !important; /* lighter weight to reduce boldness */
                  padding: 2px 8px !important;
                }
            `}</style>
            <div className="mx-auto max-w-[1400px]">
              {/* Header */}
              <div className="text-center md:text-left mb-8 md:mb-6 max-w-4xl mx-auto px-4">
                <p className="p1 text-base md:text-lg mb-2">Let us guide you.</p>
                <h2 className="choose-options-heading text-base md:text-xl lg:text-2xl font-semibold" style={{ fontSize: '24px', fontWeight: 600, lineHeight: '1.1' }}>
                  Choose the Right Child Counseling Option to Get Started
                </h2>
              </div>

              {/* Cards Grid */}
              <div className="cards-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-20 max-w-md md:max-w-4xl mx-auto justify-items-center md:justify-items-stretch items-stretch rounded-[37.8px]">
                {chooseOptionsCards.map((card) => (
                  <div
                    key={card.id}
                    className={`card-container relative bg-white rounded-[20px] overflow-hidden flex flex-col h-[500px] md:h-[500px] min-h-[500px] md:min-h-[500px] max-h-[500px] md:max-h-[500px] flex-shrink-0 cursor-pointer`}
                    onClick={() => {
                      const mapping = { 1: 'counselling', 2: 'assessments', 3: 'better-parenting' };
                      openGuide(mapping[card.id]);
                    }}
                    style={{ height: '500px' }}
                  >
                    {/* Colored background that matches image width */}
                    <div className={`absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b ${card.gradient} pointer-events-none z-0 rounded-[10px]`} />
                    {/* White gradient overlay from half to bottom - matches image width on mobile */}
                    <div className="absolute top-1/2 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-white pointer-events-none z-0 rounded-b-[10px]" />
                    {/* Card Content */}
                    <div className="card-content p-6 pb-0 mb-0 px-6 md:px-8 relative z-10">
                      {/* Tags */}
                      <div className="flex gap-2 mb-4">
                        <h3
                          className={`card-tag-pill rounded-full ${card.tagColors.primary}`}
                          style={{ fontFamily: 'inherit' }}
                        >
                          {card.tags[0]}
                        </h3>
                        <h3
                          className={`card-tag-pill rounded-full ${card.tagColors.secondary}`}
                          style={{ fontFamily: 'inherit' }}
                        >
                          {card.tags[1]}
                        </h3>
                      </div>

                      {/* Title */}
                      <h5 className="card-title text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 mb-1 whitespace-pre-line" style={{ fontWeight: 'bold' }}>
                        {card.title}
                      </h5>

                      {/* Description */}
                      <p className="card-description p1 text-sm md:text-sm mb-0" style={{ lineHeight: '1.3' }}>
                        {card.description}
                      </p>
                    </div>

                    {/* Image Section */}
                    <div className="card-image absolute left-0 right-0 z-10 h-[320px] md:h-64 min-h-[320px] md:min-h-64 max-h-[320px] md:max-h-64 overflow-hidden rounded-[20px]" style={{ top: '160px' }}>
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className={`${card.imageClass ? `${card.imageClass.replace('object-[50%_100%]', 'object-center')}` : "object-cover object-center md:object-[50%_100%]"}`}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={card.image === "/Child Assessment.webp"}
                      />
                      
                      {/* Read More Button */}
                      <div className="read-more-button absolute bottom-6 md:bottom-8 left-6">
                        <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-0 h-8 rounded-2xl text-sm font-medium transition-all duration-200 flex items-center shadow-sm border border-white/20 overflow-hidden group">
                          <span className="px-3">Find more</span>
                           <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#EAE4F4] transition-colors duration-200">
                            <svg
                              className="w-3.5 h-3.5 group-hover:scale-110 transition-all duration-200"
                              fill="none"
                              stroke="#000000"
                              strokeOpacity="0.6"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {chooseOptionsShowGuide && (
                <GuideModal open={chooseOptionsShowGuide} onClose={() => setChooseOptionsShowGuide(false)} defaultCategory={defaultCategory} />
              )}
            </div>
          </section>
        </section>

        {/* Psychologists Section */}
        <section className="pt-8 md:pt-10 lg:pt-12 pb-0 bg-white">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-2 md:px-3 lg:px-3">
              <div className="text-center mb-6 md:mb-8 px-2">
                <p className="text-sm sm:text-base text-gray-600 mb-2 md:mb-3 max-w-2xl mx-auto">
                  Connect with qualified child psychologists
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Experienced mental health professionals
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
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                          <div
                            className="guide-video-card"
                            onClick={() => handlePsychologistClick(psych)}
                          >
                        <div style={{ 
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          minHeight: "100%"
                        }}>
                          {imageSrc && (
                            <img
                              src={imageSrc}
                              alt={`${name} - Child psychologist profile photo`}
                              className="doctor-card-image"
                              width={400}
                              height={500}
                              loading="lazy"
                              decoding="async"
                              style={{ 
                                width: "100%", 
                                height: "100%", 
                                minHeight: "100%",
                                objectFit: "cover",
                                aspectRatio: "4/5",
                                position: "relative",
                                zIndex: 2
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'flex';
                                }
                              }}
                            />
                          )}
                        </div>
                        
                        {/* Gradient Overlay - Black fade from bottom to top */}
                        <div style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '55%',
                          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)",
                          pointerEvents: "none",
                          zIndex: 2
                        }} />
                        
                        {/* Fallback: Doctor Initials Avatar */}
                        <div 
                          style={{
                            display: (() => {
                              const nameLower = name.toLowerCase();
                              if (psych.cover_image_url) return 'none';
                              if (nameLower.includes('irene') || nameLower.includes('marium') || 
                                  nameLower.includes('doug') || nameLower.includes('douglas') || 
                                  nameLower.includes('ashley') || nameLower.includes('ash') || 
                                  nameLower.includes('child') || nameLower.includes('teen') ||
                                  nameLower.includes('sarah') || nameLower.includes('liana')) return 'none';
                              return 'flex';
                            })(),
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "4rem",
                            fontWeight: "bold",
                            color: "#fff",
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)"
                          }}
                        >
                          {name ? 
                            name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() :
                            psych.first_name ? 
                              psych.first_name.charAt(0).toUpperCase() : 
                              'D'
                          }
                        </div>
                        
                        {/* Doctor name and expertise bubbles */}
                        <div style={{
                          position: "absolute",
                          left: 18,
                          bottom: 10,
                          zIndex: 3,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 0,
                          width: "80%"
                        }}>
                          <div className="doctor-card-name" style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', textShadow: '0 2px 8px rgba(0,0,0,0.25)', paddingLeft: 10, paddingBottom: 0, marginBottom: 0 }}>
                            {name || 'Dr. ' + (psych.first_name || 'Unknown')}
                          </div>
                          {/* Expertise bubbles - Personality chips */}
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 1 }}>
                            {/* Personality chips */}
                            {(() => {
                              const rawTraits = psych.personality_traits || psych.personalityTraits || psych.personalities || null;
                              let traits = [];
                              if (Array.isArray(rawTraits)) {
                                traits = rawTraits;
                              } else if (typeof rawTraits === 'string' && rawTraits.trim().length > 0) {
                                traits = rawTraits.split(/[,|/]/).map(t => t.trim()).filter(Boolean);
                              }
                              return traits.slice(0, 1).map((trait, i) => (
                                <span key={`p_${i}`} style={{ background: 'rgba(255,255,255,0.16)', color: '#fff', borderRadius: 16, padding: '0.05em 0.5em', fontWeight: 400, fontSize: '0.85rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', backdropFilter: 'blur(0.5px)', WebkitBackdropFilter: 'blur(0.5px)', border: '1.2px solid rgba(255,255,255,0.18)' }}>
                                  {trait}
                                </span>
                              ));
                            })()}
                            {/* Price chip */}
                            <span style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', borderRadius: 16, padding: '0.05em 0.5em', fontWeight: 400, fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', backdropFilter: 'blur(0.5px)', WebkitBackdropFilter: 'blur(0.5px)', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                              {psych.price ? `₹${psych.price}` : (psych.individual_session_price ? `₹${psych.individual_session_price}` : '₹—')}
                            </span>
                            {/* Experience chip */}
                            <span style={{
                              background: 'rgba(255,255,255,0.22)',
                              color: '#fff',
                              borderRadius: 16,
                              padding: '0.05em 0.5em',
                              fontWeight: 400,
                              fontSize: '0.9rem',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                              backdropFilter: 'blur(0.5px)',
                              WebkitBackdropFilter: 'blur(0.5px)',
                              border: '1.5px solid rgba(255,255,255,0.18)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6
                            }}>
                              <span role="img" aria-label="experience" style={{ fontSize: 14, lineHeight: 1 }}>⚡️</span>
                              {`${(psych.experience_years || 3)}+ yrs Experience`}
                            </span>
                            {/* Designation chip */}
                            {psych.designation && (
                              <span style={{
                                background: 'rgba(255,255,255,0.22)',
                                color: '#fff',
                                borderRadius: 16,
                                padding: '0.05em 0.5em',
                                fontWeight: 400,
                                fontSize: '0.9rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                                backdropFilter: 'blur(0.5px)',
                                WebkitBackdropFilter: 'blur(0.5px)',
                                border: '1.5px solid rgba(255,255,255,0.18)'
                              }}>
                                {psych.designation}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Availability information - below card */}
                      <div className="availability-container" style={{
                        marginTop: 8,
                        marginBottom: 20
                      }}>
                        <div style={{
                          background: 'rgba(255,255,255,0.25)',
                          color: '#000000',
                          borderRadius: 12,
                          padding: '8px 12px',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          boxShadow: '0 1px 4px rgba(63, 46, 115, 0.15)',
                          backdropFilter: 'blur(0.5px)',
                          WebkitBackdropFilter: 'blur(0.5px)',
                          border: '1px solid #ffffff',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          width: '100%',
                          lineHeight: '1.4', // Better line spacing
                          overflow: 'hidden', // Hide overflow if content is too long
                          minHeight: '4.2rem' // Fixed minimum height for 3 lines (Next available: + 2 date lines) to match first card
                        }}>
                          {(() => {
                            const isLoading = loadingAvailability.has(psych.id);
                            const availability = doctorAvailability[psych.id];
                            
                            // Show loading state first
                            if (isLoading) {
                              return 'Loading next availability...';
                            }
                            
                            // Show availability if it exists
                            if (availability && availability.timeSlots && availability.timeSlots.length > 0) {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              
                              // Group slots by date
                              // Handle both old format (strings) and new format (objects with date/time)
                              const slotsByDate = {};
                              availability.timeSlots.forEach(slot => {
                                let slotDate, slotTime;
                                
                                if (typeof slot === 'string') {
                                  // Old format: just a time string, use nextDate
                                  slotDate = availability.nextDate;
                                  slotTime = slot;
                                } else if (slot && slot.date && slot.time) {
                                  // New format: object with date and time
                                  slotDate = slot.date;
                                  slotTime = slot.time;
                                } else {
                                  // Fallback
                                  slotDate = availability.nextDate;
                                  slotTime = slot.time || slot;
                                }
                                
                                if (!slotsByDate[slotDate]) {
                                  slotsByDate[slotDate] = [];
                                }
                                slotsByDate[slotDate].push(slotTime);
                              });
                              
                              // Format and display slots grouped by date
                              const formattedSlots = Object.entries(slotsByDate).map(([dateStr, times]) => {
                                const [year, month, day] = dateStr.split('-');
                                const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                const isToday = dateObj.getTime() === today.getTime();
                                const isTomorrow = dateObj.getTime() === today.getTime() + 86400000;
                                
                                let dateLabel;
                                if (isToday) {
                                  dateLabel = 'Today';
                                } else if (isTomorrow) {
                                  dateLabel = 'Tomorrow';
                                } else {
                                  dateLabel = dateObj.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: dateObj.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
                                  });
                                }
                                
                                return `${dateLabel}: ${times.join(' • ')}`;
                              });
                              
                              return (
                                <>
                                  Next available:
                                  <br />
                                  {formattedSlots.map((slotGroup, index) => (
                                    <React.Fragment key={index}>
                                      {slotGroup}
                                      {index < formattedSlots.length - 1 && <br />}
                                    </React.Fragment>
                                  ))}
                                </>
                              );
                            }
                            
                            // Only show "No availability" if not loading and no slots found
                            return 'No availability';
                          })()}
                        </div>
                        {/* Book Now Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePsychologistClick(psych);
                          }}
                          style={{
                            marginTop: '8px',
                            width: '100%',
                            padding: '8px 16px',
                            backgroundColor: '#3f2e73',
                            color: '#ffffff',
                            border: '2px solid #3f2e73',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(63, 46, 115, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            if (typeof window !== 'undefined' && window.innerWidth > 767) {
                              e.target.style.backgroundColor = '#6b5299';
                              e.target.style.borderColor = '#6b5299';
                            e.target.style.transform = 'translateY(-1px)';
                              e.target.style.boxShadow = '0 4px 8px rgba(107, 82, 153, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (typeof window !== 'undefined' && window.innerWidth > 767) {
                            e.target.style.backgroundColor = '#3f2e73';
                            e.target.style.borderColor = '#3f2e73';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(63, 46, 115, 0.2)';
                            }
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
        <div className="mt-12 md:mt-16 lg:mt-20 pt-4 md:pt-6 lg:pt-8 pb-12 md:pb-16 lg:pb-20" style={{ backgroundColor: '#E4E4F9' }}>
          <HowItWorks />
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
              }
              @media (min-width: 768px) and (max-width: 1180px) {
                .ads-page .videos-showcase-mobile {
                  margin-top: 4.5rem !important;
                  padding-top: 3rem !important;
                }
              }
            `}} />
            <VideosShowcase cmsData={{ 
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
            .reviews-marquee:hover { 
              animation-play-state: paused; 
            }
            @media (max-width: 767px) {
              .reviews-marquee:hover {
                animation-play-state: running !important;
              }
            }
            @keyframes scroll-reviews {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}} />
          <div className="w-full px-4 sm:px-0">
            <div className="text-center" style={{ marginBottom: '20px' }}>
              <h3 className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 mb-8 md:mb-14 px-4" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: 400, marginTop: '0.5rem', marginBottom: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.5' }}>
                Real experiences from families like yours
              </h3>
            </div>

            <div className="relative overflow-hidden" style={{ marginBottom: '0px' }}>
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
                      <div key={idx} className="review-card min-w-[280px] max-w-[320px] rounded-[10px] border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
                        <div className="mb-3">
                          <div className="font-semibold text-gray-900 text-sm md:text-base mb-1">{review.name}</div>
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
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed">{review.text}</p>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pt-8 md:pt-10 lg:pt-12 pb-8 md:pb-10 lg:pb-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
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
