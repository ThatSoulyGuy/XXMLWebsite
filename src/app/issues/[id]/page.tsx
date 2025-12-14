import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatRelativeDate, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { IssuePriorityBadge } from "@/components/issues/issue-priority-badge";
import { IssueCommentForm } from "@/components/issues/issue-comment-form";
import { IssueStatusSelect } from "@/components/issues/issue-status-select";
import { IssueDeleteButton } from "@/components/issues/issue-delete-button";
import { IssueBodyViewer } from "@/components/issues/issue-body-viewer";
import { IssueCommentCard } from "@/components/issues/issue-comment-card";

const ISSUE_MANAGER_ROLES = ["DEVELOPER", "ADMIN"];
const COMMENT_MANAGER_ROLES = ["DEVELOPER", "MODERATOR", "ADMIN"];

interface IssuePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: IssuePageProps) {
  const { id } = await params;
  const issue = await prisma.issue.findFirst({
    where: { OR: [{ id }, { number: parseInt(id) || 0 }] },
    select: { title: true, number: true },
  });

  if (!issue) return { title: "Issue Not Found" };

  return {
    title: `#${issue.number} - ${issue.title}`,
    description: `Issue #${issue.number}`,
  };
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { id } = await params;
  const session = await auth();

  const issue = await prisma.issue.findFirst({
    where: { OR: [{ id }, { number: parseInt(id) || 0 }] },
    include: {
      author: true,
      labels: { include: { label: true } },
      comments: {
        include: {
          author: true,
          revisions: {
            include: { editor: { select: { name: true, username: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      revisions: {
        orderBy: { createdAt: "asc" },
        take: 1, // Get oldest (original)
      },
    },
  });

  if (!issue) {
    notFound();
  }

  // Fetch current user role from database for accurate permissions
  let userRole: string | null = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    userRole = user?.role || null;
  }

  const isAuthor = session?.user?.id === issue.authorId;
  const isManager = userRole ? ISSUE_MANAGER_ROLES.includes(userRole) : false;
  const canModify = isAuthor || isManager;
  const canManageComments = userRole ? COMMENT_MANAGER_ROLES.includes(userRole) : false;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {issue.title}
            <span className="ml-2 text-zinc-400">#{issue.number}</span>
          </h1>
          {canModify && (
            <div className="flex items-center gap-2">
              <IssueStatusSelect issueId={issue.id} currentStatus={issue.status} />
              {isManager && <IssueDeleteButton issueId={issue.id} />}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <IssueStatusBadge status={issue.status} />
          <IssuePriorityBadge priority={issue.priority} />
          {issue.labels.map(({ label }) => (
            <Badge key={label.id} color={label.color}>
              {label.name}
            </Badge>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-300">
          <Avatar src={issue.author.image} name={issue.author.name || "User"} size="sm" />
          <span>
            <strong>{issue.author.username || issue.author.name}</strong> opened this issue{" "}
            {formatRelativeDate(issue.createdAt)}
          </span>
          {issue.closedAt && (
            <span className="text-zinc-500">
              &middot; Closed {formatDate(issue.closedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <IssueBodyViewer
        issue={{
          id: issue.id,
          title: issue.title,
          body: issue.body,
          priority: issue.priority,
          showOriginal: issue.showOriginal,
        }}
        originalRevision={issue.revisions[0] || null}
        isManager={isManager}
        hasBeenEdited={issue.revisions.length > 0}
        canEdit={canModify}
      />

      {/* Comments */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Comments ({issue.comments.length})
        </h2>

        <div className="mt-4 space-y-4">
          {issue.comments.map((comment) => {
            const canEditComment = canManageComments || comment.authorId === session?.user?.id;
            const canDeleteComment = canManageComments || comment.authorId === session?.user?.id;
            return (
              <IssueCommentCard
                key={comment.id}
                comment={comment}
                canEdit={canEditComment}
                canDelete={canDeleteComment}
              />
            );
          })}
        </div>

        {session?.user ? (
          <div className="mt-6">
            <IssueCommentForm issueId={issue.id} />
          </div>
        ) : (
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-300">
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>{" "}
            to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
}
