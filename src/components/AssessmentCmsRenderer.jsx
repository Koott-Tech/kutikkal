import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
// Removed ProcessSteps per request; replaced with homepage HowItWorks
import HowItWorks from '@/components/HowItWorks';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import AssessmentDemoCTA from '@/components/AssessmentDemoCTA';

export default async function AssessmentCmsRenderer({ slug }) {
  async function fetchAssessment() {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${base}/api/assessments/${slug}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.success) return data.message;
      }
    } catch (_) {}
    return null;
  }

  const cms = await fetchAssessment();

  return (
    <div>
      <HeroSection 
        therapyType={slug}
        cmsData={{
          title: cms?.hero_title || undefined,
          subtext: cms?.hero_subtext || undefined,
          imageUrl: cms?.hero_image_url || undefined,
        }}
      />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      {/* How it works should appear under the logos strip */}
      <div className="mt-8">
        <HowItWorks />
      </div>
      <BenefitsSection 
        therapyType={slug}
        cmsData={{
          benefits: cms?.benefits || [],
          benefitsImageUrl: cms?.benefits_image_url || undefined,
        }}
      />
      <TherapyTypesSplit 
        therapyType={slug}
        cmsData={{
          types: cms?.types || [],
          rightImageUrl: cms?.right_image_url || undefined,
          buttonText: 'Get started',
        }}
      />
      <div className="mt-8 sm:mt-12 md:mt-16">
        <Testimonials />
      </div>
      <div className="mt-24">
        <HelpFaq cmsData={{ faqs: cms?.faqs || [] }} />
      </div>
      <div className="mt-24">
        <AssessmentDemoCTA />
      </div>
    </div>
  );
}


