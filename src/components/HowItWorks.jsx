"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HowItWorks() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const trackRef = useRef(null);
  const isAdjustingRef = useRef(false);
  const avatars = [
    "/hero.png",
    "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
    "/hero.png",
    "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
    "/hero.png",
  ];

  const carouselData = [
    {
      id: 1,
      number: "01",
      title: "Tell Us What's Important",
      gradient: "radial-gradient(circle at top right, #fffdff 0%, #fffdff 30%, #d6cae9 50%, #b19cd3 100%)",
      tags: ["Assessment", "Child counselling", "Better parenting"],
      description: "Choose what do you want to prioritize to get started."
    },
    {
      id: 2,
      number: "02", 
      title: "Explore Your Matches",
      gradient: "conic-gradient(at 50% 50%, #ecfdf5 0deg, #d1fae5 140deg, #a7f3d0 280deg, #ecfdf5 360deg)",
      description: "Choose a therapist for you and your child."
    },
    {
      id: 3,
      number: "03",
      title: "Schedule Your Visit", 
      gradient: "conic-gradient(at 50% 50%, #fff7ed 0deg, #ffedd5 150deg, #fed7aa 300deg, #fff7ed 360deg)",
      description: "Choose your preferred slot & Get started as early as today."
    },
    {
      id: 4,
      number: "04",
      title: "Join Online Session",
      gradient: "conic-gradient(at 50% 50%, #ecfeff 0deg, #cffafe 160deg, #bae6fd 320deg, #ecfeff 360deg)",
      description: "Join sessions on Google Meet from your comfort place."
    }
  ];

  useEffect(() => {
    const container = scrollContainerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const centerFirstSlide = () => {
      const firstSlide = track.querySelector('[data-slide-index="0"]');
      if (!firstSlide) return;
      isAdjustingRef.current = true;
      const containerWidth = container.offsetWidth;
      const targetCenter = firstSlide.offsetLeft + firstSlide.offsetWidth / 2;
      container.scrollLeft = Math.max(targetCenter - containerWidth / 2, 0);
      requestAnimationFrame(() => {
        isAdjustingRef.current = false;
      });
    };

    centerFirstSlide();
    window.addEventListener("resize", centerFirstSlide);
    return () => {
      window.removeEventListener("resize", centerFirstSlide);
    };
  }, []);

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % carouselData.length;
    setCurrentSlide(newSlide);
    scrollToSlide(newSlide);
  };

  const prevSlide = () => {
    const newSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
    setCurrentSlide(newSlide);
    scrollToSlide(newSlide);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    scrollToSlide(index);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    const track = trackRef.current;
    if (!container || !track || isAdjustingRef.current) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;

    let closestIndex = 0;
    let smallestDiff = Infinity;
    const slides = track.querySelectorAll('[data-slide-index]');
    slides.forEach((slide) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const diff = Math.abs(containerCenter - slideCenter);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIndex = Number(slide.getAttribute("data-slide-index") || 0);
    }
    });

    setCurrentSlide(closestIndex);
  };

  const scrollToSlide = (index, behavior = 'smooth') => {
    const container = scrollContainerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const target = track.querySelector(`[data-slide-index="${index}"]`);
    if (!target) return;
    const containerWidth = container.offsetWidth;
    const targetCenter = target.offsetLeft + target.offsetWidth / 2;
    const newScrollLeft = targetCenter - containerWidth / 2;
    isAdjustingRef.current = true;
    container.scrollTo({
      left: newScrollLeft,
      behavior,
    });
    requestAnimationFrame(() => {
      isAdjustingRef.current = false;
      });
  };

  return (
    <section id="how-it-works" className="w-full mobile-section mt-16">
      <style jsx>{`
        @media (min-width: 768px) and (max-width: 1023px) {
          .how-it-works-card {
            height: 320px;
            width: 300px;
          }
          .how-it-works-title {
            font-size: 20px;
            margin-bottom: 14px;
          }
          .how-it-works-description {
            font-size: 14px;
            line-height: 1.4;
          }
          .how-it-works-heading {
            font-size: 32px;
            font-weight: 600;
            line-height: 1.1;
          }
        }
        @media (max-width: 767px) {
          .mobile-section {
            margin-top: 8px;
          }
          .how-it-works-card {
            height: 280px;
            width: clamp(240px, 80vw, 320px);
          }
          .how-it-works-title {
            font-size: 18px;
            margin-bottom: 12px;
          }
          .how-it-works-description {
            font-size: 13px;
            line-height: 1.3;
          }
          .how-it-works-heading {
            font-size: 28px;
            font-weight: 600;
            line-height: 0.95;
          }
        }
        .card-bg-mobile {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: initial;
        }
        @media (max-width: 768px) {
          .card-bg-mobile {
            background-size: 100% 100%;
            background-position: center top;
          }
          .card-2-inner-image {
            margin-top: 10px;
          }
        }
        @media (max-width: 767px) {
          .how-it-works-carousel {
            scroll-padding-inline: clamp(18px, 7vw, 32px);
            padding-bottom: 12px;
            margin-inline: 0;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .how-it-works-carousel::-webkit-scrollbar {
            display: none;
          }
          .how-it-works-track {
            gap: clamp(16px, 5vw, 24px);
            padding-inline: clamp(18px, 7vw, 32px);
          }
          .how-it-works-slide {
            flex: 0 0 82%;
            scroll-snap-align: center;
          }
          .how-it-works-track > .how-it-works-slide:first-child {
            margin-left: calc((100% - 82%) / 2);
          }
          .how-it-works-track > .how-it-works-slide:last-child {
            margin-right: calc((100% - 82%) / 2);
          }
        }
      `}</style>
      <div className="mx-auto flex max-w-[1400px] flex-col justify-center px-4 lg:px-6">
        <p className="text-center md:text-center mt-2 text-sm md:text-base">
          How it works
        </p>

        {/* Inline CTA under the heading */}
        <div className="mt-3 mb-8 md:mb-6 text-center md:text-center px-4">
          <h3 className="how-it-works-heading text-center text-base md:text-xl lg:text-2xl" style={{ fontWeight: 500 }}>
          Your journey to a happier, calmer home begins here.
          </h3>
          <button
            type="button"
            className="mt-4 md:mt-5 inline-flex items-center rounded-full px-6 md:px-8 py-2.5 text-sm md:text-sm font-medium text-white shadow-sm transition-colors duration-200"
            style={{ backgroundColor: '#15171A' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2d33'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#15171A'}
            onClick={() => router.push('/psychologists')}
          >
            Get started
          </button>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6 max-w-7xl mx-auto px-0">
          {/* Mobile Carousel */}
          <div className="md:hidden w-full">
            <div className="relative">
              {/* Scrollable Carousel Container */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="how-it-works-carousel relative overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
              >
                <div ref={trackRef} className="how-it-works-track flex pb-4">
                {carouselData.map((card, index) => (
                  <div 
                    key={`${card.id}-${index}`} 
                    className="how-it-works-slide flex-shrink-0 snap-center"
                    data-slide-index={index}
                  >
                    <div
                      className="how-it-works-card p-4 h-[280px] w-full flex flex-col justify-between card-bg-mobile"
                      style={{ 
                        backgroundImage: card.id === 1 ? "url('/howitworks1.png')" : card.id === 2 ? "url('/howitworks2.webp')" : card.id === 3 ? "url('/howitworks3.png')" : card.id === 4 ? "url('/howitworks4.webp')" : card.gradient,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundAttachment: "scroll",
                        backgroundColor: card.id === 2 ? "#f0f0f0" : "transparent"
              }}
            >
              {/* Header Section */}
                      <div className="flex-shrink-0" style={card.id === 2 ? { marginBottom: '-10px' } : {}}>
                        <div className="text-xl font-medium text-gray-900 text-center" style={{ marginBottom: card.id === 2 ? '8px' : '12px' }}>{card.number}</div>
                        <h6 className="how-it-works-title text-center font-semibold text-base" style={card.id === 2 ? { marginBottom: '0px' } : {}}>
                          {card.title}
                        </h6>
                      </div>

                      {/* Content Section */}
                      <div className={`flex-1 flex flex-col ${card.id === 2 ? '' : 'justify-center'}`} style={card.id === 2 ? { padding: 0, marginTop: '-50px', marginBottom: '-25px' } : {}}>
                        {/* Card-specific content */}
                        {card.id === 1 && (
                          <div className="space-y-2 flex flex-col items-center">
                            {card.tags && card.tags.map((tag, idx) => (
                              <div key={idx} className="bg-white/90 rounded-full px-3 py-1.5 border border-gray-200 flex items-center gap-2 w-fit">
                                <div className="w-5 h-5 rounded-full border border-gray-800 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3.5 h-3.5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-gray-900 whitespace-nowrap text-center tracking-tight" style={{ letterSpacing: '-0.01em' }}>{tag}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {card.id === 2 && (
                          <div className="flex flex-col items-center card-2-inner-image" style={{ margin: '-85px 0', padding: 0 }}>
                            <div className="relative" style={{ width: '200px', height: '200px', padding: 0, margin: 0 }}>
                              <Image
                                src="/howitworks2inner.png"
                                alt="Doctor"
                                fill
                                className="object-contain"
                                sizes="200px"
                                style={{ padding: '0', margin: '0', display: 'block' }}
                              />
                            </div>
                            {/* Doctor Information */}
                            <div className="text-center" style={{ marginTop: '-50px' }}>
                              <div className="text-xs font-bold text-gray-900">Aswathy Sampath</div>
                              <div className="text-xs text-gray-600">M.Phil, Clinical Psychologist</div>
                            </div>
                          </div>
                        )}

                        {card.id === 3 && (
                          <>
                          <div className="mt-4 flex justify-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-sm text-gray-900">
                                <span className="text-indigo-700">📅</span>
                                <span className="tight-tracking">Evenings After 4pm</span>
                              </div>
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-700">
                              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                                <div
                                  key={d}
                                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                                    d === "Tu" || d === "Fr" ? "bg-white/90 border border-gray-200" : ""
                                  }`}
                                >
                                  {d}
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {card.id === 4 && (
                          <div className="flex justify-center items-center" style={{ margin: '-45px 0', padding: 0 }}>
                            <div className="relative" style={{ width: '170px', height: '170px', padding: 0, margin: 0 }}>
                              <Image
                                src="/howitworks4inner.svg"
                                alt="Session"
                                fill
                                className="object-contain"
                                sizes="170px"
                                style={{ padding: '0', margin: '0', display: 'block' }}
                              />
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Footer Section */}
                      <div className="flex-shrink-0" style={card.id === 2 ? { marginTop: '-25px' } : card.id === 4 ? { marginTop: '-5px' } : {}}>
                        <p className="how-it-works-description text-center px-4 text-xs" style={card.id === 2 ? { marginTop: '0px', paddingTop: '0px', lineHeight: '1.2' } : card.id === 4 ? { marginTop: '5px', paddingTop: '0px', lineHeight: '1.2' } : { marginTop: '4px', paddingTop: '8px' }}>
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 gap-2">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-between items-center mt-4 px-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <span className="text-sm text-gray-500">
                {currentSlide + 1} of {carouselData.length}
              </span>
              
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex flex-row justify-center gap-4 max-w-7xl mx-auto px-0">
            {/* Card 01 - Desktop */}
            <div
              className="rounded-2xl p-6 h-[355px] w-[290px] flex-shrink-0 flex flex-col bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/howitworks1.png')",
              }}
            >
            <div className="text-3xl md:text-4xl font-medium text-gray-900 text-center mb-4">01</div>
            <h6 className="text-center font-semibold">
              Tell Us What's Important
            </h6>

            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-2 flex flex-col items-center">
                <div className="bg-white/90 rounded-full px-3 py-1.5 border border-gray-200 flex items-center gap-2 w-fit">
                  <div className="w-5 h-5 rounded-full border border-gray-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-900 whitespace-nowrap text-center tracking-tight" style={{ letterSpacing: '-0.01em' }}>Assessment</span>
                </div>
                <div className="bg-white/90 rounded-full px-3 py-1.5 border border-gray-200 flex items-center gap-2 w-fit">
                  <div className="w-5 h-5 rounded-full border border-gray-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-900 whitespace-nowrap text-center tracking-tight" style={{ letterSpacing: '-0.01em' }}>Child counselling</span>
                </div>
                <div className="bg-white/90 rounded-full px-3 py-1.5 border border-gray-200 flex items-center gap-2 w-fit">
                  <div className="w-5 h-5 rounded-full border border-gray-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-900 whitespace-nowrap text-center tracking-tight" style={{ letterSpacing: '-0.01em' }}>Better parenting</span>
                </div>
              </div>
            </div>

            <p className="mt-auto mb-2.5 text-center">
            Choose what do you want to prioritize to get started.
            </p>
          </div>

            {/* Card 02 - Desktop */}
            <div
              className="rounded-2xl p-6 h-[350px] w-[290px] flex-shrink-0 flex flex-col bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/howitworks2.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#f0f0f0"
              }}
            >
            <div className="text-3xl md:text-4xl font-medium text-gray-900 text-center mb-2">02</div>
            <h6 className="text-center font-semibold" style={{ marginBottom: '0px' }}>
              Explore Your Matches
            </h6>

            <div className="flex-1 flex items-start justify-center" style={{ paddingBottom: '0px', paddingTop: '0px' }}>
              {/* Inner Image */}
              <div className="flex flex-col items-center" style={{ padding: 0, margin: '-55px 0 -10px 0' }}>
                <div className="relative" style={{ width: '220px', height: '220px', padding: 0, margin: 0, marginBottom: 0 }}>
                  <Image
                    src="/howitworks2inner.png"
                    alt="Doctor"
                    fill
                    className="object-contain"
                    sizes="220px"
                    style={{ padding: '0', margin: '0', display: 'block' }}
                  />
                </div>
                {/* Doctor Information */}
                <div className="text-center" style={{ marginTop: '-60px' }}>
                  <div className="text-sm font-bold text-gray-900">Aswathy Sampath</div>
                  <div className="text-xs text-gray-600">M.Phil, Clinical Psychologist
                  </div>
                </div>
              </div>
            </div>

            <p className="mb-2.5 text-center" style={{ marginTop: '-15px', marginBottom: '10px', lineHeight: '1.2' }}>
              Choose a therapist for you and your child.
            </p>
          </div>

            {/* Card 03 - Desktop */}
          <div
              className="rounded-2xl p-6 h-[350px] w-[290px] flex-shrink-0 flex flex-col bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/howitworks3.png')",
              }}
            >
            <div className="text-3xl md:text-4xl font-medium text-gray-900 text-center mb-4">03</div>
            <h6 className="text-center font-semibold">
              Schedule Your Visit
            </h6>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mt-2 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-sm text-gray-900">
                  <span className="text-indigo-700">📅</span>
                  <span className="tight-tracking">Evenings After 4pm</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-700">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <div
                    key={d}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                      d === "Tu" || d === "Fr" ? "bg-white/90 border border-gray-200" : ""
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-auto mb-2.5 text-center">
              Choose your preferred slot & Get started as early as today.
            </p>
          </div>

            {/* Card 04 - Desktop */}
          <div
              className="rounded-2xl p-6 h-[350px] w-[290px] flex-shrink-0 flex flex-col bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/howitworks4.webp')",
              }}
            >
            <div className="text-3xl md:text-4xl font-medium text-gray-900 text-center mb-4">04</div>
            <h6 className="text-center font-semibold">
              Join Online Session
            </h6>

            {/* Inner Image */}
            <div className="flex flex-col items-center" style={{ padding: 0, margin: '-15px 0 -10px 0' }}>
              <div className="relative" style={{ width: '190px', height: '190px', padding: 0, margin: 0, marginBottom: 0 }}>
                <Image
                  src="/howitworks4inner.svg"
                  alt="Session"
                  fill
                  className="object-contain"
                  sizes="190px"
                  style={{ padding: '0', margin: '0', display: 'block' }}
                />
              </div>
            </div>

            <p className="mb-2.5 text-center" style={{ marginTop: '5px', marginBottom: '10px', lineHeight: '1.2' }}>
              Join sessions on Google Meet from your comfort place.
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


