import { NextResponse } from 'next/server';

// Mark route as dynamic (uses Date which changes per request)
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ 
    message: 'Test API route working!', 
    timestamp: new Date().toISOString() 
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Test POST working!', 
    timestamp: new Date().toISOString() 
  });
}
