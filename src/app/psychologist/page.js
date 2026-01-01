"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { psychologistApi } from "../../lib/backendApi";
import { useNotification } from "../../contexts/NotificationContext";
import { 
  Calendar, 
  Clock, 
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function PsychologistDashboard() {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    totalAvailability: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load critical data first (sessions), then secondary data in background
      const sessionsData = await psychologistApi.getSessions();
      const sessions = sessionsData.data?.sessions || [];

      // Calculate upcoming sessions (today and future)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcomingSessions = sessions.filter(session => {
        const sessionDate = new Date(session.scheduled_date);
        return sessionDate >= today && session.status === 'booked';
      });

      // Set initial stats with sessions data
      setStats({
        totalSessions: sessions.length,
        upcomingSessions: upcomingSessions.length,
        totalAvailability: 0 // Will be updated
      });

      // Load secondary data in background
      psychologistApi.getAvailability().then(availabilityData => {
        const availability = availabilityData.data || [];
        
        setStats(prev => ({
          ...prev,
          totalAvailability: availability.length
        }));
      }).catch(err => {
        console.error('Error loading secondary dashboard data:', err);
        // Don't show error for secondary data
      });

    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError(err.message);
      showError(`Failed to load dashboard data: ${err.message}`, 'Load Error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          {(() => {
            const first = user?.first_name || user?.firstName || '';
            const last = user?.last_name || user?.lastName || '';
            const fallback = user?.name || user?.email || 'Psychologist';
            const display = (first || last) ? `${first} ${last}`.trim() : fallback;
            return (
              <h6 className="font-semibold text-gray-900">{display}</h6>
            );
          })()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1 min-w-0">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Sessions</dt>
                  <dd className="text-lg sm:text-xl font-medium text-gray-900">{stats.totalSessions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1 min-w-0">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Upcoming Sessions</dt>
                  <dd className="text-lg sm:text-xl font-medium text-gray-900">{stats.upcomingSessions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1 min-w-0">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Available Slots</dt>
                  <dd className="text-lg sm:text-xl font-medium text-gray-900">{stats.totalAvailability}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <p className="font-medium text-gray-900 mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/psychologist/sessions"
            className="block bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start sm:items-center">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-3 sm:mr-4 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">View Sessions</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Check your upcoming and past therapy sessions.</p>
              </div>
            </div>
          </a>

          <a
            href="/psychologist/availability"
            className="block bg-white p-4 sm:p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start sm:items-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-3 sm:mr-4 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">Manage Availability</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Set your available time slots for client bookings.</p>
              </div>
            </div>
          </a>

        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <p className="font-medium text-gray-900 mb-4">Recent Activity</p>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500">
              Your recent sessions and availability updates will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
