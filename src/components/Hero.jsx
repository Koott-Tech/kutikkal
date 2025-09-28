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
    <div className="w-full overflow-hidden mt-10" style={{ minHeight: '75vh' }}>
      <div className="mx-auto max-w-[1400px] px-0 md:px-2">
        <section className="text-black rounded-none md:rounded-[10px] p-0 sm:p-8 md:p-[50px] mx-0 md:mx-0" style={{ background: 'linear-gradient(98.54deg, rgba(153, 126, 255, .25) 6.76%, rgba(153, 126, 255, .2) 98%)', minHeight: '75vh', height: '75vh' }}>
          <div className="grid h-full grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
            {/* Left: Text */}
            <div className="flex flex-col justify-center order-1 md:order-1 md:pl-2 text-left mt-8 md:mt-0 px-4 sm:px-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800 w-fit mx-0" style={{ backgroundColor: 'rgba(242, 242, 252, 0.7)' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Convenient, online care covered by insurance</span>
              </div>
              
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-medium leading-none break-words" style={{ color: '#1d1733', letterSpacing: '-0.06em', lineHeight: '1.0' }}>
                Your partner in Child Counselling & Parent Support
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
            <div className="relative flex items-center justify-center order-2 md:order-2 min-h-[220px] sm:min-h-[260px] md:min-h-0">
              <Image
                src="/heroo.png"
                alt="Hero"
                fill
                className="object-contain object-bottom scale-[0.75] md:scale-150 translate-y-0 md:translate-y-10"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}







