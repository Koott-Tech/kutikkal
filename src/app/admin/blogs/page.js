'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  MoreVertical,
  Calendar,
  User,
  Tag,
  Clock,
  TrendingUp,
  Globe,
  X,
  Layers,
  FileText
} from 'lucide-react';
// We'll use direct fetch for blog API calls
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import StructuredContentEditor from '@/components/StructuredContentEditor';
import { getStoredToken } from '@/lib/authStorage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function BlogsPage() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const { showError, showSuccess, showWarning } = useNotification();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    excerpt: '',
    content: '',
    structured_content: [],
    content_images: [],
    featured_image_url: '',
    author_name: '',
    status: 'draft',
    tags: [],
    categories: [],
    read_time_minutes: 5,
    // SEO fields
    seo_title: '',
    seo_description: '',
    focus_keyword: '',
    meta_keywords: [],
    canonical_url: ''
  });
  const [useStructuredContent, setUseStructuredContent] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push('/');
        return;
      }
      
      if (!hasRole('admin') && !hasRole('superadmin')) {
        router.push('/');
        return;
      }
      
      loadBlogs();
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = getStoredToken();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      
      const queryParams = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (searchTerm) queryParams.append('search', searchTerm);
      
      const response = await fetch(`${baseUrl}/blogs/admin?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBlogs(result.data.blogs || []);
        } else {
          // Treat empty blogs as successful, not an error
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
      // Only show error for actual failures, not empty results
      if (err.message !== 'Failed to load blogs') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated() && hasRole('admin')) {
      loadBlogs();
    }
  }, [searchTerm, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getStoredToken();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      const isUpdate = Boolean(selectedBlog);
      const url = isUpdate ? `${baseUrl}/blogs/admin/${selectedBlog.id}` : `${baseUrl}/blogs/admin`;
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBlog)
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        // Ignore JSON parsing errors; we'll handle via response.ok
      }

      if (!response.ok || !result?.success) {
        const message = result?.message || `Failed to ${isUpdate ? 'update' : 'create'} blog`;
        showError(message);
        return;
      }

      showSuccess(isUpdate ? 'Blog updated successfully' : 'Blog created successfully');
      if (isUpdate) {
        setShowEditModal(false);
      } else {
        setShowAddModal(false);
      }
      loadBlogs();

      // Reset form only after a successful save
      setNewBlog({
        title: '',
        excerpt: '',
        content: '',
        structured_content: [],
        content_images: [],
        featured_image_url: '',
        author_name: user?.name || '',
        status: 'draft',
        tags: [],
        categories: [],
        read_time_minutes: 5,
        // SEO fields
        seo_title: '',
        seo_description: '',
        focus_keyword: '',
        meta_keywords: [],
        canonical_url: ''
      });
      setSelectedBlog(null);
      setUseStructuredContent(true);
    } catch (err) {
      console.error('Error saving blog:', err);
      showError(err.response?.data?.message || 'Failed to save blog');
    }
  };

  const handleDelete = async () => {
    try {
      const token = getStoredToken();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      
      const response = await fetch(`${baseUrl}/blogs/admin/${selectedBlog.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showSuccess('Blog deleted successfully');
          setShowDeleteDialog(false);
          setSelectedBlog(null);
          loadBlogs();
        }
      } else {
        throw new Error('Failed to delete blog');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      showError('Failed to delete blog');
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setNewBlog({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content || '',
      structured_content: blog.structured_content || [],
      content_images: blog.content_images || [],
      featured_image_url: blog.featured_image_url,
      author_name: blog.author_name,
      status: blog.status,
      tags: blog.tags || [],
      categories: blog.categories || [],
      read_time_minutes: blog.read_time_minutes || 5,
      // SEO fields
      seo_title: blog.seo_title || blog.title,
      seo_description: blog.seo_description || blog.excerpt,
      focus_keyword: blog.focus_keyword || '',
      meta_keywords: blog.meta_keywords || [],
      canonical_url: blog.canonical_url || ''
    });
    setUseStructuredContent(blog.structured_content && blog.structured_content.length > 0);
    setShowEditModal(true);
  };

  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteDialog(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const addTag = () => {
    const tagInput = document.getElementById('tagInput');
    const tag = tagInput.value.trim();
    if (tag && !newBlog.tags.includes(tag)) {
      setNewBlog(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      tagInput.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setNewBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCategory = () => {
    const categoryInput = document.getElementById('categoryInput');
    const category = categoryInput.value.trim();
    if (category && !newBlog.categories.includes(category)) {
      setNewBlog(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
      categoryInput.value = '';
    }
  };

  const removeCategory = (categoryToRemove) => {
    setNewBlog(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }));
  };

  const addMetaKeyword = () => {
    const metaKeywordInput = document.getElementById('metaKeywordInput');
    const keyword = metaKeywordInput.value.trim();
    if (keyword && !newBlog.meta_keywords.includes(keyword)) {
      setNewBlog(prev => ({
        ...prev,
        meta_keywords: [...prev.meta_keywords, keyword]
      }));
      metaKeywordInput.value = '';
    }
  };

  const removeMetaKeyword = (keywordToRemove) => {
    setNewBlog(prev => ({
      ...prev,
      meta_keywords: prev.meta_keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    
    try {
      const token = getStoredToken();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('blogTitle', newBlog.title || 'untitled');

      const response = await fetch(`${baseUrl}/blogs/admin/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setNewBlog(prev => ({
          ...prev,
          featured_image_url: result.data.imageUrl
        }));
        setImagePreview(result.data.imageUrl);
        showSuccess('Image uploaded successfully');
      } else {
        showError(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleStructuredContentImageUpload = async (formData) => {
    try {
      const token = getStoredToken();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      
      formData.append('blogTitle', newBlog.title || 'untitled');

      const response = await fetch(`${baseUrl}/blogs/admin/upload-multiple-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccess('Image uploaded successfully');
        return result;
      } else {
        showError(result.message || 'Failed to upload image');
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image');
      return { success: false, error: error.message };
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h6>Blog Management</h6>
              <p className="text-gray-600 mt-1">Manage blog posts and content</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Blog</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Blogs</p>
                <p className="number-bold">{blogs?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="number-bold">
                  {blogs?.filter(b => b.status === 'published').length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Drafts</p>
                <p className="number-bold">
                  {blogs?.filter(b => b.status === 'draft').length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="number-bold">
                  {blogs?.reduce((sum, b) => sum + (b.view_count || 0), 0) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                        <h6>No blog posts yet</h6>
                        <p className="text-gray-500 mb-4">Create your first blog post to get started</p>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Create First Blog</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="w-20 h-16 flex-shrink-0">
                          {blog.featured_image_url ? (
                            <img
                              src={blog.featured_image_url}
                              alt={blog.title}
                              className="w-full h-full object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const placeholder = e.target.parentNode.querySelector('.placeholder-div');
                                if (placeholder) {
                                  placeholder.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          {!blog.featured_image_url && (
                            <div className="placeholder-div w-full h-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          {/* Always include the placeholder div for error fallback but hide it initially if image exists */}
                          {blog.featured_image_url && (
                            <div className="placeholder-div w-full h-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center" style={{ display: 'none' }}>
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {blog.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {blog.excerpt}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{blog.author_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {blog.view_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(blog.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100">
                              <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => window.open(`/blogs/${blog.slug}`, '_blank')} className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              View Blog
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(blog)} className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(blog)} 
                              className="cursor-pointer text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Blog Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-7xl w-full h-[95vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h6>
                    {selectedBlog ? 'Edit Blog' : 'Create New Blog'}
                  </h6>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedBlog(null);
                      setNewBlog({
                        title: '',
                        excerpt: '',
                        content: '',
                        structured_content: [],
                        content_images: [],
                        featured_image_url: '',
                        author_name: user?.name || '',
                        status: 'draft',
                        tags: [],
                        categories: [],
                        read_time_minutes: 5,
                        // SEO fields
                        seo_title: '',
                        seo_description: '',
                        focus_keyword: '',
                        meta_keywords: [],
                        canonical_url: ''
                      });
                      setUseStructuredContent(true);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                  <div className="xl:col-span-3 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newBlog.title}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter blog title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt
                      </label>
                      <textarea
                        value={newBlog.excerpt}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of the blog"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Content *
                        </label>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => setUseStructuredContent(true)}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                              useStructuredContent 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Layers className="h-4 w-4 mr-2" />
                            Structured Editor
                          </button>
                          <button
                            type="button"
                            onClick={() => setUseStructuredContent(false)}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                              !useStructuredContent 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            HTML Editor
                          </button>
                        </div>
                      </div>

                      {useStructuredContent ? (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <StructuredContentEditor
                            content={newBlog.structured_content}
                            onChange={(content) => setNewBlog(prev => ({ ...prev, structured_content: content }))}
                            onImageUpload={handleStructuredContentImageUpload}
                          />
                        </div>
                      ) : (
                        <textarea
                          required
                          value={newBlog.content}
                          onChange={(e) => setNewBlog(prev => ({ ...prev, content: e.target.value }))}
                          rows="20"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                          placeholder="Write your blog content here (HTML supported)"
                        />
                      )}
                      
                      {!useStructuredContent && (
                        <p className="text-xs text-gray-500 mt-1">
                          Use HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;)
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="xl:col-span-1 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={newBlog.author_name}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, author_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Author name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={newBlog.status}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image
                      </label>
                      
                      {/* Upload File Option */}
                      <div className="mb-3">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-3 pb-3">
                            {uploadingImage ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mb-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.975 6.5H5a3 3 0 0 0 0 6h3m-3 0V9h3v4m-3 0Z"/>
                                </svg>
                                <span className="text-xs text-gray-500">Choose image file</span>
                              </>
                            )}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>

                      {/* Image Preview */}
                      {(imagePreview || newBlog.featured_image_url) && (
                        <div className="mb-3">
                          <img
                            src={imagePreview || newBlog.featured_image_url}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setNewBlog(prev => ({ ...prev, featured_image_url: '' }));
                            }}
                            className="text-red-600 text-xs mt-1 hover:text-red-800"
                          >
                            Remove image
                          </button>
                        </div>
                      )}

                      {/* URL Input Option */}
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Or paste image URL:</span>
                      </div>
                      <input
                        type="url"
                        value={newBlog.featured_image_url}
                        onChange={(e) => {
                          setNewBlog(prev => ({ ...prev, featured_image_url: e.target.value }));
                          setImagePreview(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Read Time (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newBlog.read_time_minutes}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, read_time_minutes: parseInt(e.target.value) || 5 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <input
                          id="tagInput"
                          type="text"
                          placeholder="Add tag"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newBlog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* SEO Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        SEO Optimization
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Focus Keyword *
                          </label>
                          <input
                            type="text"
                            value={newBlog.focus_keyword}
                            onChange={(e) => setNewBlog(prev => ({ ...prev, focus_keyword: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g., child psychology, anxiety therapy"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Primary keyword you want to rank for (appears in title, content, and meta tags)
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SEO Title
                          </label>
                          <input
                            type="text"
                            value={newBlog.seo_title}
                            onChange={(e) => setNewBlog(prev => ({ ...prev, seo_title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="SEO optimized title (max 60 characters)"
                            maxLength={60}
                          />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-500">Optimized for search engines</span>
                            <span className={`${newBlog.seo_title.length > 60 ? 'text-red-500' : newBlog.seo_title.length > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {newBlog.seo_title.length}/60
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Description
                          </label>
                          <textarea
                            value={newBlog.seo_description}
                            onChange={(e) => setNewBlog(prev => ({ ...prev, seo_description: e.target.value }))}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Brief description for search results (max 160 characters)"
                            maxLength={160}
                          />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-500">Appears in search engine results</span>
                            <span className={`${newBlog.seo_description.length > 160 ? 'text-red-500' : newBlog.seo_description.length > 140 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {newBlog.seo_description.length}/160
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categories
                          </label>
                          <div className="flex space-x-2 mb-2">
                            <input
                              id="categoryInput"
                              type="text"
                              placeholder="Add category"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                            />
                            <button
                              type="button"
                              onClick={addCategory}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {newBlog.categories.map((category, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {category}
                                <button
                                  type="button"
                                  onClick={() => removeCategory(category)}
                                  className="ml-1 text-green-600 hover:text-green-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Meta Keywords
                          </label>
                          <div className="flex space-x-2 mb-2">
                            <input
                              id="metaKeywordInput"
                              type="text"
                              placeholder="Add meta keyword"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMetaKeyword())}
                            />
                            <button
                              type="button"
                              onClick={addMetaKeyword}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {newBlog.meta_keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {keyword}
                                <button
                                  type="button"
                                  onClick={() => removeMetaKeyword(keyword)}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Canonical URL
                          </label>
                          <input
                            type="url"
                            value={newBlog.canonical_url}
                            onChange={(e) => setNewBlog(prev => ({ ...prev, canonical_url: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="https://example.com/canonical-url"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Preferred URL if this content appears on multiple pages
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedBlog(null);
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedBlog ? 'Update Blog' : 'Create Blog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Blog Post
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<strong>{selectedBlog?.title}</strong>"? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setSelectedBlog(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
