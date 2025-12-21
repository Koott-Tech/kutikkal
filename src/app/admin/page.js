'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp,
  Activity,
  Clock,
  RefreshCw,
  AlertTriangle,
  XCircle,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { adminApi, dashboardApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';
import { cache, withCache } from '@/lib/cache';

export default function AdminDashboard() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalBookings: 0,
    recentBookings: 0,
    failures: {
      paymentFailures: 0,
      pendingPayments: 0,
      cancelledSessions: 0,
      noShowSessions: 0,
      totalPayments: 0
    },
    failureRate: 0
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

      // Check cache first
      const cachedStats = cache.get('dashboard_stats');
      if (cachedStats) {
        console.log('📦 Using cached dashboard stats');
        setStats(cachedStats);
        setIsLoading(false);
        
        // Load fresh data in background
        setTimeout(() => {
          loadFreshData();
        }, 100);
        return;
      }

      // Load fresh data
      await loadFreshData();

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFreshData = async () => {
    try {
      // Load only essential stats first (faster)
      console.log('Fetching platform stats...');
      const platformStats = await adminApi.getPlatformStats();
      console.log('Platform stats response:', platformStats);
      
      let newStats = {
        totalUsers: 0,
        totalDoctors: 0,
        totalBookings: 0,
        recentUsers: 0,
        recentBookings: 0
      };
      
      if (platformStats && platformStats.success) {
        newStats = { 
          ...newStats, 
          ...platformStats.data,
          failures: platformStats.data?.failures || {
            paymentFailures: 0,
            pendingPayments: 0,
            cancelledSessions: 0,
            noShowSessions: 0,
            totalPayments: 0
          },
          failureRate: platformStats.data?.failureRate || 0
        };
      } else {
        console.warn('Platform stats response format unexpected:', platformStats);
        newStats = {
          ...newStats,
          totalUsers: platformStats?.data?.totalUsers || 0,
          totalDoctors: platformStats?.data?.totalDoctors || 0,
          totalBookings: platformStats?.data?.totalBookings || 0,
          failures: platformStats?.data?.failures || {
            paymentFailures: 0,
            pendingPayments: 0,
            cancelledSessions: 0,
            noShowSessions: 0,
            totalPayments: 0
          },
          failureRate: platformStats?.data?.failureRate || 0
        };
      }

      // Load recent data in background (non-blocking)
      console.log('Fetching recent data in background...');
      Promise.all([
        dashboardApi.getRecentUsers(10), // Increased to 10 for better overview
        dashboardApi.getRecentBookings(10) // Increased to 10 for better overview
      ]).then(([recentUsers, recentBookings]) => {
        console.log('Recent users response:', recentUsers);
        console.log('Recent bookings response:', recentBookings);

        // Update stats with recent data counts
        const updatedStats = {
          ...newStats,
          recentUsers: recentUsers?.data?.length || recentUsers?.length || 0,
          recentBookings: recentBookings?.data?.length || recentBookings?.length || 0
        };

        setStats(updatedStats);
        
        // Cache the results for 3 minutes (optimized for 2GB plan)
        cache.set('dashboard_stats', updatedStats, 3 * 60 * 1000);
      }).catch(error => {
        console.warn('Background data loading failed:', error);
        // Don't show error for background loading
      });

      // Set initial stats immediately
      setStats(newStats);
      
      // Cache the initial stats for 3 minutes (optimized for 2GB plan)
      cache.set('dashboard_stats', newStats, 3 * 60 * 1000);

    } catch (error) {
      console.error('Failed to load fresh data:', error);
      throw error;
    }
  };

  const handleRefresh = () => {
    // Clear cache and reload
    cache.clear('dashboard_stats');
    loadDashboardData();
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

  const failureCards = [
    {
      title: 'Payment Failures',
      value: stats.failures?.paymentFailures || 0,
      icon: XCircle,
      color: 'bg-red-500',
      description: `Failed payment attempts`,
      subValue: stats.failures?.totalPayments > 0 
        ? `${((stats.failures?.paymentFailures || 0) / stats.failures.totalPayments * 100).toFixed(1)}% failure rate`
        : 'No payments yet'
    },
    {
      title: 'Pending Payments',
      value: stats.failures?.pendingPayments || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Payments awaiting processing',
      subValue: 'Requires attention'
    },
    {
      title: 'Cancelled Sessions',
      value: stats.failures?.cancelledSessions || 0,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      description: 'Sessions that were cancelled',
      subValue: stats.totalBookings > 0 
        ? `${((stats.failures?.cancelledSessions || 0) / stats.totalBookings * 100).toFixed(1)}% of total`
        : ''
    },
    {
      title: 'No-Show Sessions',
      value: stats.failures?.noShowSessions || 0,
      icon: AlertCircle,
      color: 'bg-red-600',
      description: 'Sessions where client did not show',
      subValue: stats.totalBookings > 0 
        ? `${((stats.failures?.noShowSessions || 0) / stats.totalBookings * 100).toFixed(1)}% of total`
        : ''
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
            <h6>Access Denied</h6>
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
            <h6>Error</h6>
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
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <h6>Welcome to Admin Dashboard</h6>
        <p className="text-blue-100 mb-2 text-sm sm:text-base">Manage your platform, users, and therapy sessions from one central location.</p>
        <div className="text-blue-100 text-xs sm:text-sm">
          <p>Logged in as: <span className="font-semibold">{user?.email}</span></p>
          <p>Role: <span className="font-semibold capitalize">{user?.role}</span></p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.color} text-white`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="number-bold">{stat.value}</p>
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Failure Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h6>Failure & Issue Metrics</h6>
            <p className="text-sm text-gray-600 mt-1">Monitor payment failures, cancellations, and issues</p>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {failureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-lg ${card.color} text-white mr-3`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">{card.title}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                    <p className="text-xs text-gray-500 mb-1">{card.description}</p>
                    {card.subValue && (
                      <p className="text-xs font-medium text-gray-700">{card.subValue}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h6>Recent Activity</h6>
          <a href="/admin/bookings" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800">
            View All
          </a>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-gray-400 mr-2 sm:mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Dashboard loaded successfully</p>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
          </div>
          <div className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 text-gray-400 mr-2 sm:mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Platform statistics updated</p>
              <p className="text-xs text-gray-500">A few minutes ago</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

