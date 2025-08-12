"use client";
import Image from "next/image";
import Footer from "./Footer";

export default function Blog() {
  const featuredPost = {
    title: "Five ways to cope with burnout when parenting a child with ADHD",
    author: "Liz Talago",
    date: "June 27, 2025",
    image: "/kids.png",
    excerpt: "Learn practical strategies to manage stress and maintain your wellbeing while supporting your child's needs."
  };

  const blogPosts = [
    {
      id: 1,
      title: "Aroace: Where aromanticism and asexuality intersect",
      author: "Alex Bachert",
      date: "June 27, 2025",
      image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
    },
    {
      id: 2,
      title: "Four tips for talking to a psychiatrist about ADHD",
      author: "Liz Talago",
      date: "June 27, 2025",
      image: "/rightside5th.png"
    },
    {
      id: 3,
      title: "Getting an autism diagnosis from a psychiatrist",
      author: "Liz Talago",
      date: "June 27, 2025",
      image: "/hero.png"
    },
    {
      id: 4,
      title: "Managing postpartum sensory overload",
      author: "Saya Des Marais",
      date: "June 26, 2025",
      image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
    },
    {
      id: 5,
      title: "What's self-invalidation?",
      author: "Linda Childers",
      date: "June 26, 2025",
      image: "/rightside5th.png",
      overlay: "Self-invalidation"
    },
    {
      id: 6,
      title: "Embracing emotional vulnerability",
      author: "Linda Childers",
      date: "June 26, 2025",
      image: "/hero.png"
    }
  ];

  const additionalPosts = [
    {
      id: 7,
      title: "How psychiatry can help you quit drinking alcohol",
      author: "Liz Talago",
      date: "June 26, 2025",
      image: "/hero.png"
    },
    {
      id: 8,
      title: "How can a psychiatrist support PTSD treatment?",
      author: "Liz Talago",
      date: "June 26, 2025",
      image: "/rightside5th.png"
    },
    {
      id: 9,
      title: "Unpacking the relationship between ADHD and sex",
      author: "Brandy Chalmers, LPC",
      date: "June 25, 2025",
      image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
    }
  ];

  return (
    <section className="min-h-screen w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Behavioral health information you can trust, verified by clinicians.
          </p>
        </div>

        {/* Featured Blog Post Card */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg mb-16">
          {/* Image Container */}
          <div className="relative h-[500px] md:h-[600px] w-full">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-8">
              <div className="text-white">
                {/* Author and Date */}
                <div className="text-sm text-gray-200 mb-3 hover:underline cursor-pointer transition-all" style={{ fontWeight: 25 }}>
                  {featuredPost.author} • {featuredPost.date}
                </div>
                
                {/* Title */}
                <h2 className="text-xl md:text-2xl leading-tight hover:underline cursor-pointer transition-all" style={{ fontWeight: 25 }}>
                  Five ways to cope with burnout when<br />
                  parenting a child with ADHD
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid - 2x3 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl overflow-hidden">
              {/* Image Container */}
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay for Card 5 */}
                {post.overlay && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-purple-500/80 px-6 py-2">
                      <span className="text-white text-sm font-medium">{post.overlay}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Text Content */}
              <div className="p-6 pl-0">
                <div className="text-sm text-gray-500 mb-2" style={{ fontWeight: 50 }}>
                  {post.author} • {post.date}
                </div>
                <h3 className="text-lg font-normal text-gray-900 leading-tight hover:underline cursor-pointer transition-all">
                  {post.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Blog Posts - 3 Cards Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {additionalPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl overflow-hidden">
              {/* Image Container */}
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Text Content */}
              <div className="p-6 pl-0">
                <div className="text-sm text-gray-500 mb-2" style={{ fontWeight: 50 }}>
                  {post.author} • {post.date}
                </div>
                <h3 className="text-lg font-normal text-gray-900 leading-tight hover:underline cursor-pointer transition-all">
                  {post.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2">
          <button className="text-gray-600 hover:text-gray-900 text-lg font-medium">
            &lt;
          </button>
          
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                page === 1
                  ? 'bg-black text-white'
                  : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button className="text-gray-600 hover:text-gray-900 text-lg font-medium">
            &gt;
          </button>
        </div>
      </div>
      <Footer />
    </section>
  );
}

