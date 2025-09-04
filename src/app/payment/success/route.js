import { NextResponse } from 'next/server';
import { setPaymentData } from '../../api/payment/data/route.js';

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

    // Store payment data
    const paymentData = {
      txnid,
      status,
      amount,
      error_code,
      error_Message,
      timestamp: Date.now()
    };

    setPaymentData(paymentData);
    console.log('💾 Stored payment data:', paymentData);

    // Redirect to a clean URL
    const redirectUrl = 'http://localhost:3000/payment/result';
    console.log('🔗 Redirecting to:', redirectUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ Error in payment success handler:', error);
    return NextResponse.redirect('http://localhost:3000/payment/result?error=processing');
  }
}
