import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "Overthinking & OCD - Little Care",
  description: "Professional support for children dealing with overthinking and OCD. Evidence-based interventions to help manage obsessive thoughts and compulsive behaviors.",
};

export default function OverthinkingOcdPage() {
  return (
    <div>
      <HeroSection therapyType="overthinking-ocd" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="overthinking-ocd" />
      <BenefitsSection therapyType="overthinking-ocd" />
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