import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Clerk-hosted avatars shown on the profile page
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: 'images.clerk.dev' },
    ],
  },
}

export default nextConfig
