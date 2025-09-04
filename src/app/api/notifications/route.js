import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    // Get user ID from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' });
    }

    // Fetch notifications for the user
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ success: false, message: 'Failed to fetch notifications' });
    }

    return NextResponse.json({ 
      success: true, 
      data: notifications || [] 
    });

  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}

export async function PUT(request) {
  try {
    const { notificationId, isRead } = await request.json();

    if (!notificationId) {
      return NextResponse.json({ success: false, message: 'Notification ID is required' });
    }

    // Update notification read status
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: isRead, updated_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) {
      console.error('Error updating notification:', error);
      return NextResponse.json({ success: false, message: 'Failed to update notification' });
    }

    return NextResponse.json({ success: true, message: 'Notification updated successfully' });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}
