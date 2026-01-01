'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Receipt,
  CreditCard,
  Percent,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FinanceDashboard() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      loadDashboardData();
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await financeApi.getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3f2e73' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.summary || {};
  const recentSessions = dashboardData?.recent_sessions || [];
  const topDoctors = dashboardData?.top_doctors || [];
  const monthlyRevenue = dashboardData?.monthly_revenue || [];
  const charts = dashboardData?.charts || {};
  
  // Prepare chart data
  const revenueByTypeData = charts.revenueByType ? [
    { name: 'Individual', value: charts.revenueByType.individual || 0 },
    { name: 'Package', value: charts.revenueByType.package || 0 }
  ].filter(item => item.value > 0) : [];
  
  const commissionBreakdownData = charts.commissionBreakdown ? [
    { name: 'Company Commission', value: charts.commissionBreakdown.company || 0 },
    { name: 'Doctor Wallet', value: charts.commissionBreakdown.doctor || 0 }
  ].filter(item => item.value > 0) : [];
  
  const expenseByCategoryData = charts.expenseByCategory || [];
  
  const monthlyRevenueChart = charts.monthlyRevenue || [];
  const monthlyExpensesChart = charts.monthlyExpenses || [];
  const monthlyCommissionChart = charts.monthlyCommission || [];
  const monthlyDoctorWalletChart = charts.monthlyDoctorWallet || [];
  
  // Combine monthly data for comparison chart
  const monthlyComparisonData = monthlyRevenueChart.map((rev, idx) => ({
    month: rev.month,
    revenue: rev.revenue,
    expenses: monthlyExpensesChart[idx]?.expenses || 0,
    commission: monthlyCommissionChart[idx]?.commission || 0,
    doctorWallet: monthlyDoctorWalletChart[idx]?.wallet || 0
  }));
  
  // Chart colors
  const COLORS = ['#3f2e73', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const StatCard = ({ title, value, change, changeType, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      red: 'bg-red-50 text-red-600',
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{value}</h3>
          <div className="flex items-center gap-2">
            {change && (
              <div className={`flex items-center text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {changeType === 'increase' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                {change}
              </div>
            )}
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div role="heading" aria-level="2" className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">Finance Dashboard</div>
          <p className="text-xs sm:text-sm text-gray-600">Overview of financial performance and key metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${(stats.total_revenue || 0).toLocaleString('en-IN')}`}
            change={stats.revenue_change}
            changeType={stats.revenue_change_type}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Net Profit"
            value={`₹${(stats.net_profit || 0).toLocaleString('en-IN')}`}
            change={stats.profit_change}
            changeType={stats.profit_change_type}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Total Expenses"
            value={`₹${(stats.total_expenses || 0).toLocaleString('en-IN')}`}
            change={stats.expenses_change}
            changeType={stats.expenses_change_type}
            icon={Receipt}
            color="orange"
          />
          <StatCard
            title="Pending Payouts"
            value={`₹${(stats.pending_payouts || 0).toLocaleString('en-IN')}`}
            icon={CreditCard}
            color="blue"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Sessions</span>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">{stats.total_sessions || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Doctor Wallet</span>
              <Wallet className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">₹{(stats.total_doctor_wallet || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">GST Collected</span>
              <Percent className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">₹{(stats.gst_collected || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Commission Paid</span>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">₹{(stats.commission_paid || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Pie Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Revenue by Type Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div role="heading" aria-level="3" className="text-sm font-medium text-gray-900 mb-4">Revenue by Type</div>
            {revenueByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                <PieChart>
                  <Pie
                    data={revenueByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No revenue data</p>
            )}
          </div>

          {/* Commission Breakdown Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div role="heading" aria-level="3" className="text-sm font-medium text-gray-900 mb-4">Commission Breakdown</div>
            {commissionBreakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                <PieChart>
                  <Pie
                    data={commissionBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {commissionBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No commission data</p>
            )}
          </div>

          {/* Expense by Category Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div role="heading" aria-level="3" className="text-sm font-medium text-gray-900 mb-4">Expenses by Category</div>
            {expenseByCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                <PieChart>
                  <Pie
                    data={expenseByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, amount, percent }) => {
                      const total = expenseByCategoryData.reduce((sum, e) => sum + e.amount, 0);
                      return `${category}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                  >
                    {expenseByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No expense data</p>
            )}
          </div>
        </div>

        {/* Line/Bar Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Monthly Revenue vs Expenses Line Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div role="heading" aria-level="3" className="text-sm font-medium text-gray-900 mb-4">Revenue vs Expenses Trend</div>
            {monthlyComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <LineChart data={monthlyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>

          {/* Monthly Commission vs Doctor Wallet Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div role="heading" aria-level="3" className="text-sm font-medium text-gray-900 mb-4">Commission vs Doctor Wallet</div>
            {monthlyComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <BarChart data={monthlyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend />
                  <Bar dataKey="commission" fill="#3f2e73" name="Company Commission" />
                  <Bar dataKey="doctorWallet" fill="#10b981" name="Doctor Wallet" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Top Doctors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div role="heading" aria-level="3" className="text-sm font-medium text-gray-900 mb-4">Top Earning Doctors</div>
          {topDoctors.length > 0 ? (
            <div className="space-y-4">
              {topDoctors.map((doctor, index) => (
                <div key={doctor.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#3f2e73] text-white flex items-center justify-center font-semibold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {doctor.first_name} {doctor.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{doctor.session_count || 0} sessions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{(doctor.total_commission || 0).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500">Commission</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No doctor data available</p>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div role="heading" aria-level="3" className="text-sm font-medium text-gray-900">Recent Sessions</div>
            <a
              href="/finance/sessions"
              className="text-sm text-[#3f2e73] hover:underline font-medium"
            >
              View All
            </a>
          </div>
          {recentSessions.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Doctor</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Client</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {recentSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {new Date(session.session_date).toLocaleDateString('en-IN')}
                      </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {session.psychologist?.first_name} {session.psychologist?.last_name}
                      </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                        {session.client?.first_name} {session.client?.last_name}
                      </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 capitalize">
                        {session.session_type || 'Individual'}
                      </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-right font-semibold text-gray-900">
                        ₹{(session.amount || 0).toLocaleString('en-IN')}
                      </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-center">
                        {session.status === 'completed' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </span>
                        ) : session.status === 'pending' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {session.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent sessions</p>
          )}
        </div>
      </div>
    </div>
  );
}

