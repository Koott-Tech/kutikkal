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
         <section className={`w-full ${bgColor} ${height} mt-2 md:mt-4`}>
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 px-2 sm:px-4 md:px-[70px]">
        {/* Insurance Coverage Text - Left on desktop, top on mobile */}
        <div className="flex flex-col items-center md:items-start gap-2 order-1 md:order-1">
                     <div className="text-center md:text-left relative">
             <p className={`text-base font-medium ${textColor} leading-tight block md:hidden`}>
               120M+ individuals are covered by insurance
             </p>
             <p className={`text-base font-medium ${textColor} leading-tight hidden md:block`}>
               120M+ individuals are
             </p>
             <p className={`text-base font-medium ${textColor} leading-tight hidden md:block`}>
               covered by insurance
             </p>
            <div className="absolute -top-1 -right-6 md:-right-6">
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
        
                                   {/* Logo Grid - Center on mobile, right on desktop */}
          <div className="flex flex-col items-center order-2 md:order-2">
                        <div className="hidden md:flex md:flex-nowrap items-center justify-between w-full max-w-4xl gap-6">
              {logosToShow.map((src) => (
                <div key={src} className="flex-shrink-0">
                  <Image
                    src={`/${src}`}
                    alt={`${src.replace('-logo-1.png', '').replace('-logo.png', '').replace('_', '').replace('.svg', '')} logo`}
                    width={144}
                    height={56}
                    className={`h-14 w-auto object-contain ${logoFilter}`}
                  />
                </div>
              ))}
            </div>
            
                                                   {/* Mobile Logo Grid - 4 logos per row */}
              <div className="md:hidden w-full">
                {/* First row - 4 logos */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
                  {logosToShow.slice(0, 4).map((src) => (
                    <div key={src} className="flex-shrink-0">
                      <Image
                        src={`/${src}`}
                        alt={`${src.replace('-logo-1.png', '').replace('-logo.png', '').replace('_', '').replace('.svg', '')} logo`}
                        width={144}
                        height={56}
                        className={`h-8 sm:h-10 w-auto object-contain ${logoFilter}`}
                      />
                    </div>
                  ))}
                </div>
                {/* Second row - 4 logos */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {logosToShow.slice(4, 8).map((src) => (
                    <div key={src} className="flex-shrink-0">
                      <Image
                        src={`/${src}`}
                        alt={`${src.replace('-logo-1.png', '').replace('-logo.png', '').replace('_', '').replace('.svg', '')} logo`}
                        width={144}
                        height={56}
                        className={`h-8 sm:h-10 w-auto object-contain ${logoFilter}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
                       {/* More partners text - visible on mobile, hidden on desktop */}
            <div className="md:hidden mt-4">
              <span className={`text-lg font-medium ${textColor}`}>More partners →</span>
            </div>
         </div>
        
        {/* More Partners Link - Right on desktop, hidden on mobile */}
        <div className="hidden md:flex items-center order-3">
          <span className={`text-base font-medium ${textColor}`}>More partners →</span>
        </div>
      </div>
    </section>
  );
}
