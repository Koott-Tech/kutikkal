'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

const HIDE_DELAY = 600;
const FADE_DURATION = 300; // Duration for fade out animation

export default function PageLoadingOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const timeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  const navigationKey = useMemo(() => {
    const search = searchParams?.toString();
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    // On initial mount, ensure loading screen shows immediately
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setIsVisible(true);
      setShouldRender(true);

      // Wait for page to load, then fade out
      const handleLoad = () => {
        // Small delay to ensure images are loading
        setTimeout(() => {
          setIsVisible(false);
          // Remove from DOM after fade out completes
          setTimeout(() => {
            setShouldRender(false);
          }, FADE_DURATION);
        }, HIDE_DELAY);
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
      return;
    }

    // For subsequent navigations, show loading immediately
    setIsVisible(true);
    setShouldRender(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      // Remove from DOM after fade out completes
      setTimeout(() => {
        setShouldRender(false);
      }, FADE_DURATION);
    }, HIDE_DELAY);

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

