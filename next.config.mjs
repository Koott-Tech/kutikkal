/** @type {import('next').NextConfig} */
const nextConfig = {
  // SWC is now enabled (Babel config moved to Jest-only configuration)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // NOTE: Supabase storage URLs are NOT included here because we use a proxy route
      // All Supabase images should go through /api/images/... proxy route which handles
      // authentication and signed URLs properly. Including Supabase here causes Next.js
      // Image Optimization to try fetching directly from Supabase, which fails with 400 errors
      // for private buckets or invalid URLs.
      // Allow images from same domain (for proxy)
      {
        protocol: 'https',
        hostname: 'www.little.care',
      },
      {
        protocol: 'https',
        hostname: 'little.care',
      },
      // Development
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
    // Also allow unoptimized images if needed (fallback)
    unoptimized: false,
  },
  // Force cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  // Optimize bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
