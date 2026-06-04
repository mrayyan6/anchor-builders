/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve modern formats (AVIF first, WebP fallback) from the built-in
    // optimizer — smaller transfers than the original JPEGs → faster LCP.
    formats: ['image/avif', 'image/webp'],
    // Cache optimized variants for 31 days so repeat views/visitors skip
    // re-optimization and hit the CDN/edge cache.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bqhqlzmcshiuvlbcjkud.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
export default nextConfig;
