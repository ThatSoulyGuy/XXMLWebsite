import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Prevent caching so sidebar always shows latest data
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check if the model exists
    const modules = await prisma.docModule.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        classes: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch modules:", errorMessage);
    return NextResponse.json(
      { error: `Failed to fetch modules: ${errorMessage}` },
      { status: 500 }
    );
  }
}
