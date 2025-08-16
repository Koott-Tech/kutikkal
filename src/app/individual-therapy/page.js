"use client";

import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import ResourcesTeaser from '@/components/ResourcesTeaser';
import Footer from '@/components/Footer';

export default function IndividualTherapy() {
  return (
    <div>
      <HeroSection therapyType="individual" />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps therapyType="individual" />
      <BenefitsSection therapyType="individual" />
      <TherapyTypesSplit />
      {/* <TherapyTypes />
      <ResourcesTeaser /> */}
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
