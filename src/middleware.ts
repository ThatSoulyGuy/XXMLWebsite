import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/docs", "/blog"];
const authRoutes = ["/login", "/signup"];
const developerRoutes = ["/docs/standard-library/editor"];
const DOC_EDITOR_ROLES = ["DEVELOPER", "ADMIN"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const userUsername = req.auth?.user?.username;

  const isPublicRoute = publicRoutes.some(
    (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isDeveloperRoute = developerRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isDocEditRoute = /^\/docs\/standard-library\/[^/]+\/[^/]+\/edit/.test(nextUrl.pathname);
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isUserSetup = nextUrl.pathname === "/user/setup";

  // Allow API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Protect non-public routes
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  // Require username setup for logged-in users (except on setup page)
  if (isLoggedIn && !userUsername && !isUserSetup && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/user/setup", nextUrl));
  }

  // Redirect away from setup page if username is already set
  if (isLoggedIn && userUsername && isUserSetup) {
    return NextResponse.redirect(new URL("/user/profile", nextUrl));
  }

  // Note: Admin routes are protected by the admin layout which checks role from database

  // Protect developer routes (editor and edit pages) - only DEVELOPER and ADMIN can edit docs
  if (isDeveloperRoute || isDocEditRoute) {
    if (!userRole || !DOC_EDITOR_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL("/docs/standard-library", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
