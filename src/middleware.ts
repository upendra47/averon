import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;

  // Helper: check if route is protected and apply redirect
  function protectedRedirect(targetPath: string) {
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    // Env vars missing — fail open only for public routes, protect admin/dashboard
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
      return protectedRedirect("/auth/login");
    }
    return supabaseResponse;
  }

  let user: { id: string } | null = null;
  let userRole = "user";

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    });

    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;

    if (user) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .is("revoked_at", null)
        .single();
      if (roleData?.role) {
        userRole = roleData.role;
      }
    }
  } catch (err) {
    // Supabase client failed (e.g. key format, network) — treat as unauthenticated
    console.error("[middleware] Supabase auth error:", err);
    user = null;
    userRole = "user";
  }

  // Route protection
  if (pathname.startsWith("/admin/manage-admins")) {
    if (!user || userRole !== "developer") {
      return protectedRedirect("/");
    }
  } else if (pathname.startsWith("/admin")) {
    if (!user || (userRole !== "admin" && userRole !== "developer")) {
      return protectedRedirect("/");
    }
  } else if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return protectedRedirect("/auth/login");
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth).*)",
  ],
};
