import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ForumPostsList } from "@/components/forum/forum-posts-list";
import { Plus, Loader2 } from "lucide-react";

export const metadata = {
  title: "Forum",
  description: "Discuss XXML with the community",
};

async function ForumContent() {
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

  return <ForumPostsList initialCategories={categories} initialPosts={recentPosts} />;
}

export default async function ForumPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Community Forum</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Discuss XXML, share projects, and get help
          </p>
        </div>
        <Button asChild>
          <Link href={session?.user ? "/forum/new" : "/login"}>
            <Plus className="mr-2 h-4 w-4" />
            New Discussion
          </Link>
        </Button>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      }>
        <ForumContent />
      </Suspense>
    </div>
  );
}
