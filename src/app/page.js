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
     
      <Hero />
      
      {/* Sister Brands Section */}
      <div className="bg-white py-8">
        <div className="mx-auto max-w-[1400px] px-1 md:px-2">
          <div className="mx-4 sm:mx-6 md:mx-0">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-700 text-xs md:text-sm md:text-left relative group cursor-pointer flex items-start gap-2">
                {/* Info Icon */}
                <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div>Our sister brands, united by one vision:</div>
                  <div className="font-semibold">Redefining care, work, and hope for a better tomorrow.</div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-80 bg-white text-gray-900 text-sm rounded-lg p-3 shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div>Our sister brands, united by one vision:</div>
                  <div className="font-semibold">Redefining care, work, and hope for a better tomorrow.</div>
                  {/* Arrow */}
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm md:text-base text-gray-700 md:ml-auto">
                <span className="hover:text-gray-900 cursor-pointer font-semibold">Koott</span>
                <span className="hover:text-gray-900 cursor-pointer font-semibold">Hopelly</span>
                <span className="hover:text-gray-900 cursor-pointer font-semibold">WorkMate</span>
                <span className="hover:text-gray-900 cursor-pointer">About us</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChooseOptions />
      
      {/* <FeatureCards /> */}
      <PersonalizedCare />
      <InfoCards />
      <ConsultationBanner />
      <HowItWorks />
      <SupportFaq />
      <Testimonials />
      
      {/* <ResultsSplit /> */}
      
      <BlogTeaser />
      
      <HelpFaq />
    </main>
  );
}
// Force deployment Tue Sep  9 12:03:00 IST 2025
