import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getClassBySlug } from "@/actions/docs";
import { ClassEditorForm } from "@/components/docs/class-editor-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{
    module: string;
    class: string;
  }>;
}

const DOC_EDITOR_ROLES: UserRole[] = ["DEVELOPER", "ADMIN"];

export async function generateMetadata({ params }: Props) {
  const { module: moduleSlug, class: classSlug } = await params;
  const docClass = await getClassBySlug(moduleSlug, classSlug);

  if (!docClass) {
    return { title: "Class Not Found" };
  }

  return {
    title: `Edit ${docClass.name} - Documentation Editor`,
  };
}

export default async function EditClassPage({ params }: Props) {
  const { module: moduleSlug, class: classSlug } = await params;

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

  const docClass = await getClassBySlug(moduleSlug, classSlug);
  if (!docClass) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          href={`/docs/standard-library/${moduleSlug}/${classSlug}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {docClass.name}
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Edit {docClass.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {docClass.module.name} Module
        </p>
      </div>

      <ClassEditorForm
        moduleId={docClass.module.id}
        moduleSlug={moduleSlug}
        classId={docClass.id}
        initialData={{
          name: docClass.name,
          slug: docClass.slug,
          description: docClass.description,
          constraints: docClass.constraints || "",
          methods: docClass.methods.map((m) => ({
            name: m.name,
            category: m.category,
            params: m.params,
            returns: m.returns,
            description: m.description,
            sortOrder: m.sortOrder,
          })),
          examples: docClass.examples.map((e) => ({
            title: e.title || "",
            code: e.code,
            filename: e.filename || "",
            showLines: e.showLines,
            sortOrder: e.sortOrder,
          })),
        }}
      />
    </div>
  );
}
