"use client";

import Image from "next/image";

export default function ConsultationBanner() {
  return (
    <div className="section-mobile mt-20">
      <div className="mx-auto max-w-[400px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] px-3 sm:px-6 md:px-0">
        <div className="rounded-[10px] overflow-hidden inline-block w-full" style={{ borderRadius: "10px", overflow: "hidden", display: "block" }}>
          <div className="overflow-hidden relative rounded-[10px] main-container min-h-[320px] md:min-h-[240px]" style={{ borderRadius: "10px", minHeight: "240px" }}>
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/consultationbanner.webp')" }}></div>
          <style jsx>{`
            .main-container {
              border-radius: 10px !important;
              overflow: hidden !important;
            }
            .mobile-container {
              border-radius: 10px !important;
              overflow: hidden !important;
            }
            @media (max-width: 767px) {
              .section-mobile > div,
              .section-mobile > div > div {
                margin-top: 0 !important;
                margin-bottom: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
              }
              .mobile-container {
                padding: 0 !important;
                min-height: 320px !important;
              }
              .mobile-container > div:last-child {
                min-height: 320px !important;
                height: 320px !important;
              }
              .mobile-text {
                padding: 0 0 0 20px !important;
              }
              .mobile-text h2 {
                margin-bottom: 4px !important;
              }
              .mobile-text p {
                margin-bottom: 15px !important;
              }
              .main-container {
                min-height: 320px !important;
                height: 320px !important;
                padding: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
              }
              .section-mobile {
                padding: 0 !important;
              }
              .section-mobile > div {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
              }
            }
            @media (min-width: 768px) {
              .main-container {
                min-height: 240px !important;
              }
              .mobile-container {
                min-height: 240px !important;
              }
              .section-mobile {
                margin-top: 0 !important;
                margin-bottom: 0 !important;
              }
            }
          `}</style>
          <div className="grid grid-cols-5 md:grid-cols-2 items-center min-h-[320px] md:min-h-[240px] gap-0 lg:gap-0 mobile-container rounded-[10px] overflow-hidden relative z-10">
            {/* Left: Text and Button */}
            <div className="p-2 md:p-6 pl-5 md:pl-14 lg:pl-6 ml-0 md:ml-6 lg:ml-8 col-span-3 md:col-span-1 flex flex-col justify-center mobile-text max-w-[360px] md:max-w-[560px]">
              <h4 className="text-left font-semibold max-w-none lg:max-w-none lg:whitespace-nowrap">
                Get a Free 20-minute Consultation
              </h4>
              
              <p className="text-[10px] md:text-base mb-10 md:mb-8 text-left max-w-none lg:max-w-none lg:whitespace-nowrap">
                Our sister brands, united by one vision: Redefining care, work, and hope for a better tomorrow.
              </p>
              
              <button className="text-gray-900 px-1 py-0.5 md:px-3 md:py-2 rounded-lg md:rounded-2xl text-[10px] md:text-sm font-medium transition-all duration-200 hover:opacity-90 flex items-center gap-0.5 md:gap-2 w-fit" style={{ backgroundColor: '#EEF4E4' }}>
                <span>Book a Google Meet now.</span>
                <div className="w-3 h-3 md:w-7 md:h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#bed39c' }}>
                  <svg className="w-2 h-2 md:w-3.5 md:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Right: Image */}
            <div className="relative h-full col-span-2 md:col-span-1 flex justify-end items-center md:items-center pr-0 pb-0 pt-0">
              <div className="absolute right-6 md:right-8 w-20 h-20 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-[10px] overflow-hidden mb-0" style={{ top: '50%', transform: 'translateY(-50%)', bottom: 'auto' }}>
                <img
                  src="/consultation.png"
                  alt="Consultation"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
