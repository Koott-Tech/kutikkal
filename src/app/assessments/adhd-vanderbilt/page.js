import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "ADHD Vanderbilt Assessment - Little Care",
  description: "Comprehensive ADHD Vanderbilt assessment for evaluating ADHD symptoms and related behavioral concerns in children and adolescents.",
};

export default function ADHDVanderbiltPage() {
  return (
    <div>
      <HeroSection therapyType="adhd-vanderbilt" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="adhd-vanderbilt" />
      <BenefitsSection therapyType="adhd-vanderbilt" />
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
