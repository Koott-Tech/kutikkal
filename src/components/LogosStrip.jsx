"use client";
import Image from "next/image";

export default function LogosStrip({ bgColor = "bg-white", height = "py-8", logosCount = 8, swapSecondThird = false }) {
  
  // Check if using dark background to determine text and logo colors
  const isDarkBg = bgColor !== "bg-white";
  const textColor = isDarkBg ? "text-white" : "text-gray-700";
  const logoFilter = isDarkBg ? "brightness-0 invert" : "";

  // Logo array
  const allLogos = [
    "University of Hyd.webp",
    "Christ University.webp",
    "Delhi University.webp",
    "calicut.webp",
    "Manipal University.webp",
    "Pondichery University.webp",
    "umr-logo.png",
    "anthem_logo_blue.svg",
  ];

  // Slice to get only the requested number of logos
  let logosToShow = allLogos.slice(0, logosCount);
  if (swapSecondThird && logosToShow.length >= 3) {
    const temp = logosToShow[1];
    logosToShow[1] = logosToShow[2];
    logosToShow[2] = temp;
  }

  return (
         <section className={`w-full ${bgColor} ${height} mt-0`}>
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 px-2 sm:px-4 md:px-[70px]">
                 {/* Insurance Coverage Text - Left on desktop, top on mobile */}
          <div className="flex flex-col items-center md:items-start gap-2 order-1 md:order-1">
                     <div className="text-center md:text-left">
             <p className={`text-base font-medium ${textColor} leading-[1.5]`}>
               Industry experts from <br /> renowned universities.
             </p>
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
            
                                                   {/* Mobile Logo Grid - 2 lines with 4 logos each */}
              <div className="md:hidden w-full">
                <div className="flex flex-col gap-4 sm:gap-6 max-w-2xl mx-auto">
                  {/* First line - 4 logos */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    {logosToShow.slice(0, 4).map((src) => (
                      <div key={src} className="flex items-center justify-center">
                        <Image
                          src={`/${src}`}
                          alt={`${src.replace('-logo-1.png', '').replace('-logo.png', '').replace('_', '').replace('.svg', '')} logo`}
                          width={144}
                          height={56}
                          className={`h-12 sm:h-14 w-auto object-contain ${logoFilter}`}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Second line - 4 logos */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    {logosToShow.slice(4, 8).map((src) => (
                      <div key={src} className="flex items-center justify-center">
                        <Image
                          src={`/${src}`}
                          alt={`${src.replace('-logo-1.png', '').replace('-logo.png', '').replace('_', '').replace('.svg', '')} logo`}
                          width={144}
                          height={56}
                          className={`h-12 sm:h-14 w-auto object-contain ${logoFilter}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
                       {/* More partners text - visible on mobile, hidden on desktop */}
            <div className="md:hidden mt-4">
              <span className={`text-base font-medium ${textColor} leading-[1.5]`}>About us →</span>
            </div>
         </div>
        
        {/* More Partners Link - Right on desktop, hidden on mobile */}
        <div className="hidden md:flex items-center order-3">
          <span className={`text-base font-medium ${textColor}`}>About us →</span>
        </div>
      </div>
    </section>
  );
}
