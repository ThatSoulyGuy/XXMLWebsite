import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ManagementButton } from "@/components/content/management-button";
import { BlogPostsList } from "@/components/blog/blog-posts-list";
import { Plus, Loader2 } from "lucide-react";

const DEVELOPER_ROLES = ["DEVELOPER", "MODERATOR", "ADMIN"];

export const metadata = {
  title: "Blog",
  description: "News and updates about XXML",
};

async function BlogContent() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", type: "BLOG" },
    include: {
      author: { select: { name: true, image: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return <BlogPostsList initialPosts={posts} />;
}

export default async function BlogPage() {
  const session = await auth();
  let canCreatePost = false;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    canCreatePost = user ? DEVELOPER_ROLES.includes(user.role) : false;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Blog</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-300">
            News, updates, and announcements about XXML
          </p>
        </div>
        {canCreatePost && (
          <ManagementButton>
            <Link href="/blog/new">
              <Button>
                <Plus className="mr-1 h-4 w-4" /> New Post
              </Button>
            </Link>
          </ManagementButton>
        )}
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      }>
        <BlogContent />
      </Suspense>
    </div>
  );
}
