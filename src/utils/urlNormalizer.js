/**
 * URL Normalizer Utility
 * 
 * Converts absolute URLs to relative URLs for development/production compatibility
 * This ensures image URLs work in both localhost and production environments
 */

/**
 * Convert absolute proxy URL to relative URL
 * Converts: https://www.little.care/api/images/... → /api/images/...
 * Or: http://localhost:3000/api/images/... → /api/images/...
 * Also converts Supabase storage URLs to proxy URLs:
 * https://PROJECT.supabase.co/storage/v1/object/public/BUCKET/FILE → /api/images/BUCKET/FILE
 * /storage/v1/object/public/BUCKET/FILE → /api/images/BUCKET/FILE
 * @param {string} url - Absolute or relative URL
 * @returns {string} Relative URL
 */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  
  // If it's already a relative proxy URL, return as-is
  if (url.startsWith('/api/images/')) return url;
  
  // Convert Supabase storage URLs to proxy URLs
  // Pattern: /storage/v1/object/public/BUCKET/FILENAME
  // Or: https://PROJECT.supabase.co/storage/v1/object/public/BUCKET/FILENAME
  const supabaseStorageMatch = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
  if (supabaseStorageMatch) {
    const bucket = supabaseStorageMatch[1];
    const filename = supabaseStorageMatch[2];
    return `/api/images/${bucket}/${filename}`;
  }
  
  // If it's already a relative URL (and not Supabase storage), return as-is
  if (url.startsWith('/')) return url;
  
  // Extract the path from absolute proxy URL
  try {
    const urlObj = new URL(url);
    // If it's a proxy URL, return the pathname
    if (urlObj.pathname.startsWith('/api/images/')) {
      return urlObj.pathname;
    }
    // If it's a Supabase URL, convert it
    if (urlObj.hostname.includes('supabase.co') && urlObj.pathname.includes('/storage/v1/object/public/')) {
      const supabaseMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
      if (supabaseMatch) {
        const bucket = supabaseMatch[1];
        const filename = supabaseMatch[2];
        return `/api/images/${bucket}/${filename}`;
      }
    }
    return urlObj.pathname;
  } catch (e) {
    // If URL parsing fails, try regex to extract /api/images/... path
    const match = url.match(/\/api\/images\/.+/);
    if (match) {
      return match[0];
    }
    // If no match, return original (might be external URL or already relative)
    return url;
  }
}

/**
 * Normalize multiple image URLs in an object
 * Useful for normalizing service data with multiple image fields
 * @param {object} data - Object containing image URL fields
 * @param {string[]} imageFields - Array of field names that contain image URLs
 * @returns {object} Object with normalized URLs
 */
export function normalizeImageUrls(data, imageFields = ['hero_image_url', 'og_image', 'imageUrl', 'profile_picture_url', 'cover_image_url']) {
  if (!data || typeof data !== 'object') return data;
  
  const normalized = { ...data };
  
  imageFields.forEach(field => {
    if (normalized[field]) {
      normalized[field] = normalizeImageUrl(normalized[field]);
    }
  });
  
  return normalized;
}

