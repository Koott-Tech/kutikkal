import { NextResponse } from 'next/server';

// Temporary storage for payment data (in production, use Redis or database)
let paymentData = null;
let paymentDataTimestamp = null;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const txnid = formData.get('txnid') || '';
    const status = formData.get('status') || '';
    const amount = formData.get('amount') || '';
    const error_code = formData.get('error_code') || '';
    const error_Message = formData.get('error_Message') || '';

    console.log('🔍 PayU POST Data:', {
      txnid,
      status,
      amount,
      error_code,
      error_Message
    });

    // Store payment data for frontend with timestamp
    paymentData = {
      txnid,
      status,
      amount,
      error_code,
      error_Message,
      timestamp: Date.now()
    };
    paymentDataTimestamp = Date.now();

    console.log('💾 Stored payment data:', paymentData);
    console.log('⏰ Payment data timestamp:', paymentDataTimestamp);

    // Call backend API to process the payment
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

    console.log('🔄 Calling backend API:', backendUrl);

    try {
      const backendResponse = await fetch(`${backendUrl}/payment/success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txnid,
          status,
          amount,
          error_code,
          error_Message,
          // Include all form data
          ...Object.fromEntries(formData.entries())
        })
      });

      if (backendResponse.ok) {
        const backendResult = await backendResponse.json();
        console.log('🔍 Backend API Response:', backendResult);

        if (backendResult.success) {
          console.log('✅ Backend payment processing successful');
        } else {
          console.error('❌ Backend payment processing failed:', backendResult.message);
        }
      } else {
        console.error('❌ Backend API returned error:', backendResponse.status, backendResponse.statusText);
      }
    } catch (backendError) {
      console.error('❌ Error calling backend API:', backendError);
      console.log('⚠️  Backend is not available, but payment data is still processed');
    }

    // Return a simple HTML page that will redirect to the result page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Processing</title>
          <meta charset="utf-8">
        </head>
        <body>
          <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h2>Payment Processing...</h2>
            <p>Please wait while we process your payment and create your session.</p>
            <div style="margin: 20px 0;">
              <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
            <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </div>
          <script>
            // Redirect to the success page after a short delay
            setTimeout(function() {
              window.location.href = '/payment/success';
            }, 3000);
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('❌ Error in payment result handler:', error);
    return new NextResponse('Error processing payment', { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('📤 GET request received');
    console.log('📤 Current payment data:', paymentData);
    console.log('📤 Payment data timestamp:', paymentDataTimestamp);
    
    if (paymentData && paymentDataTimestamp) {
      // Check if data is still fresh (within last 60 seconds)
      const now = Date.now();
      const dataAge = now - paymentDataTimestamp;
      
      console.log('📤 Data age:', dataAge, 'ms');
      
      if (dataAge < 60000) { // 60 seconds
        console.log('📤 Returning payment data:', paymentData);
        const data = { ...paymentData };
        
        // Keep the data for longer to ensure frontend can access it
        setTimeout(() => {
          paymentData = null;
          paymentDataTimestamp = null;
          console.log('🗑️ Cleared payment data after delay');
        }, 60000); // Keep data for 60 seconds
        
        return NextResponse.json({ success: true, data });
      } else {
        console.log('📤 Payment data is too old, clearing it');
        paymentData = null;
        paymentDataTimestamp = null;
        return NextResponse.json({ success: false, message: 'Payment data expired' });
      }
    } else {
      console.log('📤 No payment data found');
      return NextResponse.json({ success: false, message: 'No payment data found' });
    }
  } catch (error) {
    console.error('❌ Error getting payment data:', error);
    return NextResponse.json({ success: false, message: 'Error retrieving payment data' });
  }
}
