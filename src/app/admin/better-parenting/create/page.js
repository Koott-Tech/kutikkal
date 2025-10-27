"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateBetterParentingPage() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      
      if (!hasRole('admin') && !hasRole('superadmin')) {
        router.push('/profile');
        return;
      }
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
      const response = await fetch(`${backendUrl}/better-parenting/admin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (data && data.success) {
        router.push('/admin/better-parenting');
      } else {
        setError(data?.message || 'Failed to create better parenting page');
      }
    } catch (err) {
      setError('Error creating better parenting page');
      console.error('Error:', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h5 className="font-bold text-gray-900 mb-6">Create Better Parenting Page</h5>
        <p className="text-red-500 mb-4">Page builder coming soon. Use this placeholder for now.</p>
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

