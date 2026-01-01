'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Save, X, DollarSign, TrendingUp, Calendar, Wallet, Eye, User } from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';

const getDoctorImageUrl = (doctor) => {
  if (!doctor) return null;
  return doctor.psychologist?.cover_image_url || null;
};

export default function FinanceDoctors() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editCommissions, setEditCommissions] = useState({}); // { individual: '', package_2: '', package_3: '', ... }
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set()); // Track which cards are expanded

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
      
      loadDoctors();
    }
  }, [authLoading, isAuthenticated, hasRole, router, selectedMonth, selectedYear]);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {};
      if (selectedMonth) params.month = selectedMonth;
      if (selectedYear) params.year = selectedYear;

      const response = await financeApi.getCommissions(params);
      
      if (response.success) {
        setDoctors(response.data.commissions || []);
      } else {
        setError(response.message || 'Failed to load doctors');
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.psychologist_id);
    const commissions = doctor.commission_amounts || {};
    const editData = {
      individual: commissions.individual?.toString() || ''
    };
    
    // Add commission amounts for each package type
    if (doctor.package_commissions) {
      doctor.package_commissions.forEach(pkg => {
        editData[pkg.type] = pkg.commission_amount?.toString() || '';
      });
    }
    
    setEditCommissions(editData);
    setExpandedCards(new Set([doctor.psychologist_id])); // Expand the card
  };

  const handleSave = async (psychologistId) => {
    try {
      // Build commission amounts object
      const commissionAmounts = {};
      let hasValidAmount = false;

      for (const [packageType, value] of Object.entries(editCommissions)) {
        if (value && value.trim() !== '') {
          const amount = parseFloat(value);
          if (isNaN(amount) || amount < 0) {
            alert(`Please enter a valid commission amount for ${packageType} (≥ 0)`);
            return;
          }
          commissionAmounts[packageType] = amount;
          hasValidAmount = true;
        }
      }

      if (!hasValidAmount) {
        alert('Please enter at least one commission amount');
        return;
      }

      const response = await financeApi.updateCommissionRate(psychologistId, {
        commission_amounts: commissionAmounts
      });

      if (response.success) {
        setEditingId(null);
        setEditCommissions({});
        setExpandedCards(new Set());
        loadDoctors();
      } else {
        alert(response.message || 'Failed to update commission amounts');
      }
    } catch (err) {
      console.error('Failed to update commission:', err);
      alert('Failed to update commission amounts. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditCommissions({});
    setExpandedCards(new Set());
  };

  const toggleCardExpansion = (doctorId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(doctorId)) {
      newExpanded.delete(doctorId);
    } else {
      newExpanded.add(doctorId);
    }
    setExpandedCards(newExpanded);
  };

  const handleViewMore = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailModalOpen(true);
  };

  // Generate month/year options
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: month, label: new Date(currentYear, i, 1).toLocaleDateString('en-US', { month: 'long' }) };
  });
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3f2e73' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div role="heading" aria-level="2" className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
            Doctor Commission Management
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Manage commission amounts and view revenue statistics for each doctor</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
              >
                <option value="">All Months</option>
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
              >
                <option value="">All Years</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div
                  key={doctor.psychologist_id}
                  className="bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-all p-6 w-full rounded-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left: Image and Name */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {getDoctorImageUrl(doctor) ? (
                          <img
                            src={getDoctorImageUrl(doctor)}
                            alt={`${doctor.psychologist?.first_name} ${doctor.psychologist?.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-gray-500" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div role="heading" aria-level="3" style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>
                          {doctor.psychologist?.first_name} {doctor.psychologist?.last_name}
                        </div>
                        <p className="text-sm text-gray-600">{doctor.psychologist?.email}</p>
                      </div>
                    </div>

                    {/* Middle: Stats */}
                    <div className="flex flex-wrap gap-6 md:gap-8">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Total Sessions</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {doctor.total_sessions || 0}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                          <Wallet className="h-3 w-3" />
                          Doctor Wallet
                        </div>
                        <div className="text-lg font-semibold text-green-700">
                          ₹{(doctor.total_to_doctor_wallet || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Company
                        </div>
                        <div className="text-lg font-semibold text-blue-700">
                          ₹{(doctor.total_commission_to_company || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      {editingId === doctor.psychologist_id ? (
                        <>
                          <button
                            onClick={() => handleSave(doctor.psychologist_id)}
                            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(doctor)}
                            className={`px-3 py-2 rounded-md transition-colors flex items-center text-sm ${
                              (!doctor.commission_amount_individual || doctor.commission_amount_individual === 0) && 
                              (!doctor.commission_amount_package || doctor.commission_amount_package === 0) 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'bg-gray-600 text-white hover:bg-gray-700'
                            }`}
                            title="Edit Commission"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleViewMore(doctor)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View More
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Commission Settings Section - Always visible when editing, expandable when viewing */}
                  {editingId === doctor.psychologist_id ? (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div role="heading" aria-level="4" style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Commission Settings</div>
                      <div className="flex flex-wrap gap-4">
                        {/* Individual Session Commission */}
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Individual Session
                          </label>
                          <div className="bg-blue-50 p-2 rounded mb-2">
                            <div className="text-xs text-gray-600">Session Price:</div>
                            <div className="text-sm font-semibold text-gray-900">
                              ₹{doctor.individual_session_price ? doctor.individual_session_price.toLocaleString('en-IN') : 'Not Set'}
                            </div>
                          </div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Commission Amount (Company Gets)
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">₹</span>
                            <input
                              type="number"
                              value={editCommissions.individual || ''}
                              onChange={(e) => setEditCommissions({...editCommissions, individual: e.target.value})}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                            />
                          </div>
                          {editCommissions.individual && doctor.individual_session_price > 0 && (
                            <div className="mt-2 text-xs text-gray-600">
                              Doctor Wallet: ₹{(doctor.individual_session_price - parseFloat(editCommissions.individual || 0)).toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>

                        {/* Package Commissions */}
                        {doctor.package_commissions && doctor.package_commissions.length > 0 && (
                          <>
                            {doctor.package_commissions.map((pkg) => (
                              <div key={pkg.type} className="flex-1 min-w-[200px]">
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  {pkg.name || `${pkg.session_count} Session Package`}
                                </label>
                                <div className="bg-blue-50 p-2 rounded mb-2">
                                  <div className="text-xs text-gray-600">Package Price:</div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    ₹{pkg.price.toLocaleString('en-IN')}
                                    <span className="text-xs text-gray-600 ml-2">
                                      (₹{pkg.price_per_session.toFixed(0)}/session)
                                    </span>
                                  </div>
                                </div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Commission Amount (Company Gets)
                                </label>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">₹</span>
                                  <input
                                    type="number"
                                    value={editCommissions[pkg.type] || ''}
                                    onChange={(e) => setEditCommissions({...editCommissions, [pkg.type]: e.target.value})}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                  />
                                </div>
                                {editCommissions[pkg.type] && pkg.price > 0 && (
                                  <div className="mt-2 text-xs text-gray-600">
                                    Doctor Wallet: ₹{(pkg.price - parseFloat(editCommissions[pkg.type] || 0)).toLocaleString('en-IN')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  ) : expandedCards.has(doctor.psychologist_id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div role="heading" aria-level="4" style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Commission Settings</div>
                      <div className="space-y-4">
                        {/* Individual Session Commission */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Individual Session
                          </label>
                          <div className="bg-blue-50 p-2 rounded mb-2">
                            <div className="text-xs text-gray-600">Session Price (from Admin Profile):</div>
                            <div className="text-sm font-semibold text-gray-900">
                              ₹{doctor.individual_session_price ? doctor.individual_session_price.toLocaleString('en-IN') : 'Not Set'}
                            </div>
                          </div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Commission Amount (Company Gets)
                          </label>
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{doctor.commission_amount_individual || 0}
                          </p>
                          {doctor.commission_amount_individual > 0 && doctor.individual_session_price > 0 && (
                            <div className="mt-2 text-xs text-gray-600">
                              Doctor Wallet: ₹{(doctor.individual_session_price - doctor.commission_amount_individual).toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>

                        {/* Package Commissions */}
                        {doctor.package_commissions && doctor.package_commissions.length > 0 && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Package Commissions</label>
                            <div className="space-y-3">
                              {doctor.package_commissions.map((pkg) => (
                                <div key={pkg.type} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  <div className="mb-3">
                                    <div className="text-sm font-medium text-gray-900 mb-1">
                                      {pkg.name || `${pkg.session_count} Session Package`}
                                    </div>
                                    <div className="bg-blue-50 p-2 rounded">
                                      <div className="text-xs text-gray-600">Package Price (from Admin Profile):</div>
                                      <div className="text-sm font-semibold text-gray-900">
                                        ₹{pkg.price.toLocaleString('en-IN')} total
                                        <span className="text-xs text-gray-600 ml-2">
                                          (₹{pkg.price_per_session.toFixed(0)} per session)
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Commission Amount (Company Gets)
                                  </label>
                                  <p className="text-sm font-semibold text-gray-900">
                                    ₹{pkg.commission_amount || 0}
                                  </p>
                                  {pkg.commission_amount > 0 && pkg.price > 0 && (
                                    <div className="mt-2 text-xs text-gray-600">
                                      Doctor Wallet: ₹{(pkg.price - pkg.commission_amount).toLocaleString('en-IN')}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No doctors found</p>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        {isDetailModalOpen && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {getDoctorImageUrl(selectedDoctor) ? (
                        <img
                          src={getDoctorImageUrl(selectedDoctor)}
                          alt={`${selectedDoctor.psychologist?.first_name} ${selectedDoctor.psychologist?.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div role="heading" aria-level="2" style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>
                        {selectedDoctor.psychologist?.first_name} {selectedDoctor.psychologist?.last_name}
                      </div>
                      <p className="text-sm text-gray-600">{selectedDoctor.psychologist?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Commission Settings */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div role="heading" aria-level="3" style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Commission Settings</div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Individual Session Commission</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          ₹{selectedDoctor.commission_amount_individual || 0}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Package Session Commission</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          ₹{selectedDoctor.commission_amount_package || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Session Prices */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div role="heading" aria-level="3" style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Session Prices</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Individual Session:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{selectedDoctor.individual_session_price ? selectedDoctor.individual_session_price.toLocaleString('en-IN') : 'N/A'}
                        </span>
                      </div>
                      {selectedDoctor.package_prices && selectedDoctor.package_prices.length > 0 ? (
                        selectedDoctor.package_prices.map((pkg, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-sm text-gray-600">{pkg.session_count} Session Package:</span>
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{pkg.price.toLocaleString('en-IN')} (₹{pkg.price_per_session.toFixed(0)}/session)
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Package Sessions:</span>
                          <span className="text-sm text-gray-400">N/A</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Session Statistics */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div role="heading" aria-level="3" style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Session Statistics</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Individual Sessions:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {selectedDoctor.individual_sessions || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Package Sessions:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {selectedDoctor.package_sessions || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Sessions:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {selectedDoctor.total_sessions || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Statistics */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div role="heading" aria-level="3" style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Revenue Statistics</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Revenue:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{(selectedDoctor.total_revenue || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-700">
                        <span className="text-sm">To Doctor Wallet:</span>
                        <span className="text-sm font-semibold">
                          ₹{(selectedDoctor.total_to_doctor_wallet || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-blue-700">
                        <span className="text-sm">Company Commission:</span>
                        <span className="text-sm font-semibold">
                          ₹{(selectedDoctor.total_commission_to_company || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Breakdown */}
                {selectedDoctor.monthly_breakdown && selectedDoctor.monthly_breakdown.length > 0 && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <div role="heading" aria-level="3" style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Monthly Breakdown</div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedDoctor.monthly_breakdown.map((month, idx) => (
                        <div key={idx} className="border-b border-gray-200 pb-2 last:border-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{(month.total_revenue || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 pl-2">
                            <span>Wallet: ₹{(month.to_doctor_wallet || 0).toLocaleString('en-IN')}</span>
                            <span>Company: ₹{(month.commission_to_company || 0).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 pl-2 mt-1">
                            <span>Individual: {month.individual_sessions || 0}</span>
                            <span>Package: {month.package_sessions || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
