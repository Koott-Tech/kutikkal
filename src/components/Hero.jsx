"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push('/guide');
  };

  const handleHowItWorksClick = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="w-full overflow-hidden mt-10">
      <div className="mx-auto max-w-[1400px] px-0 md:px-0">
        <section 
          className="text-black rounded-none md:rounded-[10px] p-0 sm:px-8 sm:py-8 md:px-[50px] md:py-[50px] mx-0 md:mx-0 overflow-visible relative"
          style={{ 
            background: 'linear-gradient(98.54deg, rgba(153, 126, 255, .25) 6.76%, rgba(153, 126, 255, .2) 98%)'
          }}
        >
          <style jsx>{`
            @media (max-width: 767px) {
              section { min-height: 78vh; }
              .hero-image-box { height: 42vh; }
            }
            @media (min-width: 768px) {
              /* Tighten desktop min-height so zoom-out doesn't leave bottom gap */
              section { min-height: clamp(520px, 58vh, 780px); }
              .hero-image-box { height: 100%; }
            }
          `}</style>
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-2 md:gap-8" style={{ minHeight: 'inherit' }}>
            {/* Left: Text */}
            <div className="flex flex-col justify-center order-1 md:order-1 md:pl-2 text-left mt-0 px-4 sm:px-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-xs md:text-sm font-medium text-gray-800 w-fit mx-0" style={{ backgroundColor: 'rgba(242, 242, 252, 0.7)' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Convenient, online care covered by insurance</span>
              </div>
              
              <h1 className="hero-title mt-4 text-4xl md:text-5xl lg:text-6xl font-medium break-words" style={{ color: '#593494' }}>
                Your Partner in Child Counselling & Parent Support
              </h1>
              <p className="mt-10 text-lg font-normal opacity-95 leading-relaxed break-words" style={{ color: '#15171a' }}>
                Expert Child Counselling & Parent Support to help your whole family grow.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 sm:justify-start">
                <button
                  onClick={handleGetStartedClick}
                  className="w-full sm:w-fit inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-normal text-white shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3e2e73]/40"
                  style={{ backgroundColor: '#3e2e73' }}
                  type="button"
                >
                  <span style={{ fontWeight: 500 }}>Get Started</span>
                </button>
                <button
                  type="button"
                  onClick={handleHowItWorksClick}
                  className="w-full sm:w-fit inline-flex items-center justify-center gap-3 text-base font-normal text-black hover:text-gray-800 group relative cursor-pointer"
                >
                  <span className="relative">
                    How does it work?
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 ease-out group-hover:w-full"></span>
                  </span>
                  <div className="w-5 h-5 border border-gray-800 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-2.5 w-2.5 text-gray-800"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="hidden md:block order-2 md:order-2 -mt-8 md:mt-0 md:h-full">
              {/* Responsive image box aligned to bottom of column */}
              <div className="relative w-full md:w-1/2 hero-image-box md:absolute md:bottom-[-60px] md:right-0">
                <Image
                  src="/heroo.png"
                  alt="Hero"
                  fill
                  className="object-cover md:object-bottom"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}