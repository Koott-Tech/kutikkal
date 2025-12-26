'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Package,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PsychologistLayout({ children }) {
  // Desktop (>= 1024px): open by default, Mobile: closed by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      // First visit: open on desktop, closed on mobile
      return window.innerWidth >= 1024;
    }
    return false; // SSR default
  });
  const { user, isAuthenticated, hasRole, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push('/');
        return;
      }
      if (!hasRole('psychologist')) {
        router.push('/');
        return;
      }
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/psychologist', icon: BarChart3 },
    { name: 'Sessions', href: '/psychologist/sessions', icon: Calendar },
    { name: 'Assessments', href: '/psychologist/assessments', icon: Package },
    { name: 'Rescheduling', href: '/psychologist/rescheduling', icon: RefreshCw },
    { name: 'Availability', href: '/psychologist/availability', icon: Clock },
    { name: 'Packages', href: '/psychologist/packages', icon: FileText },
    { name: 'Messages', href: '/psychologist/messages', icon: MessageSquare },
    { name: 'Settings', href: '/psychologist/settings', icon: Settings }
  ];

  if (authLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3f2e73' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile header with menu button */}
      <div 
        className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white flex items-center justify-start px-4 z-50"
        style={!isSidebarOpen ? { boxShadow: '0 2px 8px rgba(63, 46, 115, 0.15)' } : {}}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-lg"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sidebar overlay and panel */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
          isSidebarOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop Overlay */}
        <div 
          className={`fixed inset-0 bg-white/30 backdrop-blur-[1px] transition-opacity duration-500 ease-in-out ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsSidebarOpen(false)}
          style={{ willChange: 'opacity' }}
        />
        
        {/* Sidebar Panel */}
        <div 
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl border-r border-[#3f2e73]/20 will-change-transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
          style={{ 
            transform: isSidebarOpen ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)',
            transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            contain: 'layout style paint',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            zIndex: 40
          }}
        >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  onClick={() => {
                    // Close mobile sidebar on navigation
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Desktop sidebar (always visible on lg and above) */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-[#3f2e73]/20 z-40">
        <div className="flex flex-col h-full w-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-200">
            <a 
              href="/psychologist"
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Little Care - Go to psychologist dashboard"
            >
              <img 
                src="/mainlogo.webp"
                alt="Little Care - Child Psychotherapy Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content (push right for desktop left sidebar) */}
      <div className="lg:ml-64">
        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
