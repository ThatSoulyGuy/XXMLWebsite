import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatRelativeDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostCommentForm } from "@/components/posts/post-comment-form";
import { PostCommentCard } from "@/components/posts/post-comment-card";
import { ManagementButton } from "@/components/content/management-button";
import { DeletePostButton } from "@/components/content/delete-post-button";
import { PinPostButton } from "@/components/content/pin-post-button";
import { incrementViewCount } from "@/actions/posts";
import { Pencil } from "lucide-react";

const DEVELOPER_ROLES = ["DEVELOPER", "MODERATOR", "ADMIN"];

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const session = await auth();

  let canManage = false;
  let isAuthor = false;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    canManage = user ? DEVELOPER_ROLES.includes(user.role) : false;
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      comments: {
        include: {
          author: true,
          revisions: {
            include: { editor: { select: { name: true, username: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Check if current user is the author
  isAuthor = session?.user?.id === post.authorId;
  const canEdit = canManage || isAuthor;

  // Increment view count
  await incrementViewCount(post.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Badge color={post.category.color} className="mb-3">
            {post.category.name}
          </Badge>
          <div className="flex items-center gap-2">
            {/* Author controls - always visible to post author */}
            {isAuthor && (
              <>
                <Link href={`/forum/${category}/${slug}/edit`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                </Link>
                <DeletePostButton postId={post.id} postType="forum" />
              </>
            )}
            {/* Moderator controls - hidden in preview mode */}
            {canManage && !isAuthor && (
              <ManagementButton>
                <div className="flex items-center gap-2">
                  <Link href={`/forum/${category}/${slug}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-1 h-3 w-3" /> Edit
                    </Button>
                  </Link>
                  <DeletePostButton postId={post.id} postType="forum" />
                </div>
              </ManagementButton>
            )}
            {/* Pin button - only for moderators, hidden in preview mode */}
            {canManage && (
              <ManagementButton>
                <PinPostButton postId={post.id} isPinned={post.isPinned} />
              </ManagementButton>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h1>

        <div className="mt-4 flex items-center gap-3">
          <Avatar src={post.author.image} name={post.author.name || "User"} size="md" />
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {post.author.username || post.author.name}
            </p>
            <p className="text-sm text-zinc-500">
              Posted {formatRelativeDate(post.createdAt)} &middot; {post.viewCount} views
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          {post.body.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Replies ({post.comments.length})
        </h2>

        <div className="mt-4 space-y-4">
          {post.comments.map((comment) => {
            const canEditComment = canManage || comment.authorId === session?.user?.id;
            const canDeleteComment = canManage || comment.authorId === session?.user?.id;
            return (
              <PostCommentCard
                key={comment.id}
                comment={comment}
                canEdit={canEditComment}
                canDelete={canDeleteComment}
              />
            );
          })}
        </div>

        {session?.user ? (
          <div className="mt-6">
            <PostCommentForm postId={post.id} />
          </div>
        ) : (
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-300">
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>{" "}
            to reply.
          </p>
        )}
      </div>
    </div>
  );
}
