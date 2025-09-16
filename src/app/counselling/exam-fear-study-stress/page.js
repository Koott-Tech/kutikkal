import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "Exam Fear & Study Stress - Little Care",
  description: "Professional support for children dealing with exam fear and study stress. Evidence-based interventions to help improve academic performance and reduce anxiety.",
};

export default function ExamFearStudyStressPage() {
  return (
    <div>
      <HeroSection therapyType="exam-fear-study-stress" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="exam-fear-study-stress" />
      <BenefitsSection therapyType="exam-fear-study-stress" />
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