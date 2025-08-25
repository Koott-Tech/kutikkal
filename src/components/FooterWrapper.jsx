'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Don't show footer on admin, superadmin, finance, and staff pages
  const hideFooterPaths = ['/admin', '/superadmin', '/finance', '/staff'];
  const shouldHideFooter = hideFooterPaths.some(path => pathname.startsWith(path));
  
  if (shouldHideFooter) {
    return null;
  }
  
  return <Footer />;
}

