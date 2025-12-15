import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSecurityStats, blockIP, unblockIP } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// GET: Retrieve security stats (admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stats = getSecurityStats();

    return NextResponse.json({
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch security stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch security stats" },
      { status: 500 }
    );
  }
}

// POST: Block or unblock an IP (admin only)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { action, ip, duration } = body;

    if (!ip || typeof ip !== "string") {
      return NextResponse.json({ error: "Invalid IP address" }, { status: 400 });
    }

    // Validate IP format (basic check)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$|^([a-fA-F0-9:]+)$/;
    if (!ipRegex.test(ip)) {
      return NextResponse.json({ error: "Invalid IP format" }, { status: 400 });
    }

    if (action === "block") {
      const durationMs = duration ? parseInt(duration) : 3600000; // Default 1 hour
      blockIP(ip, durationMs);
      return NextResponse.json({
        success: true,
        message: `Blocked IP ${ip} for ${durationMs / 1000} seconds`,
      });
    } else if (action === "unblock") {
      unblockIP(ip);
      return NextResponse.json({
        success: true,
        message: `Unblocked IP ${ip}`,
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Security action failed:", error);
    return NextResponse.json(
      { error: "Security action failed" },
      { status: 500 }
    );
  }
}
