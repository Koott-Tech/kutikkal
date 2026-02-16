"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { psychologistApi } from "../../lib/backendApi";
import { 
  Calendar, 
  Clock, 
  FileText, 
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function PsychologistDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    totalAvailability: 0,
    totalPackages: 0
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

      // Load all data in parallel
      const [sessionsData, availabilityData, packagesData] = await Promise.all([
        psychologistApi.getSessions(),
        psychologistApi.getAvailability(),
        psychologistApi.getPackages()
      ]);

      const sessions = sessionsData.data?.sessions || [];
      const availability = availabilityData.data || [];
      const packages = packagesData.data || [];

      // Calculate upcoming sessions (today and future)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcomingSessions = sessions.filter(session => {
        const sessionDate = new Date(session.scheduled_date);
        return sessionDate >= today && session.status === 'booked';
      });

      setStats({
        totalSessions: sessions.length,
        upcomingSessions: upcomingSessions.length,
        totalAvailability: availability.length,
        totalPackages: packages.length
      });
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError(err.message);
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
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome back! Here&apos;s an overview of your practice.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sessions</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalSessions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Sessions</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.upcomingSessions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Available Slots</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalAvailability}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Packages</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalPackages}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/psychologist/sessions"
            className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">View Sessions</h3>
                <p className="text-sm text-gray-500">Check your upcoming and past therapy sessions.</p>
              </div>
            </div>
          </a>

          <a
            href="/psychologist/availability"
            className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Manage Availability</h3>
                <p className="text-sm text-gray-500">Set your available time slots for client bookings.</p>
              </div>
            </div>
          </a>

          <a
            href="/psychologist/packages"
            className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">View Packages</h3>
                <p className="text-sm text-gray-500">Check your therapy packages and pricing.</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
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
