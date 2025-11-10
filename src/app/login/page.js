'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

function resolveRedirectTarget(searchParams, user) {
  if (searchParams) {
    const rawReturnUrl = searchParams.get('returnUrl');
    if (rawReturnUrl) {
      try {
        const decoded = decodeURIComponent(rawReturnUrl);
        if (decoded.startsWith('http')) {
          return decoded;
        }
        if (decoded.startsWith('/')) {
          return decoded;
        }
      } catch (error) {
        if (rawReturnUrl.startsWith('/')) {
          return rawReturnUrl;
        }
      }
    }
  }

  if (user?.role === 'superadmin') return '/superadmin';
  if (user?.role === 'admin') return '/admin';
  if (user?.role === 'psychologist') return '/psychologist';
  if (user?.role === 'client') return '/profile';

  return '/';
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, isAuthenticated } = useAuth();

  const [modalOpen, setModalOpen] = useState(true);
  const [storedAuthError, setStoredAuthError] = useState('');

  const redirectTarget = useMemo(() => resolveRedirectTarget(searchParams, user), [searchParams, user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pendingError = localStorage.getItem('auth_error');
    if (pendingError) {
      setStoredAuthError(pendingError);
      localStorage.removeItem('auth_error');
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated()) return;

    if (redirectTarget.startsWith('http')) {
      window.location.replace(redirectTarget);
    } else {
      router.replace(redirectTarget);
    }
  }, [isLoading, isAuthenticated, redirectTarget, router]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    if (!isAuthenticated()) {
      router.replace('/');
    }
  }, [router, isAuthenticated]);

  const handleAuthSuccess = useCallback(() => {
    setStoredAuthError('');
    // Redirect effect will handle navigation once AuthContext updates.
  }, []);

  const handleRequireContactInfo = useCallback(() => {
    router.push('/profile/contact');
  }, [router]);

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {storedAuthError && (
        <div className="absolute top-6 left-0 right-0 flex justify-center px-4">
          <div className="max-w-lg w-full rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow">
            {storedAuthError}
          </div>
        </div>
      )}

      <AuthModal
        open={modalOpen}
        onClose={handleClose}
        defaultTab="login"
        onAuthSuccess={handleAuthSuccess}
        onRequireContactInfo={handleRequireContactInfo}
      />
    </div>
  );
}


