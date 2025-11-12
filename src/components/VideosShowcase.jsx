"use client";

import { useState, useRef, useEffect } from 'react';

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url, muted = true) => {
  if (!url) return null;
  
  // Handle various YouTube URL formats including Shorts
  const patterns = [
    /youtube\.com\/shorts\/([^&\n?#\/]+)/, // YouTube Shorts: youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, // Regular YouTube URLs
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/ // YouTube watch URLs with other params
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      // Use nocookie domain and parameters to minimize branding
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${muted ? '1' : '0'}&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&cc_load_policy=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;
    }
  }
  
  return null;
};

// Check if URL is YouTube
const isYouTubeUrl = (url) => {
  if (!url) return false;
  return /youtube\.com|youtu\.be/.test(url);
};

export default function VideosShowcase({ cmsData = null }) {
  const defaultVideos = [
    { src: "/intro_2.mp4", poster: "/testimonialgirl.png" },
    { src: "/intro_2.mp4", poster: "/testimonial5.PNG" },
    { src: "/intro_2.mp4", poster: "/testimonial4.PNG" },
  ];
  const videos = (cmsData?.videos && cmsData.videos.length) ? cmsData.videos : defaultVideos;
  
  // Sort videos by position if provided, otherwise keep original order
  const sortedVideos = [...videos].sort((a, b) => {
    const posA = typeof a.position === 'number' ? a.position : 999;
    const posB = typeof b.position === 'number' ? b.position : 999;
    return posA - posB;
  });
  
  // Build display list of 5 slots, allow per-video position (0..4). Fallback to simple spread.
  let displayVideos = new Array(5);
  sortedVideos.forEach((v) => {
    if (v && typeof v.position === 'number' && v.position >= 0 && v.position <= 4) {
      displayVideos[v.position] = v;
    }
  });
  // Fill gaps with available videos in order
  let fillIdx = 0;
  for (let i = 0; i < 5; i++) {
    if (!displayVideos[i]) {
      displayVideos[i] = sortedVideos[fillIdx % sortedVideos.length];
      fillIdx++;
    }
  }
  
  const [playingVideo, setPlayingVideo] = useState(typeof cmsData?.featuredIndex === 'number' ? cmsData.featuredIndex : 2); // default center (middle)
  const [isMuted, setIsMuted] = useState(true); // Start muted
  const videoRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const scrollerRef = useRef(null);
  const hasAutoPlayedRef = useRef(false);

  const handleVideoClick = (index) => {
    const videoUrl = displayVideos[index]?.url || displayVideos[index]?.src;
    
    // If it's a YouTube URL, just set it as playing (iframe handles it)
    if (isYouTubeUrl(videoUrl)) {
      setPlayingVideo(index);
      return;
    }
    
    // For regular video elements, handle play/pause
    // Pause currently playing video
    if (playingVideo !== null && videoRefs[playingVideo].current) {
      const currentVideo = videoRefs[playingVideo].current;
      if (currentVideo && typeof currentVideo.pause === 'function') {
        currentVideo.pause().catch(() => {});
      }
    }
    
    // Play clicked video
    if (videoRefs[index].current) {
      const video = videoRefs[index].current;
      if (video && typeof video.play === 'function') {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayingVideo(index);
            })
            .catch((error) => {
              // Handle play error silently
              console.log('Video play prevented:', error);
            });
        } else {
          setPlayingVideo(index);
        }
      }
    }
  };

  // Auto-play middle video (position 2) on mount, muted
  useEffect(() => {
    if (hasAutoPlayedRef.current) return;
    
    const middleIndex = 2;
    const middleVideoUrl = displayVideos[middleIndex]?.url || displayVideos[middleIndex]?.src;
    
    if (!middleVideoUrl) return;
    
    hasAutoPlayedRef.current = true;
    
    // Auto-play middle video if it's not YouTube
    if (!isYouTubeUrl(middleVideoUrl)) {
      // Wait a bit for video element to be ready
      const timer = setTimeout(() => {
        if (videoRefs[middleIndex].current) {
          const video = videoRefs[middleIndex].current;
          video.muted = true;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Silently handle play errors
            });
          }
          setPlayingVideo(middleIndex);
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // For YouTube, just set as playing (iframe handles autoplay)
      setPlayingVideo(middleIndex);
    }
  }, [displayVideos]);

  // When a video is selected to play, auto-play it once mounted; pause others
  useEffect(() => {
    [0,1,2,3,4].forEach((i) => {
      const ref = videoRefs[i].current;
      if (!ref) return;
      
      const videoUrl = displayVideos[i]?.url || displayVideos[i]?.src;
      // Skip YouTube videos (handled by iframe)
      if (isYouTubeUrl(videoUrl)) return;
      
      try {
        if (i === playingVideo) {
          // Set muted state
          ref.muted = isMuted;
          const playPromise = ref.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Silently handle play errors
            });
          }
        } else {
          ref.pause().catch(() => {
            // Silently handle pause errors
          });
        }
      } catch (_) {
        // Silently handle errors
      }
    });
  }, [playingVideo, isMuted]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const scrollByCard = (direction = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector('[data-video-card]');
    const cardWidth = card ? card.getBoundingClientRect().width : 320;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' });
  };

  return (
    <section className="w-full pt-12 md:pt-16 pb-6 md:pb-8" style={{ marginTop: '96px' }}>
      <style jsx global>{`
        /* Hide YouTube branding and UI elements */
        .youtube-embed-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .youtube-embed-wrapper iframe {
          position: absolute;
          top: -60px;
          left: 0;
          width: 100%;
          height: calc(100% + 120px);
          transform: scale(1.1);
          transform-origin: center center;
        }
        /* Hide YouTube logo overlay using pseudo-element */
        .youtube-embed-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: transparent;
          z-index: 10;
          pointer-events: none;
        }
        .youtube-embed-wrapper::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: transparent;
          z-index: 10;
          pointer-events: none;
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="px-4 sm:px-6 mb-10 md:mb-14 text-center">
          {cmsData?.videosSubheading && (
            <p className="text-center md:text-center mt-2 text-sm md:text-base">
              {cmsData.videosSubheading}
            </p>
          )}
          <div className="mt-3 text-center md:text-center px-4">
            <h3 className="how-it-works-heading text-center text-base md:text-xl lg:text-2xl" style={{ fontWeight: 500 }}>
              {cmsData?.videosHeading || 'See More of What We Do'}
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
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="flex-shrink-0 snap-center">
                <div
                  data-video-card
                  className={`relative rounded-[14px] overflow-hidden bg-white cursor-pointer group shadow-[0_8px_24px_rgba(63,46,115,0.18)]
                    ${i === 0 || i === 4 ? 'w-[200px] h-[300px]' : 'w-[240px] h-[360px]'}
                    ${i === 2 
                      ? 'md:w-[340px] md:h-[500px] md:shadow-[0_10px_28px_rgba(63,46,115,0.25)]' 
                      : (i === 0 || i === 4) 
                        ? 'md:w-[240px] md:h-[360px]'
                        : 'md:w-[280px] md:h-[420px]'}
                  `}
                  onClick={() => handleVideoClick(i)}
                >
                  {(() => {
                    const videoUrl = displayVideos[i]?.url || displayVideos[i]?.src;
                    const thumbnailUrl = displayVideos[i]?.thumbnailUrl || displayVideos[i]?.poster;
                    const isYouTube = isYouTubeUrl(videoUrl);
                    const embedUrl = isYouTube ? getYouTubeEmbedUrl(videoUrl, isMuted) : null;
                    
                    if (isYouTube && embedUrl) {
                      // Render YouTube iframe with custom styling to hide branding
                      return (
                        <>
                          {playingVideo === i ? (
                            <div className="youtube-embed-wrapper relative w-full h-full overflow-hidden">
                              <iframe
                                key={`youtube-${i}-${isMuted}`}
                                src={embedUrl}
                                className="absolute top-0 left-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                frameBorder="0"
                                style={{
                                  position: 'absolute',
                                  top: '-60px',
                                  left: 0,
                                  width: '100%',
                                  height: 'calc(100% + 120px)',
                                  transform: 'scale(1.1)',
                                  transformOrigin: 'center center'
                                }}
                              />
                              {/* Mute/Unmute button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMute();
                                }}
                                className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                              >
                                {isMuted ? (
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="absolute inset-0" style={{ backgroundImage: `url(${thumbnailUrl || '/hero.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                                <svg className="w-16 h-16 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    } else {
                      // Render regular video element
                      return (
                        <>
                          <video
                            ref={videoRefs[i]}
                            src={videoUrl}
                            poster={thumbnailUrl}
                            preload="auto"
                            loop
                            muted={isMuted}
                            playsInline
                            className={`w-full h-full object-cover transition-opacity duration-200 ${playingVideo === i ? 'opacity-100' : 'opacity-0'}`}
                          />
                          {playingVideo === i && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMute();
                              }}
                              className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
                              aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                              {isMuted ? (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                              )}
                            </button>
                          )}
                          {playingVideo !== i && (
                            <div className="absolute inset-0" style={{ backgroundImage: `url(${thumbnailUrl || '/hero.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                                <svg className="w-16 h-16 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    }
                  })()}
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


