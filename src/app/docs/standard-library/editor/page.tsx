import { redirect } from "next/navigation";
import Link from "next/link";
import { getModules, deleteModule, deleteClass } from "@/actions/docs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";
import { Plus, Pencil, Trash2, ChevronRight, FolderOpen, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "./delete-button";

const DOC_EDITOR_ROLES: UserRole[] = ["DEVELOPER", "ADMIN"];

export const metadata = {
  title: "Documentation Editor",
  description: "Manage XXML standard library documentation",
};

export default async function EditorDashboardPage() {
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

  const modules = await getModules();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Documentation Editor
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage XXML standard library documentation
          </p>
        </div>
        <Link href="/docs/standard-library/editor/new-module">
          <Button>
            <Plus className="mr-1 h-4 w-4" /> Add Module
          </Button>
        </Link>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <FolderOpen className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            No modules yet
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Get started by creating your first module.
          </p>
          <Link href="/docs/standard-library/editor/new-module" className="mt-4 inline-block">
            <Button>
              <Plus className="mr-1 h-4 w-4" /> Create Module
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              {/* Module Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-blue-500" />
                  <div>
                    <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {module.name}
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {module.slug} &bull; {module.classes.length} class
                      {module.classes.length !== 1 ? "es" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/docs/standard-library/editor/module/${module.slug}`}
                    className="rounded p-1.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                    title="Edit module"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteButton
                    type="module"
                    id={module.id}
                    name={module.name}
                  />
                  <Link href={`/docs/standard-library/editor/new-class?module=${module.slug}`}>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" /> Add Class
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Classes List */}
              {module.classes.length === 0 ? (
                <div className="p-6 text-center">
                  <FileCode className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    No classes in this module yet
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {module.classes.map((cls) => (
                    <li
                      key={cls.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileCode className="h-4 w-4 text-zinc-400" />
                        <div>
                          <Link
                            href={`/docs/standard-library/${module.slug}/${cls.slug}`}
                            className="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                          >
                            {cls.name}
                          </Link>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            /{module.slug}/{cls.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/docs/standard-library/${module.slug}/${cls.slug}/edit`}
                          className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                          title="Edit class"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          type="class"
                          id={cls.id}
                          name={cls.name}
                        />
                        <Link
                          href={`/docs/standard-library/${module.slug}/${cls.slug}`}
                          className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                          title="View class"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
