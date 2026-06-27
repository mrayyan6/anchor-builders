import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request) {
  const supabase = createClient();
  await supabase.auth.signOut();
  const url = new URL('/', request.url);
  return NextResponse.redirect(url, { status: 303 });
}

// Used by the middleware idle-timeout redirect (GET because we can't POST from a redirect).
export async function GET(request) {
  const supabase = createClient();
  await supabase.auth.signOut();
  const url = new URL('/login', request.url);
  return NextResponse.redirect(url, { status: 303 });
}
