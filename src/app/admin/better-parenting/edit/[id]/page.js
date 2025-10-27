"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CounsellingPageBuilder from '@/components/CounsellingPageBuilder';

export default function EditBetterParentingPage() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
      fetchService();
    }
  }, [authLoading, isAuthenticated, hasRole, router, params.id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError('');
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/better-parenting/admin/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data && data.success) {
        console.log('Edit page - fetched better parenting page:', data.message);
        console.log('Edit page - benefits count:', data.message.benefits?.length);
        console.log('Edit page - FAQs count:', data.message.faqs?.length);
        console.log('Edit page - FAQs:', data.message.faqs);
        setService(data.message);
      } else {
        setError(data?.message || 'Failed to fetch better parenting page');
      }
    } catch (err) {
      setError('Error fetching better parenting page');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError('');
      
      console.log('Submitting better parenting page update:', {
        id: params.id,
        formData
      });
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/better-parenting/admin/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log('Update response:', data);

      if (data && data.success) {
        console.log('✅ Better parenting page updated successfully');
        router.push('/admin/better-parenting');
      } else {
        const errorMsg = data?.message || data?.error || 'Failed to update better parenting page';
        console.error('❌ Update failed:', errorMsg, data);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err?.message || err?.response?.data?.message || 'Error updating better parenting page';
      console.error('❌ Error updating better parenting page:', {
        message: err?.message,
        response: err?.response,
        error: err
      });
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/better-parenting');
  };

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
        <div className="text-lg">Loading better parenting page...</div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => router.push('/admin/better-parenting')}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Better Parenting Pages
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}
      <CounsellingPageBuilder
        serviceId={params.id}
        initialData={service}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={saving}
      />
    </div>
  );
}

