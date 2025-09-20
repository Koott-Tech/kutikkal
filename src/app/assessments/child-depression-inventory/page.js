import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "Child Depression Inventory - Little Care",
  description: "Child Depression Inventory assessment for identifying depression symptoms in children and adolescents.",
};

export default function ChildDepressionInventoryPage() {
  return (
    <div>
      <HeroSection therapyType="child-depression-inventory" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="child-depression-inventory" />
      <BenefitsSection therapyType="child-depression-inventory" />
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
