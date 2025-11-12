"use client";


export default function ConsultationBanner() {
  return (
    <div className="section-mobile mt-16">
      <div className="mx-auto max-w-[400px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] px-3 sm:px-6 md:px-0">
        <div className="rounded-[10px] overflow-hidden inline-block w-full" style={{ borderRadius: "10px", overflow: "hidden", display: "block" }}>
          <div className="overflow-hidden relative rounded-[10px] main-container min-h-[320px] md:min-h-[240px]" style={{ borderRadius: "10px", minHeight: "240px" }}>
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/consultationbanner.png')" }}></div>
          <style jsx>{`
            .main-container {
              border-radius: 10px;
              overflow: hidden;
            }
            .mobile-container {
              border-radius: 10px;
              overflow: hidden;
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              .main-container {
                min-height: 220px;
              }
              .mobile-text h4 {
                font-size: 18px;
                line-height: 1.35;
              }
              .mobile-text p {
                font-size: 13px;
                line-height: 1.45;
              }
              .mobile-text button {
                font-size: 12px;
                padding: 8px 16px;
              }
            }
            @media (max-width: 767px) {
              .section-mobile > div,
              .section-mobile > div > div {
                margin-top: 0;
                margin-bottom: 0;
                padding-top: 0;
                padding-bottom: 0;
              }
              .mobile-container {
                padding: 8px;
                min-height: 160px;
                gap: 0px;
              }
              .mobile-container[style] {
                gap: 0px;
              }
              .grid {
                gap: 0px;
              }
              .grid.grid-cols-2 {
                gap: 0px;
              }
              div[class*="grid"] {
                gap: 0px;
              }
              .no-gap {
                gap: 0px;
                column-gap: 0px;
                row-gap: 0px;
              }
              .mobile-container > div:last-child {
                min-height: 160px;
                height: 160px;
              }
              .mobile-text {
                padding: 8px 4px;
              }
              .mobile-text h4 {
                font-size: 16px;
                line-height: 1.3;
                margin-bottom: 6px;
                text-align: left;
              }
              .mobile-text p {
                font-size: 11px;
                line-height: 1.4;
                margin-bottom: 12px;
                text-align: left;
              }
              .mobile-text button {
                font-size: 10px;
                padding: 6px 12px;
                margin-left: 0;
              }
              .main-container {
                min-height: 160px;
                height: 160px;
                padding: 0;
                margin-top: 0;
                margin-bottom: 0;
              }
              .section-mobile {
                padding: 0;
              }
              .section-mobile > div {
                padding-top: 0;
                padding-bottom: 0;
                margin-top: 0;
                margin-bottom: 0;
              }
              .mobile-image {
                justify-content: center;
              }
              .mobile-image > div {
                width: 60px;
                height: 60px;
              }
              .flex.items-center.gap-1 {
                gap: 0px;
              }
            }
            @media (min-width: 768px) {
              .main-container {
                min-height: 240px;
              }
              .mobile-container {
                min-height: 240px;
                gap: 0px;
                align-items: center;
              }
              .desktop-banner {
                gap: 0px;
              }
              .section-mobile {
                margin-top: 0;
                margin-bottom: 0;
              }
              .mobile-text {
                padding: 16px 8px;
                max-width: none;
              }
              .mobile-image {
                align-items: center;
                justify-content: flex-end;
                padding-right: 40px;
              }
              .mobile-image > div {
                top: 40%;
                transform: translateY(-50%);
              }
              div[class*="w-24"] {
                top: 40%;
                transform: translateY(-50%);
              }
              div[class*="w-32"] {
                top: 40%;
                transform: translateY(-50%);
              }
              .desktop-image {
                position: relative;
                top: 40%;
                transform: translateY(-50%);
              }
            }
          `}</style>
          <div className="grid grid-cols-1 md:grid-cols-[8fr_2fr] items-center min-h-[280px] md:min-h-[240px] mobile-container no-gap rounded-[10px] overflow-hidden relative z-10 desktop-banner">
            {/* Left: Text and Button */}
            <div className="p-4 md:p-6 md:pl-14 lg:pl-6 md:ml-6 lg:ml-8 col-span-1 flex flex-col justify-center mobile-text" style={{ maxWidth: 'none' }}>
              <h4 className="text-left font-semibold text-lg md:text-xl">
              Confused where to start?
              </h4>
              
              <p className="text-xs md:text-base mb-6 md:mb-8 text-left">
               Book a free 20 minutes session with our psychologist.
              </p>
              
              <div className="flex items-center gap-1">
                <button className="text-gray-900 px-4 py-2 md:px-3 md:py-2 rounded-lg md:rounded-2xl text-xs md:text-sm font-medium transition-all duration-200 hover:opacity-90 flex items-center gap-2 md:gap-2 w-fit mx-auto md:mx-0" style={{ backgroundColor: 'white' }}>
                  <span>Book Your Slot Now</span>
                  <div className="w-4 h-4 md:w-7 md:h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#bed39c' }}>
                    <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                {/* Image next to button */}
                <div className="mobile-image md:hidden">
                  <div className="w-16 h-16 rounded-[10px] overflow-hidden">
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

            {/* Right: Image - Desktop only */}
            <div className="mobile-image relative h-full col-span-1 hidden md:flex justify-center items-center p-8">
              <div className="desktop-image overflow-hidden" style={{ width: '128px', height: '128px', borderRadius: '20px' }}>
                <img
                  src="/consultation.png"
                  alt="Consultation"
                  width={128}
                  height={128}
                  className="object-cover"
                  style={{ borderRadius: '20px', width: '100%', height: '100%' }}
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
