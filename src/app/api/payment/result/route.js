import { NextResponse } from 'next/server';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    console.log('🔍 PayU POST request received');
    console.log('🔍 Request URL:', req.url);
    console.log('🔍 Request headers:', Object.fromEntries(req.headers.entries()));
    
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

    // Determine redirect base URL based on environment
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://kutikkal-one.vercel.app';

    // Redirect to success page
    const dest = status === "success" ? "/payment/success" : "/payment/failure";
    return NextResponse.redirect(`${baseUrl}${dest}?txnid=${encodeURIComponent(txnid)}`, { status: 302 });
    
  } catch (error) {
    console.error('❌ Error in POST handler:', error);
    
    // Determine redirect base URL based on environment
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://kutikkal-one.vercel.app';
      
    return NextResponse.redirect(`${baseUrl}/payment/failure?error=processing`, { status: 302 });
  }
}

export async function GET(req) {
  try {
    console.log('🔍 PayU GET request received');
    
    // Validate req.url before using it
    if (!req.url) {
      console.error('❌ No URL provided in request');
      
      // Determine redirect base URL based on environment
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://kutikkal-one.vercel.app';
        
      return NextResponse.redirect(`${baseUrl}/payment/failure?error=no_url`, { status: 302 });
    }
    
    let url;
    try {
      url = new URL(req.url);
    } catch (urlError) {
      console.error('❌ Invalid URL in request:', req.url, urlError);
      
      // Determine redirect base URL based on environment
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://kutikkal-one.vercel.app';
        
      return NextResponse.redirect(`${baseUrl}/payment/failure?error=invalid_url`, { status: 302 });
    }
    
    const txnid = url.searchParams.get('txnid') || '';
    const status = url.searchParams.get('status') || '';
    
    console.log('🔍 PayU GET Data:', { txnid, status });

    // Determine redirect base URL based on environment
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://kutikkal-one.vercel.app';

    // Redirect to success page
    const dest = status === "success" ? "/payment/success" : "/payment/failure";
    return NextResponse.redirect(`${baseUrl}${dest}?txnid=${encodeURIComponent(txnid)}`, { status: 302 });
    
  } catch (error) {
    console.error('❌ Error in GET handler:', error);
    
    // Determine redirect base URL based on environment
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://kutikkal-one.vercel.app';
      
    return NextResponse.redirect(`${baseUrl}/payment/failure?error=processing`, { status: 302 });
  }
}
