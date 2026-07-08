/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Only apply these rewrites in development. In production, vercel.json handles it.
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*', // Proxy to Backend
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
