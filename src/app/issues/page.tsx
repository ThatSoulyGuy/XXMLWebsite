import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { IssuesList } from "@/components/issues/issues-list";
import { Plus, Loader2 } from "lucide-react";

export const metadata = {
  title: "Issues",
  description: "Track bugs and feature requests for XXML",
};

interface IssuesPageProps {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    q?: string;
  }>;
}

async function IssuesContent({ searchParams }: { searchParams: Promise<{ status?: string; priority?: string; q?: string }> }) {
  const params = await searchParams;

  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.priority) where.priority = params.priority;
  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { body: { contains: params.q } },
    ];
  }

  const issues = await prisma.issue.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, image: true, username: true } },
      labels: { include: { label: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return <IssuesList initialIssues={issues} />;
}

export default async function IssuesPage({ searchParams }: IssuesPageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Issues</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Track bugs, feature requests, and discussions
          </p>
        </div>
        <Button asChild>
          <Link href="/issues/new">
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {/* Filters */}
        <div className="flex items-center gap-4 border-b border-zinc-200 p-4 dark:border-zinc-800">
          <Link
            href="/issues"
            className={`text-sm font-medium ${!params.status ? "text-blue-600" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}
          >
            All
          </Link>
          <Link
            href="/issues?status=OPEN"
            className={`text-sm font-medium ${params.status === "OPEN" ? "text-blue-600" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}
          >
            Open
          </Link>
          <Link
            href="/issues?status=IN_PROGRESS"
            className={`text-sm font-medium ${params.status === "IN_PROGRESS" ? "text-blue-600" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}
          >
            In Progress
          </Link>
          <Link
            href="/issues?status=CLOSED"
            className={`text-sm font-medium ${params.status === "CLOSED" ? "text-blue-600" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}
          >
            Closed
          </Link>
        </div>

        {/* Issue List */}
        <Suspense fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        }>
          <IssuesContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
