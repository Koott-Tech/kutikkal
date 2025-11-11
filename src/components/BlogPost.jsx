"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import backendApi from "@/lib/backendApi";
import BlogMetaTags from "./BlogMetaTags";

// Structured Content Renderer Component
const StructuredContentRenderer = ({ content }) => {
  if (!Array.isArray(content)) {
    return <div>Invalid content format</div>;
  }

  return (
    <div className="prose prose-lg max-w-none space-y-12">
      {content.map((block, index) => {
        switch (block.type) {
                 case 'paragraph':
                   return (
                     <p key={index} className="leading-relaxed">
                       {(() => {
                         const parseInlineLinks = (text) => {
                           if (!text) return [{ type: 'text', content: text }];
                           
                           const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                           const parts = [];
                           let lastIndex = 0;
                           let match;
                           
                           while ((match = linkRegex.exec(text)) !== null) {
                             if (match.index > lastIndex) {
                               parts.push({
                                 type: 'text',
                                 content: text.slice(lastIndex, match.index)
                               });
                             }
                             
                             parts.push({
                               type: 'link',
                               text: match[1],
                               url: match[2]
                             });
                             
                             lastIndex = match.index + match[0].length;
                           }
                           
                           if (lastIndex < text.length) {
                             parts.push({
                               type: 'text',
                               content: text.slice(lastIndex)
                             });
                           }
                           
                           return parts.length > 0 ? parts : [{ type: 'text', content: text }];
                         };
                         
                         const parts = parseInlineLinks(block.content);
                         return parts.map((part, partIndex) => {
                           if (part.type === 'link') {
                             return (
                               <a
                                 key={partIndex}
                                 href={part.url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                               >
                                 {part.text}
                               </a>
                             );
                           }
                           return <span key={partIndex}>{part.content}</span>;
                         });
                       })()}
                     </p>
                   );
          
          case 'heading':
            // Use H6 for all blog content headings to avoid large sizes
            // H6 is 24px which is appropriate for blog content
            return (
              <h6 key={index} className="mb-4 mt-8 font-semibold text-gray-900">
                {block.content}
              </h6>
            );
          
          case 'image':
            return (
              <div key={index} className="flex justify-center">
                <img 
                  src={block.src} 
                  alt={block.alt}
                  className="w-full max-w-3xl max-h-96 object-cover rounded-lg shadow-md"
                  loading="lazy"
                />
                {block.caption && (
                  <p className="text-sm text-gray-600 mt-3 text-center italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );
          
          case 'bulletList':
            return (
              <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );
          
          case 'numberedList':
            return (
              <ol key={index} className="list-decimal list-inside space-y-2 ml-4">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            );
          
          case 'link':
            return (
              <a 
                key={index} 
                href={block.href}
                target={block.target || '_self'}
                rel={block.target === '_blank' ? 'noopener noreferrer' : ''}
                className="text-indigo-600 hover:text-indigo-800 underline font-medium"
              >
                {block.text}
              </a>
            );
          
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-indigo-500 pl-6 my-8 italic text-gray-700 bg-gray-50 py-4 rounded-r-lg">
                <p className="mb-2">"{block.content}"</p>
                {block.author && (
                  <cite className="text-sm text-gray-500 not-italic">
                    — {block.author}
                  </cite>
                )}
              </blockquote>
            );
          
          default:
            return (
              <div key={index} className="mb-4">
                {block.content}
              </div>
            );
        }
      })}
    </div>
  );
};

// Latest Blogs Suggestion Component
const LatestBlogsSection = ({ blogs, currentSlug }) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <div className="blog-content">
        <h6 className="text-2xl font-semibold text-gray-900 mb-6">
          You might also like
        </h6>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link 
              key={blog.id} 
              href={`/blog/${blog.slug}`}
              className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="p-6">
                {/* Featured Image */}
                {blog.featured_image_url && (
                  <div className="mb-4">
                    <img
                      src={blog.featured_image_url}
                      alt={blog.title}
                      className="w-full h-32 object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div>
                  {/* Title */}
                  <h6 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3">
                    {blog.title}
                  </h6>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{blog.author_name}</span>
                    <div className="flex items-center space-x-2">
                      <span>{blog.read_time_minutes || 5} min read</span>
                      <span>•</span>
                      <span>{formatDate(blog.published_at || blog.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View All Blogs Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            View All Articles
            <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function BlogPost({ slug }) {
  const router = useRouter();
  const [blogPost, setBlogPost] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadBlogPost();
    loadLatestBlogs();
  }, [slug]);

  useEffect(() => {
    if (notFound) {
      router.replace('/blog');
    }
  }, [notFound, router]);

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
      if (err?.message && err.message.toLowerCase().includes('not found')) {
        setNotFound(true);
        setError('Article not found');
      } else {
        console.error('Error loading blog post:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLatestBlogs = async () => {
    try {
      const response = await backendApi.get('/blogs?limit=3');
      
      if (response.success) {
        // Filter out the current blog post
        const filteredBlogs = response.data.blogs.filter(blog => blog.slug !== slug);
        setLatestBlogs(filteredBlogs.slice(0, 3)); // Take up to 3 latest blogs
      }
    } catch (err) {
      console.error('Error loading latest blogs:', err);
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
          <h6 className="mb-4">Article Not Found</h6>
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
    <>
      <BlogMetaTags blog={blogPost} />
    <article className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-10 sm:px-12 lg:px-20 xl:px-24 pt-24 pb-12">
        {/* Title & Metadata */}
        <header className="mb-8">
          <h3 className="font-semibold mb-4">
            {blogPost.title}
          </h3>
          
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
            <div className="relative h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={blogPost.featured_image_url}
                alt={blogPost.title}
                className="max-h-full w-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="blog-content">
          <style dangerouslySetInnerHTML={{
            __html: `
              .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5 {
                font-size: 24px !important;
                line-height: 1.5rem !important;
                letter-spacing: -0.65px !important;
              }
            `
          }} />
          {blogPost.structured_content && blogPost.structured_content.length > 0 ? (
            <StructuredContentRenderer content={blogPost.structured_content} />
          ) : (
          <div 
              className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
                        />
          )}
                      </div>

        {/* Latest Blogs Suggestions */}
        <LatestBlogsSection blogs={latestBlogs} currentSlug={slug} />

      </div>
    </article>
    </>
  );
}
