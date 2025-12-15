import { NextRequest, NextResponse } from "next/server";

// Log blocked requests for security monitoring
function logBlockedRequest(request: NextRequest, reason: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
             request.headers.get("x-real-ip") ||
             "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const path = request.nextUrl.pathname;

  console.warn(`[SECURITY] Blocked request: ${reason}`, {
    ip,
    path,
    userAgent: userAgent.substring(0, 100),
    timestamp: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  logBlockedRequest(request, "Attempted access to sensitive file");

  return new NextResponse(null, {
    status: 403,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function POST(request: NextRequest) {
  logBlockedRequest(request, "POST to blocked endpoint");
  return new NextResponse(null, { status: 403 });
}

export async function PUT(request: NextRequest) {
  logBlockedRequest(request, "PUT to blocked endpoint");
  return new NextResponse(null, { status: 403 });
}

export async function DELETE(request: NextRequest) {
  logBlockedRequest(request, "DELETE to blocked endpoint");
  return new NextResponse(null, { status: 403 });
}
