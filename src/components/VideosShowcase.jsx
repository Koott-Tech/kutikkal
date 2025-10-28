"use client";

import { useState, useRef, useEffect } from 'react';

export default function VideosShowcase({ cmsData = null }) {
  const defaultVideos = [
    { src: "/intro_2.mp4", poster: "/testimonialgirl.png" },
    { src: "/intro_2.mp4", poster: "/testimonial5.PNG" },
    { src: "/intro_2.mp4", poster: "/testimonial4.PNG" },
  ];
  const videos = (cmsData?.videos && cmsData.videos.length) ? cmsData.videos : defaultVideos;
  
  const [playingVideo, setPlayingVideo] = useState(1); // Center video plays by default
  const videoRefs = [useRef(null), useRef(null), useRef(null)];
  const scrollerRef = useRef(null);

  const handleVideoClick = (index) => {
    // Pause currently playing video
    if (playingVideo !== null && videoRefs[playingVideo].current) {
      videoRefs[playingVideo].current.pause();
    }
    
    // Play clicked video
    if (videoRefs[index].current) {
      videoRefs[index].current.play();
      setPlayingVideo(index);
    }
  };

  // When a video is selected to play, auto-play it once mounted; pause others
  useEffect(() => {
    [0,1,2].forEach((i) => {
      const ref = videoRefs[i].current;
      if (!ref) return;
      try {
        if (i === playingVideo) {
          ref.play().catch(() => {});
        } else {
          ref.pause();
        }
      } catch (_) {}
    });
  }, [playingVideo]);

  const scrollByCard = (direction = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector('[data-video-card]');
    const cardWidth = card ? card.getBoundingClientRect().width : 320;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' });
  };

  return (
    <section className="w-full pt-12 md:pt-16 pb-6 md:pb-8" style={{ marginTop: '96px' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="px-4 sm:px-6 mb-10 md:mb-14 text-center">
          <p className="text-center md:text-center mt-2 text-sm md:text-base">
            Video Reviews
          </p>
          <div className="mt-3 text-center md:text-center px-4">
            <h3 className="how-it-works-heading text-center text-base md:text-xl lg:text-2xl" style={{ fontWeight: 500 }}>
              Real stories from families who found support and healing.
            </h3>
          </div>
        </div>

        {/* Carousel controls (desktop) */}
        <div className="relative">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollByCard(-1)}
            className="hidden md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <div
            ref={scrollerRef}
            className="flex gap-4 md:gap-6 px-1 sm:px-2 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar md:overflow-visible md:snap-none md:justify-center md:items-center"
          >
            {[0,1,2].map((i) => (
              <div key={i} className="flex-shrink-0 snap-center">
                <div
                  data-video-card
                  className={`relative rounded-[14px] overflow-hidden bg-white cursor-pointer group shadow-[0_8px_24px_rgba(63,46,115,0.18)]
                    w-[240px] h-[360px]
                    ${i === 1 ? 'md:w-[340px] md:h-[500px] md:shadow-[0_10px_28px_rgba(63,46,115,0.25)]' : 'md:w-[280px] md:h-[420px]'}
                  `}
                  onClick={() => handleVideoClick(i)}
                >
                  <video
                    ref={videoRefs[i]}
                    src={videos[i]?.src}
                    poster={videos[i]?.poster}
                    preload="auto"
                    loop
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-200 ${playingVideo === i ? 'opacity-100' : 'opacity-0'}`}
                  />
                  {playingVideo !== i && (
                    <div className="absolute inset-0" style={{ backgroundImage: `url(${videos[i]?.poster || '/hero.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                        <svg className="w-16 h-16 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByCard(1)}
            className="hidden md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </section>
  );
}


