import type { NextConfig } from 'next'
import { createRequire } from 'node:module'

const loadCommonJs = createRequire(import.meta.url)

// Listing photos are served from Supabase Storage public URLs
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'qotwimhrglxtkscualim.supabase.co'

let nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // ISPs with DNS64/NAT64 (e.g. Jio) resolve public hosts to 64:ff9b::/96
    // addresses, which Next's SSRF guard treats as private and rejects with
    // 400. Dev only — remotePatterns above still restricts allowed URLs.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
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
