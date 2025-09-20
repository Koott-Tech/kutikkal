import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "Spence Anxiety Scale - Little Care",
  description: "Comprehensive Spence Anxiety Scale assessment for anxiety disorders and related symptoms in children and adolescents.",
};

export default function SpenceAnxietyScalePage() {
  return (
    <div>
      <HeroSection therapyType="spence-anxiety-scale" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="spence-anxiety-scale" />
      <BenefitsSection therapyType="spence-anxiety-scale" />
      <TherapyTypesSplit />
      <div className="mt-8 sm:mt-12 md:mt-16">
        <Testimonials />
      </div>
      <div className="mt-24">
        <HelpFaq />
      </div>
    </div>
  );
}
