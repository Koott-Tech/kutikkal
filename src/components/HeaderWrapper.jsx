'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  // Hide global site header on admin and superadmin dashboards to avoid duplicate menus
  const hideHeaderPaths = ['/admin', '/superadmin'];
  const shouldHideCompletely = hideHeaderPaths.some((p) => pathname.startsWith(p));
  
  if (shouldHideCompletely) return null;
  
  // For client dashboard (/profile), show header only on laptop/desktop, hide on mobile
  const isClientDashboard = pathname.startsWith('/profile');
  
  if (isClientDashboard) {
    return (
      <div className="hidden md:block fixed top-0 left-64 right-0 z-50 bg-white border-b border-gray-200">
        <Header />
      </div>
    );
  }
  
  return <Header />;
}
