import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { IssueStatusBadge } from "./issue-status-badge";
import { IssuePriorityBadge } from "./issue-priority-badge";
import { MessageSquare } from "lucide-react";

interface IssueCardProps {
  issue: {
    id: string;
    number: number;
    title: string;
    status: string;
    priority: string;
    createdAt: Date;
    author: {
      name: string | null;
      image: string | null;
      username: string | null;
    };
    labels: Array<{ label: { id: string; name: string; color: string } }>;
    _count: { comments: number };
  };
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="flex items-start gap-4 border-b border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
      <IssueStatusBadge status={issue.status} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/issues/${issue.number}`}
            className="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100"
          >
            {issue.title}
          </Link>
          {issue.labels.map(({ label }) => (
            <Badge key={label.id} color={label.color}>
              {label.name}
            </Badge>
          ))}
        </div>

        <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
          <span>#{issue.number}</span>
          <span>opened {formatRelativeDate(issue.createdAt)}</span>
          <span>by {issue.author.username || issue.author.name}</span>
          {issue._count.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {issue._count.comments}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <IssuePriorityBadge priority={issue.priority} />
        <Avatar src={issue.author.image} name={issue.author.name || "User"} size="sm" />
      </div>
    </div>
  );
}
