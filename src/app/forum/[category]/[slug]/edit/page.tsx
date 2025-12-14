import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ForumPostForm } from "@/components/content/forum-post-form";

const DEVELOPER_ROLES = ["DEVELOPER", "MODERATOR", "ADMIN"];

interface EditForumPostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: EditForumPostPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: `Edit: ${post.title}`,
  };
}

export default async function EditForumPostPage({ params }: EditForumPostPageProps) {
  const { category, slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  const isDeveloper = user ? DEVELOPER_ROLES.includes(user.role) : false;
  const isAuthor = post.authorId === session.user.id;

  if (!isDeveloper && !isAuthor) {
    redirect(`/forum/${category}/${slug}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Edit Discussion
      </h1>
      <ForumPostForm
        post={{
          id: post.id,
          title: post.title,
          body: post.body,
        }}
        categorySlug={category}
        slug={slug}
      />
    </div>
  );
}
