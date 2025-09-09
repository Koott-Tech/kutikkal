'use client';

export default function PaymentSuccess() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#22c55e' }}>✅ Payment Successful!</h1>
      <p>Your payment has been processed successfully.</p>
      <p>Transaction details will be displayed here.</p>
      <button 
        onClick={() => window.location.href = '/profile'}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Go to Profile
      </button>
    </div>
  );
}