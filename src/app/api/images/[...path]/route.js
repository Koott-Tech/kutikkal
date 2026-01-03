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
    
    // Log the original filename before decoding
    console.log('🔍 Image Proxy Request:');
    console.log('   Original path:', imagePath);
    console.log('   Bucket:', bucket);
    console.log('   Filename (before decode):', filename);
    
    // Decode URL-encoded filename (handles spaces and special characters)
    // This ensures the filename matches what's actually stored in Supabase storage
    try {
      const decodedFilename = decodeURIComponent(filename);
      if (decodedFilename !== filename) {
        console.log('   Filename (after decode):', decodedFilename);
      }
      filename = decodedFilename;
    } catch (e) {
      // If decoding fails, use original filename
      console.warn('⚠️ Failed to decode filename in image proxy:', filename, e);
    }
    
    console.log('   Final filename to use:', filename);

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

    // Try signed URL first (works for both public and private buckets, and verifies file exists)
    // If that fails, try public URL as fallback
    console.log('🔑 Attempting to create signed URL for:', filename);
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filename, 3600);

    let imageUrl = null;

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('❌ Error creating signed URL:');
      console.error('   Bucket:', bucket);
      console.error('   Filename used:', filename);
      console.error('   Filename length:', filename.length);
      if (typeof Buffer !== 'undefined') {
        console.error('   Filename bytes:', Buffer.from(filename).toString('hex'));
      }
      console.error('   Error code:', signedUrlError?.statusCode || signedUrlError?.error);
      console.error('   Error message:', signedUrlError?.message);
      console.error('   Full error:', JSON.stringify(signedUrlError, null, 2));
      
      // If file not found, try public URL as fallback (for public buckets)
      if (signedUrlError?.message?.includes('not found') || 
          signedUrlError?.statusCode === 404 ||
          signedUrlError?.statusCode === '404' ||
          signedUrlError?.error === 'not_found') {
        console.log('⚠️ File not found with signed URL, trying public URL as fallback...');
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(filename);
        
        if (publicUrlData?.publicUrl) {
          imageUrl = publicUrlData.publicUrl;
          console.log('✅ Using public URL as fallback for bucket:', bucket);
        } else {
          console.error(`❌ File not found in storage: ${filename} in bucket ${bucket}`);
          console.error(`💡 This usually means:`);
          console.error(`   1. The file was never uploaded to Supabase storage`);
          console.error(`   2. The file was deleted from storage`);
          console.error(`   3. The URL in the database doesn't match the actual filename in storage`);
          console.error(`   4. The file exists but with a different name (check for typos or naming changes)`);
          return new NextResponse(`Image not found: ${filename} in bucket ${bucket}`, { status: 404 });
        }
      } else {
        return new NextResponse(`Access denied or error: ${signedUrlError?.message || 'Unknown error'}`, { status: 403 });
      }
    } else {
      imageUrl = signedUrlData.signedUrl;
      console.log('✅ Using signed URL for bucket:', bucket);
    }

    // Fetch the image using the URL (public or signed)
    const response = await fetch(imageUrl, {
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

