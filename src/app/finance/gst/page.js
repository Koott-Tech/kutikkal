'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Settings, Save } from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';

export default function FinanceGST() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [gstRecords, setGstRecords] = useState([]);
  const [gstSettings, setGstSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    gst_rate: '',
    gst_number: '',
    company_name: '',
    address: ''
  });

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
      
      loadGSTData();
      loadGSTSettings();
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  const loadGSTData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await financeApi.getGSTRecords();
      
      if (response.success) {
        setGstRecords(response.data.records || []);
      } else {
        setError(response.message || 'Failed to load GST records');
      }
    } catch (err) {
      console.error('Failed to load GST records:', err);
      setError('Failed to load GST records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGSTSettings = async () => {
    try {
      const response = await financeApi.getGSTSettings();
      if (response.success) {
        const settings = response.data.settings || response.data;
        setGstSettings(settings);
        setSettingsForm({
          gst_rate: settings.gst_rate?.toString() || '',
          gst_number: settings.gst_number || '',
          company_name: settings.company_name || '',
          address: settings.address || ''
        });
      }
    } catch (err) {
      console.error('Failed to load GST settings:', err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const response = await financeApi.updateGSTSettings(settingsForm);
      if (response.success) {
        setShowSettings(false);
        loadGSTSettings();
        alert('GST settings updated successfully');
      } else {
        alert(response.message || 'Failed to update GST settings');
      }
    } catch (err) {
      console.error('Failed to update GST settings:', err);
      alert('Failed to update GST settings. Please try again.');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3f2e73' }}></div>
      </div>
    );
  }

  const summary = gstRecords.reduce((acc, record) => {
    const amount = parseFloat(record.gst_amount) || 0;
    if (record.is_input_tax) {
      acc.inputTax += amount;
    } else {
      acc.outputTax += amount;
    }
    acc.total += amount;
    return acc;
  }, { total: 0, inputTax: 0, outputTax: 0 });

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div role="heading" aria-level="2" style={{ fontSize: '22px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>GST & Tax Management</div>
            <p className="text-gray-600">Manage GST records and tax settings</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#2d1f52] transition-colors"
          >
            <Settings className="h-5 w-5" />
            GST Settings
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total GST</p>
            <p style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>₹{summary.total.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Output Tax (Collected)</p>
            <p style={{ fontSize: '20px', fontWeight: 600, color: '#16a34a' }}>₹{summary.outputTax.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Input Tax (Paid)</p>
            <p style={{ fontSize: '20px', fontWeight: 600, color: '#2563eb' }}>₹{summary.inputTax.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* GST Records */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>GST Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gstRecords.length > 0 ? (
                  gstRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.transaction_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {record.record_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.transaction_reference || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{(record.gst_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          record.is_input_tax ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {record.is_input_tax ? 'Input Tax' : 'Output Tax'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No GST records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GST Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>GST Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
                  <input
                    type="number"
                    value={settingsForm.gst_rate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gst_rate: e.target.value })}
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                  <input
                    type="text"
                    value={settingsForm.gst_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gst_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={settingsForm.company_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#2d1f52] transition-colors"
                  >
                    Save Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

