import { DocsSidebar } from "@/components/docs/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-12 lg:gap-16">
        <DocsSidebar />
        <main className="min-w-0 flex-1 py-8 lg:py-12">
          <article className="prose prose-zinc dark:prose-invert max-w-none lg:max-w-3xl">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}
