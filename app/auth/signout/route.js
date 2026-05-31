import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request) {
  const supabase = createClient();
  await supabase.auth.signOut();
  const url = new URL('/', request.url);
  return NextResponse.redirect(url, { status: 303 });
}
