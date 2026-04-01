import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Route protection proxy (Next.js 16 replacement for middleware.ts).
 *
 * Rules:
 *  - /admin/* → requires an active Supabase session; redirects to /sign-in otherwise
 *  - /sign-in  → redirects authenticated users straight to /admin/dashboard
 *  - All other routes → pass through
 *
 * Only performs an optimistic cookie-based session check here (no DB queries).
 * The actual admin-role verification (admins table lookup) happens in
 * app/admin/layout.tsx so it runs on every navigation, not just first load.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Build a response we can attach updated auth cookies to
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase isn't configured yet (no .env.local), pass all requests through
  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  // Create an SSR Supabase client that can read+refresh cookies
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write refreshed tokens back to both the request and the response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the token with Supabase Auth (not just a cookie read)
  const { data: { user } } = await supabase.auth.getUser()

  // ── Protect /admin/* ──────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/sign-in'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  // ── Redirect already-authenticated users away from /sign-in ──────────────
  if (pathname === '/sign-in' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    // Run on /admin/* and /sign-in; skip static assets and Next internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
