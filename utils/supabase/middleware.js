import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const IDLE_MS = 30 * 60 * 1000; // 30-minute idle timeout
const LAST_ACTIVE_COOKIE = 'anch_la';

// Refreshes the Supabase session on every request and gates /admin for auth.
export async function updateSession(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isSignoutPath = pathname.startsWith('/auth/signout');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Supabase middleware env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.'
    );

    if (isAdminPath) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next({ request: { headers: request.headers } });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh token if needed
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch (error) {
    console.error('Supabase middleware session refresh failed:', error?.message || error);
  }

  // 30-minute idle timeout. Skipped on the signout path to avoid redirect loops.
  if (user && !isSignoutPath) {
    const raw = request.cookies.get(LAST_ACTIVE_COOKIE)?.value;
    const now = Date.now();
    if (raw) {
      const last = parseInt(raw, 10);
      if (!isNaN(last) && now - last > IDLE_MS) {
        const target = request.nextUrl.clone();
        target.pathname = '/auth/signout';
        target.search = '?timeout=1';
        return NextResponse.redirect(target, { status: 303 });
      }
    }
    response.cookies.set(LAST_ACTIVE_COOKIE, String(now), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1800,
      path: '/',
    });
  }

  // Gate /admin/* — anonymous users get bounced to /login (with ?next=...)
  if (isAdminPath && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect signed-in users away from auth pages.
  if (isAuthPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
