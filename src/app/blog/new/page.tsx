import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "../blog-post-form";

const DEVELOPER_ROLES = ["DEVELOPER", "MODERATOR", "ADMIN"];

export const metadata = {
  title: "New Blog Post",
  description: "Create a new blog post",
};

export default async function NewBlogPostPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/blog/new");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !DEVELOPER_ROLES.includes(user.role)) {
    redirect("/blog");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          New Blog Post
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Create a new blog post for the XXML community
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <BlogPostForm />
      </div>
    </div>
  );
}
