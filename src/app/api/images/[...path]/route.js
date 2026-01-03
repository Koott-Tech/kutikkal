import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Image Proxy API Route (Secure - Uses Signed URLs)
 * 
 * This route proxies images from private Supabase Storage buckets using signed URLs.
 * This provides:
 * - Security: Buckets are private, only accessible via signed URLs
 * - Privacy: Hides Supabase project ID from end users
 * - Access Control: Signed URLs can be expired and controlled
 * 
 * Usage: /api/images/counselling-images/filename.webp
 *        /api/images/blog-images/filename.webp
 */
export async function GET(request, { params }) {
  try {
    // In Next.js 14+, params may be a promise, so await it
    const { path } = await params;
    const imagePath = Array.isArray(path) ? path.join('/') : path;

    // Validate path to prevent path traversal attacks
    if (!imagePath || imagePath.includes('..') || imagePath.includes('//')) {
      return new NextResponse('Invalid image path', { status: 400 });
    }

    // Extract bucket and filename from path
    const pathParts = imagePath.split('/');
    if (pathParts.length < 2) {
      return new NextResponse('Invalid image path format', { status: 400 });
    }

    const bucket = pathParts[0];
    let filename = pathParts.slice(1).join('/');
    
    // Decode URL-encoded filename (handles spaces and special characters)
    // This ensures the filename matches what's actually stored in Supabase storage
    try {
      filename = decodeURIComponent(filename);
    } catch (e) {
      // If decoding fails, use original filename
      console.warn('Failed to decode filename in image proxy:', filename, e);
    }

    // Whitelist allowed buckets for security
    const allowedBuckets = [
      'counselling-images',
      'blog-images',
      'profile-pictures',
      'static-files'
    ];

    if (!allowedBuckets.includes(bucket)) {
      return new NextResponse('Invalid bucket', { status: 403 });
    }

    // Get Supabase credentials from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials for image proxy');
      console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
      console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
      return new NextResponse('Storage configuration error - Missing Supabase credentials. Check .env.local file.', { status: 500 });
    }

    // Create Supabase admin client (has access to private buckets)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Generate signed URL (valid for 1 hour)
    // This allows access to private bucket files
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filename, 3600); // 1 hour expiration

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('Error creating signed URL:', signedUrlError);
      console.error('Bucket:', bucket, 'Filename:', filename);
      // If bucket is still public, try direct access as fallback
      if (signedUrlError?.message?.includes('not found') || signedUrlError?.statusCode === 404) {
        return new NextResponse(`Image not found: ${filename}`, { status: 404 });
      }
      return new NextResponse(`Access denied or error: ${signedUrlError?.message || 'Unknown error'}`, { status: 403 });
    }

    // Fetch the image using the signed URL
    const response = await fetch(signedUrlData.signedUrl, {
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with appropriate headers
    // Increased cache time: 24 hours browser, 7 days CDN (stale-while-revalidate for better UX)
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400', // 24h browser, 7d CDN, stale-while-revalidate
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

