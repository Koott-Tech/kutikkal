'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get URL parameters from PayU
        const txnid = searchParams.get('txnid');
        const amount = searchParams.get('amount');
        const productinfo = searchParams.get('productinfo');
        const firstname = searchParams.get('firstname');
        const email = searchParams.get('email');
        const status = searchParams.get('status');
        const hash = searchParams.get('hash');

        if (!txnid || !status) {
          throw new Error('Missing payment parameters');
        }

        // If payment was successful, process it
        if (status === 'success') {
          const response = await fetch('/api/payment/result', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              txnid,
              amount,
              productinfo,
              firstname,
              email,
              status,
              hash
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to process payment');
          }

          const result = await response.json();
          setPaymentData(result);
        } else {
          throw new Error('Payment was not successful');
        }
      } catch (err) {
        console.error('Payment processing error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2>Processing Payment...</h2>
        <p>Please wait while we confirm your payment.</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#ef4444' }}>❌ Payment Error</h1>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={() => router.push('/profile')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#22c55e', marginBottom: '20px' }}>✅ Payment Successful!</h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>Your payment has been processed successfully.</p>
      
      {paymentData && (
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px 0',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#374151' }}>Transaction Details</h3>
          <div style={{ textAlign: 'left' }}>
            <p><strong>Transaction ID:</strong> {paymentData.txnid}</p>
            <p><strong>Amount:</strong> ₹{paymentData.amount}</p>
            <p><strong>Service:</strong> {paymentData.productinfo}</p>
            <p><strong>Status:</strong> <span style={{ color: '#22c55e' }}>Confirmed</span></p>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => router.push('/profile')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            marginRight: '10px'
          }}
        >
          Go to Profile
        </button>
        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div style={{ 
        padding: '50px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2>Loading...</h2>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}