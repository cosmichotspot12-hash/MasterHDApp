import type { NextConfig } from 'next'
import { createRequire } from 'node:module'

const loadCommonJs = createRequire(import.meta.url)

let nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
}

// PWA support for webpack builds only
if (process.env.NEXT_TURBOPACK !== '1') {
  const nextPWA = loadCommonJs('next-pwa')
  const withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  })
  nextConfig = withPWA(nextConfig)
}

export default nextConfig
