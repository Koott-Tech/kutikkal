/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: Babel config exists for Jest compatibility, so SWC is disabled
  // This is expected - compiler options will show warnings but build works correctly
  // For production builds, console logs will still be removed via Babel plugins if needed
  // Optimize for modern browsers (reduces bundle size by removing unnecessary polyfills)
  swcMinify: false, // Explicitly disabled since we're using Babel
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // Supabase storage - using environment variable instead of hardcoded project ID
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL ? [{
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
      }] : []),
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
