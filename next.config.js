/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Netlify deployment
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://epochguard-backend.onrender.com',
  },
  // Disable rewrites for static export
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
  //     },
  //   ]
  // },
}

module.exports = nextConfig