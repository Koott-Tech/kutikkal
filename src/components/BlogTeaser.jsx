"use client";
import Image from "next/image";
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

  return (
    <section className="w-full mt-12 md:mt-20 px-4 lg:px-6">
      <style jsx>{`
        @media (max-width: 767px) {
          .blog-teaser-heading {
            font-size: 28px !important;
            font-weight: 600 !important;
            line-height: 0.95 !important;
          }
          .blog-card {
            max-width: 250px !important;
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
          .blog-grid {
            gap: 20px !important;
          }
          .grid {
            gap: 20px !important;
          }
          div[class*="grid"] {
            gap: 20px !important;
          }
        }
      `}</style>
      <div className="mx-auto max-w-[1100px] px-0 py-4 md:py-6 lg:py-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4">
          <div className="text-center md:text-left">
             <p className="text-sm md:text-base lg:text-lg">From our blog</p>
                 <h3 className="blog-teaser-heading mt-2 md:mt-3 break-words text-base md:text-xl lg:text-2xl font-semibold">
               Tips for getting started on your journey
             </h3>
           </div>
          <div className="flex justify-center md:justify-end mt-4 md:mt-6 lg:mt-9">
            <button
              type="button"
              onClick={handleExploreClick}
              className="inline-flex items-center rounded-full px-4 py-2 md:px-5 md:py-3 text-sm md:text-base font-semibold text-white transition-colors duration-200"
              style={{ backgroundColor: '#3f2e73' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d1733'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3f2e73'}
            >
              Explore more articles
            </button>
          </div>
        </div>

        <div className="blog-grid mt-8 md:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-3 md:gap-6 lg:gap-1">
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
      </div>
    </section>
  );
}


