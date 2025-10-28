import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
// Removed ProcessSteps per request; replaced with homepage HowItWorks
import HowItWorks from '@/components/HowItWorks';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import InfoCards from '@/components/InfoCards';
import Reviews from '@/components/Reviews';
import VideosShowcase from '@/components/VideosShowcase';
import Testimonials from '@/components/Testimonials';
import ConsultationBanner from '@/components/ConsultationBanner';
import HelpFaq from '@/components/HelpFaq';
import TherapistCarousel from '@/components/TherapistCarousel';
import AssessmentDemoCTA from '@/components/AssessmentDemoCTA';
import { publicApi } from '@/lib/backendApi';

export default async function AssessmentCmsRenderer({ slug }) {
  async function fetchAssessment() {
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
      const res = await fetch(`${base}/assessments/${slug}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.success) return data.message;
      }
    } catch (_) {}
    return null;
  }

  const cms = await fetchAssessment();
  // Fetch therapists (6 cards) for consistent doctor cards under hero
  const therapistsData = await publicApi.getPsychologists().catch(() => ({ data: { psychologists: [] } }));
  const therapists = therapistsData?.data?.psychologists?.slice(0, 6) || [];

  return (
    <div>
      <HeroSection 
        therapyType={slug}
        cmsData={{
          title: cms?.hero_title || undefined,
          subtext: cms?.hero_subtext || undefined,
          ctaText: cms?.hero_cta_text || undefined,
          imageUrl: cms?.hero_image_url || undefined,
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
                  {/* Image fill */}
                  <img
                    src={imageSrc}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Gradient Overlay */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                  {/* Text block at bottom */}
                  <div style={{ position: 'absolute', left: 18, bottom: 18, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 6, width: '85%' }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>{name}</div>
                    {doc.experience_years && (
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', textShadow: '0 2px 8px rgba(0,0,0,0.25)', opacity: 0.95 }}>{doc.experience_years} years experience</div>
                    )}
                    {/* Expertise bubbles */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                      {(doc.area_of_expertise && Array.isArray(doc.area_of_expertise) && doc.area_of_expertise.length > 0
                        ? doc.area_of_expertise.slice(0, 2)
                        : ['Child Therapy']
                      ).map((exp, i) => (
                        <span key={i} style={{
                          background: 'rgba(255,255,255,0.22)',
                          color: '#fff',
                          borderRadius: 16,
                          padding: '0.32em 1.1em',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1.5px solid rgba(255,255,255,0.18)'
                        }}>{exp}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      {/* How it works should appear under the logos strip */}
      <div className="mt-12 md:mt-16">
        <HowItWorks />
      </div>
      <BenefitsSection 
        therapyType={slug}
        cmsData={{
          title: cms?.benefits_title,
          benefits: cms?.benefits || [],
          benefitsImageUrl: cms?.benefits_image_url || undefined,
        }}
      />
      <div className="mb-0">
        <ConsultationBanner />
      </div>
      <TherapyTypesSplit 
        therapyType={slug}
        cmsData={{
          types: cms?.types || [],
          rightImageUrl: cms?.right_image_url || undefined,
          buttonText: 'Get started',
        }}
      />
      <VideosShowcase cmsData={{ videos: cms?.videos }} />
      <div className="mt-12 md:mt-16">
        <div className="mx-auto w-full max-w-[22rem] sm:max-w-[28rem] md:max-w-none px-4 sm:px-6 md:px-0">
          <InfoCards cmsData={{ items: cms?.info_cards }} hideIcons />
        </div>
      </div>
      <div className="mt-16 md:mt-24">
        <Reviews cmsData={{ reviews: cms?.reviews }} />
      </div>
      {/* Testimonials removed for CMS pages as requested */}
      <div className="mt-12 md:mt-16">
        <HelpFaq cmsData={{ faqs: cms?.faqs || [] }} />
      </div>
      <div className="mt-24">
        <AssessmentDemoCTA />
      </div>
    </div>
  );
}


