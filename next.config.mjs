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
  // Generate build ID (use git commit hash in production for better caching)
  generateBuildId: async () => {
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 12);
    }
    return `build-${Date.now()}`;
  },
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
