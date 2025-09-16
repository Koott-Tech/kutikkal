import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "Anxiety, Sadness or Low mood - Little Care",
  description: "Professional support for children experiencing anxiety, sadness, or low mood. Evidence-based interventions to help improve emotional well-being.",
};

export default function AnxietySadnessPage() {
  return (
    <div>
      <HeroSection therapyType="anxiety-sadness" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="anxiety-sadness" />
      <BenefitsSection therapyType="anxiety-sadness" />
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