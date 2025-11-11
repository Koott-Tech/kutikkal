import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HelpFaq from '@/components/HelpFaq';
import ScrollToTop from '@/components/ScrollToTop';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import AssessmentInfoCard from '@/components/AssessmentInfoCard';
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
      cache: 'no-store',
      next: { revalidate: 0 }
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

export default async function AssessmentDynamicPage({ params, searchParams }) {
  const { slug } = await params;
  const isPreview = searchParams?.preview === '1' || searchParams?.preview === 'true';
  const data = await fetchAssessment(slug, { preview: isPreview });

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
      {/* Assessment info card under hero (replaces doctor cards) */}
      <AssessmentInfoCard cmsData={{
        slug,
        id: data?.id, // Pass assessment ID from database
        title: data?.assessment_card_title,
        description: data?.assessment_card_description,
        sessionsInfo: data?.assessment_card_sessions_info,
        typesHeading: data?.assessment_card_types_heading,
        certifiedLabel: data?.assessment_card_certified_label,
        nonCertifiedLabel: data?.assessment_card_non_certified_label,
        assigned_doctor_ids: data?.assigned_doctor_ids || [],
      }} />
      {/* Booking Modal trigger state handled inside modal via portal-like overlay; use global state by lifting if needed */}
      {/* Here we render modal only when query or global trigger is used; for now modal opens from card by navigation replacement previously – will be opened by modifying the card next */}
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


