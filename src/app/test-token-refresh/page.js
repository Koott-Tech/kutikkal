'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { clientApi } from '../../lib/backendApi';

export default function TestTokenRefresh() {
  const { user, token, refreshToken, logout } = useAuth();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApiCall = async () => {
    setLoading(true);
    setResult('Testing API call...');
    
    try {
      const sessions = await clientApi.getSessions();
      setResult(`✅ API call successful! Sessions: ${JSON.stringify(sessions, null, 2)}`);
    } catch (error) {
      setResult(`❌ API call failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testTokenRefresh = async () => {
    setLoading(true);
    setResult('Testing token refresh...');
    
    try {
      const newToken = await refreshToken();
      if (newToken) {
        setResult(`✅ Token refreshed successfully! New token: ${newToken.substring(0, 20)}...`);
      } else {
        setResult('❌ Token refresh failed or no new token');
      }
    } catch (error) {
      setResult(`❌ Token refresh error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    logout();
    setResult('Auth cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Token Refresh Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Auth Status</h2>
          <div className="space-y-2">
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'No token'}</p>
            <p><strong>Role:</strong> {user ? user.role : 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testApiCall}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test API Call
            </button>
            <button
              onClick={testTokenRefresh}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Test Token Refresh
            </button>
            <button
              onClick={clearAuth}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Auth
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {result || 'No result yet'}
          </pre>
        </div>
      </div>
    </div>
  );
}
