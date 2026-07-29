import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAILS = ["abdulquader057@gmail.com", "official.valceron.in@gmail.com"];

export async function middleware(request: NextRequest) {
  // Create an unmodified response by default
  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return supabaseResponse;
    }

    // Initialize the Supabase client specifically for middleware
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // ALWAYS use getUser() instead of getSession() for server-side auth checks.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const url = request.nextUrl.clone();
    const pathname = request.nextUrl.pathname;

    // 1. Check if user is attempting to access protected routes without being authenticated.
    if (!user && (pathname.startsWith("/admin") || pathname.startsWith("/settings") || pathname.startsWith("/profile"))) {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }

    // 2. Check if user is attempting to access admin-specific routes.
    if (user && pathname.startsWith("/admin")) {
      const userEmail = user.email?.toLowerCase() || "";
      const isKnownAdminEmail = ADMIN_EMAILS.includes(userEmail);

      if (!isKnownAdminEmail) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (
          profile?.role !== "admin" &&
          profile?.role !== "store-admin" &&
          profile?.role !== "super-admin"
        ) {
          url.pathname = "/profile";
          return NextResponse.redirect(url);
        }
      }
    }
  } catch (error) {
    console.error("Middleware auth check exception:", error);
  }

  // Return the Supabase response, containing any modified cookies.
  return supabaseResponse;
}

// Export the configuration object with a matcher to restrict when the middleware runs.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
