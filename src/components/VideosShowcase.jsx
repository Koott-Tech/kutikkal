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
        <div className="flex items-center justify-center gap-3 md:gap-6">
          {/* Left video */}
          <div className="flex-shrink-0 mx-2 md:mx-3">
            <div 
              className="relative rounded-[12px] overflow-hidden border border-gray-200 bg-white w-[200px] md:w-[260px] h-[320px] md:h-[380px] cursor-pointer group"
              onClick={() => handleVideoClick(0)}
            >
              {/* Always render video so ref exists; fade in only when playing */}
              <video 
                ref={videoRefs[0]} 
                src={videos[0]?.src} 
                poster={videos[0]?.poster} 
                preload="auto"
                loop 
                muted 
                playsInline 
                className={`w-full h-full object-cover transition-opacity duration-200 ${playingVideo === 0 ? 'opacity-100' : 'opacity-0'}`} 
              />
              {playingVideo !== 0 && (
                <div className="absolute inset-0" style={{ backgroundImage: `url(${videos[0]?.poster || '/hero.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                    <svg className="w-16 h-16 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Center highlighted larger video */}
          <div className="flex-shrink-0 mx-2 md:mx-3">
            <div className="relative rounded-[14px] overflow-hidden shadow-[0_8px_24px_rgba(63,46,115,0.25)] bg-white w-[240px] md:w-[300px] h-[360px] md:h-[450px]">
              <video 
                ref={videoRefs[1]} 
                src={videos[1]?.src} 
                poster={videos[1]?.poster} 
                preload="auto"
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          {/* Right video */}
          <div className="flex-shrink-0 mx-2 md:mx-3">
            <div 
              className="relative rounded-[12px] overflow-hidden border border-gray-200 bg-white w-[200px] md:w-[260px] h-[320px] md:h-[380px] cursor-pointer group"
              onClick={() => handleVideoClick(2)}
            >
              {/* Always render video so ref exists; fade in only when playing */}
              <video 
                ref={videoRefs[2]} 
                src={videos[2]?.src} 
                poster={videos[2]?.poster} 
                preload="auto"
                loop 
                muted 
                playsInline 
                className={`w-full h-full object-cover transition-opacity duration-200 ${playingVideo === 2 ? 'opacity-100' : 'opacity-0'}`} 
              />
              {playingVideo !== 2 && (
                <div className="absolute inset-0" style={{ backgroundImage: `url(${videos[2]?.poster || '/hero.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                    <svg className="w-16 h-16 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


