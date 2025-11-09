'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { clientApi } from '@/lib/backendApi';
import { isClientContactComplete } from '@/lib/contactValidation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing...');
  const { login } = useAuth();

  const { returnUrl, mode, sourceOrigin } = useMemo(() => {
    if (!searchParams) {
      return { returnUrl: null, mode: null, sourceOrigin: null };
    }

    let rawReturnUrl = searchParams.get('returnUrl');
    const modeParam = searchParams.get('mode');
    let rawSourceOrigin = searchParams.get('sourceOrigin');

    if (rawReturnUrl) {
      try {
        rawReturnUrl = decodeURIComponent(rawReturnUrl);
      } catch (_) {
        // If decoding fails, fall back to original value
      }
    }

    if (rawSourceOrigin) {
      try {
        rawSourceOrigin = decodeURIComponent(rawSourceOrigin);
      } catch (_) {
        // Ignore decoding errors and keep the raw value
      }
    }

    return {
      returnUrl: rawReturnUrl,
      mode: modeParam,
      sourceOrigin: rawSourceOrigin,
    };
  }, [searchParams]);

  const targetOrigin = useMemo(() => {
    if (typeof window === 'undefined') return sourceOrigin || null;
    if (!sourceOrigin) return window.location.origin;
    try {
      const parsed = new URL(sourceOrigin);
      return parsed.origin;
    } catch (error) {
      console.warn('Invalid source origin received, falling back to current origin:', sourceOrigin);
      return window.location.origin;
    }
  }, [sourceOrigin]);

  const safeReturnUrl = useMemo(() => {
    if (!returnUrl) return returnUrl;
    try {
      const target = new URL(returnUrl, targetOrigin || undefined);
      if (typeof window !== 'undefined') {
        const currentOrigin = window.location.origin;
        if (target.origin === currentOrigin || (targetOrigin && target.origin === targetOrigin)) {
          return target.toString();
        }
      } else if (targetOrigin && target.origin === targetOrigin) {
        return target.toString();
      }
      if (returnUrl.startsWith('/')) {
        return returnUrl;
      }
      console.warn('Blocking unsafe return URL, falling back to home:', returnUrl);
      return '/';
    } catch (error) {
      if (returnUrl.startsWith('/')) {
        return returnUrl;
      }
      console.warn('Invalid return URL received, falling back to home:', returnUrl);
      return '/';
    }
  }, [returnUrl, targetOrigin]);

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
          
      // Store user data and immediately update AuthContext
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
      
      // Immediately hydrate AuthContext so downstream pages don't need a manual refresh
      try {
        login(userData, data.session.access_token);
      } catch (e) {
        console.warn('AuthContext login not available during callback, proceeding with redirect');
      }
          
          try {
            const profileResponse = await clientApi.getProfile();
            const profile = profileResponse?.data;
            if (!isClientContactComplete(profile)) {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('showQuickContact', 'true');
              }
            }
          } catch (profileError) {
            console.warn('Unable to verify contact details after login:', profileError);
          }

          const isPopupMode = mode === 'popup' && typeof window !== 'undefined' && (window.opener || window.parent !== window);

          if (isPopupMode) {
            try {
              const payload = {
                type: 'supabase:auth-result',
                success: true,
                payload: {
                  user: userData,
                  token: data.session.access_token,
                  returnUrl: safeReturnUrl,
                },
              };
              const originToUse = targetOrigin || (typeof window !== 'undefined' ? window.location.origin : '*');
              window.opener?.postMessage(payload, originToUse);
              if (window.parent && window.parent !== window) {
                window.parent.postMessage(payload, originToUse);
              }
            } catch (postMessageError) {
              console.warn('Failed to post auth success message to opener:', postMessageError);
            }
            setStatus('Authentication successful! You may close this window.');
            setTimeout(() => {
              window.close();
            }, 500);
          } else if (safeReturnUrl) {
            if (safeReturnUrl.startsWith('http')) {
              window.location.href = safeReturnUrl;
            } else {
              router.replace(safeReturnUrl);
            }
          } else {
            router.replace('/');
          }
        } else {
          console.log('No session found, redirecting to login');
          setStatus('No session found. Redirecting...');
          setTimeout(() => router.push('/login?error=no_session'), 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        const isPopupMode = mode === 'popup' && typeof window !== 'undefined' && (window.opener || window.parent !== window);

        if (isPopupMode) {
          try {
            const originToUse = targetOrigin || (typeof window !== 'undefined' ? window.location.origin : '*');
            window.opener?.postMessage(
              {
                type: 'supabase:auth-result',
                success: false,
                payload: { error: error?.message || 'Authentication failed.' },
              },
              originToUse
            );
            if (window.parent && window.parent !== window) {
              window.parent.postMessage(
                {
                  type: 'supabase:auth-result',
                  success: false,
                  payload: { error: error?.message || 'Authentication failed.' },
                },
                originToUse
              );
            }
          } catch (postMessageError) {
            console.warn('Failed to post auth error message to opener:', postMessageError);
          }
          setStatus('Authentication failed. You may close this window.');
          setTimeout(() => {
            window.close();
          }, 1500);
        } else {
          setStatus('Error occurred. Redirecting...');
          setTimeout(() => router.push('/login?error=auth_failed'), 2000);
        }
      }
    };

    handleAuthCallback();
  }, [login, mode, router, safeReturnUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
}
