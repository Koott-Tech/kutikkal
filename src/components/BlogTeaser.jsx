"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogTeaser() {
  const router = useRouter();

  const handleExploreClick = () => {
    router.push('/blog');
  };

  const handleBlogClick = (post) => {
    // Create a URL-friendly slug from the title
    const slug = post.title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
    
    // Navigate to the specific blog post page
    router.push(`/blog/${slug}`);
  };

  const posts = [
    {
      src: "/hero.png",
      alt: "Plant leaves",
      author: "Alex Bachert",
      date: "May 23, 2025",
      title: "The benefits of combining therapy and psychiatry",
      highlight: false,
    },
    {
      src: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
      alt: "Smiling person",
      author: "Liz Talago",
      date: "March 25, 2025",
      title: "How to find a therapist who's a good fit for you",
      highlight: false,
    },
    {
      src: "/rightside5th.png",
      alt: "Person working online",
      author: "Alex Bachert",
      date: "May 19, 2025",
      title: "What are the benefits of doing therapy online?",
      highlight: true,
    },
  ];

  const carouselRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;

    const updateButtons = () => {
      setCanScrollPrev(node.scrollLeft > 0);
      setCanScrollNext(node.scrollLeft + node.offsetWidth < node.scrollWidth - 1);
    };

    updateButtons();
    node.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    return () => {
      node.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  useEffect(() => {
    const node = carouselRef.current;
    if (!node || typeof window === "undefined") return;

    const centerFirstSlide = () => {
      const firstSlide = node.firstElementChild;
      if (!firstSlide) return;
      const slideWidth = firstSlide.getBoundingClientRect().width;
      const offset = Math.max((node.offsetWidth - slideWidth) / 2, 0);
      const target = Math.max(firstSlide.offsetLeft - offset, 0);
      if (node.scrollLeft !== target) {
        node.scrollTo({ left: target, behavior: "auto" });
      }
    };

    centerFirstSlide();
    window.addEventListener("resize", centerFirstSlide);

    return () => {
      window.removeEventListener("resize", centerFirstSlide);
    };
  }, []);

  const scrollCarousel = (dir) => {
    const node = carouselRef.current;
    if (!node) return;
    const firstSlide = node.firstElementChild;
    const slideWidth = firstSlide?.getBoundingClientRect().width || node.offsetWidth * 0.78;
    const styles = window.getComputedStyle(node);
    const gap =
      parseFloat(styles.getPropertyValue("column-gap") || styles.getPropertyValue("gap")) || 20;
    node.scrollTo({ left: node.scrollLeft + dir * (slideWidth + gap), behavior: "smooth" });
  };

  return (
    <section className="w-full mt-24 md:mt-24 px-4 lg:px-6">
      <style jsx>{`
        @media (min-width: 768px) and (max-width: 1023px) {
          .blog-teaser-heading {
            font-size: 32px !important;
            font-weight: 600 !important;
            line-height: 1.1 !important;
          }
          .blog-card {
            max-width: 280px !important;
          }
          .blog-image {
            height: 140px !important;
          }
          .blog-title {
            font-size: 14px !important;
            line-height: 1.35 !important;
          }
          .blog-meta {
            font-size: 12px !important;
          }
        }
        @media (max-width: 767px) {
          .blog-teaser-heading {
            font-size: 28px !important;
            font-weight: 600 !important;
            line-height: 0.95 !important;
          }
          .blog-grid {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 20px !important;
            padding-bottom: 12px;
            padding-left: clamp(18px, 7vw, 32px);
            padding-right: clamp(18px, 7vw, 32px);
            margin-inline: 0;
          }
          .blog-grid::-webkit-scrollbar {
            display: none;
          }
          .blog-image {
            height: 120px !important;
          }
          .blog-title {
            font-size: 13px !important;
            line-height: 1.3 !important;
          }
          .blog-meta {
            font-size: 11px !important;
          }
          .blog-card {
            flex: 0 0 78%;
            max-width: none !important;
            scroll-snap-align: center;
          }
          .blog-card:first-child {
            margin-left: calc((100% - 78%) / 2);
          }
          .blog-card:last-child {
            margin-right: calc((100% - 78%) / 2);
          }
          .blog-carousel-controls {
            position: relative;
            margin-top: 86px;
            height: 0;
          }
          .blog-carousel-controls button {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #f1f1f5;
            color: #1f1f28;
            border: none;
            transition: background-color 0.2s ease, transform 0.2s ease;
            position: absolute;
            top: -68px;
            z-index: 1;
          }
          .blog-carousel-controls button:first-child {
            left: 12px;
          }
          .blog-carousel-controls button:last-child {
            right: 12px;
          }
          .blog-carousel-controls button:disabled {
            opacity: 0.5;
          }
          .blog-carousel-controls button:not(:disabled):active {
            transform: scale(0.96);
          }
        }
      `}</style>
      <div className="mx-auto max-w-[1100px] px-0 py-4 md:py-6 lg:py-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4">
          <div className="text-center md:text-left">
             <p className="text-sm md:text-base lg:text-lg">From our blog</p>
                 <h3 className="blog-teaser-heading mt-2 md:mt-3 break-words text-base md:text-xl lg:text-2xl font-semibold">
               Tips to become a better parent
             </h3>
           </div>
          <div className="flex justify-center md:justify-end mt-4 md:mt-6 lg:mt-9">
            <button
              type="button"
              onClick={handleExploreClick}
              className="inline-flex items-center rounded-full px-4 py-2 md:px-5 md:py-3 text-sm md:text-base font-semibold text-white transition-colors duration-200"
              style={{ backgroundColor: '#15171A' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2d33'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#15171A'}
            >
              Explore more articles
            </button>
          </div>
        </div>

        <div ref={carouselRef} className="blog-grid mt-24 md:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 md:gap-6 lg:gap-1" id="blog-carousel">
           {posts.map((post) => (
            <article 
              key={post.title} 
              className="blog-card group w-full max-w-[300px] md:max-w-[340px] mx-auto md:mx-0 cursor-pointer"
              onClick={() => handleBlogClick(post)}
            >
               <div
                className={`blog-image relative w-full h-[140px] sm:h-[150px] md:h-[160px] lg:aspect-[16/9] overflow-hidden rounded-2xl ${
                   post.highlight ? "ring-4 md:ring-8 ring-sky-100" : ""
                 }`}
               >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 280px, 100vw"
                />
              </div>
              <div className="blog-meta mt-4 md:mt-6 lg:mt-4 text-gray-600 text-xs md:text-sm">
                <span className="p2">{post.author}</span>
                <span className="px-1 md:px-2 p2">•</span>
                <span className="p2">{post.date}</span>
              </div>
              <h6 className="blog-title mt-2 md:mt-3 lg:mt-2 font-medium text-sm md:text-base">
                {post.title}
              </h6>
            </article>
          ))}
        </div>
        <div className="blog-carousel-controls md:hidden px-4">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollCarousel(-1)}
            disabled={!canScrollPrev}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollCarousel(1)}
            disabled={!canScrollNext}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}


