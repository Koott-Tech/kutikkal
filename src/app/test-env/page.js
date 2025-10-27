"use client";

import { useState, useEffect } from 'react';

export default function TestEnv() {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Test</h1>
      <p><strong>NEXT_PUBLIC_BACKEND_URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET'}</p>
      <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'NOT SET'}</p>
      <p><strong>Timestamp:</strong> {timestamp || 'Loading...'}</p>
      
      <button 
        onClick={async () => {
          try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';
            console.log('Testing connection to:', backendUrl);
            const response = await fetch(`${backendUrl}/security/test`);
            const data = await response.json();
            console.log('Response:', data);
            alert(`Connection test: ${data.success ? 'SUCCESS' : 'FAILED'}\nMessage: ${data.message}`);
          } catch (error) {
            console.error('Test failed:', error);
            alert(`Test failed: ${error.message}`);
          }
        }}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Test Backend Connection
      </button>
    </div>
  );
}
