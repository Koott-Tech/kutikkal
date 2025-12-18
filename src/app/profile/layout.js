"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../lib/backendApi";
import { 
  Calendar, 
  LogOut,
  FileText,
  User,
  MessageSquare,
  BarChart3,
  Receipt,
  X,
  Menu,
  Home,
  Users,
  Mail,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

export default function ProfileLayout({ children }) {
  const { user, logout, hasRole, login, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Load sidebar state from localStorage, default to true (open)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profileSidebarOpen');
      return saved !== null ? saved === 'true' : true; // Default to true if not set
    }
    return true;
  });
  const [profileData, setProfileData] = useState(null);

  const navigation = [
    { name: 'Home', href: '/', icon: Home, show: true },
  { name: 'Browse Therapists', href: '/psychologists', icon: Users, show: false },
    { name: 'Sessions', href: '/profile/sessions', icon: Calendar },
    { name: 'Messages', href: '/profile/messages', icon: MessageSquare },
    { name: 'Contact', href: '/profile/contact', icon: Mail },
    { name: 'Report', href: '/profile/reports', icon: BarChart3 },
    { name: 'Packages', href: '/profile/packages', icon: FileText, show: hasRole('client') },
    { name: 'Receipts', href: '/profile/receipts', icon: Receipt, show: hasRole('client') },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      // Only fetch if user exists and we don't already have profile data
      // Skip if user already has full profile data
      if (user && !profileData && !user.first_name && !user.last_name) {
        try {
          const response = await authApi.getProfile({ silent: true });
          
          if (response?.data?.user) {
            const profile = response.data.user.profile || response.data.user;
            setProfileData(profile);
            // Update the auth context with full profile data
            if (token) {
              login({ ...user, profile }, token);
            }
          }
        } catch (error) {
          // Silently fail - non-critical
        }
      }
    };
    
    fetchProfile();
  }, [user, profileData]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Prefer showing full name from loaded profile or auth context; avoid flashing email
  const displayName = (profileData?.first_name && profileData?.last_name)
    ? `${profileData.first_name} ${profileData.last_name}`
    : (user?.profile?.first_name && user?.profile?.last_name)
      ? `${user.profile.first_name} ${user.profile.last_name}`
      : null;

  const handleNavigationClick = (item) => {
    router.push(item.href);
    // Don't close sidebar on navigation - preserve user's preference
  };

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('profileSidebarOpen', sidebarOpen.toString());
    }
  }, [sidebarOpen]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const isActive = (href) => {
    return pathname === href;
  };

  useEffect(() => {
    // Only redirect if auth has finished loading AND user is not authenticated
    // This prevents redirecting on page refresh when auth is still loading
    if (authLoading) {
      return; // Don't redirect while auth is loading - wait for auth to finish
    }
    
    // Only redirect when auth has finished loading and user is confirmed to be null
    if (!user) {
      if (typeof window !== 'undefined') {
        // Let Header know to show AuthModal
        localStorage.setItem('auth_error', 'Please log in to view your profile.');
      }
      router.replace('/');
    }
  }, [user, router, authLoading]);

  // Show loading while auth is loading (prevents premature redirect)
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: '#3f2e73' }}></div>
      </div>
    );
  }

  // Only show nothing/redirect if auth has finished loading and user is still null
  // This means user is definitely not authenticated
  if (!user) {
    // Show nothing while redirecting; Header will show login modal on home
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar (slide from right) */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 right-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center">
              <img 
                src="/mainlogo.webp" 
                alt="Little Care Logo" 
                className="h-8 w-auto hover:opacity-80 transition-opacity"
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          
          <nav className="flex-1 space-y-4 px-2 py-4">
            {navigation.filter(item => item.show !== false).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left cursor-pointer ${
                    active 
                      ? 'text-gray-900 border-l-4' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={active ? { borderLeftColor: '#3f2e73' } : {}}
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          
          {/* Logout button at bottom of sidebar */}
          <div className="border-t border-gray-200 p-4 mb-8">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar toggle button - outside when closed */}
      {!sidebarOpen && (
        <div className="hidden lg:block fixed top-20 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <PanelLeftOpen className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:flex lg:w-64 lg:flex-col z-30 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 relative group">
          <nav className={`flex-1 space-y-4 px-2 py-4 transition-all duration-300 ${
            sidebarOpen ? 'pt-6' : 'pt-6'
          }`}>
            {navigation.filter(item => item.show !== false).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left cursor-pointer ${
                    active 
                      ? 'text-gray-900 border-l-4' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={active ? { borderLeftColor: '#3f2e73' } : {}}
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          
          {/* Toggle button - inside sidebar, above logout */}
          <div className="p-4 pb-2 flex justify-end">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white w-full border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/mainlogo.webp" 
              alt="Little Care Logo" 
              className="h-8 w-auto hover:opacity-80 transition-opacity"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {displayName || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{ backgroundColor: '#3f2e73' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d1733'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3f2e73'}
            >
              Get started
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`lg:transition-all lg:duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        {/* Mobile header */}
        <div className="lg:hidden flex h-16 items-center justify-between px-4 bg-white w-full sticky top-0 z-40">
          <div className="flex items-center">
            <img 
              src="/mainlogo.webp" 
              alt="Little Care Logo" 
              className="h-8 w-auto hover:opacity-80 transition-opacity"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="lg:py-6 lg:pt-24">
          <div className="lg:px-4 lg:sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

