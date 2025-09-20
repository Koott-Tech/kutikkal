import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "ADHD Conners 3 Assessment - Little Care",
  description: "Advanced ADHD Conners 3 assessment for comprehensive evaluation of attention and behavioral patterns in children and adolescents.",
};

export default function ADHDConners3Page() {
  return (
    <div>
      <HeroSection therapyType="adhd-conners-3" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="adhd-conners-3" />
      <BenefitsSection therapyType="adhd-conners-3" />
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
