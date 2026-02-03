'use client';

import { useState, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Upload,
  X,
  Eye,
  Settings,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import DocumentStyleEditor from '@/components/DocumentStyleEditor';

// Generate slug from title (same logic as backend)
const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Wix-style blog editor:
 * - Left panel: post settings (cover, excerpt, author, status, tags, SEO)
 * - Main area: block-based content with inline "+" to add blocks
 * Uses same structured_content format as existing editor.
 */
const BlogEditorWix = forwardRef(function BlogEditorWix({
  blog,
  onChange,
  onFeaturedImageUpload,
  onContentImageUpload,
  uploadProgress = false,
  defaultAuthorName = '',
  featuredImagePreview = null,
}, ref) {
  const editorRef = useRef(null);
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent?.() ?? ''
  }), []);

  const [settingsOpen, setSettingsOpen] = useState(true);
  const [seoOpen, setSeoOpen] = useState(false);
  const [seoPreviewOpen, setSeoPreviewOpen] = useState(true);
  
  // Auto-generate slug from title (display only; backend generates slug on save if needed)
  const autoSlug = useMemo(() => generateSlug(blog.title || ''), [blog.title]);
  const displaySlug = blog.slug || autoSlug;

  // Wrapper for image upload to convert File to FormData
  const handleImageUpload = async (file) => {
    if (!onContentImageUpload || !file) return { success: false, error: 'No file provided' };
    
    try {
      const formData = new FormData();
      formData.append('images', file);
      formData.append('blogTitle', blog.title || 'untitled');
      const result = await onContentImageUpload(formData);
      
      // API can return: data as array, data.uploadedImages array, data.imageUrl, or data as string URL
      if (result?.success && result?.data) {
        const d = result.data;
        // Backend upload-multiple returns { uploadedImages: [{ imageUrl, ... }], errors: [] }
        if (d.uploadedImages && Array.isArray(d.uploadedImages) && d.uploadedImages.length > 0) {
          const first = d.uploadedImages[0];
          return {
            success: true,
            data: { imageUrl: first.imageUrl || first.url || first }
          };
        }
        // If result.data is an array, get first image
        if (Array.isArray(d) && d.length > 0) {
          const firstImage = d[0];
          return {
            success: true,
            data: {
              imageUrl: firstImage.imageUrl || firstImage.url || firstImage
            }
          };
        }
        // If result.data has imageUrl directly
        if (d?.imageUrl) {
          return result;
        }
        // If result.data is a string (URL)
        if (typeof d === 'string') {
          return { success: true, data: { imageUrl: d } };
        }
      }
      return result;
    } catch (error) {
      console.error('Image upload error:', error);
      return { success: false, error: error.message };
    }
  };

  const addTag = () => {
    const input = document.getElementById('wix-tag-input');
    const v = input?.value?.trim();
    if (v && !blog.tags.includes(v)) {
      onChange({ ...blog, tags: [...(blog.tags || []), v] });
      if (input) input.value = '';
    }
  };
  const removeTag = (tag) => {
    onChange({ ...blog, tags: (blog.tags || []).filter((t) => t !== tag) });
  };
  const addCategory = () => {
    const input = document.getElementById('wix-category-input');
    const v = input?.value?.trim();
    if (v && !(blog.categories || []).includes(v)) {
      onChange({ ...blog, categories: [...(blog.categories || []), v] });
      if (input) input.value = '';
    }
  };
  const removeCategory = (cat) => {
    onChange({ ...blog, categories: (blog.categories || []).filter((c) => c !== cat) });
  };
  const addMetaKeyword = () => {
    const input = document.getElementById('wix-meta-keyword-input');
    const v = input?.value?.trim();
    if (v && !(blog.meta_keywords || []).includes(v)) {
      onChange({ ...blog, meta_keywords: [...(blog.meta_keywords || []), v] });
      if (input) input.value = '';
    }
  };
  const removeMetaKeyword = (kw) => {
    onChange({ ...blog, meta_keywords: (blog.meta_keywords || []).filter((k) => k !== kw) });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
      {/* Left panel - Wix-style settings */}
      <aside className="lg:w-80 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-200 overflow-y-auto max-h-[calc(95vh-8rem)]">
        <div className="p-4 space-y-4">
          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900"
          >
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Post settings
            </span>
            {settingsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {settingsOpen && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured image</label>
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 bg-white">
                    {uploadProgress ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400 mb-0.5" />
                        <span className="text-xs text-gray-500">Upload</span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onFeaturedImageUpload?.(f);
                      }}
                      disabled={uploadProgress}
                    />
                  </label>
                  {(blog.featured_image_url || featuredImagePreview) && (
                    <div className="relative">
                      <img
                        src={featuredImagePreview || blog.featured_image_url}
                        alt="Cover"
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => onChange({ ...blog, featured_image_url: '' })}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    value={blog.featured_image_url || ''}
                    onChange={(e) => onChange({ ...blog, featured_image_url: e.target.value })}
                    placeholder="Or paste image URL"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={blog.author_name ?? defaultAuthorName}
                  onChange={(e) => onChange({ ...blog, author_name: e.target.value })}
                  placeholder="Author name"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={blog.status ?? 'draft'}
                  onChange={(e) => onChange({ ...blog, status: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Read time (min)</label>
                <input
                  type="number"
                  min={1}
                  value={blog.read_time_minutes ?? 5}
                  onChange={(e) => onChange({ ...blog, read_time_minutes: parseInt(e.target.value, 10) || 5 })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex gap-1 mb-1">
                  <input
                    id="wix-tag-input"
                    type="text"
                    placeholder="Add tag"
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button type="button" onClick={addTag} className="px-2 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(blog.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSeoOpen((o) => !o)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200"
              >
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  SEO
                </span>
                {seoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {seoOpen && (
                <div className="space-y-3 pt-2">
                  {/* SEO Preview Toggle */}
                  <button
                    type="button"
                    onClick={() => setSeoPreviewOpen((o) => !o)}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 p-2 bg-green-50 rounded-lg hover:bg-green-100 border border-green-200"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-green-600" />
                      Google Preview
                    </span>
                    {seoPreviewOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  
                  {/* SEO Preview Panel */}
                  {seoPreviewOpen && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-xs text-gray-600">Google</span>
                        </div>
                        <div className="flex-1 border-t border-gray-200"></div>
                        <div className="text-xs text-gray-500">Search Preview</div>
                      </div>
                      <div className="space-y-2">
                        {/* URL */}
                        <div className="text-xs text-green-700">
                          {displaySlug ? `www.little.care/blog/${displaySlug}` : 'www.little.care/blog/...'}
                        </div>
                        {/* Title */}
                        <div className={`text-lg text-blue-600 leading-tight ${(blog.seo_title || blog.title || '').length > 60 ? 'text-red-600' : ''}`}>
                          {blog.seo_title || blog.title || 'Your blog post title'}
                        </div>
                        {/* Description */}
                        <div className={`text-sm text-gray-600 leading-relaxed ${(blog.seo_description || blog.excerpt || '').length > 160 ? 'text-red-600' : ''}`}>
                          {blog.seo_description || blog.excerpt || 'Your meta description will appear here...'}
                        </div>
                        {/* SEO Score Indicators */}
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                          <div className={`flex items-center gap-1 text-xs ${(blog.seo_title || blog.title || '').length <= 60 && (blog.seo_title || blog.title || '').length >= 30 ? 'text-green-600' : 'text-gray-400'}`}>
                            {(blog.seo_title || blog.title || '').length <= 60 && (blog.seo_title || blog.title || '').length >= 30 ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            <span>Title: {(blog.seo_title || blog.title || '').length}/60</span>
                          </div>
                          <div className={`flex items-center gap-1 text-xs ${(blog.seo_description || blog.excerpt || '').length <= 160 && (blog.seo_description || blog.excerpt || '').length >= 120 ? 'text-green-600' : 'text-gray-400'}`}>
                            {(blog.seo_description || blog.excerpt || '').length <= 160 && (blog.seo_description || blog.excerpt || '').length >= 120 ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            <span>Desc: {(blog.seo_description || blog.excerpt || '').length}/160</span>
                          </div>
                          {blog.focus_keyword && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Keyword set</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 whitespace-nowrap">little.care/blog/</span>
                      <input
                        type="text"
                        value={displaySlug}
                        onChange={(e) => {
                          const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
                          onChange({ ...blog, slug: newSlug });
                        }}
                        placeholder="auto-generated-from-title"
                        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Auto-generated from title. Edit if needed.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Focus keyword</label>
                    <input
                      type="text"
                      value={blog.focus_keyword ?? ''}
                      onChange={(e) => onChange({ ...blog, focus_keyword: e.target.value })}
                      placeholder="e.g. child psychology"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SEO title
                      <span className={`ml-2 text-xs ${(blog.seo_title || '').length > 60 ? 'text-red-600' : (blog.seo_title || '').length >= 30 ? 'text-green-600' : 'text-gray-400'}`}>
                        {(blog.seo_title || '').length > 60 ? 'Too long' : (blog.seo_title || '').length >= 30 ? 'Good' : 'Too short'}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={blog.seo_title ?? ''}
                      onChange={(e) => onChange({ ...blog, seo_title: e.target.value })}
                      placeholder={blog.title || 'Max 60 chars'}
                      maxLength={60}
                      className={`w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        (blog.seo_title || '').length > 60 ? 'border-red-300' : (blog.seo_title || '').length >= 30 ? 'border-green-300' : 'border-gray-300'
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-0.5">{ (blog.seo_title || '').length }/60 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta description
                      <span className={`ml-2 text-xs ${(blog.seo_description || '').length > 160 ? 'text-red-600' : (blog.seo_description || '').length >= 120 ? 'text-green-600' : 'text-gray-400'}`}>
                        {(blog.seo_description || '').length > 160 ? 'Too long' : (blog.seo_description || '').length >= 120 ? 'Good' : 'Too short'}
                      </span>
                    </label>
                    <textarea
                      value={blog.seo_description ?? ''}
                      onChange={(e) => onChange({ ...blog, seo_description: e.target.value })}
                      placeholder={blog.excerpt || 'Max 160 chars'}
                      maxLength={160}
                      rows={3}
                      className={`w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        (blog.seo_description || '').length > 160 ? 'border-red-300' : (blog.seo_description || '').length >= 120 ? 'border-green-300' : 'border-gray-300'
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-0.5">{ (blog.seo_description || '').length }/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                    <div className="flex gap-1 mb-1">
                      <input
                        id="wix-category-input"
                        type="text"
                        placeholder="Add category"
                        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                      />
                      <button type="button" onClick={addCategory} className="px-2 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(blog.categories || []).map((c) => (
                        <span key={c} className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          {c}
                          <button type="button" onClick={() => removeCategory(c)} className="ml-1 text-green-600 hover:text-green-800">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta keywords</label>
                    <div className="flex gap-1 mb-1">
                      <input
                        id="wix-meta-keyword-input"
                        type="text"
                        placeholder="Add keyword"
                        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMetaKeyword())}
                      />
                      <button type="button" onClick={addMetaKeyword} className="px-2 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(blog.meta_keywords || []).map((k) => (
                        <span key={k} className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {k}
                          <button type="button" onClick={() => removeMetaKeyword(k)} className="ml-1 text-gray-600 hover:text-gray-800">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={blog.canonical_url ?? ''}
                      onChange={(e) => onChange({ ...blog, canonical_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Main: title, excerpt, then document-style editor */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="space-y-4 mb-6">
          <input
            type="text"
            required
            value={blog.title ?? ''}
            onChange={(e) => onChange({ ...blog, title: e.target.value })}
            placeholder="Post title"
            className="w-full text-3xl font-bold border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 bg-transparent py-3 placeholder:text-gray-400"
          />
          <textarea
            value={blog.excerpt ?? ''}
            onChange={(e) => onChange({ ...blog, excerpt: e.target.value })}
            placeholder="Brief description (excerpt)"
            rows={2}
            className="w-full text-lg text-gray-600 border-0 border-b border-gray-100 focus:ring-0 focus:border-blue-500 bg-transparent py-2 placeholder:text-gray-400 resize-none"
          />
        </div>
        <div className="flex-1 min-h-[600px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DocumentStyleEditor
            ref={editorRef}
            content={blog.content || ''}
            onChange={(htmlContent) => {
              // Store HTML content directly
              onChange({ ...blog, content: htmlContent });
            }}
            onImageUpload={handleImageUpload}
            placeholder="Start writing... Press '/' for commands"
          />
        </div>
        <div className="mt-4 text-xs text-gray-500 flex items-center gap-4">
          <span>💡 <strong>Tip:</strong> Select text to format • Type "/" to insert blocks • Click image and drag bottom-right corner to resize</span>
        </div>
      </main>
    </div>
  );
});

export default BlogEditorWix;
