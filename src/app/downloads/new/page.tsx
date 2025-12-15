import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DownloadForm } from "@/components/downloads/download-form";

const EDITOR_ROLES = ["DEVELOPER", "ADMIN"];

export const metadata = {
  title: "Add Download",
  description: "Add a new download",
};

export default async function NewDownloadPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/downloads/new");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !EDITOR_ROLES.includes(user.role)) {
    redirect("/downloads");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Add Download
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Add a new download for users
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <DownloadForm />
      </div>
    </div>
  );
}
