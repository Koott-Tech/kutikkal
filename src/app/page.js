import Header from "../components/Header";
import Hero from "../components/Hero";
import LogosStrip from "../components/LogosStrip";
import PersonalizedCare from "../components/PersonalizedCare";
import FeatureCards from "../components/FeatureCards";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import ResultsSplit from "../components/ResultsSplit";
import InfoCards from "../components/InfoCards";
import BlogTeaser from "../components/BlogTeaser";
import HelpFaq from "../components/HelpFaq";
import SupportFaq from "../components/SupportFaq";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main >
     
      <Hero />
      <LogosStrip />
      
      <FeatureCards />
      <PersonalizedCare />
      <InfoCards />
      <HowItWorks />
      <Testimonials />
      <SupportFaq />
      <ResultsSplit />
      
      <BlogTeaser />
      
      <HelpFaq />
      
      <Footer />
    </main>
  );
}
