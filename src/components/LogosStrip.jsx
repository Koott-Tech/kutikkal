"use client";
import { useState } from "react";
import Image from "next/image";

export default function LogosStrip({ bgColor = "bg-white", height = "py-8", logosCount = 8 }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Check if using dark background to determine text and logo colors
  const isDarkBg = bgColor !== "bg-white";
  const textColor = isDarkBg ? "text-white" : "text-gray-700";
  const logoFilter = isDarkBg ? "brightness-0 invert" : "";

  // Logo array
  const allLogos = [
    "aetna-logo-1.png",
    "cigna-logo-1.png",
    "uhc-logo.png",
    "logo_bcbs-1.png",
    "optum-logo-1.png",
    "kaiser-logo.png",
    "umr-logo.png",
    "anthem_logo_blue.svg",
  ];

  // Slice to get only the requested number of logos
  const logosToShow = allLogos.slice(0, logosCount);

  return (
    <section className={`w-full ${bgColor} ${height} mt-4 md:mt-6`}>
      <div className="flex items-center justify-between gap-8 px-[70px]">
        <div className="flex items-start gap-2">
          <div className="text-left relative">
            <p className={`text-base font-medium ${textColor} leading-tight`}>
              120M+ individuals are
            </p>
            <p className={`text-base font-medium ${textColor} leading-tight`}>
              covered by insurance
            </p>
            <div className="absolute -top-1 -right-6">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`flex h-4 w-4 items-center justify-center rounded-full ${isDarkBg ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-200 hover:bg-gray-300'} transition-colors cursor-pointer`}
              >
                <span className={`text-xs font-medium ${isDarkBg ? 'text-white' : 'text-gray-600'}`}>i</span>
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
        
        <div className="flex flex-nowrap items-center justify-between w-full max-w-4xl">
          {logosToShow.map((src) => (
            <div key={src} className="flex-shrink-0">
              <Image
                src={`/${src}`}
                alt={`${src.replace('-logo-1.png', '').replace('-logo.png', '').replace('_', ' ')} logo`}
                width={144}
                height={56}
                className={`h-14 w-auto object-contain ${logoFilter}`}
              />
            </div>
          ))}
        </div>
        
        <div className="flex items-center">
          <span className={`text-base font-medium ${textColor}`}>More partners →</span>
        </div>
      </div>
    </section>
  );
}
