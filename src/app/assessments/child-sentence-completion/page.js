import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "Child Sentence Completion Test - Little Care",
  description: "Child Sentence Completion Test projective technique for assessing personality and emotional development in children.",
};

export default function ChildSentenceCompletionPage() {
  return (
    <div>
      <HeroSection therapyType="child-sentence-completion" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="child-sentence-completion" />
      <BenefitsSection therapyType="child-sentence-completion" />
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
