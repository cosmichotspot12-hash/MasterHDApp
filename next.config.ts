import type { NextConfig } from 'next'

let nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
}

// PWA support for webpack builds only
if (process.env.NEXT_TURBOPACK !== '1') {
  const nextPWA = require('next-pwa')
  const withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  })
  nextConfig = withPWA(nextConfig)
}

export default nextConfig
