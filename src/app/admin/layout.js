'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Clock,
  FileText,
  MessageSquare,
  Shield,
  Package,
  ChevronDown,
  ChevronRight,
  Layers,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SecurityNotificationCenter from '@/components/SecurityNotificationCenter';

export default function AdminLayout({ children }) {
  // Desktop (>= 1024px): open by default, Mobile: closed by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      // First visit: open on desktop, closed on mobile
      return window.innerWidth >= 1024;
    }
    return false; // SSR default
  });
  const [isCmsMenuOpen, setIsCmsMenuOpen] = useState(false);
  const { user, isAuthenticated, hasRole, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      
      if (!hasRole('admin') && !hasRole('superadmin')) {
        router.push('/');
        return;
      }
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  // Keep CMS menu open if user is on any CMS page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const cmsPaths = ['/admin/blogs', '/admin/counselling', '/admin/assessments', '/admin/better-parenting'];
      const isOnCmsPage = cmsPaths.some(path => currentPath.startsWith(path));
      if (isOnCmsPage) {
        setIsCmsMenuOpen(true);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Doctors', href: '/admin/doctors', icon: UserCheck },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Assessment Sessions', href: '/admin/assessment-sessions', icon: Package },
    { name: 'Rescheduling', href: '/admin/rescheduling', icon: RefreshCw },
    { 
      name: 'CMS', 
      icon: Layers, 
      hasSubmenu: true,
      submenu: [
        { name: 'Blogs', href: '/admin/blogs', icon: FileText },
        { name: 'Counselling Pages', href: '/admin/counselling', icon: MessageSquare },
        { name: 'Assessment Pages', href: '/admin/assessments', icon: FileText },
        { name: 'Better Parenting', href: '/admin/better-parenting', icon: FileText },
      ]
    },
    { name: 'Free Assessment', href: '/admin/free-assessment-timeslots', icon: Clock },
    { name: 'Security', href: '/admin/security', icon: Shield },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
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
        className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white flex items-center justify-end px-4 z-50"
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
          className={`fixed inset-y-0 right-0 w-64 bg-white shadow-xl border-l border-[#3f2e73]/20 will-change-transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:left-0 lg:right-auto lg:translate-x-0`}
          style={{ 
            transform: isSidebarOpen ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)',
            transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            contain: 'layout style paint',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            zIndex: 40
          }}
        >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              
              // Handle CMS menu with submenu
              if (item.hasSubmenu && item.submenu) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsCmsMenuOpen(!isCmsMenuOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </div>
                      {isCmsMenuOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {isCmsMenuOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              onClick={() => {
                                // Close mobile sidebar on navigation
                                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                  setIsSidebarOpen(false);
                                }
                              }}
                            >
                              <SubIcon className="h-4 w-4 mr-3" />
                              {subItem.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              // Regular menu item
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
              href="/admin"
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Little Care - Go to admin dashboard"
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
              
              // Handle CMS menu with submenu
              if (item.hasSubmenu && item.submenu) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsCmsMenuOpen(!isCmsMenuOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </div>
                      {isCmsMenuOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {isCmsMenuOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                              <SubIcon className="h-4 w-4 mr-3" />
                              {subItem.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              // Regular menu item
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
        {/* Top bar */}
        <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200 px-6 py-4 w-full sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <h6>Little Care Admin Panel</h6>
            <div className="flex items-center space-x-4">
              <SecurityNotificationCenter />
              {user && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{user.email}</span>
                  <span className="ml-2 text-gray-400 capitalize">({user.role})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main>
          {children}
        </main>
      </div>

    </div>
  );
}
