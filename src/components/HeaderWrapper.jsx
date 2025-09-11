'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  // Hide global site header on admin, superadmin, and client dashboards to avoid duplicate menus
  const hideHeaderPaths = ['/admin', '/superadmin', '/profile'];
  const shouldHide = hideHeaderPaths.some((p) => pathname.startsWith(p));
  if (shouldHide) return null;
  return <Header />;
}
