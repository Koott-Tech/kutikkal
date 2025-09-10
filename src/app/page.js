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
      {/* <LogosStrip /> */}

      {/* Sister brands message under hero */}
      <section className="mx-auto max-w-[1400px] px-1 md:px-2 mt-4 md:mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="text-left mb-4 md:mb-0">
            <p className="text-xs md:text-sm text-gray-700 leading-tight">Our sister brands, united by one vision:</p>
            <p className="text-xs md:text-sm font-semibold text-gray-900 leading-tight">Redefining care, work, and hope for a better tomorrow.</p>
          </div>
          <div className="flex justify-start md:justify-end gap-x-4 text-sm md:text-base text-gray-900">
            <span className="font-bold">Koott</span>
            <span className="font-bold">Hopelly</span>
            <span className="font-bold">WorkMate</span>
            <span className="font-normal text-xs md:text-sm">About us</span>
          </div>
        </div>
      </section>
      
      <ChooseOptions />
      
      {/* <FeatureCards /> */}
      <PersonalizedCare />
      <InfoCards />
      <ConsultationBanner />
      <HowItWorks />
      <SupportFaq />
      <div className="hidden md:block">
        <Testimonials />
      </div>
      
      {/* <ResultsSplit /> */}
      
      <BlogTeaser />
      
      <HelpFaq />
    </main>
  );
}
// Force deployment Tue Sep  9 12:03:00 IST 2025
