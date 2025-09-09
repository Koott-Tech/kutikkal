import { NextResponse } from 'next/server';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    console.log('🔍 PayU POST request received');
    
    // Simple form data parsing
    const formData = await req.formData();
    const txnid = formData.get('txnid') || '';
    const status = formData.get('status') || '';
    const amount = formData.get('amount') || '';
    
    console.log('🔍 PayU Data:', { txnid, status, amount });

    // Call backend API
    try {
      const backendResponse = await fetch('https://littlecare-backend.onrender.com/api/payment/success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnid, status, amount })
      });
      
      if (backendResponse.ok) {
        console.log('✅ Backend processing successful');
      } else {
        console.log('⚠️ Backend processing failed');
      }
    } catch (backendError) {
      console.log('⚠️ Backend not available:', backendError.message);
    }

    // Redirect to success page
    const dest = status === "success" ? "/payment/success" : "/payment/failure";
    return NextResponse.redirect(`https://kuttikal.vercel.app${dest}?txnid=${encodeURIComponent(txnid)}`, { status: 302 });
    
  } catch (error) {
    console.error('❌ Error in POST handler:', error);
    return NextResponse.redirect('https://kuttikal.vercel.app/payment/failure?error=processing', { status: 302 });
  }
}

export async function GET(req) {
  try {
    console.log('🔍 PayU GET request received');
    const url = new URL(req.url);
    const txnid = url.searchParams.get('txnid') || '';
    const status = url.searchParams.get('status') || '';
    
    console.log('🔍 PayU GET Data:', { txnid, status });

    // Redirect to success page
    const dest = status === "success" ? "/payment/success" : "/payment/failure";
    return NextResponse.redirect(`https://kuttikal.vercel.app${dest}?txnid=${encodeURIComponent(txnid)}`, { status: 302 });
    
  } catch (error) {
    console.error('❌ Error in GET handler:', error);
    return NextResponse.redirect('https://kuttikal.vercel.app/payment/failure?error=processing', { status: 302 });
  }
}
