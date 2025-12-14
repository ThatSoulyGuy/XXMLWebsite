import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "../../blog-post-form";

const DEVELOPER_ROLES = ["DEVELOPER", "MODERATOR", "ADMIN"];

export const metadata = {
  title: "Edit Blog Post",
  description: "Edit blog post",
};

interface EditBlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/blog/${slug}/edit`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !DEVELOPER_ROLES.includes(user.role)) {
    redirect(`/blog/${slug}`);
  }

  const post = await prisma.post.findFirst({
    where: { slug, type: "BLOG" },
    select: {
      id: true,
      title: true,
      body: true,
      excerpt: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Edit Blog Post
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Make changes to your blog post
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <BlogPostForm post={post} />
      </div>
    </div>
  );
}
