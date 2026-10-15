import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CampusHub — Next.js Middleware
 * - Enforces authentication on protected routes
 * - RBAC redirect guards (admin-only routes)
 * - Sets `x-pathname` header for server component awareness
 */

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/auth/sign-in",
  "/auth/error",
  "/auth/verify",
  "/offline",
  "/api/auth",
];

// Routes restricted to ADMIN role
const ADMIN_ROUTES = ["/admin"];

// Routes restricted to ADMIN or SECURITY role
const SECURITY_ROUTES = ["/safety/sos-dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through public routes and static files
  const isPublic =
    PUBLIC_ROUTES.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|woff2?|ttf|otf|css|js)$/);

  if (isPublic) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  const session = await auth();

  if (!session) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // RBAC checks
  const role = session.user?.role;

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    SECURITY_ROUTES.some((r) => pathname.startsWith(r)) &&
    role !== "ADMIN" &&
    role !== "SECURITY"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
