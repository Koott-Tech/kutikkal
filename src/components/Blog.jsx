"use client";
import { useState } from "react";
import Image from "next/image";
import Footer from "./Footer";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Mental Health", "ADHD", "Autism", "Parenting", "Relationships", "Self-Care", "Therapy", "Psychiatry"];

  const featuredPost = {
    title: "Five ways to cope with burnout when parenting a child with ADHD",
    author: "Liz Talago",
    date: "June 27, 2025",
    image: "/kids.png",
    excerpt: "Learn practical strategies to manage stress and maintain your wellbeing while supporting your child's needs.",
    category: "Parenting"
  };

  const blogPosts = [
    {
      id: 1,
      title: "Aroace: Where aromanticism and asexuality intersect",
      author: "Alex Bachert",
      date: "June 27, 2025",
      image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
      category: "Relationships"
    },
    {
      id: 2,
      title: "Four tips for talking to a psychiatrist about ADHD",
      author: "Liz Talago",
      date: "June 27, 2025",
      image: "/rightside5th.png",
      category: "ADHD"
    },
    {
      id: 3,
      title: "Getting an autism diagnosis from a psychiatrist",
      author: "Liz Talago",
      date: "June 27, 2025",
      image: "/hero.png",
      category: "Autism"
    },
    {
      id: 4,
      title: "Managing postpartum sensory overload",
      author: "Saya Des Marais",
      date: "June 26, 2025",
      image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
      category: "Parenting"
    },
    {
      id: 5,
      title: "What's self-invalidation?",
      author: "Linda Childers",
      date: "June 26, 2025",
      image: "/rightside5th.png",
      overlay: "Self-invalidation",
      category: "Self-Care"
    },
    {
      id: 6,
      title: "Embracing emotional vulnerability",
      author: "Linda Childers",
      date: "June 26, 2025",
      image: "/hero.png",
      category: "Self-Care"
    }
  ];

  const additionalPosts = [
    {
      id: 7,
      title: "How psychiatry can help you quit drinking alcohol",
      author: "Liz Talago",
      date: "June 26, 2025",
      image: "/hero.png",
      category: "Psychiatry"
    },
    {
      id: 8,
      title: "How can a psychiatrist support PTSD treatment?",
      author: "Liz Talago",
      date: "June 26, 2025",
      image: "/rightside5th.png",
      category: "Psychiatry"
    },
    {
      id: 9,
      title: "Unpacking the relationship between ADHD and sex",
      author: "Brandy Chalmers, LPC",
      date: "June 25, 2025",
      image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
      category: "ADHD"
    }
  ];

  // Combine all posts
  const allPosts = [...blogPosts, ...additionalPosts];

  // Filter posts based on selected category and search query
  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });



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
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {featuredPost.category}
              </span>
            </div>
            
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

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden py-4">
                {/* Image Container */}
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  
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
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              No articles found for "{searchQuery}" in {selectedCategory === "All" ? "all categories" : selectedCategory}
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination - Only show if there are filtered results */}
        {filteredPosts.length > 0 && (
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
        )}
      </div>
      <Footer />
    </section>
  );
}

