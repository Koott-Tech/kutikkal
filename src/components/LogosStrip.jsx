"use client";
import { useState } from "react";
import Image from "next/image";

export default function LogosStrip() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <section className="w-full bg-white py-8 mt-4 md:mt-[-10px]">
      <div className="flex items-center justify-between gap-8 px-[70px]">
        <div className="flex items-start gap-2">
          <div className="text-left relative">
            <p className="text-base font-medium text-gray-700 leading-tight">
              120M+ individuals are
            </p>
            <p className="text-base font-medium text-gray-700 leading-tight">
              covered by insurance
            </p>
            <div className="absolute -top-1 -right-6">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
              >
                <span className="text-xs font-medium text-gray-600">i</span>
              </button>
              
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                  <div className="text-xs text-gray-700 leading-tight">
                    Rula patients typically pay $15 per session using insurance, but we'll provide you with a personalized cost estimate prior to your first appointment.
                  </div>
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-nowrap items-center gap-6">
          {[
            "aetna-logo-1.png",
            "cigna-logo-1.png",
            "uhc-logo.png",
            "logo_bcbs-1.png",
            "optum-logo-1.png",
            "kaiser-logo.png",
            "umr-logo.png",
            "anthem_logo_blue.svg",
          ].map((src) => (
            <div key={src} className="flex-shrink-0">
              <Image
                src={`/${src}`}
                alt={`${src.replace('-logo-1.png', '').replace('-logo.png', '').replace('_', ' ')} logo`}
                width={144}
                height={56}
                className="h-14 w-auto object-contain"
              />
            </div>
          ))}
        </div>
        
        <div className="flex items-center">
          <span className="text-base font-medium text-gray-700">More partners →</span>
        </div>
      </div>
    </section>
  );
}
