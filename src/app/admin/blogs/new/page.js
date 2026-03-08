'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminSidebar } from '@/contexts/AdminSidebarContext';
import { useNotification } from '@/contexts/NotificationContext';
import BlogEditorWix from '@/components/BlogEditorWix';
import { getStoredToken } from '@/lib/authStorage';

const initialBlogState = (userName = '') => ({
  title: '',
  excerpt: '',
  content: '',
  structured_content: [],
  content_images: [],
  featured_image_url: '',
  author_name: userName,
  status: 'draft',
  tags: [],
  categories: [],
  read_time_minutes: 5,
  slug: '',
  seo_title: '',
  seo_description: '',
  focus_keyword: '',
  meta_keywords: [],
  canonical_url: ''
});

export default function NewBlogPage() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const { showError, showSuccess } = useNotification();
  const { toggleSidebar, isSidebarOpen } = useAdminSidebar() || {};
  const adminSidebarCollapsed = isSidebarOpen === false;
  const router = useRouter();
  const [blog, setBlog] = useState(() => initialBlogState(user?.name || ''));
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const blogEditorRef = useRef(null);

  if (!authLoading && (!isAuthenticated() || (!hasRole('admin') && !hasRole('superadmin')))) {
    router.push('/');
    return null;
  }

  const uploadFeaturedImage = async (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return { success: false };
    }
    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return { success: false };
    }
    setUploadingImage(true);
    try {
      const token = getStoredToken();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      const formData = new FormData();
      formData.append('image', file);
      formData.append('blogTitle', blog.title || 'untitled');
      const response = await fetch(`${baseUrl}/blogs/admin/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setBlog(prev => ({ ...prev, featured_image_url: result.data.imageUrl }));
        setImagePreview(result.data.imageUrl);
        showSuccess('Image uploaded successfully');
        return result;
      }
      showError(result.message || 'Failed to upload image');
      return { success: false };
    } catch (error) {
      showError('Failed to upload image');
      return { success: false };
    } finally {
      setUploadingImage(false);
    }
  };

  const handleContentImageUpload = async (formData) => {
    const token = getStoredToken();
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
    formData.append('blogTitle', blog.title || 'untitled');
    const response = await fetch(`${baseUrl}/blogs/admin/upload-multiple-images`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const result = await response.json();
    if (result.success) {
      showSuccess('Image uploaded successfully');
      return result;
    }
    showError(result.message || 'Failed to upload image');
    return { success: false, error: result.message };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blog.title?.trim()) {
      showError('Please enter a title');
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      let editorContent = blogEditorRef.current?.getContent?.() ?? blog.content;
      const payload = { ...blog };
      if (editorContent != null) payload.content = editorContent;

      const token = getStoredToken();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      const response = await fetch(`${baseUrl}/blogs/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.success) {
        showError(result?.message || 'Failed to create blog');
        return;
      }
      showSuccess('Blog created successfully');
      router.push('/admin/blogs');
    } catch (err) {
      showError(err?.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3f2e73]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-4 ${adminSidebarCollapsed ? 'w-full max-w-full' : 'max-w-7xl'}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blogs"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Back to blogs"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="font-semibold text-gray-900" style={{ fontSize: '1.25rem' }} role="heading" aria-level={2}>Create New Blog</div>
                <p className="text-sm text-gray-500">Add a new blog post</p>
              </div>
            </div>
            {typeof toggleSidebar === 'function' && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Toggle admin menu"
                aria-label="Toggle admin menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-8 ${adminSidebarCollapsed ? 'w-full max-w-full' : 'max-w-7xl'}`}>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="min-h-[60vh]">
            <BlogEditorWix
              ref={blogEditorRef}
              blog={blog}
              onChange={setBlog}
              onFeaturedImageUpload={uploadFeaturedImage}
              onContentImageUpload={handleContentImageUpload}
              uploadProgress={uploadingImage}
              defaultAuthorName={user?.name}
              featuredImagePreview={imagePreview}
              adminSidebarCollapsed={adminSidebarCollapsed}
            />
          </div>
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/admin/blogs"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#1d1733] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Creating...' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
