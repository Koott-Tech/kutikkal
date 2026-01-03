'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/backendApi';
import { normalizeImageUrl } from '@/utils/urlNormalizer';
import HowItWorks from '@/components/HowItWorks';

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
        url: 'https://www.little.care/hero.png',
        width: 1200,
        height: 630,
        alt: 'Little Care - Child Psychology Services and Online Counseling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Child Psychology Services & Online Counseling | Little Care',
    description: 'Discover professional child psychology services and online counseling for children and families. Expert child psychologists help with anxiety, behavior, ADHD, and emotional support.',
    images: ['https://www.little.care/hero.png'],
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
  image: 'https://www.little.care/hero.png',
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

// Services Data
const SERVICES = [
  {
    id: 1,
    tags: ['Counseling', 'Emotions'],
    title: 'Child\nCounseling',
    description: 'A safe space for your kids to express & grow.',
    image: '/letusguide1.webp',
    gradient: 'from-[#DEEFDC] to-white',
    infoTitle: 'Connect with Licensed Child Psychologists Online',
    infoDescription: 'With online child counseling, parents can connect with a caring child psychologist who helps children talk through their feelings, handle anxiety or behaviour concerns, and develop healthy coping skills—right from home.',
  },
  {
    id: 2,
    tags: ['Assessments', 'Tests'],
    title: 'Child\nAssessment',
    description: "Find your child's needs & strengths to grow.",
    image: '/boy1.png',
    gradient: 'from-[#f1e7f9] to-white',
    infoTitle: 'Understand Your Child\'s Needs with Assessments',
    infoDescription: "With child counseling online, families gain a clearer understanding of their child's strengths and challenges, including attention, learning, or emotional concerns, making it easier to choose the right next steps.",
  },
  {
    id: 3,
    tags: ['Parents', 'Workshops'],
    title: 'Better\nParenting',
    description: 'Learn, Connect & Build a wonderful home.',
    image: '/fam1.png',
    gradient: 'from-[#fff4e2] to-white',
    infoTitle: 'Learn Practical Parenting Strategies Online',
    infoDescription: 'With online parenting counseling, parents receive thoughtful guidance to manage behaviour, improve communication, and support their child\'s emotional growth with confidence, clarity, and consistency.',
  },
];

export default function AdsLandingPage() {
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);

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
            font-size: 1.75rem !important;
            line-height: 1.3 !important;
          }
          .ads-page h2 {
            font-size: 1.5rem !important;
            line-height: 1.4 !important;
          }
          .ads-page h3 {
            font-size: 1.125rem !important;
            line-height: 1.5 !important;
          }
          @media (min-width: 640px) {
            .ads-page h1 {
              font-size: 2rem !important;
            }
            .ads-page h2 {
              font-size: 1.75rem !important;
            }
            .ads-page h3 {
              font-size: 1.25rem !important;
            }
          }
          @media (min-width: 768px) {
            .ads-page h1 {
              font-size: 2.5rem !important;
            }
            .ads-page h2 {
              font-size: 2rem !important;
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
        <section className="py-20 sm:py-16 md:py-20 lg:py-28" style={{ background: 'linear-gradient(to bottom, #f5f1ff, #eae4ff, #e8e0f5)' }}>
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
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
                Trusted by Families Across India
              </h2>
              <p className="text-sm sm:text-base text-gray-700 max-w-3xl mx-auto px-4">
                Little Care is the sister brand of <a href="https://www.koott.in/" target="_blank" rel="noopener noreferrer" className="text-[#3f2e73] font-semibold hover:underline">Koott - Online Malayali Counselling</a>, 
                bringing the same commitment to quality mental health care to children and families nationwide. 
                Together, we're redefining care and hope for a better tomorrow.
              </p>
            </div>
          </div>
        </section>

        {/* Psychologists Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-2 md:px-3 lg:px-3">
            <div className="text-center mb-6 md:mb-8 px-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Experienced mental health professionals for you.
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
                        imageSrc = '/hero.png';
                      } else if (nameLower.includes('child') || nameLower.includes('teen') || nameLower.includes('liana')) {
                        imageSrc = '/kids.png';
                      } else {
                        imageSrc = '/hero.png';
                      }
                    }
                    
                    return (
                      <div key={psych.id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
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
                    </div>
                    );
                  })}
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
              Our Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {SERVICES.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-lg py-6 md:py-8 lg:py-10 px-4 sm:px-5 md:px-6 transition-shadow flex flex-col" style={{ background: 'linear-gradient(to bottom, #fefbff, #faf7ff, #f7f4fa)' }}>
                  <h3 className="service-card-heading text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                    {service.infoTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-0 flex-grow" style={{ lineHeight: '1.4' }}>
                    {service.infoDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Reviews Section */}
        <section className="w-screen py-12 md:py-16 lg:py-20 bg-white mt-6 md:mt-8 lg:mt-12">
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
        <section className="py-12 md:py-16 lg:py-20 bg-white">
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
                      className="flex w-full items-center justify-between py-3 md:py-4 text-left hover:bg-white transition-colors px-2 md:px-0 cursor-pointer"
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
