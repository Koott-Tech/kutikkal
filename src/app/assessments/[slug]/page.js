import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HelpFaq from '@/components/HelpFaq';
import ScrollToTop from '@/components/ScrollToTop';
import HowItWorks from '@/components/HowItWorks';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import AssessmentInfoCard from '@/components/AssessmentInfoCard';
import TherapistCarousel from '@/components/TherapistCarousel';
import InfoCards from '@/components/InfoCards';
import Reviews from '@/components/Reviews';
import VideosShowcase from '@/components/VideosShowcase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchAssessment(slug, { preview = false } = {}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const previewSuffix = preview ? '?preview=1' : '';
    const response = await fetch(`${baseUrl}/api/assessments/${slug}${previewSuffix}`, {
      cache: 'no-store'
    });

    if (response.ok) {
      const json = await response.json();
      if (json?.success) {
        const payload = json.data ?? json.message ?? json.assessment ?? json.result ?? json;
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          if (payload.assessment && typeof payload.assessment === 'object' && !Array.isArray(payload.assessment)) {
            return payload.assessment;
          }
          return payload;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching assessment:', error);
  }

  return null;
}

async function fetchPublicTherapists(limit = 6) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${baseUrl}/api/public/psychologists`, {
      cache: 'no-store'
    });

    if (response.ok) {
      const json = await response.json();
      const psychologists = json?.data?.psychologists || json?.message?.psychologists || json?.psychologists || [];
      if (Array.isArray(psychologists)) {
        return psychologists.slice(0, limit);
      }
    }
  } catch (error) {
    console.error('Error fetching public psychologists:', error);
  }

  return [];
}

export default async function AssessmentDynamicPage({ params, searchParams }) {
  const { slug } = await params;
  const isPreview = searchParams?.preview === '1' || searchParams?.preview === 'true';
  const data = await fetchAssessment(slug, { preview: isPreview });

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#3f2e73' }}>404</h1>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: '#3f2e73' }}>
            Assessment page not found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t load this assessment right now. It may have been moved, unpublished, or does not exist.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center w-full py-3 px-4 text-base font-semibold text-white rounded-lg transition-colors duration-200 bg-[#3f2e73] hover:bg-[#1d1733]"
          >
            Go back home
          </a>
        </div>
      </div>
    );
  }

  const therapists = await fetchPublicTherapists(6);

  const title = data?.hero_title || (slug ? slug.replace(/[-_]/g, ' ') : 'Assessment');
  const subtext = data?.hero_subtext || 'Professional assessment to better understand needs and strengths.';
  const imageUrl = data?.hero_image_url || '';
  const heroFeatures = [data?.hero_point_1, data?.hero_point_2, data?.hero_point_3].filter(Boolean);

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
          features: heroFeatures,
        }}
      />
      <LogosStrip bgColor="bg-[#15171A]" height="py-4" logosCount={6} swapSecondThird />

      <div className="mt-8 md:mt-12">
        <AssessmentInfoCard
          cmsData={{
            slug,
            id: data?.id,
            title: data?.assessment_card_title,
            description: data?.assessment_card_description,
            sessionsInfo: data?.assessment_card_sessions_info,
            typesHeading: data?.assessment_card_types_heading,
            certifiedLabel: data?.assessment_card_certified_label,
            nonCertifiedLabel: data?.assessment_card_non_certified_label,
            assigned_doctor_ids: data?.assigned_doctor_ids || [],
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-8 md:mt-12 hidden md:block">
        <TherapistCarousel therapists={therapists} />
      </div>

      <div className="mt-12 md:mt-16">
        <HowItWorks />
      </div>

      <div className="mt-16 md:mt-20">
        <BenefitsSection 
          cmsData={{ 
            title: data?.benefits_title || 'Why this assessment?', 
            benefits: data?.benefits || [],
            benefitsImageUrl: data?.benefits_image_url || ''
          }} 
        />
      </div>
      <div className="mt-0">
        <TherapyTypesSplit 
          therapyType={slug}
          cmsData={{ 
            title: data?.types_title || 'What we evaluate', 
            types: data?.types || [],
            rightImageUrl: data?.right_image_url || '',
            buttonText: data?.types_button_text || 'Get started'
          }} 
        />
      </div>
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
      <div className="mt-8 md:-mt-24">
        <Reviews cmsData={{ reviews: data?.reviews || [] }} />
      </div>
      <div className="mt-12 md:mt-16 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <HelpFaq cmsData={{ faqs: data?.faqs || [] }} />
        </div>
      </div>
    </div>
  );
}


