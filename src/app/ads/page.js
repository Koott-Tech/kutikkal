'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/backendApi';
import { normalizeImageUrl } from '@/utils/urlNormalizer';
import HowItWorks from '@/components/HowItWorks';
import ChooseOptions from '@/components/ChooseOptions';
import VideosShowcase from '@/components/VideosShowcase';

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

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
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
        {/* Achievements Section */}
        <section className="pt-40 sm:pt-32 md:pt-36 lg:pt-44 pb-20 sm:pb-24 md:pb-28 lg:pb-32" style={{ background: 'linear-gradient(to bottom, #f5f1ff, #eae4ff, #e8e0f5)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-6 md:mb-8">
              <img
                src="/mainlogo.webp"
                alt="Little Care Logo"
                width={300}
                height={99}
                className="mx-auto mb-6 md:mb-8"
                style={{ width: 'clamp(120px, 50vw, 200px)', height: 'auto', objectFit: 'contain' }}
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
                Trusted by Families Across India for Quality Care
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-5xl mx-auto px-4" style={{ lineHeight: '1.4' }}>
                Little Care is the sister brand of <a href="https://www.koott.in/" target="_blank" rel="noopener noreferrer" className="text-[#3f2e73] font-semibold md:hover:underline">Koott - Online Malayali Counselling</a>, bringing the same commitment to quality mental health care to children and families nationwide. Together, we're redefining care and hope for a better tomorrow.
              </p>
            </div>
          </div>
        </section>

        {/* Free Consultation Banner */}
        <div className="section-mobile mt-0 pt-28 md:pt-24 lg:pt-28">
          <div className="mx-auto max-w-[400px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] px-3 sm:px-6 md:px-6 lg:px-0">
            <div className="rounded-[10px] overflow-hidden inline-block w-full" style={{ borderRadius: "10px", overflow: "hidden", display: "block" }}>
              <div className="overflow-hidden relative rounded-[10px] main-container min-h-[280px] md:min-h-[200px]" style={{ borderRadius: "10px", minHeight: "200px" }}>
                <div className="absolute top-0 left-0 right-0 bg-cover bg-center bg-no-repeat rounded-[10px]" style={{ backgroundImage: "url('/consultationbanner.png')", zIndex: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '10px', height: '180px', maxHeight: '180px', width: '100%' }}></div>
                <style dangerouslySetInnerHTML={{__html: `
                  .main-container {
                    border-radius: 10px;
                    overflow: hidden;
                  }
                  .main-container > div[class*="absolute"][class*="bg-cover"] {
                    height: 180px !important;
                    max-height: 180px !important;
                  }
                  @media (min-width: 768px) {
                    .main-container > div[class*="absolute"][class*="bg-cover"] {
                      height: 200px !important;
                      max-height: 200px !important;
                    }
                  }
                  .mobile-container {
                    border-radius: 10px;
                    overflow: hidden;
                  }
                  @media (min-width: 768px) and (max-width: 1180px) and (max-height: 1180px) {
                    .main-container {
                      min-height: 180px;
                    }
                    .mobile-text {
                      padding-top: 0 !important;
                    }
                    .mobile-text h4 {
                      font-size: 18px;
                      line-height: 1.35;
                      margin-top: -12px !important;
                      padding-top: 0 !important;
                      margin-bottom: 4px !important;
                    }
                    .mobile-text p {
                      font-size: 13px;
                      line-height: 1.45;
                      margin-top: 0px !important;
                      margin-bottom: 20px !important;
                    }
                    .mobile-text .flex.items-center.gap-1 {
                      margin-top: 16px !important;
                    }
                    .mobile-text button {
                      font-size: 12px;
                      padding: 8px 16px;
                    }
                    .mobile-image {
                      overflow: visible !important;
                    }
                    .desktop-image-container {
                      display: flex !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    .desktop-image {
                      overflow: visible !important;
                      width: 130px !important;
                      height: 180px !important;
                      display: block !important;
                      visibility: visible !important;
                    }
                    .desktop-image img {
                      object-fit: contain !important;
                      object-position: center !important;
                      width: 100% !important;
                      height: 100% !important;
                      display: block !important;
                      visibility: visible !important;
                    }
                  }
                  @media (max-width: 767px) {
                    .section-mobile > div,
                    .section-mobile > div > div {
                      margin-top: 0;
                      margin-bottom: 0;
                      padding-top: 0;
                      padding-bottom: 0;
                    }
                    .main-container {
                      position: relative;
                      overflow: hidden;
                    }
                    .main-container > div[class*="absolute"] {
                      z-index: 0;
                      background-size: cover;
                      background-position: center;
                      background-repeat: no-repeat;
                      width: 100%;
                      height: 180px;
                      max-height: 180px;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      border-radius: 10px !important;
                    }
                    .mobile-container {
                      padding: 8px;
                      min-height: 180px;
                      gap: 0px;
                    }
                    .mobile-container[style] {
                      gap: 0px;
                    }
                    .grid {
                      gap: 0px;
                    }
                    .grid.grid-cols-2 {
                      gap: 0px;
                    }
                    div[class*="grid"] {
                      gap: 0px;
                    }
                    .no-gap {
                      gap: 0px;
                      column-gap: 0px;
                      row-gap: 0px;
                    }
                    .mobile-container > div:last-child {
                      min-height: 180px;
                      height: 180px;
                    }
                    .mobile-text {
                      padding: 0px 4px 0px 4px !important;
                      padding-top: 0px !important;
                      max-width: 280px;
                    }
                    div[class*="p-4"].mobile-text {
                      padding: 0px 4px 0px 4px !important;
                      padding-top: 0px !important;
                      max-width: 280px;
                    }
                    .mobile-text h4 {
                      font-size: 16px;
                      line-height: 1.3;
                      margin-bottom: 4px !important;
                      margin-top: -12px !important;
                      text-align: left;
                    }
                    .mobile-text p.text-xs {
                      font-size: 12px !important;
                      line-height: 1.2 !important;
                      margin-bottom: 8px;
                      margin-top: 0px !important;
                      text-align: left;
                    }
                    .mobile-text p {
                      font-size: 9px !important;
                      line-height: 1.2 !important;
                      margin-bottom: 8px;
                      margin-top: 0px !important;
                      text-align: left;
                    }
                    .mobile-text button {
                      font-size: 11px !important;
                      padding: 7px 14px !important;
                      margin-left: 0;
                    }
                    .mobile-text .flex.items-center.gap-1 {
                      margin-top: 24px !important;
                    }
                    .main-container {
                      min-height: 180px;
                      height: 180px;
                      max-height: 180px;
                      padding: 0;
                      margin-top: 0;
                      margin-bottom: 0;
                    }
                    .section-mobile {
                      padding-top: 7rem !important;
                      padding-left: 0;
                      padding-right: 0;
                      padding-bottom: 0;
                    }
                    .section-mobile > div {
                      padding-top: 0;
                      padding-bottom: 0;
                      margin-top: 0;
                      margin-bottom: 0;
                    }
                    .mobile-image {
                      justify-content: center;
                      margin: 0;
                      padding: 0;
                    }
                    .mobile-image > div {
                      margin: 0;
                      margin-top: -80px !important;
                      padding: 0 !important;
                      width: 70px;
                      height: 100px;
                    }
                    .mobile-image > div img {
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                    .flex.items-center.gap-1 {
                      gap: 0px;
                      margin-bottom: 0;
                      padding-bottom: 0;
                    }
                    .mobile-text > div:last-child {
                      margin-bottom: 0;
                      padding-bottom: 0;
                    }
                  }
                  @media (min-width: 768px) {
                    .main-container {
                      min-height: 200px;
                    }
                    .mobile-container {
                      min-height: 200px;
                      gap: 0px;
                      align-items: center;
                    }
                    .desktop-banner {
                      gap: 0px;
                    }
                    .section-mobile {
                      margin-top: 0;
                      margin-bottom: 0;
                    }
                    .mobile-text {
                      padding: 0px 8px 16px 8px !important;
                      padding-top: 0 !important;
                      max-width: none;
                    }
                    .mobile-text h4 {
                      margin-top: -12px !important;
                      padding-top: 0 !important;
                      margin-bottom: 4px !important;
                    }
                    .mobile-text p {
                      margin-top: 0px !important;
                    }
                    .mobile-text .flex.items-center.gap-1 {
                      margin-top: 16px !important;
                    }
                    .mobile-image {
                      align-items: center;
                      justify-content: flex-end;
                      padding-right: 40px;
                    }
                    .mobile-image > div {
                      top: 40%;
                      transform: translateY(-50%);
                    }
                    div[class*="w-24"] {
                      top: 40%;
                      transform: translateY(-50%);
                    }
                    div[class*="w-32"] {
                      top: 40%;
                      transform: translateY(-50%);
                    }
                    .desktop-image-container {
                      display: flex !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    .desktop-image {
                      position: relative;
                      top: 40%;
                      transform: translateY(-50%);
                      padding: 0;
                      margin: 0;
                      display: block !important;
                      visibility: visible !important;
                    }
                    .desktop-image img {
                      padding: 0;
                      margin: 0;
                      display: block !important;
                      visibility: visible !important;
                    }
                  }
                `}}></style>
                <div className="grid grid-cols-1 md:grid-cols-[8fr_2fr] items-center min-h-[280px] md:min-h-[240px] mobile-container no-gap rounded-[10px] overflow-hidden relative z-10 desktop-banner">
                  {/* Left: Text and Button */}
                  <div className="px-4 pb-4 pt-0 md:px-6 md:pb-6 md:pt-0 md:pl-14 lg:pl-6 md:ml-6 lg:ml-8 col-span-1 flex flex-col justify-center mobile-text" style={{ maxWidth: 'none', paddingTop: 0 }}>
                    <h4 className="text-left font-semibold text-lg md:text-xl" style={{ marginTop: '-12px', paddingTop: 0, marginBottom: '4px' }}>
                      Confused where to start?
                    </h4>
                    
                    <p className="text-xs md:text-base mb-4 md:mb-8 text-left" style={{ marginBottom: '8px', marginTop: '0px' }}>
                      Book a free 20 minutes  session<br className="md:hidden" /> with our child psychologist.
                    </p>
                    
                    <div className="flex items-center gap-1" style={{ marginTop: '16px' }}>
                      <button 
                        onClick={() => router.push('/free-assessment')}
                        className="text-gray-900 px-4 py-2 md:px-3 md:py-2 rounded-lg md:rounded-2xl text-xs md:text-sm font-medium transition-all duration-200 hover:opacity-90 flex items-center gap-2 md:gap-2 w-fit mx-auto md:mx-0" 
                        style={{ backgroundColor: 'white' }}
                      >
                        <span>Book Your Slot Now</span>
                        <div className="w-4 h-4 md:w-7 md:h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#bed39c' }}>
                          <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                      
                      {/* Image next to button */}
                      <div className="mobile-image md:hidden">
                        <div className="w-[70px] h-[100px] rounded-[10px] overflow-hidden" style={{ padding: 0, margin: 0 }}>
                          <img
                            src="/consultation.png"
                            alt="Consultation"
                            className="w-full h-full object-cover"
                            style={{ padding: 0, margin: 0 }}
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Image - Desktop and Tablet */}
                  <div className="relative h-full col-span-1 hidden md:flex justify-center items-center p-8 desktop-image-container">
                    <div className="desktop-image overflow-hidden" style={{ width: '112px', height: '160px', borderRadius: '10px', padding: 0, margin: 0 }}>
                      <img
                        src="/consultation.png"
                        alt="Consultation"
                        width={112}
                        height={160}
                        className="object-cover"
                        style={{ borderRadius: '10px', width: '100%', height: '100%', padding: 0, margin: 0 }}
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="pt-0 pb-0 bg-white">
          <ChooseOptions />
        </section>

        {/* Psychologists Section */}
        <section className="pt-12 md:pt-16 lg:pt-20 pb-0 bg-white">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-2 md:px-3 lg:px-3">
            <div className="text-center mb-6 md:mb-8 px-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Experienced mental health professionals for you.
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2 md:mt-3 max-w-2xl mx-auto">
                Connect with qualified child psychologists who understand your child's unique needs
              </p>
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
                          overflow: 'hidden' // Hide overflow if content is too long
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
        <div className="pt-12 md:pt-16 lg:pt-20">
          <HowItWorks />
        </div>

        {/* Videos Showcase Section */}
        {!videosLoading && videos.length > 0 && (
          <div className="pt-12 md:pt-16 lg:pt-0">
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
        <section className="w-screen pt-12 md:pt-16 lg:pt-20 pb-0 bg-white">
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
        <section className="pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
              Frequently Asked Questions
            </h2>
            <style dangerouslySetInnerHTML={{__html: `
              @media (max-width: 767px) {
                .faq-heading {
                  font-size: 16px !important;
                  font-weight: 600;
                  line-height: 1.4;
                }
                .faq-answer {
                  font-size: 14px !important;
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
                        <p className="faq-answer md:text-sm leading-relaxed">
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
