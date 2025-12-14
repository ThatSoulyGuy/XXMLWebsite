import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [categories, recentPosts] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { posts: true } } },
      }),
      prisma.post.findMany({
        where: { status: "PUBLISHED", type: { in: ["DISCUSSION", "QUESTION"] } },
        include: {
          author: { select: { name: true, image: true, username: true } },
          category: true,
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({ categories, recentPosts });
  } catch (error) {
    console.error("Failed to fetch forum data:", error);
    return NextResponse.json(
      { error: "Failed to fetch forum data" },
      { status: 500 }
    );
  }
}
