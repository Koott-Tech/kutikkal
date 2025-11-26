import BlogTeaser from '@/components/BlogTeaser';
import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HelpFaq from '@/components/HelpFaq';
import ScrollToTop from '@/components/ScrollToTop';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import HowItWorks from '@/components/HowItWorks';
import InfoCards from '@/components/InfoCards';
import VideosShowcase from '@/components/VideosShowcase';
import Reviews from '@/components/Reviews';
import TherapistCarousel from '@/components/TherapistCarousel';

const removeAssessmentSpecialist = (docs = []) => {
  const filtered = docs.filter(doc => (doc?.name || doc?.first_name || '').toLowerCase() !== 'assessment specialist');
  return filtered.length > 0 ? filtered : docs;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchBetterParentingPage(slug, { preview = false } = {}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const previewSuffix = preview ? '?preview=1' : '';
    const response = await fetch(`${baseUrl}/api/better-parenting/${slug}${previewSuffix}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (response.ok) {
      const json = await response.json();
      if (json?.success) {
        const payload = json.data ?? json.message ?? json.page ?? json.result ?? json;
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          if (payload.page && typeof payload.page === 'object' && !Array.isArray(payload.page)) {
            return payload.page;
          }
          return payload;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching better parenting page:', error);
  }

  return null;
}

async function fetchPublicTherapists(limit = 6) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${baseUrl}/api/public/psychologists`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (response.ok) {
      const json = await response.json();
      const psychologists = json?.data?.psychologists || json?.message?.psychologists || json?.psychologists || [];
      if (Array.isArray(psychologists)) {
        const sanitized = removeAssessmentSpecialist(psychologists);
        return sanitized.slice(0, limit);
      }
    }
  } catch (error) {
    console.error('Error fetching public psychologists:', error);
  }

  return [];
}

export default async function BetterParentingDynamicPage({ params, searchParams }) {
  const { slug } = await params;
  const isPreview = searchParams?.preview === '1' || searchParams?.preview === 'true';
  const data = await fetchBetterParentingPage(slug, { preview: isPreview });

  if (!data) {
    return (
      <div className="px-6 py-16 text-center">
        <h3 className="text-2xl font-medium">Program coming soon</h3>
        <p className="mt-2 text-gray-600">We couldn't load this Better Parenting page right now. Please try another topic or check back shortly.</p>
      </div>
    );
  }

  const therapists = await fetchPublicTherapists(6);
  const displayTherapists = removeAssessmentSpecialist(therapists);

  const title = data?.hero_title || (slug ? slug.replace(/[-_]/g, ' ') : 'Better Parenting');
  const subtext = data?.hero_subtext || '';
  const imageUrl = data?.hero_image_url || '';
  const heroFeatures = [data?.hero_point_1, data?.hero_point_2, data?.hero_point_3].filter(Boolean);
  const therapistsHeading = data?.therapists_heading || 'Your journey to a happier, calmer home begins here.';

  return (
    <div>
      <ScrollToTop />
      <HeroSection 
        therapyType={slug}
        cmsData={{
          title,
          subtext,
          ctaText: data?.hero_cta_text || '',
          imageUrl,
          features: heroFeatures
        }}
      />
      <LogosStrip bgColor="bg-[#15171A]" height="py-4" logosCount={6} swapSecondThird />
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .therapist-heading-mobile {
            font-size: 30px !important;
            line-height: 0.95 !important;
          }
        }
      `}} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-8 md:mt-12">
        <div className="px-4 sm:px-6 mb-4 md:mb-6 text-center">
          <div className="mt-3 text-center px-4">
            <h3 className="how-it-works-heading therapist-heading-mobile text-center text-2xl md:text-xl lg:text-2xl" style={{ fontWeight: 500 }}>
              {therapistsHeading}
            </h3>
          </div>
        </div>
        <TherapistCarousel therapists={displayTherapists} />

        {/* Desktop/tablet grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-6 justify-items-stretch mt-8" style={{ columnGap: '2rem' }}>
          {displayTherapists.map((doc, idx) => {
            const imageSrc = doc.cover_image_url || doc.profile_picture_url || '/hero.png';
            const name = doc.name || doc.first_name || 'Therapist';
            return (
              <a key={idx} href={`/therapist-profile?doctor=${idx}`} className="block">
                <div className="guide-video-card h-[360px] w-full rounded-[10px] overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer relative">
                  <img src={imageSrc} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '55%',
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)'
                    }}
                  />
                  <div style={{ position: 'absolute', left: 18, bottom: 18, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 6, width: '85%' }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>{name}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                      {(doc.area_of_expertise && Array.isArray(doc.area_of_expertise) && doc.area_of_expertise.length > 0 ? doc.area_of_expertise.slice(0, 2) : ['Child Therapy']).map((exp, i) => (
                        <span
                          key={i}
                          style={{
                            background: 'rgba(255,255,255,0.22)',
                            color: '#fff',
                            borderRadius: 16,
                            padding: '0.18em 0.5em',
                            fontWeight: 400,
                            fontSize: '0.9rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                            backdropFilter: 'blur(0.5px)',
                            WebkitBackdropFilter: 'blur(0.5px)',
                            border: '1.5px solid rgba(255,255,255,0.18)'
                          }}
                        >
                          {exp}
                        </span>
                      ))}
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.22)',
                          color: '#fff',
                          borderRadius: 16,
                          padding: '0.18em 0.5em',
                          fontWeight: 400,
                          fontSize: '0.9rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          backdropFilter: 'blur(0.5px)',
                          WebkitBackdropFilter: 'blur(0.5px)',
                          border: '1.5px solid rgba(255,255,255,0.18)'
                        }}
                      >
                        {doc.price ? `₹${doc.price}` : doc.individual_session_price ? `₹${doc.individual_session_price}` : '₹—'}
                      </span>
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.22)',
                          color: '#fff',
                          borderRadius: 16,
                          padding: '0.18em 0.5em',
                          fontWeight: 400,
                          fontSize: '0.9rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          backdropFilter: 'blur(0.5px)',
                          WebkitBackdropFilter: 'blur(0.5px)',
                          border: '1.5px solid rgba(255,255,255,0.18)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <span role="img" aria-label="experience" style={{ fontSize: 14, lineHeight: 1 }}>⚡️</span>
                        {`${(doc.experience_years || 3)}+ yrs Experience`}
                      </span>
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.22)',
                          color: '#fff',
                          borderRadius: 16,
                          padding: '0.18em 0.5em',
                          fontWeight: 400,
                          fontSize: '0.9rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          backdropFilter: 'blur(0.5px)',
                          WebkitBackdropFilter: 'blur(0.5px)',
                          border: '1.5px solid rgba(255,255,255,0.18)'
                        }}
                      >
                        📚 Consultant Psychologist
                      </span>
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
        <a href="/psychologists" className="inline-flex items-center justify-center text-gray-900 text-lg group">
          <span className="relative cursor-pointer">
            View more →
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gray-900 transition-all duration-300 ease-out group-hover:w-full" />
          </span>
        </a>
      </div>

      <div className="mt-12 md:mt-16">
        <HowItWorks />
      </div>
      <div className="mt-16 md:mt-20">
        <BenefitsSection cmsData={{ title: data?.benefits_title || 'Why this program?', benefits: data?.benefits || [], benefitsImageUrl: data?.benefits_image_url || '' }} />
      </div>
      <div className="mt-0">
        <TherapyTypesSplit cmsData={{ title: data?.types_title || 'What we offer', types: data?.types || [], rightImageUrl: data?.right_image_url || '' }} />
      </div>
      {/* Videos showcase */}
      <div className="mt-4 md:-mt-24">
        <VideosShowcase cmsData={{ 
          videos: (data?.videos || []).map(video => ({
            src: video.url || video.src,
            poster: video.thumbnailUrl || video.poster,
            title: video.title,
            position: video.position
          })),
          videosHeading: data?.videos_heading,
          videosSubheading: data?.videos_subheading,
          featuredIndex: data?.videos_featured_index
        }} />
      </div>
      {(data?.info_cards && data.info_cards.length > 0) && (
        <div className="-mt-8 md:-mt-24">
          <InfoCards cmsData={{ items: data.info_cards }} isCmsPage={true} />
        </div>
      )}
      {/* Reviews */}
      <div className="mt-8 md:-mt-24">
        <Reviews cmsData={{ reviews: data?.reviews || [], title: data?.reviews_heading }} />
      </div>
      {(data?.blog_teaser_enabled !== false) && (
        <div className="mt-12 md:mt-16">
          <BlogTeaser />
        </div>
      )}
      <div className="mt-12 md:mt-16 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <HelpFaq cmsData={{ faqs: data?.faqs || [], context: 'better-parenting' }} />
        </div>
      </div>
    </div>
  );
}


