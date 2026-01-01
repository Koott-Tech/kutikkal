"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { normalizeImageUrl } from '@/utils/urlNormalizer';

export default function LeadershipTeam() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollContainerRef = useRef(null);
    const autoPlayRef = useRef(null);

    const leadershipMembers = [
        {
            name: "Faisal Vysam Purath",
            title: "CEO & Founder",
            image: "https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Faisal.webp"
        },
        {
            name: "Aswathy Usha Raman",
            title: "Chief Psychologist",
            image: "https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Aswathy%20Raman.webp"
        }
    ];

    const nextSlide = () => {
        stopAutoPlay();
        const newSlide = (currentSlide + 1) % leadershipMembers.length;
        setCurrentSlide(newSlide);
        scrollToSlide(newSlide);
        setTimeout(() => startAutoPlay(), 2000);
    };

    const prevSlide = () => {
        stopAutoPlay();
        const newSlide = (currentSlide - 1 + leadershipMembers.length) % leadershipMembers.length;
        setCurrentSlide(newSlide);
        scrollToSlide(newSlide);
        setTimeout(() => startAutoPlay(), 2000);
    };

    const goToSlide = (index) => {
        stopAutoPlay();
        setCurrentSlide(index);
        scrollToSlide(index);
        setTimeout(() => startAutoPlay(), 2000);
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const cardWidth = 320;
            const gap = 8;
            const totalCardWidth = cardWidth + gap;
            const newSlide = Math.round(scrollLeft / totalCardWidth);
            setCurrentSlide(Math.min(newSlide, leadershipMembers.length - 1));
        }
    };

    const scrollToSlide = (index) => {
        if (scrollContainerRef.current) {
            const cardWidth = 320;
            const gap = 8;
            const totalCardWidth = cardWidth + gap;
            scrollContainerRef.current.scrollTo({
                left: index * totalCardWidth,
                behavior: 'smooth'
            });
        }
    };

    const startAutoPlay = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
        autoPlayRef.current = setInterval(() => {
            setCurrentSlide((prev) => {
                const next = (prev + 1) % leadershipMembers.length;
                scrollToSlide(next);
                return next;
            });
        }, 5000);
    };

    const stopAutoPlay = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }
    };

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [touchHoldTimer, setTouchHoldTimer] = useState(null);
    const [isHolding, setIsHolding] = useState(false);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        stopAutoPlay();
        
        // Start touch hold timer
        const timer = setTimeout(() => {
            setIsHolding(true);
            stopAutoPlay();
        }, 300);
        setTouchHoldTimer(timer);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
        // If moved significantly, cancel hold
        if (touchStart && Math.abs(e.targetTouches[0].clientX - touchStart) > 10) {
            if (touchHoldTimer) {
                clearTimeout(touchHoldTimer);
                setTouchHoldTimer(null);
            }
            setIsHolding(false);
        }
    };

    const onTouchEnd = () => {
        // Clear hold timer
        if (touchHoldTimer) {
            clearTimeout(touchHoldTimer);
            setTouchHoldTimer(null);
        }
        
        if (isHolding) {
            setIsHolding(false);
            // If was holding, don't swipe, just resume autoplay after delay
            setTimeout(() => {
                startAutoPlay();
            }, 3000);
            return;
        }
        
        if (!touchStart || !touchEnd) {
            setTimeout(() => {
                startAutoPlay();
            }, 3000);
            return;
        }
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
        
        setTimeout(() => {
            startAutoPlay();
        }, 3000);
    };

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, []);
  useEffect(() => {
    const styleId = 'leadership-image-border-radius';
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = `
      @media (max-width: 767px) {
        .leadership-image-container {
          border-radius: 10px !important;
          overflow: hidden !important;
        }
        .leadership-image-container * {
          border-radius: 10px !important;
        }
        .leadership-image-container img,
        .leadership-image-container span,
        .leadership-image-container span img,
        .leadership-image-container > *,
        .leadership-image-container > * > * {
          border-radius: 10px !important;
          overflow: hidden !important;
        }
      }
    `;
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .leadership-image-container {
            border-radius: 10px !important;
            overflow: hidden !important;
          }
          .leadership-image-container * {
            border-radius: 10px !important;
          }
          .leadership-image-container img,
          .leadership-image-container span,
          .leadership-image-container span img,
          .leadership-image-container > *,
          .leadership-image-container > * > * {
            border-radius: 10px !important;
            overflow: hidden !important;
          }
        }
      `}} />
    <div className="px-4 md:px-[50px]">
      <section className="w-full mt-24">
        <div className="w-full">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 
              className="text-[2.5rem] md:text-[3.75rem] font-medium md:font-[500] leading-[110%] md:leading-[106%] tracking-[-0.125rem] md:tracking-[-0.195rem] mb-4"
              style={{
                color: '#1d1733'
              }}
            >
              Leadership
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the team shaping our unique approach to mental healthcare.
            </p>
          </div>

          {/* Desktop: Team Members Grid */}
          <div className="hidden md:flex flex-wrap justify-center gap-8">
            {leadershipMembers.map((member, index) => (
              <div key={index} className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden rounded-[10px] leadership-image-container" suppressHydrationWarning>
                <Image
                    src={normalizeImageUrl(member.image)}
                    alt={`${member.name} - ${member.title} at Little Care`}
                  width={320}
                  height={320}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                  <h5 className="text-sm md:text-base font-medium text-gray-900 mb-1">{member.name}</h5>
                  <p className="text-gray-600">{member.title}</p>
                </div>
              </div>
            ))}
            </div>

          {/* Mobile: Carousel */}
          <div className="block md:hidden w-full mt-6 mx-auto max-w-sm px-4">
            {/* Scrollable Carousel Container */}
            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="relative overflow-x-auto overflow-y-hidden rounded-[10px] carousel-scroll snap-x snap-mandatory"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                <div className="flex gap-2 pb-4 items-stretch">
                    {leadershipMembers.map((member, index) => (
                        <div 
                            key={index} 
                            className="flex-shrink-0 w-[320px] snap-start px-4"
                        >
                            <div className="w-full bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden rounded-[10px] leadership-image-container" suppressHydrationWarning>
                <Image
                                        src={normalizeImageUrl(member.image)}
                                        alt={`${member.name} - ${member.title} at Little Care`}
                  width={320}
                  height={320}
                  className="w-full h-full object-contain rounded-[10px]"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                                    <h5 className="text-sm font-medium text-gray-900 mb-1">{member.name}</h5>
                                    <p className="text-gray-600">{member.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 gap-2">
                {leadershipMembers.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
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
        </div>
      </section>
    </div>
    </>
  );
}
