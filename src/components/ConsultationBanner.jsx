"use client";


export default function ConsultationBanner() {
  return (
    <div className="section-mobile mt-20">
      <div className="mx-auto max-w-[400px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] px-3 sm:px-6 md:px-0">
        <div className="rounded-[10px] overflow-hidden inline-block w-full" style={{ borderRadius: "10px", overflow: "hidden", display: "block" }}>
          <div className="overflow-hidden relative rounded-[10px] main-container min-h-[320px] md:min-h-[240px]" style={{ borderRadius: "10px", minHeight: "240px" }}>
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/consultationbanner.png')" }}></div>
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
                padding: 8px !important;
                min-height: 160px !important;
                gap: 0px !important;
              }
              .mobile-container[style] {
                gap: 0px !important;
              }
              .grid {
                gap: 0px !important;
              }
              .grid.grid-cols-2 {
                gap: 0px !important;
              }
              div[class*="grid"] {
                gap: 0px !important;
              }
              .no-gap {
                gap: 0px !important;
                column-gap: 0px !important;
                row-gap: 0px !important;
              }
              .mobile-container > div:last-child {
                min-height: 160px !important;
                height: 160px !important;
              }
              .mobile-text {
                padding: 8px 4px !important;
              }
              .mobile-text h4 {
                font-size: 16px !important;
                line-height: 1.3 !important;
                margin-bottom: 6px !important;
                text-align: left !important;
              }
              .mobile-text p {
                font-size: 11px !important;
                line-height: 1.4 !important;
                margin-bottom: 12px !important;
                text-align: left !important;
              }
              .mobile-text button {
                font-size: 10px !important;
                padding: 6px 12px !important;
                margin-left: 0 !important;
              }
              .main-container {
                min-height: 160px !important;
                height: 160px !important;
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
              .mobile-image {
                justify-content: center !important;
              }
              .mobile-image > div {
                width: 60px !important;
                height: 60px !important;
              }
              .flex.items-center.gap-1 {
                gap: 0px !important;
              }
            }
            @media (min-width: 768px) {
              .main-container {
                min-height: 240px !important;
              }
              .mobile-container {
                min-height: 240px !important;
                gap: 0px !important;
                align-items: center !important;
              }
              .desktop-banner {
                gap: 0px !important;
              }
              .section-mobile {
                margin-top: 0 !important;
                margin-bottom: 0 !important;
              }
              .mobile-text {
                padding: 16px 8px !important;
                max-width: none !important;
              }
              .mobile-image {
                align-items: center !important;
                justify-content: flex-end !important;
                padding-right: 40px !important;
              }
              .mobile-image > div {
                top: 40% !important;
                transform: translateY(-50%) !important;
              }
              div[class*="w-24"] {
                top: 40% !important;
                transform: translateY(-50%) !important;
              }
              div[class*="w-32"] {
                top: 40% !important;
                transform: translateY(-50%) !important;
              }
              .desktop-image {
                position: relative !important;
                top: 40% !important;
                transform: translateY(-50%) !important;
              }
            }
          `}</style>
          <div className="grid grid-cols-1 md:grid-cols-[8fr_2fr] items-center min-h-[280px] md:min-h-[240px] mobile-container no-gap rounded-[10px] overflow-hidden relative z-10 desktop-banner">
            {/* Left: Text and Button */}
            <div className="p-4 md:p-6 md:pl-14 lg:pl-6 md:ml-6 lg:ml-8 col-span-1 flex flex-col justify-center mobile-text" style={{ maxWidth: 'none' }}>
              <h4 className="text-left font-semibold text-lg md:text-xl">
              Free 20 minutes Assessments
              </h4>
              
              <p className="text-xs md:text-base mb-6 md:mb-8 text-left">
              Confused where to start ? Book a free session with our psychologist.
              </p>
              
              <div className="flex items-center gap-1">
                <button className="text-gray-900 px-4 py-2 md:px-3 md:py-2 rounded-lg md:rounded-2xl text-xs md:text-sm font-medium transition-all duration-200 hover:opacity-90 flex items-center gap-2 md:gap-2 w-fit mx-auto md:mx-0" style={{ backgroundColor: 'white' }}>
                  <span>Book a Google Meet now.</span>
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
