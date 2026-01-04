import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_noStore as noStore } from 'next/cache';

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

// Disable Next.js static caching for this route (prevents cache errors for large files)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
  // Disable Next.js internal caching to prevent cache errors for large files
  noStore();
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
    // Note: The filename in the URL might be encoded multiple times, so we decode until stable
    let decodedFilename = filename;
    let previousDecoded = '';
    let decodeAttempts = 0;
    const maxDecodeAttempts = 5;
    
    while (decodedFilename !== previousDecoded && decodeAttempts < maxDecodeAttempts) {
      previousDecoded = decodedFilename;
      try {
        decodedFilename = decodeURIComponent(decodedFilename);
        decodeAttempts++;
      } catch (e) {
        // If decoding fails, use the last successfully decoded version
        break;
      }
    }
    
    if (decodedFilename !== filename) {
      console.log('   Filename (after decode):', decodedFilename);
    }
    filename = decodedFilename;
    
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

    // For large files (>1MB), use direct download to avoid signed URL issues and cache problems
    // First, check file size if possible, or just use direct download for all files
    // Direct download is more reliable and doesn't have JWT expiration issues
    
    // Try to get file metadata first to check size
    let useDirectDownload = false;
    try {
      const { data: fileList, error: listError } = await supabaseAdmin.storage
        .from(bucket)
        .list('', {
          search: filename.split('/').pop(),
          limit: 1
        });
      
      if (!listError && fileList && fileList.length > 0) {
        const fileSize = fileList[0].metadata?.size || 0;
        // Use direct download for files larger than 1MB to avoid cache issues and signed URL problems
        if (fileSize > 1024 * 1024) {
          useDirectDownload = true;
          console.log(`   File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB - using direct download`);
        }
      }
    } catch (e) {
      // If metadata check fails, continue with signed URL attempt
      console.log('   Could not check file size, will try signed URL first');
    }

    let imageUrl = null;
    let signedUrlError = null;

    // Try signed URL only for smaller files, or if direct download check failed
    if (!useDirectDownload) {
      console.log('🔑 Attempting to create signed URL for:', filename);
      const { data: signedUrlData, error: signedUrlErr } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(filename, 3600); // 1 hour expiration
      
      signedUrlError = signedUrlErr;
      
      if (!signedUrlError && signedUrlData?.signedUrl) {
        imageUrl = signedUrlData.signedUrl;
        console.log('✅ Using signed URL for bucket:', bucket);
        // Log first 150 chars of signed URL for debugging (without exposing full token)
        const urlPreview = imageUrl.length > 150 ? imageUrl.substring(0, 150) + '...' : imageUrl;
        console.log('   Signed URL preview:', urlPreview);
      } else {
        signedUrlError = signedUrlErr || new Error('No signed URL returned');
      }
    }

    if (signedUrlError || !imageUrl) {
      if (!useDirectDownload) {
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
      }
      
      // If file not found, try public URL as fallback (for public buckets)
      if (signedUrlError?.message?.includes('not found') || 
          signedUrlError?.statusCode === 404 ||
          signedUrlError?.statusCode === '404' ||
          signedUrlError?.error === 'not_found' ||
          signedUrlError?.message?.includes('The resource was not found')) {
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
        // For other errors or if using direct download, skip to direct download
        useDirectDownload = true;
      }
    }
    
    // If we should use direct download (large files or signed URL failed), skip fetch and go straight to download
    if (useDirectDownload && !imageUrl) {
      console.log(`   Using direct download from storage for ${filename}`);
      try {
        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
          .from(bucket)
          .download(filename);
        
        if (downloadError || !fileData) {
          console.error(`   Direct download failed:`, downloadError?.message || 'No data');
          return new NextResponse(`Image not found: ${filename} in bucket ${bucket}`, { status: 404 });
        }
        
        // Convert Blob to ArrayBuffer
        const imageBuffer = await fileData.arrayBuffer();
        if (!imageBuffer || imageBuffer.byteLength === 0) {
          console.error(`   Image buffer is empty for ${filename}`);
          return new NextResponse('Image not found or empty', { status: 404 });
        }
        
        // Determine content type from filename
        const ext = filename.split('.').pop()?.toLowerCase();
        const contentTypeMap = {
          'webp': 'image/webp',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'gif': 'image/gif',
          'svg': 'image/svg+xml',
          'avif': 'image/avif',
        };
        const contentType = contentTypeMap[ext] || 'image/jpeg';
        
        console.log(`   ✅ Direct download succeeded: ${(imageBuffer.byteLength / 1024).toFixed(2)} KB`);
        
        // For large files (>2MB), disable Next.js caching to avoid cache errors
        const isLargeFile = imageBuffer.byteLength > 2 * 1024 * 1024;
        const cacheControl = isLargeFile 
          ? 'public, max-age=86400, s-maxage=0' // Disable CDN cache for large files
          : 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400';
        
        return new NextResponse(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': cacheControl,
            'X-Content-Type-Options': 'nosniff',
          },
        });
      } catch (directDownloadError) {
        console.error(`   Direct download error:`, directDownloadError.message);
        return new NextResponse(`Image download failed: ${directDownloadError.message}`, { status: 500 });
      }
    }

    // Fetch the image using the URL (public or signed)
    // Add retry logic for transient failures
    let response = null;
    let imageBuffer = null;
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`   Retry attempt ${attempt}/${maxRetries} for ${filename}`);
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        try {
          response = await fetch(imageUrl, {
            headers: {
              'Accept': 'image/*',
              'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
            },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unable to read error response');
          console.error(`❌ Image fetch failed: ${response.status} ${response.statusText} for ${filename}`);
          console.error(`   Response body: ${errorText.substring(0, 200)}`);
          console.error(`   Signed URL (first 100 chars): ${imageUrl.substring(0, 100)}...`);
          
          // If it's a 400 (JWT expiration) or 404, try direct download from storage as fallback
          if (response.status === 400 || response.status === 404) {
            const isJWTError = errorText.includes('InvalidJWT') || errorText.includes('exp');
            if (response.status === 400 && isJWTError) {
              console.log(`   JWT expiration detected, using direct download for ${filename}`);
            } else {
              console.log(`   Attempting direct download from storage as fallback for ${filename}`);
            }
            
            try {
              const { data: fileData, error: downloadError } = await supabaseAdmin.storage
                .from(bucket)
                .download(filename);
              
              if (downloadError || !fileData) {
                console.error(`   Direct download also failed:`, downloadError?.message || 'No data');
                return new NextResponse(`Image not found or invalid: ${filename}`, { status: 404 });
              }
              
              // Convert Blob to ArrayBuffer
              imageBuffer = await fileData.arrayBuffer();
              if (imageBuffer && imageBuffer.byteLength > 0) {
                console.log(`   ✅ Direct download succeeded: ${(imageBuffer.byteLength / 1024).toFixed(2)} KB`);
                // Determine content type from filename
                const ext = filename.split('.').pop()?.toLowerCase();
                const contentTypeMap = {
                  'webp': 'image/webp',
                  'png': 'image/png',
                  'jpg': 'image/jpeg',
                  'jpeg': 'image/jpeg',
                  'gif': 'image/gif',
                  'svg': 'image/svg+xml',
                  'avif': 'image/avif',
                };
                const contentType = contentTypeMap[ext] || 'image/jpeg';
                
                // For large files (>2MB), disable Next.js caching to avoid cache errors
                const isLargeFile = imageBuffer.byteLength > 2 * 1024 * 1024;
                const cacheControl = isLargeFile 
                  ? 'public, max-age=86400, s-maxage=0' // Disable CDN cache for large files
                  : 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400';
                
                return new NextResponse(imageBuffer, {
                  status: 200,
                  headers: {
                    'Content-Type': contentType,
                    'Cache-Control': cacheControl,
                    'X-Content-Type-Options': 'nosniff',
                  },
                });
              }
            } catch (directDownloadError) {
              console.error(`   Direct download error:`, directDownloadError.message);
            }
            return new NextResponse(`Image not found or invalid: ${filename}`, { status: 404 });
          }
          
          // For other errors, retry if we have attempts left
          if (attempt < maxRetries) {
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
            continue;
          }
          
          return new NextResponse(`Image fetch failed: ${response.status} ${response.statusText}`, { status: response.status });
        }

        // Get the image data
        imageBuffer = await response.arrayBuffer();
        
        // Check if buffer is empty or null
        if (!imageBuffer || imageBuffer.byteLength === 0) {
          console.error(`❌ Image buffer is empty or null for ${filename} in bucket ${bucket}`);
          if (attempt < maxRetries) {
            lastError = new Error('Empty buffer');
            continue;
          }
          return new NextResponse('Image not found or empty', { status: 404 });
        }
        
        // Success - break out of retry loop
        break;
      } catch (fetchError) {
        lastError = fetchError;
        console.error(`❌ Fetch error (attempt ${attempt + 1}/${maxRetries + 1}):`, fetchError.message);
        
        // If it's a timeout or network error, retry
        if (attempt < maxRetries && (
          fetchError.name === 'TimeoutError' || 
          fetchError.message.includes('fetch failed') ||
          fetchError.message.includes('network')
        )) {
          continue;
        }
        
        // Otherwise, fail immediately
        console.error(`❌ Fatal fetch error for ${filename}:`, fetchError);
        return new NextResponse(`Image fetch error: ${fetchError.message}`, { status: 500 });
      }
    }

    // If we exhausted retries and still don't have a buffer
    if (!imageBuffer || imageBuffer.byteLength === 0) {
      console.error(`❌ Failed to fetch image after ${maxRetries + 1} attempts: ${filename}`);
      return new NextResponse(`Image fetch failed after retries: ${lastError?.message || 'Unknown error'}`, { status: 500 });
    }
    
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Validate that it's actually an image
    if (!contentType.startsWith('image/')) {
      console.error(`❌ Invalid content type: ${contentType} for ${filename}`);
      console.error(`   Buffer size: ${imageBuffer.byteLength} bytes`);
      return new NextResponse('Invalid image format', { status: 400 });
    }

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

