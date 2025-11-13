'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../lib/supabaseClient';

export default function GoogleSignIn({ onSuccess, onError, returnUrl }) {
  const { login } = useAuth();
  const router = useRouter();
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);

  // Get singleton Supabase client
  const supabase = getSupabaseClient();

  // Check if we're in development or production
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_NODE_ENV === 'development';

  // Monitor for OAuth completion in production iframe
  useEffect(() => {
    if (!showIframe || isDevelopment) return;

    const checkAuth = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (sessionData.session) {
          setShowIframe(false);
          onSuccess?.(sessionData.session);
          // In production: stay on same page and refresh to update auth
          window.location.reload();
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    // Poll for session changes every 1 second when iframe is open
    const interval = setInterval(checkAuth, 1000);
    
    // Also listen for storage events (in case auth completes in another tab/window)
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [showIframe, isDevelopment, supabase, onSuccess, onError, router, returnUrl]);

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      console.error('❌ Supabase client not available');
      console.error('Check environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
      onError?.(new Error('Supabase configuration missing'));
      return;
    }
    
    try {
      console.log('🔍 Starting Supabase Google Sign-In');
      console.log('🔍 Environment:', isDevelopment ? 'Development' : 'Production');
      console.log('🔍 Redirect URL:', `${window.location.origin}/auth/callback`);
      console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      if (isDevelopment) {
        // Development: Use current redirect behavior
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('❌ Supabase Google Sign-In error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        if (onError) onError(new Error(error.message));
        return;
      }

      console.log('✅ Supabase Google Sign-In initiated:', data);
      // Note: User will be redirected to Google, so no further code will execute
      } else {
        // Production: Use popup window centered on screen
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
            skipBrowserRedirect: true
          }
        });

        if (error) {
          console.error('❌ Supabase Google Sign-In error:', error);
          console.error('Error details:', {
            message: error.message,
            status: error.status,
            name: error.name
          });
          if (onError) onError(new Error(error.message));
          return;
        }

        if (data?.url) {
          // Production: Show iframe-based modal centered on screen
          setIframeUrl(data.url);
          setShowIframe(true);
        }
      }
      
    } catch (error) {
      console.error('❌ Google Sign-In error:', error);
      console.error('Error stack:', error.stack);
      if (onError) onError(error);
    }
  };


  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      {/* Production: Iframe-based Google sign-in modal - centered on screen */}
      {showIframe && iframeUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowIframe(false)}
        >
          <div 
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ 
              width: '500px', 
              height: '600px',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowIframe(false)}
              className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Google Sign-in iframe */}
            <iframe
              src={iframeUrl}
              className="w-full h-full border-0"
              title="Google Sign In"
              allow="popups popupto"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
}