import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';

export const metadata = {
  title: "Big Emotions (CBT - Kids) - Little Care",
  description: "Cognitive Behavioral Therapy for children dealing with big emotions. Professional support to help kids understand and manage their feelings effectively.",
};

export default function BigEmotionsPage() {
  return (
    <div>
      <HeroSection therapyType="big-emotions" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="big-emotions" />
      <BenefitsSection therapyType="big-emotions" />
      <TherapyTypesSplit therapyType="big-emotions" />
      <div className="mt-8 sm:mt-12 md:mt-16">
        <Testimonials />
      </div>
      <div className="mt-24">
        <HelpFaq />
      </div>
    </div>
  );
}