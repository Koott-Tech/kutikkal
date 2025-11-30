'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

const HIDE_DELAY = 600;

export default function PageLoadingOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef(null);

  const navigationKey = useMemo(() => {
    const search = searchParams?.toString();
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, searchParams]);

  // Show loading overlay for all pages including payment success
  const isPaymentSuccessPage = pathname === '/payment/success';

  useLayoutEffect(() => {
    // show overlay immediately on mount and whenever the path/search changes
    setIsVisible(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigationKey]);

  if (!isVisible) {
    return null;
  }

  return <LoadingScreen />;
}

