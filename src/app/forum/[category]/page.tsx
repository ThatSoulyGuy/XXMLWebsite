import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatRelativeDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Pin, Eye, ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = await prisma.category.findFirst({
    where: { slug: categorySlug },
    select: { name: true, description: true },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: category.name,
    description: category.description || `Discussions in ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const session = await auth();

  const category = await prisma.category.findFirst({
    where: { slug: categorySlug },
  });

  if (!category) {
    notFound();
  }

  const posts = await prisma.post.findMany({
    where: {
      categoryId: category.id,
      status: "PUBLISHED",
      type: { in: ["DISCUSSION", "QUESTION"] },
    },
    include: {
      author: { select: { name: true, image: true, username: true } },
      _count: { select: { comments: true } },
    },
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/forum"
          className="mb-4 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Forum
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {category.name}
              </h1>
            </div>
            {category.description && (
              <p className="mt-2 text-zinc-500 dark:text-zinc-300">
                {category.description}
              </p>
            )}
          </div>
          <Button asChild>
            <Link href={session?.user ? "/forum/new" : "/login"}>
              <Plus className="mr-2 h-4 w-4" />
              New Discussion
            </Link>
          </Button>
        </div>
      </div>

      {/* Posts */}
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/forum/${categorySlug}/${post.slug}`}
              className="flex items-start gap-4 border-b border-zinc-200 p-4 transition-colors last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
            >
              <Avatar src={post.author.image} name={post.author.name || "User"} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {post.isPinned && <Pin className="h-4 w-4 text-orange-500" />}
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</h3>
                </div>
                {post.excerpt && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-300">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500">
                  <span>{post.author.username || post.author.name}</span>
                  <span>{formatRelativeDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {post._count.comments}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-zinc-500 dark:text-zinc-300">No discussions in this category yet.</p>
            <Button asChild className="mt-4">
              <Link href="/forum/new">Start the first discussion</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
