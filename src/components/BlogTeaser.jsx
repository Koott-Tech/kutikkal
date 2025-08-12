"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BlogTeaser() {
  const router = useRouter();

  const handleExploreClick = () => {
    router.push('/blog');
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
    <section className="min-h-[100vh] w-full mt-6 md:mt-8">
      <div className="mx-auto max-w-[1400px] px-[50px] py-10 md:py-14">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">From our blog</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-medium tracking-tight text-gray-900">
              Tips for getting started on your journey
            </h2>
          </div>
          <button
            type="button"
            onClick={handleExploreClick}
            className="mt-3 inline-flex items-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
          >
            Explore more articles
          </button>
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="group">
              <div
                className={`relative aspect-[16/9] w-full overflow-hidden rounded-2xl ${
                  post.highlight ? "ring-8 ring-sky-100" : ""
                }`}
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
              <div className="mt-3 text-xs text-gray-700">
                <span>{post.author}</span>
                <span className="px-2">•</span>
                <span>{post.date}</span>
              </div>
              <h3 className="mt-1 text-lg md:text-xl font-medium text-gray-900">
                {post.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


