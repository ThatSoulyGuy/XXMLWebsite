import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/posts/post-form";

export const metadata = {
  title: "New Discussion",
  description: "Start a new discussion",
};

export default async function NewForumPostPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/forum/new");
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">New Discussion</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
        Start a discussion with the XXML community
      </p>

      <div className="mt-8">
        <PostForm categories={categories} type="DISCUSSION" />
      </div>
    </div>
  );
}
