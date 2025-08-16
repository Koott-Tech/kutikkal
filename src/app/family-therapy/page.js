"use client";

import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import Footer from '@/components/Footer';

export default function FamilyTherapy() {
  return (
    <div>
      <HeroSection therapyType="family" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="family" />
      <BenefitsSection therapyType="family" />
      <div className="mt-16">
        <Testimonials />
      </div>
      <div className="mt-24">
        <HelpFaq />
      </div>
      <Footer />
    </div>
  );
}
