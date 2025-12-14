import { notFound } from "next/navigation";
import Link from "next/link";
import { getClassBySlug, getClassesByModule } from "@/actions/docs";
import { CodeBlock } from "@/components/docs/code-block";
import { ClassHeader } from "@/components/docs/class-header";
import { MethodTable } from "@/components/docs/method-table";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";
import { Pencil } from "lucide-react";

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
    title: `${docClass.name} - ${docClass.module.name} Module`,
    description: docClass.description,
  };
}

export default async function ClassPage({ params }: Props) {
  const { module: moduleSlug, class: classSlug } = await params;
  const docClass = await getClassBySlug(moduleSlug, classSlug);

  if (!docClass) {
    notFound();
  }

  // Check if user can edit
  const session = await auth();
  let canEdit = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    canEdit = user ? DOC_EDITOR_ROLES.includes(user.role as UserRole) : false;
  }

  // Get sibling classes for "See Also" section
  const siblingClasses = await getClassesByModule(moduleSlug);
  const otherClasses = siblingClasses.filter((c) => c.slug !== classSlug);

  // Group methods by category
  const methodsByCategory: Record<string, typeof docClass.methods> = {};
  for (const method of docClass.methods) {
    const category = method.category || "Methods";
    if (!methodsByCategory[category]) {
      methodsByCategory[category] = [];
    }
    methodsByCategory[category].push(method);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/docs/standard-library"
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Standard Library
          </Link>
          <span>/</span>
          <span className="text-zinc-700 dark:text-zinc-300">
            {docClass.module.name}
          </span>
          <span>/</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {docClass.name}
          </span>
        </nav>

        {canEdit && (
          <Link
            href={`/docs/standard-library/${moduleSlug}/${classSlug}/edit`}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        )}
      </div>

      <h1>{docClass.name}</h1>
      <p className="lead">{docClass.description}</p>

      {docClass.constraints && (
        <div className="not-prose my-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-semibold">Type Constraints:</span>{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900/50">
              {docClass.constraints}
            </code>
          </p>
        </div>
      )}

      <CodeBlock language="xxml">{docClass.module.importPath}</CodeBlock>

      {/* Method tables grouped by category */}
      {Object.entries(methodsByCategory).map(([category, methods]) => (
        <div key={category}>
          <h2>{category}</h2>
          <MethodTable
            methods={methods.map((m) => ({
              name: m.name,
              params: m.params,
              returns: m.returns,
              description: m.description,
            }))}
          />
        </div>
      ))}

      {/* Code examples */}
      {docClass.examples.length > 0 && (
        <>
          <h2>Examples</h2>
          {docClass.examples.map((example, index) => (
            <div key={example.id} className="mt-4">
              {example.title && <h3>{example.title}</h3>}
              <CodeBlock
                language="xxml"
                filename={example.filename || undefined}
                showLineNumbers={example.showLines}
              >
                {example.code}
              </CodeBlock>
            </div>
          ))}
        </>
      )}

      {/* See Also section */}
      {otherClasses.length > 0 && (
        <>
          <h2>See Also</h2>
          <div className="not-prose mt-4 flex flex-wrap gap-2">
            {otherClasses.map((cls) => (
              <Link
                key={cls.id}
                href={`/docs/standard-library/${moduleSlug}/${cls.slug}`}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                {cls.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
