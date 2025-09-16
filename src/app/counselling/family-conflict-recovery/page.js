import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "Family Conflict Recovery - Little Care",
  description: "Professional support for families dealing with conflict and relationship issues. Evidence-based interventions to help heal family relationships and resolve conflicts.",
};

export default function FamilyConflictRecoveryPage() {
  return (
    <div>
      <HeroSection therapyType="family-conflict-recovery" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="family-conflict-recovery" />
      <BenefitsSection therapyType="family-conflict-recovery" />
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