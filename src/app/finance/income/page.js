'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { financeApi } from '@/lib/backendApi';
import { useAuth } from '@/contexts/AuthContext';

export default function FinanceIncome() {
  const { user, isAuthenticated, hasRole, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [income, setIncome] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingIncomeId, setDeletingIncomeId] = useState(null);
  const [sources, setSources] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    income_source: '',
    description: '',
    amount: '',
    payment_method: 'bank_transfer',
    reference_number: '',
    notes: ''
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
      
      loadIncome();
      loadSources();
    }
  }, [authLoading, isAuthenticated, hasRole, router]);

  const loadIncome = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await financeApi.getIncome();
      
      if (response.success) {
        setIncome(response.data.income || []);
      } else {
        setError(response.message || 'Failed to load income');
      }
    } catch (err) {
      console.error('Failed to load income:', err);
      setError('Failed to load income. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSources = async () => {
    try {
      const response = await financeApi.getIncomeSources();
      if (response.success) {
        setSources(response.data.sources || []);
      }
    } catch (err) {
      console.error('Failed to load sources:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await financeApi.createIncome(formData);
      if (response.success) {
        setShowAddModal(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          income_source: '',
          description: '',
          amount: '',
          payment_method: 'bank_transfer',
          reference_number: '',
          notes: ''
        });
        loadIncome();
      } else {
        alert(response.message || 'Failed to create income entry');
      }
    } catch (err) {
      console.error('Failed to create income:', err);
      alert('Failed to create income entry. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingIncome(item);
    setFormData({
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      income_source: item.income_source || '',
      description: item.description || '',
      amount: item.amount || '',
      payment_method: item.payment_method || 'bank_transfer',
      reference_number: item.reference_number || '',
      notes: item.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await financeApi.updateIncome(editingIncome.id, formData);
      if (response.success) {
        setShowEditModal(false);
        setEditingIncome(null);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          income_source: '',
          description: '',
          amount: '',
          payment_method: 'bank_transfer',
          reference_number: '',
          notes: ''
        });
        loadIncome();
      } else {
        alert(response.message || 'Failed to update income entry');
      }
    } catch (err) {
      console.error('Failed to update income:', err);
      alert('Failed to update income entry. Please try again.');
    }
  };

  const handleDeleteClick = (incomeId) => {
    setDeletingIncomeId(incomeId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await financeApi.deleteIncome(deletingIncomeId);
      if (response.success) {
        setShowDeleteConfirm(false);
        setDeletingIncomeId(null);
        loadIncome();
      } else {
        alert(response.message || 'Failed to delete income entry');
      }
    } catch (err) {
      console.error('Failed to delete income:', err);
      alert('Failed to delete income entry. Please try again.');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderBottomColor: '#3f2e73' }}></div>
      </div>
    );
  }

  const totalIncome = income.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div role="heading" aria-level="2" style={{ fontSize: '22px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Income Management</div>
            <p className="text-gray-600">Track and manage company income</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#2d1f52] transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Income
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <p style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>₹{totalIncome.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 text-green-600">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {income.length > 0 ? (
                    income.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.income_source}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{(item.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {item.payment_method?.replace('_', ' ') || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Edit income entry"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete income entry"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No income entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Income Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Add New Income</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Income Source</label>
                  <select
                    value={formData.income_source}
                    onChange={(e) => setFormData({ ...formData, income_source: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  >
                    <option value="">Select source</option>
                    {sources.map((source) => (
                      <option key={source.id} value={source.name}>{source.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                  <input
                    type="text"
                    value={formData.reference_number}
                    onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#2d1f52] transition-colors"
                  >
                    Add Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Income Modal */}
        {showEditModal && editingIncome && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Edit Income Entry</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingIncome(null);
                      setFormData({
                        date: new Date().toISOString().split('T')[0],
                        income_source: '',
                        description: '',
                        amount: '',
                        payment_method: 'bank_transfer',
                        reference_number: '',
                        notes: ''
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Income Source</label>
                  <select
                    value={formData.income_source}
                    onChange={(e) => setFormData({ ...formData, income_source: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  >
                    <option value="">Select source</option>
                    {sources.map((source) => (
                      <option key={source.id} value={source.name}>{source.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                  <input
                    type="text"
                    value={formData.reference_number}
                    onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3f2e73] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#3f2e73] text-white rounded-lg hover:bg-[#2d1f52] transition-colors"
                  >
                    Update Income
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingIncome(null);
                      setFormData({
                        date: new Date().toISOString().split('T')[0],
                        income_source: '',
                        description: '',
                        amount: '',
                        payment_method: 'bank_transfer',
                        reference_number: '',
                        notes: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Delete Income Entry</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this income entry? This action cannot be undone.</p>
                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletingIncomeId(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

