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
  Mail
} from "lucide-react";

export default function ProfileLayout({ children }) {
  const { user, logout, hasRole, login, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const navigation = [
    { name: 'Home', href: '/', icon: Home, show: true },
    { name: 'Browse Therapists', href: '/guide', icon: Users, show: hasRole('client') },
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
    setSidebarOpen(false);
  };

  const isActive = (href) => {
    return pathname === href;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
                alt="Kuttikal Logo" 
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
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
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

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:flex lg:w-64 lg:flex-col z-30">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <nav className="flex-1 space-y-4 px-2 py-4 pt-6">
            {navigation.filter(item => item.show !== false).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left cursor-pointer ${
                    active 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          
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
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white w-full">
        <div className="flex h-16 items-center justify-end px-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {displayName || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Get started
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex h-16 items-center justify-between px-4 bg-white w-full sticky top-0 z-40">
          <div className="flex items-center">
            <img 
              src="/mainlogo.svg" 
              alt="Kuttikal Logo" 
              className="h-8 w-auto hover:opacity-80 transition-opacity"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
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

