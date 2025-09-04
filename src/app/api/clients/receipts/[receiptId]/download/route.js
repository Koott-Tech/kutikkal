import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { receiptId } = params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    console.log('🔍 Download API - Receipt ID:', receiptId);
    console.log('🔍 Download API - Token received:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      console.log('❌ Download API - No token provided');
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5001/api/clients/receipts/${receiptId}/download`
      : `https://littlecare-backend.onrender.com/api/clients/receipts/${receiptId}/download`;

    console.log('🔍 Download API - Calling backend:', backendUrl);

    const response = await fetch(backendUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('🔍 Download API - Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Download API - Backend error:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    // Check if backend returned a redirect
    if (response.status === 302 || response.headers.get('location')) {
      const redirectUrl = response.headers.get('location') || response.url;
      console.log('🔍 Download API - Redirecting to:', redirectUrl);
      
      return NextResponse.redirect(redirectUrl);
    }

    // Fallback: handle direct PDF response
    const pdfBuffer = await response.arrayBuffer();
    console.log('🔍 Download API - PDF buffer size:', pdfBuffer.byteLength, 'bytes');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${receiptId}.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString()
      }
    });

  } catch (error) {
    console.error('Error downloading receipt:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to download receipt' }, 
      { status: 500 }
    );
  }
}
