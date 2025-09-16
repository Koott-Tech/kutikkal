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
    <main >
     
      <Hero />
      
      {/* Sister Brands Section */}
      <div className="bg-white py-8">
        <div className="mx-auto max-w-[1400px] px-1 md:px-2">
          <div className="mx-4 sm:mx-6 md:mx-0">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-700 text-xs md:text-sm md:text-left">
                <div>Our sister brands, united by one vision:</div>
                <div className="font-semibold">Redefining care, work, and hope for a better tomorrow.</div>
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
