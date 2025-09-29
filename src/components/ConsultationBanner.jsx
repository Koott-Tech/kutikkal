"use client";

import Image from "next/image";

export default function ConsultationBanner() {
  return (
    <div className="section-mobile">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="bg-cover bg-center bg-no-repeat overflow-hidden relative rounded-[10px] main-container" style={{ backgroundImage: "url('/freeconsultation.png')", backgroundSize: "cover" }}>
          <style jsx>{`
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
                min-height: auto !important;
              }
              .mobile-container > div:last-child {
                min-height: auto !important;
                height: auto !important;
              }
              .mobile-text {
                padding: 0 !important;
              }
              .mobile-text h2 {
                margin-bottom: 4px !important;
              }
              .mobile-text p {
                margin-bottom: 4px !important;
              }
              .main-container {
                min-height: auto !important;
                height: auto !important;
                background-image: none !important;
                background-color: transparent !important;
                padding: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
              }
              @media (min-width: 768px) {
                .main-container {
                  min-height: 600px !important;
                }
                .mobile-container {
                  min-height: 600px !important;
                }
              }
              .section-mobile {
                padding: 0 !important;
              }
              .section-mobile > div {
                padding-left: 8px !important;
                padding-right: 8px !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
              }
              @media (min-width: 768px) {
                .section-mobile {
                  margin-top: 0 !important;
                  margin-bottom: 0 !important;
                }
              }
            }
          `}</style>
          <div className="grid grid-cols-2 items-center min-h-[600px] md:min-h-[600px] gap-0 lg:gap-0 mobile-container">
            {/* Left: Text and Button */}
            <div className="p-2 md:p-6 pl-4 md:pl-10 lg:pl-12 col-span-1 flex flex-col justify-center mobile-text">
              <h2 className="text-sm md:text-3xl lg:text-4xl font-medium text-gray-900 mb-2 leading-tight text-left max-w-none lg:max-w-none lg:whitespace-nowrap">
                Get a Free 20-minute Consultation
              </h2>
              
              <p className="text-[10px] md:text-base text-gray-700 mb-4 leading-relaxed text-left max-w-none lg:max-w-none lg:whitespace-nowrap">
                Our sister brands, united by one vision: Redefining care, work, and hope for a better tomorrow.
              </p>
              
              <button className="bg-white hover:bg-gray-50 text-gray-900 px-1 py-0.5 md:px-3 md:py-2 rounded-lg md:rounded-2xl text-[10px] md:text-sm font-medium transition-all duration-200 flex items-center gap-0.5 md:gap-2 w-fit">
                <span>Book a Google Meet now.</span>
                <div className="w-3 h-3 md:w-7 md:h-7 bg-green-200 rounded-full flex items-center justify-center">
                  <svg className="w-1.5 h-1.5 md:w-3 md:h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Right: Image */}
            <div className="relative h-32 md:h-52 lg:h-60 col-span-1 flex justify-end items-center pr-0 pb-0 pt-0 min-h-[600px] md:min-h-[600px]">
              <div className="relative w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-[10px] overflow-hidden">
                <Image
                  src="/consultation.png"
                  alt="Consultation"
                  fill
                  className="object-cover rounded-[10px]"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
