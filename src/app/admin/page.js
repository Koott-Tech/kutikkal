'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';
import { adminApi, dashboardApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalBookings: 0,
    recentBookings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication and role
    if (!authLoading) {
      if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
        return;
      }
      
      if (!hasRole('admin') && !hasRole('superadmin')) {
        console.log('User does not have admin privileges, redirecting to profile');
        router.push('/profile');
        return;
      }
      
      // User is authenticated and has admin role, load dashboard data
      loadDashboardData();
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Loading dashboard data...');

      // Load platform statistics
      console.log('Fetching platform stats...');
      const platformStats = await adminApi.getPlatformStats();
      console.log('Platform stats response:', platformStats);
      
      if (platformStats && platformStats.success) {
        setStats(platformStats.data);
      } else {
        console.warn('Platform stats response format unexpected:', platformStats);
        // Set default stats if response format is unexpected
        setStats(prev => ({
          ...prev,
          totalUsers: platformStats?.data?.totalUsers || 0,
          totalDoctors: platformStats?.data?.totalDoctors || 0,
          totalBookings: platformStats?.data?.totalBookings || 0
        }));
      }

      // Load recent data
      console.log('Fetching recent data...');
      const [recentUsers, recentBookings] = await Promise.all([
        dashboardApi.getRecentUsers(5),
        dashboardApi.getRecentBookings(5)
      ]);

      console.log('Recent users response:', recentUsers);
      console.log('Recent bookings response:', recentBookings);

      // Update stats with recent data counts
      setStats(prev => ({
        ...prev,
        recentUsers: recentUsers?.data?.length || recentUsers?.length || 0,
        recentBookings: recentBookings?.data?.length || recentBookings?.length || 0
      }));

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setError(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Registered users on the platform'
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: UserCheck,
      color: 'bg-green-500',
      description: 'Active psychologists and therapists'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-purple-500',
      description: 'All therapy sessions booked'
    },
    {
      title: 'Recent Activity',
      value: stats.recentBookings,
      icon: Activity,
      color: 'bg-orange-500',
      description: 'Bookings in the last 7 days'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Doctor',
      description: 'Register a new psychologist or therapist',
      href: '/admin/doctors',
      icon: UserCheck,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'View Users',
      description: 'Manage user accounts and profiles',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Manage Bookings',
      description: 'View and manage therapy sessions',
      href: '/admin/bookings',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user has admin privileges
  if (!user || (!hasRole('admin') && !hasRole('superadmin'))) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
            <p className="text-sm text-red-700 mt-1">You do not have permission to access the admin dashboard.</p>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push('/profile')}
            className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
  }

  if (error) {
                      return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                </div>
                  </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
        <div className="mt-4">
                  <button
            onClick={loadDashboardData}
            className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
          >
            Try Again
                  </button>
                </div>
    </div>
  );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-blue-100 mb-2">Manage your platform, users, and therapy sessions from one central location.</p>
        <div className="text-blue-100 text-sm">
          <p>Logged in as: <span className="font-semibold">{user?.email}</span></p>
          <p>Role: <span className="font-semibold capitalize">{user?.role}</span></p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <Icon className="h-6 w-6" />
                  </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                      </div>
              <p className="mt-4 text-sm text-gray-500">{stat.description}</p>
    </div>
  );
        })}
        </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.href}
                className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="ml-3 font-medium text-gray-900">{action.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <a href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </a>
          </div>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-gray-400 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Dashboard loaded successfully</p>
              <p className="text-xs text-gray-500">Just now</p>
        </div>
        </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 text-gray-400 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Platform statistics updated</p>
              <p className="text-xs text-gray-500">A few minutes ago</p>
      </div>
                </div>
                </div>
                </div>
    </div>
  );
}

