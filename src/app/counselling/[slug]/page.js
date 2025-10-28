import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HowItWorks from '@/components/HowItWorks';
import ConsultationBanner from '@/components/ConsultationBanner';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import InfoCards from '@/components/InfoCards';
import Reviews from '@/components/Reviews';
import VideosShowcase from '@/components/VideosShowcase';
import { publicApi } from '@/lib/backendApi';
// Link replaced with plain anchor to avoid client navigation context during SSR
import HelpFaq from '@/components/HelpFaq';
import CounsellingNotFound from '@/components/CounsellingNotFound';
import ScrollToTop from '@/components/ScrollToTop';
import TherapistCarousel from '@/components/TherapistCarousel';

// Force dynamic rendering and disable caching so edits reflect immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EXCLUDED = new Set([
  'assessments',
  'better-parenting',
  'resources'
]);

// Fallback metadata for when API fails
const FALLBACK_META = {
  'depression': {
    title: 'Depression Counselling - Little Care',
    description: 'Compassionate, evidence-based counselling to support children experiencing depression.'
  },
  'anxiety-sadness': {
    title: 'Anxiety, Sadness or Low mood - Little Care',
    description: 'Professional support for children experiencing anxiety, sadness, or low mood.'
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
    try {
    // Try to fetch from API for dynamic metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/counselling/${slug}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.message) {
        const service = data.message;
        // Only use fields that exist in database
        const title = service.seo_title || service.hero_title || `${slug?.replace(/[-_]/g, ' ')} - Little Care`;
        const description = service.hero_subtext || 'Specialized counselling services for children and families.';
        
        return {
          title,
          description,
          openGraph: {
            title,
            description,
            type: 'website',
            siteName: 'Little Care',
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching metadata (non-critical):', error);
    // Fall through to static metadata
  }
  
  // Fallback to static metadata if API fails
  const meta = FALLBACK_META[slug] || {
    title: `${slug?.replace(/[-_]/g, ' ') || 'Counselling'} - Little Care`,
    description: 'Specialized counselling services for children and families.'
  };
  return meta;
}

async function fetchCounsellingService(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/counselling/${slug}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return data.message;
      }
    }
  } catch (error) {
    console.error('Error fetching counselling service:', error);
  }
  
  return null;
}

export default async function CounsellingDynamicPage({ params }) {
  const { slug } = await params;

  // Guard for excluded roots if accessed directly
  if (EXCLUDED.has(slug)) {
    return (
      <div className="px-6 py-16 text-center">
        <h3 className="text-2xl font-medium">Section coming soon</h3>
        <p className="mt-2 text-gray-600">Please choose a specific counselling topic from the menu.</p>
      </div>
    );
  }

  // Try to fetch from CMS
  const serviceData = await fetchCounsellingService(slug);
  
  if (!serviceData) {
    return <CounsellingNotFound slug={slug} />;
  }

  // Fetch therapists (6 cards)
  const therapistsData = await publicApi.getPsychologists().catch(() => ({ data: { psychologists: [] } }));
  const therapists = therapistsData?.data?.psychologists?.slice(0, 6) || [];

  // Render with CMS data - with safe fallbacks
  return (
    <div>
      <ScrollToTop />
      <HeroSection 
        therapyType={slug} 
        cmsData={{
          title: serviceData.hero_title || 'Counselling',
          subtext: serviceData.hero_subtext || '',
          ctaText: serviceData.hero_cta_text || '',
          imageUrl: serviceData.hero_image_url || ''
        }}
      />
      <LogosStrip bgColor="bg-[#15171A]" height="py-4" logosCount={6} />
      {/* Therapist grid under hero */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-8 md:mt-12">
        <div className="px-4 sm:px-6 mb-8 md:mb-10 text-center">
          <p className="text-center md:text-center mt-2 text-sm md:text-base">How it works</p>
          <div className="mt-3 text-center md:text-center px-4">
            <h3 className="how-it-works-heading text-center text-base md:text-xl lg:text-2xl" style={{ fontWeight: 500 }}>
              Your journey to a happier, calmer home begins here.
            </h3>
          </div>
        </div>
        <TherapistCarousel therapists={therapists} />

        {/* Desktop/tablet grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-6 justify-items-stretch" style={{ columnGap: '2rem' }}>
          {therapists.map((doc, idx) => {
            const imageSrc = doc.cover_image_url || doc.profile_picture_url || '/hero.png';
            const name = doc.name || doc.first_name || 'Therapist';
            return (
              <a key={idx} href={`/therapist-profile?doctor=${idx}`} className="block">
                <div className="guide-video-card h-[360px] w-full rounded-[10px] overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer relative">
                  <img src={imageSrc} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                  <div style={{ position: 'absolute', left: 18, bottom: 18, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 6, width: '85%' }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>{name}</div>
                    {doc.experience_years && (
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', textShadow: '0 2px 8px rgba(0,0,0,0.25)', opacity: 0.95 }}>{doc.experience_years} years experience</div>
                    )}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                      {(doc.area_of_expertise && Array.isArray(doc.area_of_expertise) && doc.area_of_expertise.length > 0 ? doc.area_of_expertise.slice(0, 2) : ['Child Therapy']).map((exp, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', borderRadius: 16, padding: '0.32em 1.1em', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.18)' }}>{exp}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      {/* Desktop-only View More under grid */}
      <div className="hidden md:block text-center mt-6">
        <a href="/guide" className="inline-flex items-center justify-center text-gray-900 text-lg group">
          <span className="relative cursor-pointer">
            View more →
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gray-900 transition-all duration-300 ease-out group-hover:w-full" />
          </span>
        </a>
      </div>
      <div className="mt-12 md:mt-16">
        <HowItWorks />
      </div>
      <BenefitsSection 
        therapyType={slug} 
        cmsData={{
          title: serviceData.benefits_title,
          benefits: serviceData.benefits || [],
          benefitsImageUrl: serviceData.benefits_image_url || ''
        }}
        fluid
        compactSpacing
      />
      <div className="mt-2 md:mt-4">
        <ConsultationBanner />
      </div>
      <div className="mt-24 md:mt-28">
        <TherapyTypesSplit 
          therapyType={slug} 
          cmsData={{
            title: serviceData.types_title,
            types: serviceData.types || [],
            rightImageUrl: serviceData.right_image_url || '',
            buttonText: 'Get started'
          }}
        />
      </div>
      {/* Videos showcase above InfoCards */}
      <div className="mt-16 md:mt-20">
        <VideosShowcase cmsData={{ videos: serviceData.videos }} />
      </div>
      {/* Info Cards under Types of Therapy */}
      <div className="-mt-8 md:-mt-12">
        <div className="mx-auto w-full max-w-[22rem] sm:max-w-[28rem] md:max-w-none px-4 sm:px-6 md:px-0">
          <InfoCards cmsData={{ items: serviceData.info_cards }} hideIcons />
        </div>
      </div>
      {/* Reviews */}
      <div className="mt-16 md:-mt-12">
        <Reviews cmsData={{ reviews: serviceData.reviews }} />
      </div>
      <div className="mt-12 md:mt-16">
        <HelpFaq 
          cmsData={{
            faqs: serviceData.faqs || []
          }}
        />
      </div>
    </div>
  );
}
