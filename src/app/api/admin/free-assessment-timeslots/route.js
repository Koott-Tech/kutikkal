import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token provided' },
        { status: 401 }
      );
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5001/api/free-assessment-timeslots'
      : 'https://littlecare-backend.onrender.com/api/free-assessment-timeslots';

    const response = await fetch(backendUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error fetching timeslots:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token provided' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { timeSlot, isActive, maxBookingsPerSlot } = body;

    if (!timeSlot) {
      return NextResponse.json(
        { success: false, message: 'Time slot is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5001/api/free-assessment-timeslots'
      : 'https://littlecare-backend.onrender.com/api/free-assessment-timeslots';

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timeSlot, isActive, maxBookingsPerSlot })
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error adding timeslot:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

