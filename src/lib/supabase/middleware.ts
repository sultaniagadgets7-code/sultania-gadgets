import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /admin routes (except /admin/login)
    if (
      request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')
    ) {
      // Check if user is authenticated
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }

      const adminEmail = process.env.ADMIN_EMAIL;

      // Fast path: email matches admin email directly
      if (adminEmail && user.email === adminEmail) {
        // Allow through — trusted admin email
      } else {
        // Try is_admin column check
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        const columnMissing = error?.code === '42703' || (error?.message ?? '').includes('is_admin');

        if (columnMissing) {
          // Column not yet created — deny non-admin-email users
          console.warn(`is_admin column missing in DB. Denying access for ${user.email}`);
          const url = request.nextUrl.clone();
          url.pathname = '/admin/login';
          return NextResponse.redirect(url);
        }

        if (error || !profile?.is_admin) {
          console.warn(`Unauthorized admin access attempt by ${user.email}`);
          const url = request.nextUrl.clone();
          url.pathname = '/admin/login';
          return NextResponse.redirect(url);
        }
      }
    }

    // Redirect logged-in admin away from login page
    if (request.nextUrl.pathname === '/admin/login' && user) {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail && user.email === adminEmail) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (profile?.is_admin) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login for admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
