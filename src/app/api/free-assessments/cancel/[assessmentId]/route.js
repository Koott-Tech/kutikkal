import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const { assessmentId } = params;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token provided' },
        { status: 401 }
      );
    }

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, message: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NODE_ENV === 'development' 
      ? `http://localhost:5001/api/free-assessments/cancel/${assessmentId}`
      : `https://littlecare-backend.onrender.com/api/free-assessments/cancel/${assessmentId}`;

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error cancelling free assessment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
