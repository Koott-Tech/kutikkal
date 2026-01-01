'use client';

import { usePathname } from 'next/navigation';
import WhatsAppWidget from './WhatsAppWidget';

export default function WhatsAppWidgetWrapper() {
  const pathname = usePathname();
  
  // Hide WhatsApp widget on finance pages only
  // Keep it on admin, superadmin, and all other pages
  const shouldHide = pathname.startsWith('/finance');
  
  if (shouldHide) {
    return null;
  }
  
  return <WhatsAppWidget />;
}

