"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/backendApi';

export default function AssessmentsAdminPage() {
  const { isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) return router.push('/login');
      if (!hasRole('admin') && !hasRole('superadmin')) return router.push('/profile');
      fetchRows();
    }
  }, [authLoading]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Refetch on search
  useEffect(() => {
    if (!authLoading && isAuthenticated() && (hasRole('admin') || hasRole('superadmin'))) {
      fetchRows();
    }
  }, [debouncedSearch]);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAssessments({ search: debouncedSearch, limit: 20 });
      if (res?.success) setRows(res.message.assessments || []);
      else setError(res?.message || 'Failed to fetch assessments');
    } catch (e) {
      setError('Error fetching assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assessment page?')) {
      return;
    }
    try {
      await adminApi.deleteAssessment(id);
      await fetchRows();
    } catch (err) {
      alert('Error deleting assessment');
      console.error('Error:', err);
    }
  };

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h5 className="font-bold text-gray-900">Assessments</h5>
          <p className="text-gray-600 mt-2">Manage assessment pages and content</p>
        </div>
        <button onClick={() => router.push('/admin/assessments/create')} className="bg-[#593494] text-white px-6 py-3 rounded-lg hover:bg-[#7351A9]">Create New</button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Assessments</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by slug or title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#593494]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {rows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No assessments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{r.hero_title || 'Untitled'}</div>
                      <div className="text-sm text-gray-500">/assessments/{r.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${r.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(r.updated_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => router.push(`/admin/assessments/edit/${r.id}`)} className="text-[#593494] hover:text-[#7351A9]">Edit</button>
                      <button onClick={() => window.open(`/assessments/${r.slug}`, '_blank')} className="text-blue-600 hover:text-blue-800">View</button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800">Delete</button>
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


