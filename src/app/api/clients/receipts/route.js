import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('🔍 Frontend API - Token received:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      console.log('❌ Frontend API - No token provided');
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5001/api/clients/receipts'
      : 'https://littlecare-backend.onrender.com/api/clients/receipts';

    console.log('🔍 Frontend API - Calling backend:', backendUrl);

    const response = await fetch(backendUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('🔍 Frontend API - Backend response:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Frontend API - Error fetching receipts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch receipts' }, 
      { status: 500 }
    );
  }
}
