"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function BetterParentingAdminPage() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  useEffect(() => {
    // Check authentication and role
    if (!authLoading) {
      if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
        return;
      }
      
      if (!hasRole('admin') && !hasRole('superadmin')) {
        console.log('User does not have admin privileges, redirecting to profile');
        router.push('/profile');
        return;
      }
      
      // User is authenticated and has admin role, load data
      fetchPages();
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  // Debounce the search term
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Fetch pages when debounced search term changes
  useEffect(() => {
    if (!authLoading && isAuthenticated() && hasRole('admin')) {
      fetchPages();
    }
  }, [debouncedSearchTerm]);

  const fetchPages = async () => {
    try {
      // Only show loading spinner on initial load, not during search
      if (isInitialLoad) {
        setLoading(true);
      }
      setError('');
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      const response = await fetch(`${backendUrl}/better-parenting/admin?limit=20&search=${debouncedSearchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data && data.success) {
        const pages = data.message?.pages || data.data?.pages || [];
        setPages(pages);
      } else {
        setError(data?.message || 'Failed to fetch pages');
      }
    } catch (err) {
      const errorMsg = err?.message || 'Error fetching pages';
      setError(errorMsg);
      console.error('Error fetching better parenting pages:', {
        message: err?.message,
        response: err?.response,
        error: err
      });
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      await fetch(`${backendUrl}/better-parenting/admin/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        }
      });
      await fetchPages();
    } catch (err) {
      alert('Error deleting page');
      console.error('Error:', err);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.hero_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading better parenting pages...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h5 className="font-bold text-gray-900">Better Parenting Pages</h5>
          <p className="text-gray-600 mt-2">Manage better parenting content and pages</p>
        </div>
        <button
          onClick={() => router.push('/admin/better-parenting/create')}
          className="bg-[#593494] text-white px-6 py-3 rounded-lg hover:bg-[#7351A9] transition-colors duration-200"
        >
          Create New Page
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Pages
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by slug or title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#593494]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#593494]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No better parenting pages found</p>
            <button
              onClick={() => router.push('/admin/better-parenting/create')}
              className="mt-4 bg-[#593494] text-white px-6 py-3 rounded-lg hover:bg-[#7351A9] transition-colors duration-200"
            >
              Create Your First Page
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {page.hero_title || 'Untitled Page'}
                        </div>
                        <div className="text-sm text-gray-500">
                          /better-parenting/{page.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        page.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => router.push(`/admin/better-parenting/edit/${page.id}`)}
                        className="text-[#593494] hover:text-[#7351A9]"
                      >
                        Edit
                      </button>
                      {page.status === 'published' && (
                        <button
                          onClick={() => window.open(`/better-parenting/${page.slug}`, '_blank')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

