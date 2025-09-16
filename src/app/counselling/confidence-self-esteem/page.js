import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "Confidence & Self-esteem - Little Care",
  description: "Professional support to build confidence and self-esteem in children. Evidence-based interventions to help develop positive self-worth and confidence.",
};

export default function ConfidenceSelfEsteemPage() {
  return (
    <div>
      <HeroSection therapyType="confidence-self-esteem" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="confidence-self-esteem" />
      <BenefitsSection therapyType="confidence-self-esteem" />
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