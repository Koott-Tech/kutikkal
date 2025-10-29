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
          .component-spacing:first-child {
            margin-top: 0 !important;
          }
          .info-cards-spacing {
            margin-top: 24px !important;
          }
          .testimonials-spacing {
            margin-top: 48px !important;
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
              <div className="sister-brands-content text-gray-700 text-sm md:text-sm text-center md:text-left relative group cursor-pointer flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-2">
                {/* Info Icon */}
                <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="sister-brands-text text-center md:text-left">
                  <div className="text-xs md:text-sm">Our sister brands, united by one vision:</div>
                  <div className="font-semibold text-sm md:text-sm">Redefining care, work, and hope for a better tomorrow.</div>
                </div>
                
                {/* Tooltip - Hidden on mobile */}
                <div className="hidden md:block absolute bottom-full left-0 mb-2 w-80 bg-white text-gray-900 text-sm rounded-lg p-3 shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div>Our sister brands, united by one vision:</div>
                  <div className="font-semibold">Redefining care, work, and hope for a better tomorrow.</div>
                  {/* Arrow */}
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
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

      <div className="component-spacing">
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
      <div className="component-spacing">
        <SupportFaq />
      </div>
      <div className="component-spacing testimonials-spacing" style={{ marginTop: 160 }}>
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
