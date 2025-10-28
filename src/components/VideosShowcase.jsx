"use client";

export default function VideosShowcase({ cmsData = null }) {
  const defaultVideos = [
    { src: "/intro_2.mp4", poster: "/testimonialgirl.png" },
    { src: "/intro_2.mp4", poster: "/testimonial5.PNG" },
    { src: "/intro_2.mp4", poster: "/testimonial4.PNG" },
  ];
  const videos = (cmsData?.videos && cmsData.videos.length) ? cmsData.videos : defaultVideos;

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
            <div className="relative rounded-[12px] overflow-hidden border border-gray-200 bg-white w-[200px] md:w-[260px] h-[320px] md:h-[380px]">
              <video src={videos[0]?.src} poster={videos[0]?.poster} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Center highlighted larger video */}
          <div className="flex-shrink-0 mx-2 md:mx-3">
            <div className="relative rounded-[14px] overflow-hidden shadow-[0_8px_24px_rgba(63,46,115,0.25)] bg-white w-[240px] md:w-[300px] h-[360px] md:h-[450px]">
              <video src={videos[1]?.src} poster={videos[1]?.poster} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Right video */}
          <div className="flex-shrink-0 mx-2 md:mx-3">
            <div className="relative rounded-[12px] overflow-hidden border border-gray-200 bg-white w-[200px] md:w-[260px] h-[320px] md:h-[380px]">
              <video src={videos[2]?.src} poster={videos[2]?.poster} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


