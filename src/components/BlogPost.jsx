"use client";

import { normalizeImageUrl } from '@/utils/urlNormalizer';
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import backendApi from "@/lib/backendApi";
import BlogMetaTags from "./BlogMetaTags";

// Extract text content from block - handles string, object { text/content }, or array of nodes
const getBlockContent = (block) => {
  const raw = block?.content;
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw.text ?? raw.content ?? '';
  }
  if (Array.isArray(raw)) {
    return raw.map((n) => (typeof n === 'string' ? n : n?.text ?? n?.content ?? '')).join('');
  }
  return block?.title ?? '';
};

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
                         const normalizeUrl = (url) => {
                           if (!url || !url.trim()) return url;
                           
                           const trimmedUrl = url.trim();
                           
                           // If it already has a protocol, return as is
                           if (trimmedUrl.match(/^https?:\/\//i)) {
                             return trimmedUrl;
                           }
                           
                           // If it starts with //, add https:
                           if (trimmedUrl.startsWith('//')) {
                             return `https:${trimmedUrl}`;
                           }
                           
                           // If it's a relative path, return as is
                           if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
                             return trimmedUrl;
                           }
                           
                           // If it looks like a domain (contains a dot and no spaces), add https://
                           if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ')) {
                             return `https://${trimmedUrl}`;
                           }
                           
                           // Otherwise, return as is
                           return trimmedUrl;
                         };

                         const parseInlineLinks = (rawText) => {
                           const text = rawText != null ? String(rawText) : '';
                           if (!text) return [{ type: 'text', content: '' }];
                           
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
                             
                             // Normalize the URL to ensure it has a protocol
                             const normalizedUrl = normalizeUrl(match[2]);
                             
                             parts.push({
                               type: 'link',
                               text: match[1],
                               url: normalizedUrl
                             });
                             
                             lastIndex = match.index + match[0].length;
                           }
                           
                           if (lastIndex < text.length) {
                             parts.push({
                               type: 'text',
                               content: text.slice(lastIndex)
                             });
                           }
                           
                           return parts.length > 0 ? parts : [{ type: 'text', content: text ?? '' }];
                         };
                         
                         const parts = parseInlineLinks(getBlockContent(block));
                         return parts.map((part, partIndex) => {
                           if (part.type === 'link') {
                             return (
                               <a
                                 key={partIndex}
                                 href={part.url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="underline font-medium"
                                 style={{ textDecoration: 'underline', color: '#3f2e73' }}
                                 onMouseEnter={(e) => e.target.style.color = '#2d1f52'}
                                 onMouseLeave={(e) => e.target.style.color = '#3f2e73'}
                               >
                                 {part.text}
                               </a>
                             );
                           }
                           return <span key={partIndex}>{part.content ?? ''}</span>;
                         });
                       })()}
                     </p>
                   );
          
          case 'heading':
            // Render heading based on the level (1-6)
            const HeadingTag = `h${Math.min(Math.max(block.level || 2, 1), 6)}`;
            const normalizeUrl = (url) => {
              if (!url || !url.trim()) return url;
              
              const trimmedUrl = url.trim();
              
              // If it already has a protocol, return as is
              if (trimmedUrl.match(/^https?:\/\//i)) {
                return trimmedUrl;
              }
              
              // If it starts with //, add https:
              if (trimmedUrl.startsWith('//')) {
                return `https:${trimmedUrl}`;
              }
              
              // If it's a relative path, return as is
              if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
                return trimmedUrl;
              }
              
              // If it looks like a domain (contains a dot and no spaces), add https://
              if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ')) {
                return `https://${trimmedUrl}`;
              }
              
              // Otherwise, return as is
              return trimmedUrl;
            };

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
                
                // Normalize the URL to ensure it has a protocol
                const normalizedUrl = normalizeUrl(match[2]);
                
                parts.push({
                  type: 'link',
                  text: match[1],
                  url: normalizedUrl
                });
                
                lastIndex = match.index + match[0].length;
              }
              
              if (lastIndex < text.length) {
                parts.push({
                  type: 'text',
                  content: text.slice(lastIndex)
                });
              }
              
              return parts.length > 0 ? parts : [{ type: 'text', content: text ?? '' }];
            };
            const headingText = String(getBlockContent(block) ?? '');
            const headingParts = parseInlineLinks(headingText);
            return (
              <HeadingTag key={index} className="mb-4 mt-8 font-semibold text-gray-900">
                {headingParts.map((part, partIndex) => {
                  if (part.type === 'link') {
                    return (
                      <a
                        key={partIndex}
                        href={part.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium"
                        style={{ textDecoration: 'underline', color: '#3f2e73' }}
                        onMouseEnter={(e) => e.target.style.color = '#2d1f52'}
                        onMouseLeave={(e) => e.target.style.color = '#3f2e73'}
                      >
                        {part.text}
                      </a>
                    );
                  }
                  return <span key={partIndex}>{part.content ?? ''}</span>;
                })}
              </HeadingTag>
            );
          
          case 'image':
            return (
              <div key={index} className="flex justify-center">
                <img 
                  src={normalizeImageUrl(block.src || '')} 
                  alt={block.alt}
                  className="w-full max-w-[640px] max-h-96 object-cover rounded-lg shadow-md"
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
          
          case 'spacer':
            return (
              <div key={index} className="h-6"></div>
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
    <section className="mt-16 pt-8 border-t border-gray-200" aria-label="You might also like">
      <div className="related-posts text-left">
        <h6 className="text-2xl font-semibold text-gray-900 mb-6">
          You might also like
        </h6>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link 
              key={blog.id} 
              href={`/blog/${blog.slug}`}
              className="group block w-full max-w-[340px] mx-0"
            >
              <article className="w-full cursor-pointer text-left">
                {/* Image Container */}
                {blog.featured_image_url && (
                  <div className="relative w-full h-[140px] sm:h-[150px] md:h-[160px] lg:aspect-[16/9] overflow-hidden rounded-2xl">
                    <Image
                      src={normalizeImageUrl(blog.featured_image_url || '')}
                      alt={blog.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 280px, 100vw"
                      className="object-contain object-left md:object-center"
                      priority={false}
                    />
                  </div>
                )}
                
                {/* Meta Info */}
                <div className="mt-4 md:mt-6 lg:mt-4 text-gray-600 text-xs md:text-sm">
                  <span>{blog.author_name || "Little Care Team"}</span>
                  <span className="px-1 md:px-2">•</span>
                  <span>{formatDate(blog.published_at || blog.created_at)}</span>
                </div>
                
                {/* Title */}
                <h6 className="mt-2 md:mt-3 lg:mt-2 font-medium text-sm md:text-base text-gray-900">
                  {blog.title}
                </h6>
              </article>
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
  const blogContentRef = useRef(null);
  const hasResetScrollRef = useRef(false);
  const [blogPost, setBlogPost] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadBlogPost();
    loadLatestBlogs();
    hasResetScrollRef.current = false;
  }, [slug]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading || hasResetScrollRef.current) return;

    // Avoid browser scroll restoration placing the page near footer on refresh.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    hasResetScrollRef.current = true;
  }, [loading]);

  // Frontend: remove drag UI and disable drag (drag only in CMS editor)
  useEffect(() => {
    if (!blogPost) return;
    const root = blogContentRef.current;
    if (!root) return;
    const stripDragUI = () => {
      root.querySelectorAll('.doc-editor-img-block, .document-editor-image-wrapper').forEach((el) => {
        el.setAttribute('draggable', 'false');
        // Force full-width rendering even for legacy content with inline image sizing.
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('width', '100%', 'important');
        el.style.setProperty('max-width', '100%', 'important');
        el.style.setProperty('margin-left', 'auto', 'important');
        el.style.setProperty('margin-right', 'auto', 'important');
        const imgEl = el.querySelector('img');
        if (imgEl) {
          imgEl.removeAttribute('width');
          imgEl.removeAttribute('height');
          imgEl.style.setProperty('display', 'block', 'important');
          imgEl.style.setProperty('width', '100%', 'important');
          imgEl.style.setProperty('min-width', '100%', 'important');
          imgEl.style.setProperty('max-width', '100%', 'important');
          imgEl.style.setProperty('height', 'auto', 'important');
          imgEl.style.setProperty('max-height', 'none', 'important');
          imgEl.style.setProperty('object-fit', 'cover', 'important');
        }
        el.querySelectorAll('.doc-editor-img-drag-handle, .doc-editor-img-overlay').forEach((c) => c.remove());
      });
    };
    const t = setTimeout(stripDragUI, 0);
    return () => clearTimeout(t);
  }, [blogPost]);

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
      <article className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#3f2e73' }}>404</h1>
          <h2 className="text-2xl font-semibold mb-3" style={{ color: '#3f2e73' }}>
            Article not found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ? `Error: ${error}` : "The article you're looking for doesn't exist or is no longer available."}
            </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3 px-4 text-base font-semibold text-white rounded-lg transition-colors duration-200 bg-[#3f2e73] hover:bg-[#1d1733]"
          >
            Go back home
          </Link>
      </div>
      </article>
    );
  }

  return (
    <>
      <BlogMetaTags blog={blogPost} />
    <article className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-32 lg:px-40 xl:px-44 pt-24 pb-12">
        {/* Title & Metadata */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 sm:gap-x-4 sm:text-sm">
            <span className="font-medium">{blogPost.author_name}</span>
            <span>•</span>
            <span>
              {formatDate(blogPost.published_at || blogPost.created_at)}
            </span>
            <span>•</span>
            <span>
              {blogPost.read_time_minutes || 5} min read
            </span>
            <span>•</span>
            <span>
              {blogPost.view_count || 0} views
            </span>
          </div>
          <div
            role="heading"
            aria-level={1}
            className="font-semibold mb-4 text-[20px] leading-[1.5rem] md:text-[32px] md:leading-[2.25rem] tracking-[-0.5px]"
          >
            {blogPost.title}
          </div>
          {blogPost.excerpt && (
            <p className="font-medium text-gray-600 text-base md:text-lg mb-4">
              {blogPost.excerpt}
            </p>
          )}
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
            <div className="flex justify-center">
              <div className="w-full max-w-[960px] rounded-2xl overflow-hidden">
                <img
                  src={normalizeImageUrl(blogPost.featured_image_url || '')}
                  alt={blogPost.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Blog body: content first, then "You might also like" below (no overlap) */}
        <div className="blog-post-body w-full">
        <div ref={blogContentRef} className="blog-content w-full">
          <style dangerouslySetInnerHTML={{
            __html: `
              /* Same block spacing as blog CMS editor (document-editor) for correct line breaks */
              .blog-content .document-editor p {
                display: block !important;
                margin-top: 0 !important;
                margin-bottom: 1rem !important;
                line-height: 1.45 !important;
              }
              .blog-content .document-editor h1 { display: block !important; margin-top: 1.5rem !important; margin-bottom: 1rem !important; }
              .blog-content .document-editor h2 { display: block !important; margin-top: 1.25rem !important; margin-bottom: 0.75rem !important; }
              .blog-content .document-editor h3 { display: block !important; margin-top: 1rem !important; margin-bottom: 0.5rem !important; }
              .blog-content .document-editor h4, .blog-content .document-editor h5, .blog-content .document-editor h6 { display: block !important; margin-top: 0.75rem !important; margin-bottom: 0.5rem !important; }
              .blog-content .document-editor div { display: block !important; margin-top: 0 !important; margin-bottom: 1rem !important; }
              .blog-content .document-editor blockquote { display: block !important; margin: 1rem 0 !important; }
              .blog-content .document-editor pre { display: block !important; margin: 1rem 0 !important; }
              .blog-content .document-editor > *:first-child { margin-top: 0 !important; }
              .blog-content .document-editor > *:last-child { margin-bottom: 0 !important; }
              .blog-content .document-editor ul,
              .blog-content .document-editor ol {
                display: block !important;
                margin: 0.75rem 0 !important;
                margin-left: 1.5rem !important;
                padding-left: 1.25rem !important;
                list-style-position: outside !important;
              }
              .blog-content .document-editor ul { list-style-type: disc !important; }
              .blog-content .document-editor ol { list-style-type: decimal !important; }
              .blog-content .document-editor li { display: list-item !important; margin: 0 0 0.5rem 0 !important; line-height: 1.6 !important; list-style-position: outside !important; padding-left: 0.25rem !important; }
              .blog-content p,
              .blog-content div,
              .blog-content h1,
              .blog-content h2,
              .blog-content h3,
              .blog-content h4,
              .blog-content h5,
              .blog-content h6,
              .blog-content blockquote,
              .blog-content-html p,
              .blog-content-html div,
              .blog-content-html h1,
              .blog-content-html h2,
              .blog-content-html h3,
              .blog-content-html h4,
              .blog-content-html h5,
              .blog-content-html h6,
              .blog-content-html blockquote,
              .blog-content-html pre {
                display: block !important;
                margin-bottom: 1rem !important;
                line-height: 1.6 !important;
                margin-left: 0 !important;
                padding-left: 0 !important;
              }
              /* Ensure headings and paragraphs start from the left edge */
              .blog-content > p,
              .blog-content > div,
              .blog-content > h1,
              .blog-content > h2,
              .blog-content > h3,
              .blog-content > h4,
              .blog-content > h5,
              .blog-content > h6,
              .blog-content > blockquote {
                margin-left: 0 !important;
                padding-left: 0 !important;
              }
              .blog-content p:last-child,
              .blog-content div:last-child,
              .blog-content-html p:last-of-type,
              .blog-content-html div:last-of-type,
              .blog-content-html > *:last-child {
                margin-bottom: 0 !important;
              }
              .blog-content br {
                display: block !important;
                margin-bottom: 0.25em !important;
              }
              .blog-content ul,
              .blog-content ol {
                display: block !important;
                margin: 1rem 0 !important;
                margin-left: 1.5rem !important;
                padding-left: 1.25rem !important;
                list-style-position: outside !important;
              }
              .blog-content ul {
                list-style-type: disc !important;
              }
              .blog-content ol {
                list-style-type: decimal !important;
              }
              .blog-content li {
                display: list-item !important;
                margin-bottom: 0.5rem !important;
                line-height: 1.6 !important;
                font-size: 1rem !important;
                list-style-position: outside !important;
                padding-left: 0.25rem !important;
              }
              /* Support mixed content inside list items: h4 title + p description in same bullet */
              .blog-content li > h1,
              .blog-content li > h2,
              .blog-content li > h3,
              .blog-content li > h4,
              .blog-content li > h5,
              .blog-content li > h6,
              .blog-content-html li > h1,
              .blog-content-html li > h2,
              .blog-content-html li > h3,
              .blog-content-html li > h4,
              .blog-content-html li > h5,
              .blog-content-html li > h6 {
                display: block !important;
                margin-top: 0 !important;
                margin-bottom: 0.25rem !important;
                line-height: 1.35 !important;
              }
              .blog-content li > h4,
              .blog-content-html li > h4 {
                font-size: 1.1rem !important;
                font-weight: 600 !important;
              }
              .blog-content li > p,
              .blog-content-html li > p {
                display: block !important;
                margin-top: 0 !important;
                margin-bottom: 0.5rem !important;
                line-height: 1.6 !important;
              }
              .blog-content li > blockquote,
              .blog-content-html li > blockquote {
                margin: 0.35rem 0 !important;
              }
              .blog-content ul ul,
              .blog-content ol ul,
              .blog-content ul ol,
              .blog-content ol ol {
                margin: 0.5rem 0 !important;
              }
              .blog-content h1,
              .blog-content-html h1 {
                font-size: 2.5rem !important;
                line-height: 1.2 !important;
                font-weight: 700 !important;
                letter-spacing: -0.65px !important;
                margin-top: 2rem !important;
                margin-bottom: 1rem !important;
                overflow: visible !important;
                visibility: visible !important;
              }
              .blog-content h2,
              .blog-content-html h2 {
                font-size: 2rem !important;
                line-height: 1.3 !important;
                font-weight: 700 !important;
                letter-spacing: -0.65px !important;
                margin-top: 1.75rem !important;
                margin-bottom: 0.875rem !important;
                overflow: visible !important;
                visibility: visible !important;
              }
              .blog-content h3,
              .blog-content-html h3 {
                font-size: 1.75rem !important;
                line-height: 1.4 !important;
                font-weight: 600 !important;
                letter-spacing: -0.65px !important;
                margin-top: 1.5rem !important;
                margin-bottom: 0.75rem !important;
                overflow: visible !important;
                visibility: visible !important;
              }
              .blog-content h4,
              .blog-content-html h4 {
                font-size: 1.5rem !important;
                line-height: 1.4 !important;
                font-weight: 600 !important;
                letter-spacing: -0.65px !important;
                margin-top: 1.25rem !important;
                margin-bottom: 0.625rem !important;
                overflow: visible !important;
                visibility: visible !important;
              }
              .blog-content h5,
              .blog-content-html h5 {
                font-size: 1.25rem !important;
                line-height: 1.5 !important;
                font-weight: 600 !important;
                letter-spacing: -0.65px !important;
                margin-top: 1rem !important;
                margin-bottom: 0.5rem !important;
                overflow: visible !important;
                visibility: visible !important;
              }
              .blog-content h6,
              .blog-content-html h6 {
                font-size: 1.125rem !important;
                line-height: 1.5 !important;
                font-weight: 600 !important;
                letter-spacing: -0.65px !important;
                margin-top: 0.875rem !important;
                margin-bottom: 0.5rem !important;
                overflow: visible !important;
                visibility: visible !important;
              }
              .blog-content a {
                color: #3f2e73 !important;
                text-decoration: underline !important;
              }
              .blog-content a:hover {
                color: #1d1733 !important;
              }
              .blog-content .doc-editor-img-block,
              .blog-content .document-editor-image-wrapper {
                display: block !important;
                margin: 1rem auto !important;
                margin-left: auto !important;
                margin-right: auto !important;
                max-width: 100% !important;
                width: 100% !important;
                overflow: visible !important;
                cursor: default !important;
              }
              .blog-content .doc-editor-img-drag-handle,
              .blog-content .doc-editor-img-overlay,
              .blog-content-html .doc-editor-img-drag-handle,
              .blog-content-html .doc-editor-img-overlay {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                pointer-events: none !important;
              }
              .blog-content .doc-editor-img-block img,
              .blog-content .document-editor-image-wrapper img {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                max-height: none !important;
                object-fit: cover !important;
                border-radius: 0.5rem !important;
              }
              .blog-content img,
              .blog-content-html img {
                display: block !important;
                width: 100% !important;
                min-width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                max-height: none !important;
                object-fit: cover !important;
                margin: 1rem 0 !important;
                border-radius: 0.5rem !important;
              }
              @media (max-width: 767px) {
                .blog-content .document-editor p,
                .blog-content .document-editor div,
                .blog-content .document-editor blockquote {
                  line-height: 1.25rem !important;
                }
                .blog-content h1,
                .blog-content-html h1 {
                  font-size: 22px !important;
                }
                .blog-content h2,
                .blog-content-html h2 {
                  font-size: 20px !important;
                }
                .blog-content h3,
                .blog-content-html h3 {
                  font-size: 18px !important;
                }
                .blog-content h4,
                .blog-content-html h4 {
                  font-size: 16px !important;
                }
                .blog-content h5,
                .blog-content-html h5 {
                  font-size: 15px !important;
                }
                .blog-content h6,
                .blog-content-html h6 {
                  font-size: 14px !important;
                }
                .blog-content h1,
                .blog-content h2,
                .blog-content h3,
                .blog-content h4,
                .blog-content h5,
                .blog-content h6,
                .blog-content-html h1,
                .blog-content-html h2,
                .blog-content-html h3,
                .blog-content-html h4,
                .blog-content-html h5,
                .blog-content-html h6 {
                  line-height: 1.3 !important;
                  letter-spacing: -0.65px !important;
                }
                .blog-content p,
                .blog-content div,
                .blog-content blockquote,
                .blog-content-html p,
                .blog-content-html div,
                .blog-content-html blockquote {
                  line-height: 1.25rem !important;
                  letter-spacing: -0.50px !important;
                }
              }
            `
          }} />
          {(() => {
            // Prefer HTML content when it has block structure (from BlogEditorWix/CMS) so headings display correctly
            const hasHtmlBlocks = blogPost.content && /<(p|div|br|h[1-6]|ul|ol|li|blockquote)\b/i.test(blogPost.content);
            const useStructured = !hasHtmlBlocks && blogPost.structured_content && blogPost.structured_content.length > 0;
            const raw = blogPost.content || '';
            const htmlContent = !raw.trim() ? '' : !/<(p|div|br|h[1-6]|ul|ol|li|blockquote)\b/i.test(raw) && /\n/.test(raw) ? raw.replace(/\n/g, '<br>') : raw;

            if (useStructured) {
              return <StructuredContentRenderer content={blogPost.structured_content} />;
            }
            return (
              <div
                className="blog-content-html document-editor"
                data-block-content="true"
                style={{ display: 'block', maxWidth: 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.75 }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            );
          })()}
        </div>

        {/* You might also like – always after the blog content */}
        <LatestBlogsSection blogs={latestBlogs.slice(0, 2)} currentSlug={slug} />
        </div>
      </div>
    </article>
    </>
  );
}
