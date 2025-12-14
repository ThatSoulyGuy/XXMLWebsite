import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getModules, getModuleBySlug } from "@/actions/docs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";
import { ArrowLeft } from "lucide-react";
import { ClassEditorForm } from "@/components/docs/class-editor-form";

interface Props {
  searchParams: Promise<{
    module?: string;
  }>;
}

const DOC_EDITOR_ROLES: UserRole[] = ["DEVELOPER", "ADMIN"];

export const metadata = {
  title: "Create Class - Documentation Editor",
};

export default async function NewClassPage({ searchParams }: Props) {
  const { module: moduleSlug } = await searchParams;

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

  // Get the module if specified
  let module = null;
  if (moduleSlug) {
    module = await getModuleBySlug(moduleSlug);
    if (!module) {
      notFound();
    }
  }

  // Get all modules for the selector
  const modules = await getModules();

  if (modules.length === 0) {
    redirect("/docs/standard-library/editor/new-module");
  }

  // Use the first module if none specified
  if (!module) {
    module = modules[0];
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          href="/docs/standard-library/editor"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Editor
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Create New Class
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Add a new class to the {module.name} module
        </p>

        {modules.length > 1 && (
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Select Module
            </label>
            <div className="flex flex-wrap gap-2">
              {modules.map((m) => (
                <Link
                  key={m.id}
                  href={`/docs/standard-library/editor/new-class?module=${m.slug}`}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    m.slug === module.slug
                      ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {m.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ClassEditorForm moduleId={module.id} moduleSlug={module.slug} />
    </div>
  );
}
