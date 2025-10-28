"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const autoPlayRef = useRef(null);
  
  const photos = [
    { src: "/TESTIMONIALS 1.webp", alt: "Smiling parent and child" },
    { src: "/TESTIMONIALS 2.webp", alt: "Family smiling" },
    { src: "/TESTIMONIALS 3.webp", alt: "Happy child" },
    { src: "/TESTIMONIALS 4.webp", alt: "Family moment" },
    { src: "/TESTIMONIALS 5.webp", alt: "Happy family" }
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
    <section className="w-full bg-white mt-24 md:mt-48 testimonials-section">
      <style jsx>{`
        .testimonial-faq-bg {
          position: absolute;
          inset: 0;
          transform: rotate(90deg) scale(2.0);
          transform-origin: center;
          /* Stretch the overlay wider than the container and center it */
          width: 220%;
          height: 120%;
          left: -60%;
          top: -10%;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat !important;
        }
        @media (max-width: 1023px) {
          .testimonial-faq-bg {
            transform: rotate(90deg) scale(2.3);
            width: 240%;
            height: 140%;
            left: -70%;
            top: -20%;
          }
        }
        @media (max-width: 767px) {
          .testimonials-heading {
            font-size: 28px !important;
            font-weight: 600 !important;
            line-height: 0.95 !important;
          }
        }
      `}</style>
      <div className="mx-auto max-w-[1600px] px-0 md:px-1">
        {/* Heading */}
        <div className="text-center px-4">
          <p className="p1">Testimonials</p>
          <h3 className="testimonials-heading mt-2 mb-16 text-lg md:text-xl lg:text-2xl font-semibold">What families are saying</h3>
        </div>

        {/* Desktop: 5-column layout with images */}
        <div className="hidden lg:grid grid-cols-5 gap-2 px-2.5 items-start">
          {/* First column split vertically into two equal halves with padding and gap */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-0 gap-2">
            <div className="relative rounded-[10px] border border-gray-200 p-4 overflow-hidden" style={{height: '316px'}}>
              <div
                className="absolute inset-0 bg-cover bg-center z-0 testimonial-faq-bg"
                style={{ backgroundImage: "url('/faq1.png')" }}
              />
              <div className="relative z-10">
                <p className="p1">
                  "What I liked most is how the therapist involved us as parents. It didn't feel like therapy alone, it felt like teamwork. My child is opening up more every week."
                </p>
                <br />
                <p className="p2 mt-4 mb-4">
                  Father of a 10-year-old
                </p>
              </div>
            </div>
            <div className="relative rounded-[10px] border border-gray-200 p-4 overflow-hidden" style={{height: '316px'}}>
              <div
                className="absolute inset-0 bg-cover bg-center z-0 testimonial-faq-bg"
                style={{ backgroundImage: "url('/6.png')" }}
              />
              <div className="relative z-10">
                <p>
                  "I thought therapy was only for people with big problems, but now I know it's just a space to talk and feel better. I feel safe to say anything, and it's helping me be more confident."
                </p>
                <br />
                <p className="p2 mt-4 mb-4">
                  12-year-old girl
                </p>
              </div>
            </div>
          </div>
          {/* Second column: full-length image edge-to-edge */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-0">
            <div className="flex-1 rounded-[10px] relative overflow-hidden">
              <Image src="/testimonial5.PNG" alt="Testimonial" fill className="object-cover object-bottom scale-100" />
            </div>
          </div>
          {/* Third column: split 40% top (text review), 60% bottom (image) */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-0 gap-2">
            <div className="relative rounded-[10px] border border-gray-200 p-3 flex flex-col overflow-hidden" style={{height: '236px'}}>
              <div
                className="absolute inset-0 bg-cover bg-center z-0 testimonial-faq-bg"
                style={{ backgroundImage: "url('/7.png')" }}
              />
              <div className="relative z-10">
                <p>
                  "I was a person who used to get angry at my kid for every little thing. Through better parenting coaching I started becoming a better parent and a better person."
                </p>
                <br />
                <p className="p2 mt-4 mb-4">
                  Parent of an 8-year-old
                </p>
              </div>
            </div>
            <div className="rounded-[10px] relative overflow-hidden" style={{height: '396px'}}>
              <video 
                src="/intro_2.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center bottom' }}
              />
            </div>
          </div>

          {/* Fourth column: split 30% top (image), 70% bottom (image) */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-0 gap-2">
            <div className="rounded-[10px] relative overflow-hidden" style={{height: '186px'}}>
              <img 
                src="/testimonial3.PNG" 
                alt="Testimonial" 
                className="w-full h-full object-cover object-bottom scale-100" 
              />
            </div>
            <div className="rounded-[10px] relative overflow-hidden" style={{height: '446px'}}>
              <Image src="/testimonialgirl.png" alt="Testimonial" fill className="object-cover object-bottom scale-100" />
            </div>
          </div>

          {/* Fifth column: split 50% image (top), 50% text (bottom) */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-0 gap-2">
            <div className="rounded-[10px] relative overflow-hidden" style={{height: '316px'}}>
              <Image src="/testimonial2.PNG" alt="Testimonial" fill className="object-cover object-bottom scale-100" />
            </div>
            <div className="relative rounded-[10px] border border-gray-200 p-3 flex flex-col overflow-hidden" style={{height: '316px'}}>
              <div
                className="absolute inset-0 bg-cover bg-center z-0 testimonial-faq-bg"
                style={{ backgroundImage: "url('/8.png')" }}
              />
              <div className="relative z-10">
                <p>
                  "Little Care has been such a gentle support for our family. My daughter used to struggle with focus and big emotions, but after a few sessions, I can see how much more confident she feels. The therapists truly understand children."
                </p>
                <br />
                <p className="p2 mt-4 mb-4">
                  Parent of a 9-year-old
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Mobile: Horizontal photo carousel */}
        <div className="block lg:hidden w-full max-w-sm mx-auto mt-6">
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
            <div className="flex gap-3 pb-4">
              {photos.map((photo, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[240px] snap-start"
                >
                  <div className="relative w-full h-[180px] rounded-[10px] overflow-hidden">
                    <Image 
                      src={photo.src} 
                      alt={photo.alt} 
                      fill 
                      className="object-cover" 
                      sizes="240px"
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
      <p>"{quote}"</p>
      <br />
      <p className="p2 mt-4 mb-4">
        {by}
      </p>
    </div>
  );
}

function PlayImage({ src, alt, className = "" }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
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
    <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl ${className}`}>
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


