import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { IssueForm } from "@/components/issues/issue-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "New Issue",
  description: "Create a new issue",
};

export default async function NewIssuePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/issues/new");
  }

  const labels = await prisma.label.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Create New Issue</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
        Report a bug or request a feature
      </p>

      <div className="mt-8">
        <IssueForm labels={labels} />
      </div>
    </div>
  );
}
