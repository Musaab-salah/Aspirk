/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  // Custom webpack configuration to handle hydration warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Suppress hydration warnings in development
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
  // Suppress hydration warnings for browser extension attributes
  experimental: {
    suppressHydrationWarning: true,
  },
  // Custom headers to prevent browser extensions from adding attributes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
