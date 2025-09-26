import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HowItWorks from '@/components/HowItWorks';
import ConsultationBanner from '@/components/ConsultationBanner';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import AnxietyTestimonials from '@/components/AnxietyTestimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';
import AnxietyInfoCards from '@/components/AnxietyInfoCards';

export const metadata = {
  title: "Anxiety, Sadness or Low mood - Little Care",
  description: "Professional support for children experiencing anxiety, sadness, or low mood. Evidence-based interventions to help improve emotional well-being.",
};

export default function AnxietySadnessPage() {
  return (
    <div>
      <HeroSection therapyType="anxiety-sadness" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <HowItWorks />
      <ConsultationBanner />
      <BenefitsSection therapyType="anxiety-sadness" />
      <TherapyTypesSplit therapyType="anxiety-sadness" />
      <AnxietyInfoCards />
      <div className="mt-8 sm:mt-12 md:mt-16">
        <AnxietyTestimonials />
      </div>
      <div className="mt-24">
        <HelpFaq />
      </div>
    </div>
  );
}