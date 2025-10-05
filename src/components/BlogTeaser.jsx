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
    <section className="w-full mt-20 px-4 lg:px-6">
      <div className="mx-auto max-w-[1100px] px-0 py-6 md:py-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
             <p className="text-lg md:text-base">From our blog</p>
                 <h3 className="mt-3 break-words">
               Tips for getting started on your journey
             </h3>
           </div>
          <div className="flex justify-center md:justify-end mt-6 md:mt-9">
            <button
              type="button"
              onClick={handleExploreClick}
              className="inline-flex items-center rounded-full px-5 py-3 text-base md:text-sm font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: '#593494' }}
            >
              Explore more articles
            </button>
          </div>
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-1">
           {posts.map((post) => (
            <article 
              key={post.title} 
              className="group w-[260px] sm:w-[280px] md:w-full md:max-w-[340px] mx-auto md:mx-0 cursor-pointer"
              onClick={() => handleBlogClick(post)}
            >
               <div
                className={`relative w-full h-[150px] sm:h-[160px] md:aspect-[16/9] overflow-hidden rounded-2xl ${
                   post.highlight ? "ring-8 ring-sky-100" : ""
                 }`}
               >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 280px, 260px"
                />
              </div>
              <div className="mt-6 md:mt-4 text-gray-600">
                <span className="p2">{post.author}</span>
                <span className="px-2 p2">•</span>
                <span className="p2">{post.date}</span>
              </div>
              <h6 className="mt-3 md:mt-2 font-medium">
                {post.title}
              </h6>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


