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
  Layers
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SecurityNotificationCenter from '@/components/SecurityNotificationCenter';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-lg"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar: right slide-in on mobile, fixed left on desktop */}
      <div className={`fixed inset-y-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out 
        right-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:left-0 lg:right-auto lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <Image
              src="/mainlogo.webp"
              alt="Kuttikal Logo"
              width={120}
              height={40}
              className="object-contain"
            />
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
                              onClick={() => setIsSidebarOpen(false)}
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
                  onClick={() => setIsSidebarOpen(false)}
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
        <main className="lg:p-6">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
