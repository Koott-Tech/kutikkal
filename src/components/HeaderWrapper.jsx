'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  // Hide global site header on admin, superadmin, psychologist dashboards, login, and register pages
  const hideHeaderPaths = ['/admin', '/superadmin', '/psychologist', '/login', '/register'];
  const shouldHideCompletely = hideHeaderPaths.some((p) => pathname.startsWith(p));
  
  if (shouldHideCompletely) return null;
  
  // For client dashboard (/profile), show header only on laptop/desktop, hide on mobile
  const isClientDashboard = pathname.startsWith('/profile');
  
  if (isClientDashboard) {
    return (
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white">
        <Header />
      </div>
    );
  }
  
  return <Header />;
}
