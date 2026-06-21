const isDev = process.env.NODE_ENV !== 'production';

// Supabase host (auth, REST, realtime, storage) — needed in connect-src/img-src
// so the browser Supabase client and admin storage thumbnails keep working.
const SUPABASE_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host;
  } catch {
    return 'bqhqlzmcshiuvlbcjkud.supabase.co';
  }
})();

// Content-Security-Policy. 'unsafe-inline' is required for scripts because Next
// injects inline hydration/bootstrap scripts and we don't run a nonce setup;
// 'unsafe-inline' is also required for styles (inline style attrs + next/font).
// We deliberately omit 'unsafe-eval' (Next 14 production doesn't need it) so the
// policy still meaningfully restricts injected external scripts, framing,
// <base>, <object>/<embed>, form exfiltration, and non-Supabase connections.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${SUPABASE_HOST}`,
  "font-src 'self' data:",
  `connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Security headers applied to every route. The CSP + HSTS are emitted only in
  // production so they don't interfere with `next dev` (HMR uses eval + ws).
  async headers() {
    const headers = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      },
    ];
    if (!isDev) {
      headers.push({ key: 'Content-Security-Policy', value: contentSecurityPolicy });
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains',
      });
    }
    return [{ source: '/:path*', headers }];
  },
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
