import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.qrserver.com' },


      { protocol: 'https', hostname: 'axonesim.com' },
      { protocol: 'https', hostname: 'www.axonesim.com' },

      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  serverExternalPackages: ['twilio'],
}

export default nextConfig