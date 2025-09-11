'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import LoadingScreen from '@/components/LoadingScreen';

export default function ConditionalProviders({ children }) {
  const pathname = usePathname();
  
  // Static pages that don't need heavy providers
  const staticPages = [
    '/',
    '/about',
    '/individual-therapy',
    '/couples-therapy', 
    '/family-therapy',
    '/child-therapy',
    '/teen-therapy',
    '/psychiatry',
    '/career',
    '/faq'
  ];
  
  const isStaticPage = staticPages.includes(pathname);
  
  if (isStaticPage) {
    // For static pages, only load minimal providers
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }
  
  // For dynamic pages (dashboards, login, etc.), load all providers
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <LoadingScreen />
          {children}
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
