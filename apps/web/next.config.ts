import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next.js 16 Cache Components (experimental)
  experimental: {
    // ppr: true, // Partial Pre-Rendering - 有効にする場合
  },
  transpilePackages: ['@repo/shared', '@repo/ui'],
}

export default nextConfig
