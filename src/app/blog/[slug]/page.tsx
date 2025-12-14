import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ManagementButton } from "@/components/content/management-button";
import { DeletePostButton } from "@/components/content/delete-post-button";
import { incrementViewCount } from "@/actions/posts";
import { Pencil } from "lucide-react";

const DEVELOPER_ROLES = ["DEVELOPER", "MODERATOR", "ADMIN"];

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, type: "BLOG" },
    select: { title: true, excerpt: true },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const session = await auth();
  let canEdit = false;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    canEdit = user ? DEVELOPER_ROLES.includes(user.role) : false;
  }

  const post = await prisma.post.findUnique({
    where: { slug, type: "BLOG" },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  await incrementViewCount(post.id);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <time className="text-sm text-zinc-500">{formatDate(post.createdAt)}</time>
          {canEdit && (
            <ManagementButton>
              <div className="flex items-center gap-2">
                <Link href={`/blog/${slug}/edit`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                </Link>
                <DeletePostButton postId={post.id} postType="blog" />
              </div>
            </ManagementButton>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <Avatar src={post.author.image} name={post.author.name || "User"} size="md" />
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {post.author.username || post.author.name}
            </p>
            <p className="text-sm text-zinc-500">{post.viewCount} views</p>
          </div>
        </div>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        {post.body.split("\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
