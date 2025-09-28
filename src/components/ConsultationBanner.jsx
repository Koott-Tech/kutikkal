"use client";

import Image from "next/image";

export default function ConsultationBanner() {
  return (
    <section className="w-full py-4 px-4 md:px-6 mt-10">
      <div className="mx-auto max-w-7xl">
        <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-[10px] overflow-hidden relative">
          {/* White gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-center">
            {/* Left: Text and Button */}
            <div className="p-5 md:p-6 pl-8 md:pl-10 lg:pl-12 order-1 lg:order-1">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-medium text-gray-900 mb-2 leading-tight text-left max-w-2xl lg:max-w-none lg:whitespace-nowrap">
                Get a Free 20-minute Consultation
              </h2>
              
              <p className="text-xs md:text-base text-gray-700 mb-4 leading-relaxed text-left max-w-2xl lg:max-w-none lg:whitespace-nowrap">
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
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-[10px] overflow-hidden">
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
    </section>
  );
}
