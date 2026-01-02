'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

const FADE_DURATION = 300; // Duration for fade out animation

/**
 * PageLoadingOverlay - Client-side loader for navigation transitions
 * 
 * NOTE: This is ONLY for client-side navigation transitions.
 * Initial page load is handled by server-rendered #initial-loader in layout.js
 * 
 * This component:
 * - Only shows AFTER React hydration (for client navigation)
 * - Hides when DOMContentLoaded fires (not window.load)
 * - No fixed delays - adapts to actual page readiness
 */
function PageLoadingOverlayContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false); // Start hidden (initial load handled by server loader)
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef(null);
  const isInitialMount = useRef(true);
  const hasHydrated = useRef(false);

  const navigationKey = useMemo(() => {
    const search = searchParams?.toString();
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, searchParams]);

  // On initial mount, hide immediately (server loader handles initial load)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Mark as hydrated, but don't show (server loader is handling initial load)
      hasHydrated.current = true;
          setIsVisible(false);
            setShouldRender(false);
      return;
    }
  }, []);

  // Handle navigation transitions (only after hydration)
  useEffect(() => {
    // Don't show on initial mount (server loader handles that)
    if (!hasHydrated.current) {
      return;
    }

    // Show loading screen for navigation
    setIsVisible(true);
    setShouldRender(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Hide when DOM is ready (interactive state, not window.load)
    const hideLoader = () => {
      setIsVisible(false);
      // Remove from DOM after fade out completes
      setTimeout(() => {
        setShouldRender(false);
      }, FADE_DURATION);
    };

    // Check if DOM is already ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Small delay to ensure smooth transition
      timeoutRef.current = setTimeout(hideLoader, 100);
    } else {
      // Wait for DOMContentLoaded (fires when HTML is parsed, CSS applied)
      const handleDOMReady = () => {
        timeoutRef.current = setTimeout(hideLoader, 100);
      };
      document.addEventListener('DOMContentLoaded', handleDOMReady, { once: true });
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        document.removeEventListener('DOMContentLoaded', handleDOMReady);
      };
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigationKey]);

  if (!shouldRender) {
    return null;
  }

  return <LoadingScreen isVisible={isVisible} />;
}

/**
 * Wrapper component with Suspense boundary for useSearchParams
 * This prevents build errors during static generation
 */
export default function PageLoadingOverlay() {
  return <PageLoadingOverlayContent />;
}

