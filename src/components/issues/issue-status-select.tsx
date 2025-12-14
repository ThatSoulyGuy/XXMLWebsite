"use client";

import { updateIssueStatus } from "@/actions/issues";
import { useTransition } from "react";

interface IssueStatusSelectProps {
  issueId: string;
  currentStatus: string;
}

export function IssueStatusSelect({ issueId, currentStatus }: IssueStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(async () => {
      await updateIssueStatus(issueId, e.target.value);
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      <option value="OPEN">Open</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="CLOSED">Closed</option>
      <option value="WONT_FIX">Won&apos;t Fix</option>
    </select>
  );
}
