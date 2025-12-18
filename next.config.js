/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are enabled by default in Next.js 14+
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Fix for pdf-parse and other Node.js libraries
      config.externals = [...(config.externals || []), 'canvas', 'jsdom']
    }
    return config
  },
}

module.exports = nextConfig

