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

      // Check if user has admin role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin, email')
        .eq('id', user.id)
        .single();

      // Check admin access - allow if is_admin is true
      // If column doesn't exist (error code 42703), fall back to email check
      const isColumnMissing = error?.code === '42703' || error?.message?.includes('column') || error?.message?.includes('is_admin');
      
      if (isColumnMissing) {
        // Column doesn't exist yet - allow access based on email match with admin email
        const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (!adminEmail || user.email !== adminEmail) {
          console.warn(`Admin column missing. Access denied for user ${user.email}`);
          const url = request.nextUrl.clone();
          url.pathname = '/admin/login';
          return NextResponse.redirect(url);
        }
        // Admin email matches - allow through
      } else if (error || !profile || !profile.is_admin) {
        console.warn(`Unauthorized admin access attempt by user ${user.id} (${user.email})`);
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    }

    // Redirect logged-in admin away from login page
    if (request.nextUrl.pathname === '/admin/login' && user) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      const isColumnMissing = error?.code === '42703' || error?.message?.includes('is_admin');
      const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if (profile?.is_admin || (isColumnMissing && adminEmail && user.email === adminEmail)) {
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
