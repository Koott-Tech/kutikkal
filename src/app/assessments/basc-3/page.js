import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "BASC-3 Assessment - Little Care",
  description: "Comprehensive Behaviour Assessment System (BASC-3) for evaluating behavioral and emotional functioning in children and adolescents.",
};

export default function BASC3Page() {
  return (
    <div>
      <HeroSection therapyType="basc-3" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="basc-3" />
      <BenefitsSection therapyType="basc-3" />
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
