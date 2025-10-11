/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'iylutfwntoqcnqnjdnnp.supabase.co',
      },
    ],
  },
  // Force cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  // Set output file tracing root to silence workspace warning
  outputFileTracingRoot: '/Users/abhishekr/Desktop/Projects/kuttikal/frontend',
  // Enable prefetching for better navigation performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
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
