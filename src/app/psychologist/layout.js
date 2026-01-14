'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Package,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { psychologistApi } from '@/lib/backendApi';

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
  const pathname = usePathname();
  
  // Header stats state
  const [headerStats, setHeaderStats] = useState({
    completed_sessions: 0,
    upcoming_sessions: 0,
    month: ''
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

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

  // Load header stats
  useEffect(() => {
    const loadHeaderStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await psychologistApi.getMonthlyStats();
        if (response.success && response.data) {
          setHeaderStats(response.data);
        }
      } catch (err) {
        console.error('Failed to load header stats:', err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (!authLoading && hasRole('psychologist')) {
      loadHeaderStats();
      // Refresh every 30 seconds to keep data fresh
      const interval = setInterval(() => {
        loadHeaderStats();
      }, 30 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [authLoading, hasRole]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/psychologist', icon: BarChart3 },
    { name: 'Sessions', href: '/psychologist/sessions', icon: Calendar },
    { name: 'Assessments', href: '/psychologist/assessments', icon: Package },
    { name: 'Availability', href: '/psychologist/availability', icon: Clock },
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
      {/* Mobile header with menu button and stats */}
      <div 
        className="lg:hidden fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200"
        style={!isSidebarOpen ? { boxShadow: '0 2px 8px rgba(63, 46, 115, 0.15)' } : {}}
      >
        <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
          <div className="flex-1 flex items-center justify-center gap-4 px-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs text-gray-600">Completed:</span>
              <span className="text-xs font-semibold text-gray-900">
                {isLoadingStats ? '...' : (headerStats.completed_sessions || 0)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs text-gray-600">Upcoming:</span>
              <span className="text-xs font-semibold text-gray-900">
                {isLoadingStats ? '...' : (headerStats.upcoming_sessions || 0)}
              </span>
            </div>
          </div>
        </div>
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
          {/* Logo/Brand - Mobile only */}
          <div className="lg:hidden p-4 border-b border-gray-200">
            <a 
              href="/psychologist"
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Little Care - Go to psychologist dashboard"
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setIsSidebarOpen(false);
                }
              }}
            >
              <img 
                src="/mainlogo.webp"
                alt="Little Care"
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
              const isActive = pathname === item.href || (item.href !== '/psychologist' && pathname?.startsWith(item.href));
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'hover:bg-blue-50 hover:text-blue-700'
                  }`}
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
                alt="Little Care"
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
              const isActive = pathname === item.href || (item.href !== '/psychologist' && pathname?.startsWith(item.href));
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'hover:bg-blue-50 hover:text-blue-700'
                  }`}
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
      <div className={`lg:ml-64 transition-all duration-300 ease-in-out`}>
        {/* Top bar - Fixed header with Monthly Stats */}
        <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-64 z-30">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <h6 className="text-lg font-semibold text-gray-800">Psychologist Dashboard</h6>
                {headerStats.month && (
                  <span className="text-sm text-gray-500">({headerStats.month})</span>
                )}
              </div>
              {user && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{user.email}</span>
                  <span className="ml-2 text-gray-400 capitalize">({user.role})</span>
                </div>
              )}
            </div>
            
            {/* Monthly Stats Row */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-600">Completed:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {isLoadingStats ? '...' : (headerStats.completed_sessions || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-600">Upcoming:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {isLoadingStats ? '...' : (headerStats.upcoming_sessions || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content - Add padding-top to account for fixed header */}
        <main className="pt-16 lg:pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}
