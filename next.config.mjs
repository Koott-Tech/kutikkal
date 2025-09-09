/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Force cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  // Disable static optimization for dynamic content
  experimental: {
    staticPageGenerationTimeout: 1000,
  },
};

export default nextConfig;
