import { updateSession } from './utils/supabase/middleware';

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every request except static assets, image optimisation,
     * and favicon. Includes /admin and /login (auth gating).
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|ico)$).*)',
  ],
};
