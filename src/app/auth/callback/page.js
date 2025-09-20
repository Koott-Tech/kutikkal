'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Processing authentication...');
        
        const supabase = getSupabaseClient();
        
        if (!supabase) {
          console.error('Supabase client not available');
          setStatus('Configuration error. Redirecting...');
          setTimeout(() => router.push('/login?error=config_error'), 2000);
          return;
        }

        // Get the session from URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => router.push('/login?error=auth_failed'), 2000);
          return;
        }

        if (data.session && data.session.user) {
          console.log('🔍 Supabase auth successful:', data.session.user);
          setStatus('Authentication successful! Redirecting...');
          
      // Store user data in localStorage for your auth context
      const userData = {
        id: data.session.user.id,
        email: data.session.user.email,
        name: data.session.user.user_metadata?.full_name || data.session.user.email,
        role: 'client' // Default role for Google sign-ins
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userData', JSON.stringify(userData)); // Also store with userData key for compatibility
      localStorage.setItem('token', data.session.access_token);
      localStorage.setItem('authToken', data.session.access_token); // Also store with authToken key for compatibility
      
      console.log('🔍 Token stored:', {
        token: data.session.access_token.substring(0, 20) + '...',
        userData: userData
      });
          
          // Redirect to profile contact tab to complete setup (same as email/password registration)
          setTimeout(() => router.push('/profile?tab=contact'), 1000);
        } else {
          console.log('No session found, redirecting to login');
          setStatus('No session found. Redirecting...');
          setTimeout(() => router.push('/login?error=no_session'), 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('Error occurred. Redirecting...');
        setTimeout(() => router.push('/login?error=auth_failed'), 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
}
