import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
// Removed ProcessSteps per request; replaced with homepage HowItWorks
import HowItWorks from '@/components/HowItWorks';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import ConditionBoxes from '@/components/ConditionBoxes';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import AssessmentDemoCTA from '@/components/AssessmentDemoCTA';

const DEFAULTS = {
  'early-parent-postpartum-support': {
    hero_title: 'Early Parent & Postpartum Support',
    hero_subtext: 'Guidance for the critical first months and beyond.'
  },
  'parenting-coaching-counselling': {
    hero_title: 'Parenting Coaching & Counselling',
    hero_subtext: 'Practical strategies to build confident parenting.'
  },
  'parent-child-joint-sessions': {
    hero_title: 'Parent–Child Joint Sessions',
    hero_subtext: 'Strengthen bonding and communication together.'
  },
  'child-development-behaviour-support': {
    hero_title: 'Child Development & Behaviour Support',
    hero_subtext: 'Understand milestones and manage challenging behaviours.'
  },
  'help-for-all-kinds-of-parents': {
    hero_title: 'Help for All Kinds of Parents',
    hero_subtext: 'Inclusive support for every family structure.'
  },
  'group-community-support': {
    hero_title: 'Group & Community Support',
    hero_subtext: 'Learn with peers in safe, supportive circles.'
  },
  'care-for-parents': {
    hero_title: 'Care for Parents',
    hero_subtext: 'Well-being support for the people who care for kids.'
  }
};

export default async function ParentingCmsRenderer({ slug }) {
  async function fetchParenting() {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${base}/api/better-parenting/${slug}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.success) return data.message;
      }
    } catch (_) {}
    return null;
  }

  const cms = await fetchParenting();
  const fallback = DEFAULTS[slug] || {};

  return (
    <div>
      <HeroSection 
        therapyType={slug}
        cmsData={{
          title: cms?.hero_title || fallback.hero_title || undefined,
          subtext: cms?.hero_subtext || fallback.hero_subtext || undefined,
          ctaText: cms?.hero_cta_text || undefined,
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
          title: cms?.benefits_title,
          benefits: cms?.benefits || [],
          benefitsImageUrl: cms?.benefits_image_url || undefined,
        }}
      />
      <TherapyTypesSplit 
        therapyType={slug}
        cmsData={{
          title: cms?.types_title,
          types: cms?.types || [],
          rightImageUrl: cms?.right_image_url || undefined,
          buttonText: 'Get started',
        }}
      />
      <ConditionBoxes cmsData={{ condition_boxes: cms?.condition_boxes }} />
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


