'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';

export default function FinanceRevenue() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [revenueData, setRevenueData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push('/');
        return;
      }
      
      if (!hasRole('finance') && !hasRole('admin') && !hasRole('superadmin')) {
        router.push('/');
        return;
      }
      
      loadRevenue();
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  const loadRevenue = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const response = await financeApi.getRevenue(params);
      
      if (response.success) {
        setRevenueData(response.data);
      } else {
        setError(response.message || 'Failed to load revenue data');
      }
    } catch (err) {
      console.error('Failed to load revenue:', err);
      setError('Failed to load revenue data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3f2e73' }}></div>
      </div>
    );
  }

  const revenue = revenueData || {};
  const monthlyBreakdown = revenue.monthly_breakdown || [];
  const doctorBreakdown = revenue.by_doctor || [];
  const typeBreakdown = revenue.by_session_type || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div role="heading" aria-level="2" style={{ fontSize: '22px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Revenue Management</div>
          <p className="text-gray-600">Track and analyze revenue performance</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={loadRevenue}
                className="px-6 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#2d1f52] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
              ₹{(revenue.total_revenue || 0).toLocaleString('en-IN')}
            </h3>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
              ₹{(revenue.net_revenue || 0).toLocaleString('en-IN')}
            </h3>
            <p className="text-sm text-gray-600">Net Revenue (After Commission)</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
              {revenue.total_sessions || 0}
            </h3>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Monthly Revenue Breakdown</h3>
          {monthlyBreakdown.length > 0 ? (
            <div className="space-y-4">
              {monthlyBreakdown.map((month, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{month.month}</span>
                    <span className="font-semibold text-gray-900">₹{month.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#3f2e73] h-2 rounded-full"
                      style={{ width: `${(month.revenue / Math.max(...monthlyBreakdown.map(m => m.revenue))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No revenue data available</p>
          )}
        </div>

        {/* Doctor Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Revenue by Doctor</h3>
            {doctorBreakdown.length > 0 ? (
              <div className="space-y-3">
                {doctorBreakdown.map((doctor, index) => (
                  <div key={doctor.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {doctor.first_name} {doctor.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{doctor.session_count || 0} sessions</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{(doctor.revenue || 0).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Revenue by Session Type</h3>
            {typeBreakdown.length > 0 ? (
              <div className="space-y-3">
                {typeBreakdown.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">{type.session_type || 'Individual'}</p>
                      <p className="text-sm text-gray-600">{type.session_count || 0} sessions</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{(type.revenue || 0).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

