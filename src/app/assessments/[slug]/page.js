import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HelpFaq from '@/components/HelpFaq';
import ScrollToTop from '@/components/ScrollToTop';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import TherapistCarousel from '@/components/TherapistCarousel';
import InfoCards from '@/components/InfoCards';
import Reviews from '@/components/Reviews';
import VideosShowcase from '@/components/VideosShowcase';
import { publicApi } from '@/lib/backendApi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchAssessment(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/assessments/${slug}`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) return data.message;
    }
  } catch (e) {
    // non-blocking
  }
  return null;
}

export default async function AssessmentDynamicPage({ params }) {
  const { slug } = await params;
  const data = await fetchAssessment(slug);

  // Fetch therapists (6 cards)
  const therapistsData = await publicApi.getPsychologists().catch(() => ({ data: { psychologists: [] } }));
  const therapists = therapistsData?.data?.psychologists?.slice(0, 6) || [];

  const title = data?.hero_title || (slug ? slug.replace(/[-_]/g, ' ') : 'Assessment');
  const subtext = data?.hero_subtext || 'Professional assessment to better understand needs and strengths.';
  const imageUrl = data?.hero_image_url || '';

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
          features: [data?.hero_point_1, data?.hero_point_2, data?.hero_point_3].filter(Boolean),
        }}
      />
      <LogosStrip bgColor="bg-[#15171A]" height="py-4" logosCount={6} swapSecondThird />
      {/* Therapist grid under hero */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-8 md:mt-12">
        <div className="px-4 sm:px-6 mb-8 md:mb-10 text-center">
          <div className="mt-3 text-center md:text-center px-4">
            <h3 className="how-it-works-heading text-center text-base md:text-xl lg:text-2xl" style={{ fontWeight: 500 }}>
              {data?.therapists_heading || 'Your journey to a happier, calmer home begins here.'}
            </h3>
          </div>
        </div>
        <TherapistCarousel therapists={therapists} />
      </div>
      {/* Benefits (render with safe defaults like counselling) */}
      <div className="mt-8">
        <BenefitsSection 
          cmsData={{ 
            title: data?.benefits_title || 'Why this assessment?', 
            benefits: data?.benefits || [],
            benefitsImageUrl: data?.benefits_image_url || ''
          }} 
        />
      </div>
      {/* Types (render with safe defaults like counselling) */}
      <div className="mt-8">
        <TherapyTypesSplit 
          cmsData={{ 
            title: data?.types_title || 'What we evaluate', 
            types: data?.types || [],
            rightImageUrl: data?.right_image_url || ''
          }} 
        />
      </div>
      {/* Videos showcase */}
      <div className="mt-8">
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
      {/* Info Cards */}
      {(data?.info_cards && data.info_cards.length > 0) && (
        <div className="mt-8">
          <InfoCards cmsData={{ items: data.info_cards }} />
        </div>
      )}
      {/* Reviews */}
      <div className="mt-8">
        <Reviews cmsData={{ reviews: data?.reviews || [] }} />
      </div>
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <HelpFaq cmsData={{ faqs: data?.faqs || [] }} />
        </div>
      </div>
    </div>
  );
}


