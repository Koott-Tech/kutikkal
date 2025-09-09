import { NextResponse } from 'next/server';

// Force Node.js runtime for reliable SHA-512 hashing
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Temporary storage for payment data (in production, use Redis or database)
let paymentData = null;
let paymentDataTimestamp = null;

// Parse different content types from PayU
async function parseBody(req) {
  const ct = (req.headers.get("content-type") || "").toLowerCase();

  if (ct.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    return new URLSearchParams(text);
  }
  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    const entries = [];
    for (const [k, v] of form.entries()) {
      entries.push([k, typeof v === "string" ? v : v.name || ""]);
    }
    return new URLSearchParams(entries);
  }
  if (ct.includes("application/json")) {
    const json = await req.json();
    return new URLSearchParams(Object.entries(json).map(([k, v]) => [k, String(v ?? "")]));
  }
  // fallback
  const text = await req.text();
  return new URLSearchParams(text);
}

// Verify PayU hash (stubbed for now - implement with your TEST key/salt)
function verifyPayUHash(params) {
  // TODO: implement PayU SHA-512 verification
  // Response pattern: SALT|status|...|email|firstname|productinfo|amount|txnid|KEY
  console.log('🔐 Hash verification (stubbed):', params.get('hash'));
  return true; // For now, always return true
}

async function handlePayment(params, req) {
  const status = (params.get("status") || "").toLowerCase();
  const txnid = params.get("txnid") || "";
  const amount = params.get("amount") || "";
  const error_code = params.get("error_code") || "";
  const error_Message = params.get("error_Message") || "";
  
  console.log('🔍 PayU Data:', { txnid, status, amount, error_code, error_Message });

  // 1) Verify hash
  if (!verifyPayUHash(params)) {
    console.log('❌ Hash verification failed');
    const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    return NextResponse.redirect(`${base}/payment/failure?reason=hash&txnid=${encodeURIComponent(txnid)}`, { status: 302 });
  }

  // 2) Store payment data for frontend
  paymentData = {
    txnid,
    status,
    amount,
    error_code,
    error_Message,
    timestamp: Date.now(),
    // Include all params
    ...Object.fromEntries(params.entries())
  };
  paymentDataTimestamp = Date.now();

  console.log('💾 Stored payment data:', paymentData);

  // 3) Call backend API to process the payment
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

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
        ...Object.fromEntries(params.entries())
      })
    });

    if (backendResponse.ok) {
      const backendResult = await backendResponse.json();
      console.log('✅ Backend payment processing successful:', backendResult);
    } else {
      console.error('❌ Backend API returned error:', backendResponse.status, backendResponse.statusText);
    }
  } catch (backendError) {
    console.error('❌ Error calling backend API:', backendError);
    console.log('⚠️  Backend is not available, but payment data is still processed');
  }

  // 4) Redirect to appropriate UI page
  const base = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const dest = status === "success" ? "/payment/success" : "/payment/failure";
  
  console.log(`🔄 Redirecting to: ${base}${dest}?txnid=${encodeURIComponent(txnid)}`);
  
  return NextResponse.redirect(`${base}${dest}?txnid=${encodeURIComponent(txnid)}`, { status: 302 });
}

export async function POST(req) {
  try {
    const params = await parseBody(req);
    return handlePayment(params, req);
  } catch (error) {
    console.error('❌ Error in POST handler:', error);
    return new NextResponse('Error processing payment', { status: 500 });
  }
}

// Handle GET requests (helpful in test mode)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    return handlePayment(searchParams, req);
  } catch (error) {
    console.error('❌ Error in GET handler:', error);
    return new NextResponse('Error processing payment', { status: 500 });
  }
}

