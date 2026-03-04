import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if Supabase env vars are available - required for client creation
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Env vars not available - allow request to proceed without auth check
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect all routes except /login and API routes
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  if (!user && !isLoginPage && !isApiRoute) {
    // Not logged in, redirect to /login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Check if user is in admins table for protected routes
  // Skip admin check if admins table doesn't exist yet (allows initial setup)
  if (user && !isLoginPage && !isApiRoute) {
    try {
      const { data: adminRecord, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

      // If table doesn't exist (error code 42P01) or other errors, allow access for now
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - that's a valid "not an admin" case
        // Other errors (like table not existing) - allow through for initial setup
        console.error('[v0] Admin check error:', error.message)
      } else if (!adminRecord && !error) {
        // No admin record found and no error - user is not an admin
        await supabase.auth.signOut()
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      } else if (error?.code === 'PGRST116') {
        // No rows returned - user is not in admins table
        await supabase.auth.signOut()
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
    } catch (e) {
      console.error('[v0] Admin check failed:', e)
      // Allow through on error to not block users during setup
    }
  }

  if (user && isLoginPage) {
    // Already logged in, redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
