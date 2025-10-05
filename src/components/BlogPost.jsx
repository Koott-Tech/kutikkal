"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { backendApi } from "@/lib/backendApi";

export default function BlogPost({ slug }) {
  const router = useRouter();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlogPost();
  }, [slug]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      const response = await backendApi.get(`/blogs/slug/${slug}`);
      
      if (response.success) {
        setBlogPost(response.data);
      } else {
        throw new Error(response.message || 'Failed to load blog post');
      }
    } catch (err) {
      console.error('Error loading blog post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <article className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </article>
    );
  }

  if (error || !blogPost) {
    return (
      <article className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
          <h1 className="mb-4">Article Not Found</h1>
            <p className="p2 mb-6">
              {error ? `Error: ${error}` : "The article you're looking for doesn't exist."}
            </p>
          <Link href="/blog" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
      </article>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 p2 text-gray-600">
            <Link href="/blog" className="hover:text-indigo-600">Blog</Link>
            <span>/</span>
            {blogPost.tags && blogPost.tags.length > 0 ? (
              <span className="hover:text-indigo-600">{blogPost.tags[0]}</span>
            ) : (
              <span>Article</span>
            )}
          </div>
        </nav>

        {/* Title & Metadata */}
        <header className="mb-8">
          <h1 className="mb-4">
            {blogPost.title}
          </h1>
          
          <div className="flex items-center space-x-6 mb-6">
            <span className="p2">
              By <span className="font-medium">{blogPost.author_name}</span>
            </span>
            <span className="p2">•</span>
            <span className="p2">
              {formatDate(blogPost.published_at || blogPost.created_at)}
            </span>
            <span className="p2">•</span>
            <span className="p2">
              {blogPost.read_time_minutes || 5} min read
            </span>
            <span className="p2">•</span>
            <span className="p2">
              {blogPost.view_count || 0} views
            </span>
          </div>
          
          {/* Tags */}
          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blogPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full p2 bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
          </div>
          )}
        </header>

        {/* Featured Image */}
        {blogPost.featured_image_url && (
          <div className="mb-8">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src={blogPost.featured_image_url}
            alt={blogPost.title}
                className="w-full h-full object-cover"
          />
        </div>
        </div>
        )}

        {/* Excerpt */}
        {blogPost.excerpt && (
          <div className="mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="p1">{blogPost.excerpt}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="blog-content">
          <div 
            className="max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
                        />
                      </div>

        {/* Author Bio */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="mb-2">About {blogPost.author_name}</h3>
            <p className="p1">
              Professional psychologist and mental health advocate with expertise in child and family therapy.
            </p>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to All Articles
          </Link>
        </div>
      </div>
    </article>
  );
}
