'use client';

import { useState, useEffect } from 'react';
import { Edit, Save, X, DollarSign, TrendingUp, Calendar, Wallet, Eye, User, MoreVertical, Filter } from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useNotification } from '@/contexts/NotificationContext';
import { normalizeImageUrl } from '@/utils/urlNormalizer';
import DateRangePicker from '@/components/ui/date-range-picker';
import { hasDateRangeBounds } from '@/lib/dateRangeBounds';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getDoctorImageUrl = (doctor) => {
  if (!doctor) return null;
  const imageUrl = doctor.psychologist?.cover_image_url || null;
  // Normalize the image URL (converts Supabase URLs to proxy URLs with signed signatures)
  return imageUrl ? normalizeImageUrl(imageUrl) : null;
};

export default function FinanceDoctors() {
  const { showError } = useNotification();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editCommissions, setEditCommissions] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [dateRange, setDateRange] = useState(() => {
    try {
      const now = new Date();
      const istString = now.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
      });
      const [month, , year] = istString.split('/').map(Number);
      const startOfMonth = new Date(year, month - 1, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) throw new Error('Invalid date');
      return { from: startOfMonth, to: endOfMonth };
    } catch {
      const today = new Date();
      const s = new Date(today.getFullYear(), today.getMonth(), 1); s.setHours(0,0,0,0);
      const e = new Date(today.getFullYear(), today.getMonth() + 1, 0); e.setHours(23,59,59,999);
      return { from: s, to: e };
    }
  });

  useEffect(() => {
    loadDoctors();
  }, [dateRange]);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {};
      if (hasDateRangeBounds(dateRange)) {
        const formatDateToIST = (date) => {
          const istString = new Date(date).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
          });
          const [month, day, year] = istString.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };
        params.dateFrom = formatDateToIST(dateRange.from);
        params.dateTo = formatDateToIST(dateRange.to);
      }

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
      individual: commissions.individual?.toString() || '',
      doctor_commission_first_session: doctor.doctor_commission_first_session?.toString() || '',
      doctor_commission_followup: doctor.doctor_commission_followup?.toString() || '',
      doctor_commission_individual: doctor.doctor_commission_individual?.toString() || '',
      // Legacy package commissions (for backward compatibility)
      doctor_commission_first_session_package: doctor.doctor_commission_first_session_package?.toString() || '',
      doctor_commission_followup_package: doctor.doctor_commission_followup_package?.toString() || ''
    };
    
    // Add commission amounts for each package type (company commission)
    if (doctor.package_commissions) {
      doctor.package_commissions.forEach(pkg => {
        editData[pkg.type] = pkg.commission_amount?.toString() || '';
      });
    }
    
    // Add package-specific doctor commissions (first_session and followup for each package)
    if (doctor.package_commissions) {
      doctor.package_commissions.forEach(pkg => {
        const packageType = pkg.type || `package_${pkg.session_count}`;
        // Get from doctor_commission_packages JSONB field if available
        const packageCommissions = doctor.doctor_commission_packages || {};
        const firstSessionKey = `${packageType}_first_session`;
        const followupKey = `${packageType}_followup`;
        
        editData[firstSessionKey] = packageCommissions[firstSessionKey]?.toString() || 
          (pkg.doctor_commission_first_session?.toString() || '');
        editData[followupKey] = packageCommissions[followupKey]?.toString() || 
          (pkg.doctor_commission_followup?.toString() || '');
      });
    }
    
    setEditCommissions(editData);
    setExpandedCards(new Set([doctor.psychologist_id])); // Expand the card
  };

  const handleSave = async (psychologistId) => {
    try {
      // Build commission amounts object (company gets)
      const commissionAmounts = {};
      const doctorCommissionFields = ['doctor_commission_first_session', 'doctor_commission_followup', 'doctor_commission_individual'];
      let hasValidAmount = false;

      for (const [packageType, value] of Object.entries(editCommissions)) {
        // Skip doctor commission fields - they're handled separately
        if (doctorCommissionFields.includes(packageType)) {
          continue;
        }
        
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

      // Build request data with commission amounts and doctor commission fields
      const requestData = {
        commission_amounts: commissionAmounts
      };
      
      // Include doctor commission amounts if provided
      if (editCommissions.doctor_commission_first_session && editCommissions.doctor_commission_first_session.trim() !== '') {
        const amount = parseFloat(editCommissions.doctor_commission_first_session);
        if (isNaN(amount) || amount < 0) {
          alert('Please enter a valid doctor commission amount for first session (≥ 0)');
          return;
        }
        requestData.doctor_commission_first_session = amount;
        hasValidAmount = true;
      }
      if (editCommissions.doctor_commission_followup && editCommissions.doctor_commission_followup.trim() !== '') {
        const amount = parseFloat(editCommissions.doctor_commission_followup);
        if (isNaN(amount) || amount < 0) {
          alert('Please enter a valid doctor commission amount for follow-up package (≥ 0)');
          return;
        }
        requestData.doctor_commission_followup = amount;
        hasValidAmount = true;
      }
      if (editCommissions.doctor_commission_individual && editCommissions.doctor_commission_individual.trim() !== '') {
        const amount = parseFloat(editCommissions.doctor_commission_individual);
        if (isNaN(amount) || amount < 0) {
          alert('Please enter a valid doctor commission amount for individual session (≥ 0)');
          return;
        }
        requestData.doctor_commission_individual = amount;
        hasValidAmount = true;
      }
      // Legacy package commissions (for backward compatibility)
      if (editCommissions.doctor_commission_first_session_package && editCommissions.doctor_commission_first_session_package.trim() !== '') {
        const amount = parseFloat(editCommissions.doctor_commission_first_session_package);
        if (isNaN(amount) || amount < 0) {
          alert('Please enter a valid doctor commission amount for first session (package) (≥ 0)');
          return;
        }
        requestData.doctor_commission_first_session_package = amount;
        hasValidAmount = true;
      }
      if (editCommissions.doctor_commission_followup_package && editCommissions.doctor_commission_followup_package.trim() !== '') {
        const amount = parseFloat(editCommissions.doctor_commission_followup_package);
        if (isNaN(amount) || amount < 0) {
          alert('Please enter a valid doctor commission amount for follow-up package (full package) (≥ 0)');
          return;
        }
        requestData.doctor_commission_followup_package = amount;
        hasValidAmount = true;
      }
      
      // Package-specific doctor commissions (for each package type)
      const doctorCommissionPackages = {};
      const doctor = doctors.find(d => d.psychologist_id === psychologistId);
      if (doctor && doctor.package_commissions) {
        doctor.package_commissions.forEach(pkg => {
          const packageType = pkg.type || `package_${pkg.session_count}`;
          const firstSessionKey = `${packageType}_first_session`;
          const followupKey = `${packageType}_followup`;
          
          if (editCommissions[firstSessionKey] && editCommissions[firstSessionKey].trim() !== '') {
            const amount = parseFloat(editCommissions[firstSessionKey]);
            if (isNaN(amount) || amount < 0) {
              alert(`Please enter a valid doctor commission amount for ${pkg.name || packageType} first session (≥ 0)`);
              return;
            }
            doctorCommissionPackages[firstSessionKey] = amount;
            hasValidAmount = true;
          }
          
          if (editCommissions[followupKey] && editCommissions[followupKey].trim() !== '') {
            const amount = parseFloat(editCommissions[followupKey]);
            if (isNaN(amount) || amount < 0) {
              alert(`Please enter a valid doctor commission amount for ${pkg.name || packageType} follow-up package (≥ 0)`);
              return;
            }
            doctorCommissionPackages[followupKey] = amount;
            hasValidAmount = true;
          }
        });
      }
      
      if (Object.keys(doctorCommissionPackages).length > 0) {
        requestData.doctor_commission_packages = doctorCommissionPackages;
      }

      if (!hasValidAmount) {
        alert('Please enter at least one commission amount');
        return;
      }

      const response = await financeApi.updateCommissionRate(psychologistId, requestData);

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

  if (isLoading && doctors.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3f2e73]"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold text-gray-900">Doctors</div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap items-start md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
            </div>
            <DateRangePicker
              selectedRange={dateRange}
              onSelect={setDateRange}
            />
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
                        <div className="text-sm font-semibold text-gray-900">
                          {doctor.psychologist?.first_name} {doctor.psychologist?.last_name}
                        </div>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100">
                              <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewMore(doctor)} className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(doctor)} className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Commission
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  {/* Commission Settings Section - Always visible when editing, expandable when viewing */}
                  {editingId === doctor.psychologist_id ? (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm font-semibold text-gray-900 mb-4">Commission Settings</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Column 1: Individual Session */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="text-sm font-semibold text-gray-900 mb-4">
                            Individual Session
                            <div className="text-xs font-normal text-gray-600 mt-1">
                              ₹{doctor.individual_session_price ? doctor.individual_session_price.toLocaleString('en-IN') : 'Not Set'}
                            </div>
                          </div>
                          
                          {/* First Session Commission */}
                          <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              First Session Commission (What Doctor Gets)
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">₹</span>
                              <input
                                type="number"
                                value={editCommissions.doctor_commission_first_session || ''}
                                onChange={(e) => setEditCommissions({...editCommissions, doctor_commission_first_session: e.target.value})}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                              />
                            </div>
                            {editCommissions.doctor_commission_first_session && doctor.individual_session_price > 0 && (
                              <div className="mt-1 text-xs text-gray-600">
                                Company Commission: ₹{(doctor.individual_session_price - parseFloat(editCommissions.doctor_commission_first_session || 0)).toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                          
                          {/* Follow-up package commission */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Follow-up package commission (what doctor gets)
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">₹</span>
                              <input
                                type="number"
                                value={editCommissions.doctor_commission_followup || ''}
                                onChange={(e) => setEditCommissions({...editCommissions, doctor_commission_followup: e.target.value})}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                              />
                            </div>
                            {editCommissions.doctor_commission_followup && doctor.individual_session_price > 0 && (
                              <div className="mt-1 text-xs text-gray-600">
                                Company Commission: ₹{(doctor.individual_session_price - parseFloat(editCommissions.doctor_commission_followup || 0)).toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Column 2 & 3: Package Sessions */}
                        {doctor.package_commissions && doctor.package_commissions.length > 0 ? (
                          doctor.package_commissions.map((pkg) => {
                            const packageType = pkg.type || `package_${pkg.session_count}`;
                            const firstSessionKey = `${packageType}_first_session`;
                            const followupKey = `${packageType}_followup`;
                            const firstSessionValue = editCommissions[firstSessionKey] || '';
                            const followupValue = editCommissions[followupKey] || '';
                            
                            // Calculate full package price (price * session_count if price_per_session, otherwise use price directly)
                            const fullPackagePrice = pkg.price || (pkg.price_per_session ? pkg.price_per_session * (pkg.session_count || 1) : 0);
                            
                            return (
                              <div key={pkg.type} className="border border-gray-200 rounded-lg p-4">
                                <div className="text-sm font-semibold text-gray-900 mb-4">
                                  {pkg.name || `Package of ${pkg.session_count} Sessions`}
                                  <div className="text-xs font-normal text-gray-600 mt-1">
                                    ₹{fullPackagePrice.toLocaleString('en-IN')} (Full Package)
                                  </div>
                                </div>
                                
                                {/* First Session Commission */}
                                <div className="mb-4">
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                    First Session Commission for Full Package (What Doctor Gets)
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">₹</span>
                                    <input
                                      type="number"
                                      value={firstSessionValue}
                                      onChange={(e) => setEditCommissions({...editCommissions, [firstSessionKey]: e.target.value})}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                    />
                                  </div>
                                  {firstSessionValue && fullPackagePrice > 0 && (
                                    <div className="mt-1 text-xs text-gray-600">
                                      Company Commission: ₹{(fullPackagePrice - parseFloat(firstSessionValue || 0)).toLocaleString('en-IN')}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Follow-up package commission */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Follow-up package commission for full package (what doctor gets)
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">₹</span>
                                    <input
                                      type="number"
                                      value={followupValue}
                                      onChange={(e) => setEditCommissions({...editCommissions, [followupKey]: e.target.value})}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                    />
                                  </div>
                                  {followupValue && fullPackagePrice > 0 && (
                                    <div className="mt-1 text-xs text-gray-600">
                                      Company Commission: ₹{(fullPackagePrice - parseFloat(followupValue || 0)).toLocaleString('en-IN')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            <div className="border border-gray-200 rounded-lg p-4 opacity-50">
                              <div className="text-sm font-semibold text-gray-500 mb-4">No Package</div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4 opacity-50">
                              <div className="text-sm font-semibold text-gray-500 mb-4">No Package</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : expandedCards.has(doctor.psychologist_id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm font-semibold text-gray-900 mb-4">Commission Settings</div>
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
                                      <div className="text-xs text-gray-600">Full Package Price (from Admin Profile):</div>
                                      <div className="text-sm font-semibold text-gray-900">
                                        ₹{pkg.price.toLocaleString('en-IN')} (Full Package)
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
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-slate-200/80">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {getDoctorImageUrl(selectedDoctor) ? (
                      <img
                        src={getDoctorImageUrl(selectedDoctor)}
                        alt={`${selectedDoctor.psychologist?.first_name} ${selectedDoctor.psychologist?.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 tracking-tight">
                      {selectedDoctor.psychologist?.first_name} {selectedDoctor.psychologist?.last_name}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedDoctor.psychologist?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Commission Settings */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Commission Settings</div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Individual Session</p>
                          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900">
                            ₹{selectedDoctor.commission_amount_individual || 0}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Package Session</p>
                          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900">
                            ₹{selectedDoctor.commission_amount_package || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Session Prices */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Session Prices</div>
                      <div className="space-y-2">
                        <div className="flex justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <span className="text-xs text-slate-500">Individual:</span>
                          <span className="text-sm font-medium text-slate-900">
                            ₹{selectedDoctor.individual_session_price ? selectedDoctor.individual_session_price.toLocaleString('en-IN') : 'N/A'}
                          </span>
                        </div>
                        {selectedDoctor.package_prices && selectedDoctor.package_prices.length > 0 ? (
                          selectedDoctor.package_prices.map((pkg, idx) => (
                            <div key={idx} className="flex justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                              <span className="text-xs text-slate-500">{pkg.session_count} Sessions:</span>
                              <span className="text-sm font-medium text-slate-900">₹{pkg.price.toLocaleString('en-IN')}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                            <span className="text-xs text-slate-500">Package:</span>
                            <span className="text-sm text-slate-400">N/A</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Session Statistics */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Session Statistics</div>
                      <div className="space-y-2">
                        <div className="flex justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <span className="text-xs text-slate-500">Individual:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedDoctor.individual_sessions || 0}</span>
                        </div>
                        <div className="flex justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <span className="text-xs text-slate-500">Package:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedDoctor.package_sessions || 0}</span>
                        </div>
                        <div className="flex justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <span className="text-xs text-slate-500">Total:</span>
                          <span className="text-sm font-semibold text-slate-900">{selectedDoctor.total_sessions || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Statistics */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Revenue Statistics</div>
                      <div className="space-y-2">
                        <div className="flex justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <span className="text-xs text-slate-500">Total Revenue:</span>
                          <span className="text-sm font-medium text-slate-900">₹{(selectedDoctor.total_revenue || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <span className="text-xs text-green-600">Doctor Wallet:</span>
                          <span className="text-sm font-medium text-green-700">₹{(selectedDoctor.total_to_doctor_wallet || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                          <span className="text-xs text-blue-600">Company:</span>
                          <span className="text-sm font-medium text-blue-700">₹{(selectedDoctor.total_commission_to_company || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Breakdown */}
                  {selectedDoctor.monthly_breakdown && selectedDoctor.monthly_breakdown.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Monthly Breakdown</div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedDoctor.monthly_breakdown.map((month, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-slate-900">
                                {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                              <span className="text-sm font-semibold text-slate-900">
                                ₹{(month.total_revenue || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Wallet: ₹{(month.to_doctor_wallet || 0).toLocaleString('en-IN')}</span>
                              <span>Company: ₹{(month.commission_to_company || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
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

              {/* Footer */}
              <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50/30 flex-shrink-0">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 text-[#3f2e73] bg-white border border-[#3f2e73]/40 rounded-lg hover:bg-[#3f2e73]/10 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
