"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const autoPlayRef = useRef(null);
  
  const photos = [
    { src: "/thumb1.jpg", alt: "Smiling parent and child" },
    { src: "/thumb2.jpg", alt: "Family smiling" },
    { src: "/thumb3.jpg", alt: "Happy child" },
    { src: "/thumb4.jpg", alt: "Family moment" },
    { src: "/kids.png", alt: "Happy family" }
  ];

  const nextSlide = () => {
    stopAutoPlay(); // Stop auto-play when user clicks
    const newSlide = (currentSlide + 1) % photos.length;
    setCurrentSlide(newSlide);
    scrollToSlide(newSlide);
    // Restart auto-play after delay
    setTimeout(() => startAutoPlay(), 2000);
  };

  const prevSlide = () => {
    stopAutoPlay(); // Stop auto-play when user clicks
    const newSlide = (currentSlide - 1 + photos.length) % photos.length;
    setCurrentSlide(newSlide);
    scrollToSlide(newSlide);
    // Restart auto-play after delay
    setTimeout(() => startAutoPlay(), 2000);
  };

  const goToSlide = (index) => {
    stopAutoPlay(); // Stop auto-play when user clicks
    setCurrentSlide(index);
    scrollToSlide(index);
    // Restart auto-play after delay
    setTimeout(() => startAutoPlay(), 2000);
  };

  // Handle scroll events to sync with navigation dots
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 280; // Fixed card width
      const gap = 16; // gap-4 = 16px
      const totalCardWidth = cardWidth + gap;
      const newSlide = Math.round(scrollLeft / totalCardWidth);
      setCurrentSlide(Math.min(newSlide, photos.length - 1));
    }
  };

  // Scroll to specific slide
  const scrollToSlide = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Fixed card width
      const gap = 16; // gap-4 = 16px
      const totalCardWidth = cardWidth + gap;
      scrollContainerRef.current.scrollTo({
        left: index * totalCardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Auto-play functionality
  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % photos.length;
        scrollToSlide(next);
        return next;
      });
    }, 3000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    stopAutoPlay(); // Stop auto-play when user interacts
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Restart auto-play after user interaction
    setTimeout(() => {
      startAutoPlay();
    }, 2000);
  };

  // Start auto-play on mount
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1600px] px-0 md:px-1 py-12 md:py-16">
        <h2 className="text-3xl md:text-[44px] font-semibold tracking-tight text-gray-900 text-center leading-[1.1] md:leading-normal">
          Hear from our patients
        </h2>
        <p className="text-gray-600 text-center mt-3 mb-10 text-base md:text-lg">
          We’re making online therapy work the way it should.
        </p>

        {/* Desktop: 5-column layout with images */}
        <div className="hidden lg:grid grid-cols-5 gap-0">
          {/* First column split vertically into two equal halves with padding and gap */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-1 gap-1">
            <div className="flex-1 rounded-[10px] bg-[#E6F5EC] border border-gray-200 p-4">
              <p className="text-[15px] leading-relaxed text-gray-900">
                "Rula was the only way I was able to find a therapist. Everywhere else I was running into barriers. At a time when I was really struggling, finding help seemed impossible. Rula made it possible."
              </p>
              <div className="mt-3 text-xs text-gray-600 font-medium">Rula patient</div>
            </div>
            <div className="flex-1 rounded-[10px] bg-[#ECEBFF] border border-gray-200 p-4">
              <p className="text-[15px] leading-relaxed text-gray-900">
                "Finding mental healthcare through insurance can be a daunting task, but Rula made it easy to find a therapist who meets my needs and takes my insurance."
              </p>
              <div className="mt-3 text-xs text-gray-600 font-medium">Rula patient</div>
            </div>
          </div>
          {/* Second column: full-length image edge-to-edge */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-0">
            <div className="flex-1 rounded-[10px] relative overflow-hidden">
              <Image src="/thumb1.jpg" alt="Smiling parent and child" fill className="object-cover" />
            </div>
          </div>
          {/* Third column: split 40% top (text review), 60% bottom (image) */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-1 gap-1">
            <div className="basis-[40%] rounded-[10px] bg-[#ECEBFF] border border-gray-200 p-3 flex flex-col">
              <p className="text-[13px] leading-snug text-gray-900">
                "I was hesitant to go the online therapy route. But I am so glad I did. It was an easy process and I absolutely adore my therapist."
              </p>
              <div className="mt-2 text-[11px] text-gray-600 font-medium">Rula patient</div>
            </div>
            <div className="basis-[60%] rounded-[10px] p-0">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-gray-100">
                <Image src="/thumb3.jpg" alt="Happy child" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Fourth column: split 30% top (image), 70% bottom (image) */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-1 gap-1">
            <div className="basis-[30%] rounded-[10px] p-0">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-gray-100">
                <Image src="/thumb2.jpg" alt="Family smiling" fill className="object-cover" />
              </div>
            </div>
            <div className="basis-[70%] rounded-[10px] p-0">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-gray-100">
                <Image src="/kids.png" alt="Happy family" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Fifth column: split 50% image (top), 50% text (bottom) */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-1 gap-1">
            <div className="flex-1 rounded-[10px] p-0">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-gray-100">
                <Image src="/thumb4.jpg" alt="Family moment" fill className="object-cover" />
              </div>
            </div>
            <div className="flex-1 rounded-[10px] bg-[#FFFBE6] border border-gray-200 p-3 flex flex-col">
              <p className="text-[13px] leading-snug text-gray-900">
                "Clear progress, kind support, and easy follow‑ups. Highly recommend."
              </p>
              <div className="mt-2 text-[11px] text-gray-600 font-medium">Rula patient</div>
            </div>
          </div>
        </div>

        {/* Mobile: Horizontal photo carousel */}
        <div className="block lg:hidden w-full max-w-sm mx-auto">
          {/* Scrollable Carousel Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative overflow-x-auto overflow-y-hidden rounded-2xl carousel-scroll snap-x snap-mandatory"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            <div className="flex gap-4 pb-4">
              {photos.map((photo, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[280px] snap-start"
                >
                  <div className="relative w-full h-[200px] rounded-[10px] overflow-hidden bg-gray-100">
                    <Image 
                      src={photo.src} 
                      alt={photo.alt} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {photos.map((_, index) => (
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
              {currentSlide + 1} of {photos.length}
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
      </div>
    </section>
  );
}

function QuoteCard({ quote, by, tone = "mint", className = "" }) {
  const toneClasses = {
    mint: "bg-[#E6F5EC] text-gray-900",
    lavender: "bg-[#ECEBFF] text-gray-900",
    peach: "bg-[#FFF0E1] text-gray-900",
  };
  return (
    <div className={`rounded-2xl p-6 md:p-7 border border-gray-200 ${toneClasses[tone]} ${className}`}>
      <p className="text-[15px] md:text-base leading-relaxed">“{quote}”</p>
      <div className="mt-3 text-xs md:text-sm text-gray-700 font-medium">{by}</div>
    </div>
  );
}

function PlayImage({ src, alt, className = "" }) {
  return (
    <div className={`relative w-full overflow-hidden bg-gray-100 ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
      <button
        aria-label="Play testimonial"
        className="absolute left-4 bottom-4 h-10 w-10 md:h-12 md:w-12 grid place-items-center rounded-full bg-white/90 shadow-md hover:bg-white transition"
      >
        <PlayIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
      </button>
    </div>
  );
}

function ImageTile({ src, alt, className = "" }) {
  const hasFullHeight = className?.includes('h-full');
  const aspectClass = hasFullHeight ? '' : 'aspect-[4/3]';
  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl bg-gray-100 ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 20vw, 50vw" />
    </div>
  );
}

function PlayIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 5.14v13.72c0 .79.86 1.28 1.54.86l10.37-6.86a1 1 0 000-1.72L9.54 4.28A1 1 0 008 5.14z" />
    </svg>
  );
}


