"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { normalizeImageUrl } from '@/utils/urlNormalizer';
// Removed backendApi import - will use direct fetch

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["All", "Mental Health", "ADHD", "Autism", "Parenting", "Relationships", "Self-Care", "Therapy", "Psychiatry"];

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      
      const response = await fetch(`${baseUrl}/blogs?status=published&limit=100`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBlogs(result.data.blogs || []);
        } else {
          // Set empty blogs array instead of throwing error
          setBlogs([]);
        }
      } else if (response.status === 404) {
        // No blogs found - this is normal
        setBlogs([]);
      } else {
        throw new Error('Failed to load blogs');
      }
    } catch (err) {
      console.error('Error loading blogs:', err);
      setBlogs([]); // Set empty array instead of showing error
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from blog tags
  const uniqueCategories = [...new Set((blogs || []).flatMap(blog => blog.tags || []))];
  const displayCategories = ["All", ...categories.filter(cat => uniqueCategories.some(blogTag => blogTag.toLowerCase().includes(cat.toLowerCase())))];
  
  // Sort blogs by creation date, get the latest as featured
  const sortedBlogs = [...(blogs || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const featuredPost = sortedBlogs[0];
  
  // Filter posts based on selected category and search query
  const filteredPosts = sortedBlogs.slice(1).filter(post => {
    const matchesCategory = selectedCategory === "All" || 
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())));
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /* globals.css uses !important on h1–h6 font sizes; use a div + role so Tailwind / inline size is not overridden (avoids loading → loaded title flash). */
  const pageTitle = (
    <div
      role="heading"
      aria-level={1}
      className="font-semibold text-gray-900 mb-6"
      style={{
        fontFamily: "'DM Sans', Arial, Helvetica, sans-serif",
        fontSize: 'clamp(1.75rem, 5vw + 0.5rem, 3.5rem)',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      }}
    >
      Our Blog
    </div>
  );

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="text-center mb-16">
            {pageTitle}
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Behavioral health information you can trust, verified by clinicians.
            </p>
          </div>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen w-full bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="text-center mb-16">
            {pageTitle}
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Behavioral health information you can trust, verified by clinicians.
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">Failed to load blogs: {error}</p>
            <button 
              onClick={loadBlogs}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-white">
      <div className="mx-auto max-w-6xl px-16 sm:px-24 lg:px-32 pt-32 pb-16 md:pt-40 md:pb-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          {pageTitle}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Behavioral health information you can trust, verified by clinicians.
          </p>
        </div>

        {/* Featured Blog Post Card */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="block">
            <div className="relative overflow-hidden rounded-2xl shadow-lg mb-16 group cursor-pointer">
              {/* Image Container */}
              <div className="relative h-[360px] md:h-[420px] w-full">
                <Image
                  src={normalizeImageUrl(featuredPost.featured_image_url || "/kids.png")}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Category Badge */}
                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.tags[0]}
                    </span>
                  </div>
                )}
                
                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-8">
                  <div className="text-white">
                    {/* Author and Date */}
                    <div className="text-sm text-gray-200 mb-3" style={{ fontWeight: 25 }}>
                      {featuredPost.author_name} • {formatDate(featuredPost.published_at || featuredPost.created_at)}
                    </div>
                    
                    {/* Title */}
                    <h6 className="text-xl md:text-2xl leading-tight" style={{ fontWeight: 500 }}>
                      {featuredPost.title}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

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
            {displayCategories.map((category) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`} 
                className="group block w-full max-w-[340px] mx-auto md:mx-0"
              >
                <article className="w-full cursor-pointer">
                  {/* Image Container */}
                  {post.featured_image_url && (
                    <div className="relative w-full h-[140px] sm:h-[150px] md:h-[160px] lg:aspect-[16/9] overflow-hidden rounded-2xl">
                    <Image
                        src={normalizeImageUrl(post.featured_image_url || '')}
                      alt={post.title}
                      fill
                        className="object-contain object-left"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 280px, 100vw"
                      />
                      </div>
                    )}
                  
                  {/* Meta Info */}
                  <div className="mt-4 md:mt-6 lg:mt-4 text-gray-600 text-xs md:text-sm">
                    <span>{post.author_name || "Little Care Team"}</span>
                    <span className="px-1 md:px-2">•</span>
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  
                  {/* Title */}
                  <h6 className="mt-2 md:mt-3 lg:mt-2 font-medium text-sm md:text-base text-gray-900">
                      {post.title}
                    </h6>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              {blogs.length === 0 
                ? "No blog posts available yet." 
                : `No articles found for "${searchQuery}" in ${selectedCategory === "All" ? "all categories" : selectedCategory}`
              }
            </div>
            {blogs.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}