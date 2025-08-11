import Image from "next/image";
import FeatureCards from "../components/FeatureCards";
import InfoCards from "../components/InfoCards";
import HowItWorks from "../components/HowItWorks";
import SupportFaq from "../components/SupportFaq";
import ResultsSplit from "../components/ResultsSplit";
import Testimonials from "../components/Testimonials";
import BlogTeaser from "../components/BlogTeaser";
import HelpFaq from "../components/HelpFaq";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import LogosStrip from "../components/LogosStrip";


export default function Home() {
  return (
    <main >
      <Hero />

      <LogosStrip />

      {/* Feature cards under hero */}
      <FeatureCards />

      {/* Info cards */}
      <InfoCards />

      {/* How it works */}
      <HowItWorks />

  
      {/* Support + FAQ */}
      <SupportFaq />

      {/* Results split section */}
      <ResultsSplit />

      {/* Testimonials (100vh) */}
      <Testimonials />

      {/* Blog Teaser (100vh) */}
      <BlogTeaser />

      {/* Help / FAQ (100vh style) */}
      <HelpFaq />

      {/* Footer (100vh) */}
      <Footer />
    </main>
  );
}
