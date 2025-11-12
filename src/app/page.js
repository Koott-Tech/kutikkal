"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";
import ChooseOptions from "../components/ChooseOptions";
import ConsultationBanner from "../components/ConsultationBanner";
// import LogosStrip from "../components/LogosStrip";
import PersonalizedCare from "../components/PersonalizedCare";
import FeatureCards from "../components/FeatureCards";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import ResultsSplit from "../components/ResultsSplit";
import InfoCards from "../components/InfoCards";
import BlogTeaser from "../components/BlogTeaser";
import HelpFaq from "../components/HelpFaq";
import SupportFaq from "../components/SupportFaq";

export default function Home() {
  return (
    <main className="pt-8">
      <style jsx>{`
        .info-cards-spacing {
          margin-top: 32px;
        }
        .testimonials-spacing {
          margin-top: 80px;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .component-spacing {
            margin-top: 70px !important;
          }
          .info-cards-spacing {
            margin-top: 28px !important;
          }
          .testimonials-spacing {
            margin-top: 60px !important;
          }
        }
        @media (max-width: 767px) {
          .component-spacing {
            margin-top: 60px !important;
          }
          .component-spacing-tight {
            margin-top: 8px !important;
          }
          /* Reduce wrapper margin above SupportFaq */
          .support-tight {
            margin-top: 12px !important;
          }
          /* Tighten spacing above Support section (Our promise) on mobile */
          :global(.support-tight .our-promise-section) {
            margin-top: 16px !important;
          }
          /* Force the ChooseOptions root <section> margin to collapse on mobile */
          :global(.raise-choose > section) {
            margin-top: 0 !important;
          }
          .component-spacing:first-child {
            margin-top: 0 !important;
          }
          .info-cards-spacing {
            margin-top: 24px !important;
          }
          .testimonials-spacing {
            margin-top: 24px !important;
          }
          :global(.testimonials-tight .testimonials-section) {
            margin-top: 16px !important;
          }
          .sister-brands-text {
            text-align: left !important;
          }
          .sister-brands-container {
            align-items: flex-start !important;
            justify-content: flex-start !important;
          }
          .sister-brands-content {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          .sister-brands-nav {
            justify-content: center !important;
            width: 100% !important;
            margin-top: 16px !important;
          }
          .sister-brands-container {
            justify-content: flex-start !important;
          }
        }
      `}</style>
     
      <Hero />
      
      {/* Sister Brands Section */}
      <div className="bg-white py-6 md:py-8 mt-0">
        <div className="mx-auto max-w-[1400px] px-4 md:px-2">
          <div className="mx-0 sm:mx-6 md:mx-0">
            <div className="sister-brands-container flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="sister-brands-content text-gray-700 text-sm md:text-sm text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-2">
                <div className="sister-brands-text text-center md:text-left">
                  <div className="text-xs md:text-sm">Our sister brands, united by one vision:</div>
                  <div className="font-semibold text-sm md:text-sm">Redefining care, work, and hope for a better tomorrow.</div>
                </div>
              </div>
              <div className="sister-brands-nav flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6 text-sm md:text-base text-gray-700 md:ml-auto">
                <span className="hover:text-gray-900 cursor-pointer font-semibold">Koott</span>
                <span className="hover:text-gray-900 cursor-pointer font-semibold">Hopelly</span>
                <span className="hover:text-gray-900 cursor-pointer font-semibold">WorkMate</span>
                <span className="hover:text-gray-900 cursor-pointer">About us</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="component-spacing component-spacing-tight raise-choose">
        <ChooseOptions />
      </div>
      
      {/* <FeatureCards /> */}
      <div className="component-spacing">
        <PersonalizedCare />
      </div>
      <div className="component-spacing info-cards-spacing" style={{ marginTop: 20 }}>
        <InfoCards compact />
      </div>
      <div className="component-spacing">
        <ConsultationBanner />
      </div>
      <div className="component-spacing">
        <HowItWorks />
      </div>
      <div className="component-spacing support-tight">
        <SupportFaq />
      </div>
      <div className="component-spacing testimonials-spacing testimonials-tight" style={{ marginTop: 160 }}>
        <Testimonials />
      </div>
      
      {/* <ResultsSplit /> */}
      
      <div className="component-spacing">
        <BlogTeaser />
      </div>
      
      <div className="component-spacing">
        <HelpFaq />
      </div>
    </main>
  );
}
// Force deployment Tue Sep  9 12:03:00 IST 2025
