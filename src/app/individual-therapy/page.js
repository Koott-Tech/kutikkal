"use client";

import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import Testimonials from '@/components/Testimonials';
import HelpFaq from '@/components/HelpFaq';
import TherapyTypes from '@/components/TherapyTypes';
import ResourcesTeaser from '@/components/ResourcesTeaser';
import Footer from '@/components/Footer';

export default function IndividualTherapy() {
  return (
    <div>
      <HeroSection />
      <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />
      <ProcessSteps />
      <BenefitsSection />
      {/* <TherapyTypes />
      <ResourcesTeaser /> */}
      <Testimonials />
      <div className="mt-24">
        <HelpFaq />
      </div>
      <Footer />
    </div>
  );
}
