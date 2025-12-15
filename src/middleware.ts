import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/docs", "/downloads", "/blog", "/forum", "/issues", "/privacy", "/terms"];
const authRoutes = ["/login", "/signup"];
const developerRoutes = ["/docs/standard-library/editor"];
const DOC_EDITOR_ROLES = ["DEVELOPER", "ADMIN"];

// ============================================
// EDGE-COMPATIBLE SECURITY LAYER
// ============================================

// Blocked path patterns (attacks, exploits, scanners)
const BLOCKED_PATHS = [
  /\.env/i,
  /\.git/i,
  /\.svn/i,
  /\.htaccess/i,
  /wp-admin/i,
  /wp-login/i,
  /wp-includes/i,
  /wp-content/i,
  /xmlrpc\.php/i,
  /phpmyadmin/i,
  /adminer/i,
  /mysql/i,
  /\.sql/i,
  /shell/i,
  /eval\(/i,
  /passwd/i,
  /etc\/shadow/i,
  /proc\/self/i,
  /cgi-bin/i,
  /\.asp/i,
  /\.aspx/i,
  /\.jsp/i,
  /\.php/i,
  /\.cgi/i,
  /config\.json/i,
  /package\.json/i,
  /composer\.json/i,
  /\.pem/i,
  /\.key/i,
  /id_rsa/i,
  /\.bak/i,
  /\.backup/i,
  /\.old/i,
  /\.orig/i,
  /\.save/i,
  /\.swp/i,
  /~$/,
];

// Malicious user agents (known attack tools)
const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /openvas/i,
  /w3af/i,
  /acunetix/i,
  /netsparker/i,
  /qualys/i,
  /masscan/i,
  /zgrab/i,
  /gobuster/i,
  /dirbuster/i,
  /wpscan/i,
  /joomscan/i,
  /havij/i,
  /webshag/i,
  /fimap/i,
  /grabber/i,
  /metasploit/i,
  /core-security/i,
  /hydra/i,
  /medusa/i,
];

// Simple edge-compatible rate limiter (per-request check)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function edgeRateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean up old entries periodically (every 1000 checks)
  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!entry || entry.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  entry.count++;
  if (entry.count > limit) {
    return false;
  }

  return true;
}

function getClientIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  return "unknown";
}

function isBlockedPath(pathname: string): boolean {
  return BLOCKED_PATHS.some((pattern) => pattern.test(pathname));
}

function isBlockedUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BLOCKED_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

export default auth((req) => {
  const { nextUrl, headers } = req;
  const pathname = nextUrl.pathname;
  const userAgent = headers.get("user-agent");
  const clientIP = getClientIP(req);

  // ============================================
  // SECURITY CHECKS (run first)
  // ============================================

  // Block malicious user agents
  if (isBlockedUserAgent(userAgent)) {
    console.warn(`[SECURITY] Blocked malicious user agent from ${clientIP}: ${userAgent?.substring(0, 50)}`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Block suspicious paths
  if (isBlockedPath(pathname)) {
    console.warn(`[SECURITY] Blocked suspicious path from ${clientIP}: ${pathname}`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Rate limiting (100 requests per minute per IP)
  if (!edgeRateLimit(clientIP)) {
    console.warn(`[SECURITY] Rate limited ${clientIP}`);
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    });
  }

  // ============================================
  // AUTHENTICATION & ROUTING LOGIC
  // ============================================

  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const userUsername = req.auth?.user?.username;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = authRoutes.includes(pathname);
  const isDeveloperRoute = developerRoutes.some((route) => pathname.startsWith(route));
  const isDocEditRoute = /^\/docs\/standard-library\/[^/]+\/[^/]+\/edit/.test(pathname);
  const isApiRoute = pathname.startsWith("/api");
  const isUserSetup = pathname === "/user/setup";

  // Allow API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    // If user doesn't have username, send to setup
    if (!userUsername) {
      return NextResponse.redirect(new URL("/user/setup", nextUrl));
    }
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Protect non-public routes
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  // Require username setup for logged-in users (except on setup page, API routes, and specific public paths)
  if (isLoggedIn && !userUsername && !isUserSetup) {
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
