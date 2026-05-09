import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mi_admin_session";

// Paths that require admin authentication (login page excluded)
const PROTECTED_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";

/**
 * Lightweight session check for Edge Runtime.
 * We only verify that the cookie exists and has the correct structure
 * (username.expiresAt.signature). Full cryptographic verification
 * happens inside the route handlers via `requireAdmin()`.
 */
function hasValidSessionCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return false;
  const [, expiresAtText] = parts;
  const expiresAt = Number(expiresAtText);
  if (!expiresAt || isNaN(expiresAt)) return false;
  // Check expiry without crypto
  return expiresAt > Math.floor(Date.now() / 1000);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPath = pathname === LOGIN_PATH;
  const isAdminPath = pathname.startsWith(PROTECTED_PREFIX);

  // Only intercept admin paths
  if (!isAdminPath) return NextResponse.next();

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const isLoggedIn = hasValidSessionCookie(sessionCookie);

  // Protected admin page (not login) with no valid session → redirect to login
  if (!isLoginPath && !isLoggedIn) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in and visiting login page → redirect to dashboard
  if (isLoginPath && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
