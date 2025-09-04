import { NextResponse } from 'next/server';

// Temporary storage for payment data (in production, use Redis or database)
let paymentData = null;
let failureData = null;

export async function GET() {
  try {
    // Return the most recent payment data
    const data = paymentData || failureData;
    
    if (data) {
      console.log('📤 Returning payment data:', data);
      return NextResponse.json({ success: true, data });
    } else {
      console.log('📤 No payment data found');
      return NextResponse.json({ success: false, message: 'No payment data found' });
    }
  } catch (error) {
    console.error('❌ Error getting payment data:', error);
    return NextResponse.json({ success: false, message: 'Error retrieving payment data' });
  }
}

// Function to set payment data (called from route handlers)
export function setPaymentData(data) {
  paymentData = data;
  failureData = null; // Clear failure data
}

export function setFailureData(data) {
  failureData = data;
  paymentData = null; // Clear payment data
}
