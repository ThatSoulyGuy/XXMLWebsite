import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DownloadForm } from "@/components/downloads/download-form";

const EDITOR_ROLES = ["DEVELOPER", "ADMIN"];

interface EditDownloadPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EditDownloadPageProps) {
  const { slug } = await params;
  const download = await prisma.download.findUnique({
    where: { slug },
    select: { name: true },
  });

  if (!download) return { title: "Download Not Found" };

  return {
    title: `Edit ${download.name}`,
    description: `Edit download: ${download.name}`,
  };
}

export default async function EditDownloadPage({ params }: EditDownloadPageProps) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/downloads/${slug}/edit`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !EDITOR_ROLES.includes(user.role)) {
    redirect("/downloads");
  }

  const download = await prisma.download.findUnique({
    where: { slug },
  });

  if (!download) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Edit Download
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Update download information
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <DownloadForm download={download} />
      </div>
    </div>
  );
}
