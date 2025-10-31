import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HelpFaq from '@/components/HelpFaq';
import ScrollToTop from '@/components/ScrollToTop';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';

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
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <HelpFaq />
        </div>
      </div>
    </div>
  );
}


