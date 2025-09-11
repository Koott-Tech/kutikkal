"use client";

import Image from "next/image";

export default function ConsultationBanner() {
  return (
    <section className="w-full py-8 px-4 md:px-6 mt-12 md:mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-center">
            {/* Left: Text and Button */}
            <div className="p-5 md:p-6 pl-8 md:pl-10 lg:pl-12 order-1 lg:order-1">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-medium text-gray-900 mb-2 leading-tight text-left">
                Get a Free 20-minute Consultation
              </h2>
              
              <p className="text-xs md:text-base text-gray-700 mb-4 leading-relaxed text-left break-words">
                Our sister brands, united by one vision: Redefining care, work, and hope for a better tomorrow.
              </p>
              
              <button className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-2xl font-medium transition-all duration-200 flex items-center gap-3">
                <span>Book a Google Meet now.</span>
                <div className="w-7 h-7 bg-green-200 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Right: Image */}
            <div className="relative h-40 md:h-52 lg:h-60 order-2 lg:order-2 flex justify-center lg:justify-end items-center pr-6 pb-6 pt-6">
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden">
                <Image
                  src="/kids.png"
                  alt="Consultation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
                
                {/* Video Call Interface Elements */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    </svg>
                  </div>
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </div>
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
