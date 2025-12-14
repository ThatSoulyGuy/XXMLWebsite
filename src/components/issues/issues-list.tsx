"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePolling } from "@/lib/use-polling";
import { IssueCard } from "./issue-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Issue {
  id: string;
  number: number;
  title: string;
  body: string;
  status: string;
  priority: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    username: string | null;
  };
  labels: {
    label: {
      id: string;
      name: string;
      color: string;
    };
  }[];
  _count: {
    comments: number;
  };
}

interface IssuesListProps {
  initialIssues: Issue[];
}

export function IssuesList({ initialIssues }: IssuesListProps) {
  const searchParams = useSearchParams();
  const [issues, setIssues] = useState(initialIssues);

  // Build query string from search params
  const queryString = searchParams.toString();
  const apiUrl = `/api/issues${queryString ? `?${queryString}` : ""}`;

  const handleUpdate = useCallback((data: Issue[]) => {
    if (Array.isArray(data)) {
      setIssues(data);
    }
  }, []);

  // Poll every 5 seconds
  usePolling<Issue[]>({
    url: apiUrl,
    interval: 5000,
    onUpdate: handleUpdate,
  });

  if (issues.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-300">No issues found.</p>
        <Button asChild className="mt-4">
          <Link href="/issues/new">Create the first issue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}
