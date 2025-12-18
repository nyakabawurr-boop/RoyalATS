/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Fix for pdf-parse and other Node.js libraries
      config.externals = [...(config.externals || []), 'canvas', 'jsdom']
    }
    return config
  },
}

module.exports = nextConfig

