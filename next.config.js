/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimize image loading
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Enable edge runtime for better performance
  experimental: {
    serverActions: {},
  },
  // Optimize production build
  swcMinify: true,
  // Allow build to continue despite prerender errors
  staticPageGenerationTimeout: 180,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Add rewrites for clean URLs
  async rewrites() {
    return [
      {
        source: '/p/:id',
        destination: '/products/:id',
      },
      {
        source: '/proj/:id',
        destination: '/projects/:id',
      },
    ];
  },
}

module.exports = nextConfig