import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getModuleBySlug } from "@/actions/docs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";
import { ArrowLeft } from "lucide-react";
import { ModuleEditorForm } from "../../module-editor-form";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const DOC_EDITOR_ROLES: UserRole[] = ["DEVELOPER", "ADMIN"];

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const module = await getModuleBySlug(slug);

  if (!module) {
    return { title: "Module Not Found" };
  }

  return {
    title: `Edit ${module.name} - Documentation Editor`,
  };
}

export default async function EditModulePage({ params }: Props) {
  const { slug } = await params;

  // Check authorization
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/docs/standard-library/editor");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !DOC_EDITOR_ROLES.includes(user.role as UserRole)) {
    redirect("/docs/standard-library");
  }

  const module = await getModuleBySlug(slug);
  if (!module) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/docs/standard-library/editor"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Editor
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Edit {module.name} Module
        </h1>
      </div>

      <ModuleEditorForm
        moduleId={module.id}
        initialData={{
          name: module.name,
          slug: module.slug,
          description: module.description,
          importPath: module.importPath,
          sortOrder: module.sortOrder,
        }}
      />
    </div>
  );
}
