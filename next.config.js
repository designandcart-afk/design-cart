/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_DOMAIN,
      'images.unsplash.com', // For demo images
    ],
  },
  // Enable edge runtime for better performance
  experimental: {
    runtime: 'edge',
    serverActions: true,
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