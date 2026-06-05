// App Router metadata route → served at /robots.txt.
// Allows normal crawling of all public content; keeps auth/admin utility
// routes out of the index. Sitemap is advertised below.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://anchor-builders.vercel.app';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/signup', '/auth'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
