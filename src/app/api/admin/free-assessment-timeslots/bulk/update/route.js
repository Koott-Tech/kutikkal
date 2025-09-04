import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token provided' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { timeslotIds, isActive } = body;

    if (!Array.isArray(timeslotIds) || timeslotIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Timeslot IDs array is required' },
        { status: 400 }
      );
    }

    if (isActive === undefined) {
      return NextResponse.json(
        { success: false, message: 'isActive status is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5001/api/free-assessment-timeslots/bulk/update'
      : 'https://littlecare-backend.onrender.com/api/free-assessment-timeslots/bulk/update';

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timeslotIds, isActive })
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error bulk updating timeslots:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
