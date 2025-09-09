export default function PaymentSuccessTest() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#22c55e' }}>✅ Payment Success Test Page</h1>
      <p>This is a test page to verify the payment success route is working.</p>
      <p>If you can see this page, the routing is working correctly.</p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
        <h3>Current URL Parameters:</h3>
        <p>Check the browser URL to see if PayU parameters are present.</p>
      </div>
    </div>
  );
}
