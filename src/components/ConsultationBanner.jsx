"use client";

import { useRouter } from 'next/navigation';

export default function ConsultationBanner() {
  const router = useRouter();
  return (
    <div className="section-mobile mt-16">
      <div className="mx-auto max-w-[400px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] px-3 sm:px-6 md:px-6 lg:px-0">
        <div className="rounded-[10px] overflow-hidden inline-block w-full" style={{ borderRadius: "10px", overflow: "hidden", display: "block" }}>
          <div className="overflow-hidden relative rounded-[10px] main-container min-h-[280px] md:min-h-[200px]" style={{ borderRadius: "10px", minHeight: "200px" }}>
            <div className="absolute top-0 left-0 right-0 bg-cover bg-center bg-no-repeat rounded-[10px]" style={{ backgroundImage: "url('/consultationbanner.png')", zIndex: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '10px', height: '180px', maxHeight: '180px', width: '100%' }}></div>
          <style jsx>{`
            .main-container {
              border-radius: 10px;
              overflow: hidden;
            }
            .main-container > div[class*="absolute"][class*="bg-cover"] {
              height: 180px !important;
              max-height: 180px !important;
            }
            @media (min-width: 768px) {
              .main-container > div[class*="absolute"][class*="bg-cover"] {
                height: 200px !important;
                max-height: 200px !important;
              }
            }
            .mobile-container {
              border-radius: 10px;
              overflow: hidden;
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              .main-container {
                min-height: 180px;
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
              .mobile-image {
                overflow: visible !important;
              }
              .desktop-image {
                overflow: visible !important;
                width: 130px !important;
                height: 180px !important;
              }
              .desktop-image img {
                object-fit: contain !important;
                object-position: center !important;
                width: 100% !important;
                height: 100% !important;
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
              .main-container {
                position: relative;
                overflow: hidden;
              }
              .main-container > div[class*="absolute"] {
                z-index: 0;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                width: 100%;
                height: 180px;
                max-height: 180px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 10px !important;
              }
              .mobile-container {
                padding: 8px;
                min-height: 180px;
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
                min-height: 180px;
                height: 180px;
              }
              .mobile-text {
                padding: 0px 4px 0px 4px !important;
                padding-top: 0px !important;
                max-width: 280px;
              }
              div[class*="p-4"].mobile-text {
                padding: 0px 4px 0px 4px !important;
                padding-top: 0px !important;
                max-width: 280px;
              }
              .mobile-text h4 {
                font-size: 16px;
                line-height: 1.3;
                margin-bottom: 4px;
                margin-top: -8px;
                text-align: left;
              }
              .mobile-text p.text-xs {
                font-size: 12px !important;
                line-height: 1.2 !important;
                margin-bottom: 8px;
                text-align: left;
              }
              .mobile-text p {
                font-size: 9px !important;
                line-height: 1.2 !important;
                margin-bottom: 8px;
                text-align: left;
              }
              .mobile-text button {
                font-size: 11px !important;
                padding: 7px 14px !important;
                margin-left: 0;
              }
              .mobile-text .flex.items-center.gap-1 {
                margin-top: 20px;
              }
              .main-container {
                min-height: 180px;
                height: 180px;
                max-height: 180px;
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
                margin: 0;
                padding: 0;
              }
              .mobile-image > div {
                margin: 0;
                margin-top: -80px !important;
                padding: 0 !important;
                width: 70px;
                height: 100px;
              }
              .mobile-image > div img {
                padding: 0 !important;
                margin: 0 !important;
              }
              .flex.items-center.gap-1 {
                gap: 0px;
                margin-bottom: 0;
                padding-bottom: 0;
              }
              .mobile-text > div:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
              }
            }
            @media (min-width: 768px) {
              .main-container {
                min-height: 200px;
              }
              .mobile-container {
                min-height: 200px;
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
                padding: 0;
                margin: 0;
              }
              .desktop-image img {
                padding: 0;
                margin: 0;
              }
            }
          `}</style>
          <div className="grid grid-cols-1 md:grid-cols-[8fr_2fr] items-center min-h-[280px] md:min-h-[240px] mobile-container no-gap rounded-[10px] overflow-hidden relative z-10 desktop-banner">
            {/* Left: Text and Button */}
            <div className="p-4 md:p-6 md:pl-14 lg:pl-6 md:ml-6 lg:ml-8 col-span-1 flex flex-col justify-center mobile-text" style={{ maxWidth: 'none' }}>
              <h4 className="text-left font-semibold text-lg md:text-xl">
              Confused where to start?
              </h4>
              
              <p className="text-xs md:text-base mb-4 md:mb-8 text-left" style={{ marginBottom: '8px' }}>
               Book a free 20 minutes  session<br className="md:hidden" /> with our psychologist.
              </p>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => router.push('/free-assessment')}
                  className="text-gray-900 px-4 py-2 md:px-3 md:py-2 rounded-lg md:rounded-2xl text-xs md:text-sm font-medium transition-all duration-200 hover:opacity-90 flex items-center gap-2 md:gap-2 w-fit mx-auto md:mx-0" 
                  style={{ backgroundColor: 'white' }}
                >
                  <span>Book Your Slot Now</span>
                  <div className="w-4 h-4 md:w-7 md:h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#bed39c' }}>
                    <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                {/* Image next to button */}
                <div className="mobile-image md:hidden">
                  <div className="w-[70px] h-[100px] rounded-[10px] overflow-hidden" style={{ padding: 0, margin: 0 }}>
                    <img
                      src="/consultation.png"
                      alt="Consultation"
                      className="w-full h-full object-cover"
                      style={{ padding: 0, margin: 0 }}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image - Desktop only */}
            <div className="mobile-image relative h-full col-span-1 hidden md:flex justify-center items-center p-8">
              <div className="desktop-image overflow-hidden" style={{ width: '112px', height: '160px', borderRadius: '10px', padding: 0, margin: 0 }}>
                <img
                  src="/consultation.png"
                  alt="Consultation"
                  width={112}
                  height={160}
                  className="object-cover"
                  style={{ borderRadius: '10px', width: '100%', height: '100%', padding: 0, margin: 0 }}
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
