"use client";
import Image from "next/image";
import { useState, useRef } from "react";

export default function HowItWorks() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
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
      title: "Explore Your Matches",
      gradient: "conic-gradient(at 50% 50%, #f5f3ff 0deg, #ede9fe 120deg, #e9d5ff 240deg, #f5f3ff 360deg)",
      tags: ["Anxiety and Depression", "Accepts Cigna Health Plans", "Available this week"],
      description: "Browse profiles of ADHD specialists who fit your child's needs."
    },
    {
      id: 2,
      number: "02", 
      title: "Explore your matches",
      gradient: "conic-gradient(at 50% 50%, #ecfdf5 0deg, #d1fae5 140deg, #a7f3d0 280deg, #ecfdf5 360deg)",
      description: "Browse profiles of licensed providers who match your preferences."
    },
    {
      id: 3,
      number: "03",
      title: "Schedule your visit", 
      gradient: "conic-gradient(at 50% 50%, #fff7ed 0deg, #ffedd5 150deg, #fed7aa 300deg, #fff7ed 360deg)",
      description: "Choose your preferred time and meet with provider as soon as tomorrow."
    },
    {
      id: 4,
      number: "04",
      title: "Join your online session",
      gradient: "conic-gradient(at 50% 50%, #ecfeff 0deg, #cffafe 160deg, #bae6fd 320deg, #ecfeff 360deg)",
      description: "Connect with your provider over live video from wherever you feel comfortable."
    }
  ];

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

  // Handle scroll events to sync with navigation dots
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 320; // Fixed card width (w-80 = 320px)
      const gap = 16; // gap-4 = 16px
      const totalCardWidth = cardWidth + gap;
      const newSlide = Math.round(scrollLeft / totalCardWidth);
      setCurrentSlide(Math.min(newSlide, carouselData.length - 1));
    }
  };

  // Scroll to specific slide
  const scrollToSlide = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Fixed card width (w-80 = 320px)
      const gap = 16; // gap-4 = 16px
      const totalCardWidth = cardWidth + gap;
      scrollContainerRef.current.scrollTo({
        left: index * totalCardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="how-it-works" className="w-full mobile-section mb-12 md:mb-16">
      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-section {
            margin-top: 8px !important;
          }
        }
        .card-bg-mobile {
          background-size: cover !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          background-attachment: initial !important;
        }
        @media (max-width: 768px) {
          .card-bg-mobile {
            background-size: 100% 100% !important;
            background-position: center top !important;
          }
        }
      `}</style>
      <div className="mx-auto flex max-w-[1400px] flex-col justify-center px-8 lg:px-12 pt-2 md:pt-4 pb-6 md:pb-8">
        <h2 className="text-center md:text-center text-[18px] font-medium tracking-tight text-gray-900 leading-none mt-2">
          How it works
        </h2>

        {/* Inline CTA under the heading */}
        <div className="mt-2 mb-6 text-center md:text-center">
          <h3 className="text-4xl md:text-5xl font-medium text-gray-900 leading-none tracking-tight md:tracking-normal">
            Your journey to mental well-being gets easier<br />from here.
          </h3>
          <button
            type="button"
            className="mt-5 inline-flex items-center rounded-full bg-black px-[26px] md:px-[32px] py-2.5 text-sm md:text-sm font-medium text-white hover:bg-black/85 shadow-sm"
          >
            Get started
          </button>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6 max-w-7xl mx-auto px-0">
          {/* Mobile Carousel */}
          <div className="md:hidden w-full max-w-sm mx-auto">
            {/* Scrollable Carousel Container */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="relative overflow-x-auto overflow-y-hidden rounded-2xl carousel-scroll snap-x snap-mandatory"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              <div className="flex gap-4 pb-4">
                {carouselData.map((card, index) => (
                  <div 
                    key={card.id} 
                    className="flex-shrink-0 snap-start"
                  >
                    <div
                      className="rounded-lg p-4 h-[280px] w-[380px] flex flex-col justify-between card-bg-mobile"
                      style={{ 
                        backgroundImage: card.id === 1 ? "url('/1.png')" : card.id === 2 ? "url('/2.png')" : card.id === 3 ? "url('/3.png')" : card.id === 4 ? "url('/4.png')" : card.gradient,
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                        backgroundRepeat: "no-repeat",
                        backgroundAttachment: "scroll"
              }}
            >
              {/* Header Section */}
              <div className="flex-shrink-0">
                        <div className="text-xl font-medium text-indigo-900 text-center">{card.number}</div>
                        <h3 className="mt-0 text-sm font-medium text-gray-900 text-center">
                          {card.title}
                        </h3>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col justify-center">
                        {/* Card-specific content */}
                        {card.id === 1 && (
                          <div className="mt-2 flex flex-col gap-1 items-center">
                            {card.tags.map((label) => (
                              <div
                                key={label}
                                className="inline-flex w-fit items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-1.5 py-0.5 text-xs text-gray-900"
                              >
                                <span className="text-indigo-700 text-xs">✓</span>
                                <span>{label}</span>
                              </div>
                            ))}
                          </div>
                        )}


                        {card.id === 3 && (
                          <>
                          <div className="mt-6 flex justify-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-sm text-gray-900">
                                <span className="text-indigo-700">📅</span>
                                <span>Evenings After 4pm</span>
                              </div>
                            </div>
                            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-700">
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
                          </>
                        )}

                      </div>

                      {/* Footer Section */}
                      <div className="flex-shrink-0">
                        <p className="mt-1 pt-2 text-xs leading-relaxed text-gray-700 text-center px-6">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
                disabled={currentSlide === 0}
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
                disabled={currentSlide === carouselData.length - 1}
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
                backgroundImage: "url('/1.png')",
              }}
            >
            <div className="text-3xl md:text-4xl font-medium text-indigo-900 text-center">01</div>
            <h3 className="mt-3 text-lg md:text-xl font-medium text-gray-900 text-center whitespace-nowrap truncate leading-none">
              Explore Your Matches
            </h3>

            <div className="mt-4 flex-1 flex flex-col gap-3 items-center justify-center">
              {[
                "Anxiety and Depression",
                "Accepts Cigna Health Plans",
                "Available this week",
              ].map((label) => (
                <div
                  key={label}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-sm text-gray-900"
                >
                  <span className="text-indigo-700">✓</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <p className="mt-auto mb-2.5 text-sm leading-relaxed text-gray-700">
              Browse profiles of ADHD specialists who fit your child's needs.
            </p>
          </div>

            {/* Card 02 - Desktop */}
          <div
              className="rounded-2xl p-6 h-[350px] w-[290px] flex-shrink-0 flex flex-col bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/2.png')",
              }}
            >
            <div className="text-3xl md:text-4xl font-medium text-indigo-900 text-center">02</div>
            <h3 className="mt-2 text-lg md:text-xl font-medium text-gray-900 text-center whitespace-nowrap truncate leading-none">
              Explore your matches
            </h3>


            <p className="mt-auto mb-2.5 text-sm leading-relaxed text-gray-700">
              Browse profiles of licensed providers who match
              your preferences.
            </p>
          </div>

            {/* Card 03 - Desktop */}
          <div
              className="rounded-2xl p-6 h-[350px] w-[290px] flex-shrink-0 flex flex-col bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/3.png')",
              }}
            >
            <div className="text-3xl md:text-4xl font-medium text-indigo-900 text-center">03</div>
            <h3 className="mt-4 text-lg md:text-xl font-medium text-gray-900 text-center whitespace-nowrap truncate leading-none">
              Schedule your visit
            </h3>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-sm text-gray-900">
                  <span className="text-indigo-700">📅</span>
                  <span>Evenings After 4pm</span>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-700">
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

            <p className="mt-auto mb-2.5 text-sm leading-relaxed text-gray-700">
              Choose your preferred time and meet with provider as soon as
              tomorrow.
            </p>
          </div>

            {/* Card 04 - Desktop */}
          <div
              className="rounded-2xl p-6 h-[350px] w-[290px] flex-shrink-0 flex flex-col bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/4.png')",
              }}
            >
            <div className="text-3xl md:text-4xl font-medium text-indigo-900 text-center">04</div>
            <h3 className="mt-4 text-lg md:text-xl font-medium text-gray-900 text-center whitespace-nowrap truncate leading-none">
              Join your online session
            </h3>


            <p className="mt-auto mb-2.5 text-sm leading-relaxed text-gray-700">
              Connect with your provider over live video from wherever you are.
            </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


