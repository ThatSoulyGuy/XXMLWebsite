"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const ISSUE_MANAGER_ROLES = ["DEVELOPER", "ADMIN"];

const issueSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  body: z.string().min(20, "Description must be at least 20 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

export async function createIssue(prevState: { error: string | null }, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to create an issue" };
  }

  const validated = issueSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    priority: formData.get("priority"),
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { title, body, priority } = validated.data;
  const labelIds = formData.getAll("labelIds") as string[];

  // Get next issue number
  const lastIssue = await prisma.issue.findFirst({
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const nextNumber = (lastIssue?.number || 0) + 1;

  await prisma.issue.create({
    data: {
      number: nextNumber,
      title,
      body,
      priority,
      authorId: session.user.id,
      labels: labelIds.length
        ? { create: labelIds.map((labelId) => ({ labelId })) }
        : undefined,
    },
  });

  revalidatePath("/issues");
  return { error: null };
}

export async function updateIssueStatus(issueId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Check if user is author or has manager role
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { authorId: true },
  });

  if (!issue) {
    return { error: "Issue not found" };
  }

  const isAuthor = issue.authorId === session.user.id;
  const isManager = ISSUE_MANAGER_ROLES.includes(session.user.role || "");

  if (!isAuthor && !isManager) {
    return { error: "You don't have permission to modify this issue" };
  }

  await prisma.issue.update({
    where: { id: issueId },
    data: {
      status,
      closedAt: status === "CLOSED" ? new Date() : null,
    },
  });

  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
  return { error: null };
}

export async function updateIssue(
  issueId: string,
  data: { title?: string; body?: string; priority?: string }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { authorId: true, title: true, body: true, priority: true },
  });

  if (!issue) {
    return { error: "Issue not found" };
  }

  const isAuthor = issue.authorId === session.user.id;
  const isManager = ISSUE_MANAGER_ROLES.includes(session.user.role || "");

  if (!isAuthor && !isManager) {
    return { error: "You don't have permission to modify this issue" };
  }

  // Check if content actually changed
  const hasChanges =
    (data.title && data.title !== issue.title) ||
    (data.body && data.body !== issue.body) ||
    (data.priority && data.priority !== issue.priority);

  if (hasChanges) {
    // Save current version as a revision before updating
    await prisma.issueRevision.create({
      data: {
        issueId,
        title: issue.title,
        body: issue.body,
        priority: issue.priority,
        editorId: session.user.id,
      },
    });
  }

  await prisma.issue.update({
    where: { id: issueId },
    data,
  });

  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
  return { error: null };
}

export async function toggleShowOriginal(issueId: string, showOriginal: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Only managers can toggle this
  const isManager = ISSUE_MANAGER_ROLES.includes(session.user.role || "");
  if (!isManager) {
    return { error: "Only developers and admins can toggle original view" };
  }

  await prisma.issue.update({
    where: { id: issueId },
    data: { showOriginal },
  });

  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
  return { error: null };
}

export async function revertToOriginal(issueId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Only managers can revert
  const isManager = ISSUE_MANAGER_ROLES.includes(session.user.role || "");
  if (!isManager) {
    return { error: "Only developers and admins can revert issues" };
  }

  // Get the oldest revision (the original)
  const originalRevision = await prisma.issueRevision.findFirst({
    where: { issueId },
    orderBy: { createdAt: "asc" },
  });

  if (!originalRevision) {
    return { error: "No original version found" };
  }

  // Revert to original
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      title: originalRevision.title,
      body: originalRevision.body,
      priority: originalRevision.priority,
      showOriginal: false,
    },
  });

  // Delete all revisions since we've reverted
  await prisma.issueRevision.deleteMany({
    where: { issueId },
  });

  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
  return { error: null };
}

export async function deleteIssue(issueId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Only managers (DEVELOPER, ADMIN) can delete issues
  const isManager = ISSUE_MANAGER_ROLES.includes(session.user.role || "");

  if (!isManager) {
    return { error: "Only developers and admins can delete issues" };
  }

  await prisma.issue.delete({
    where: { id: issueId },
  });

  revalidatePath("/issues");
  return { error: null };
}

export async function addIssueComment(issueId: string, body: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!body || body.trim().length < 1) {
    return { error: "Comment cannot be empty" };
  }

  await prisma.issueComment.create({
    data: {
      body: body.trim(),
      issueId,
      authorId: session.user.id,
    },
  });

  revalidatePath(`/issues/${issueId}`);
  return { error: null };
}

const COMMENT_MANAGER_ROLES = ["DEVELOPER", "MODERATOR", "ADMIN"];

export async function editIssueComment(commentId: string, newBody: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!newBody || newBody.trim().length < 1) {
    return { error: "Comment cannot be empty" };
  }

  const comment = await prisma.issueComment.findUnique({
    where: { id: commentId },
    select: { authorId: true, issueId: true, body: true },
  });

  if (!comment) {
    return { error: "Comment not found" };
  }

  // Check if user is author or has manager role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const isAuthor = comment.authorId === session.user.id;
  const isManager = user ? COMMENT_MANAGER_ROLES.includes(user.role) : false;

  if (!isAuthor && !isManager) {
    return { error: "You don't have permission to edit this comment" };
  }

  // Check if content actually changed
  if (newBody.trim() !== comment.body) {
    // Save current version as a revision before updating
    await prisma.issueCommentRevision.create({
      data: {
        body: comment.body,
        commentId,
        editorId: session.user.id,
      },
    });
  }

  await prisma.issueComment.update({
    where: { id: commentId },
    data: { body: newBody.trim() },
  });

  revalidatePath(`/issues/${comment.issueId}`);
  return { error: null };
}

export async function deleteIssueComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const comment = await prisma.issueComment.findUnique({
    where: { id: commentId },
    select: { authorId: true, issueId: true },
  });

  if (!comment) {
    return { error: "Comment not found" };
  }

  // Check if user is author or has manager role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const isAuthor = comment.authorId === session.user.id;
  const isManager = user ? COMMENT_MANAGER_ROLES.includes(user.role) : false;

  if (!isAuthor && !isManager) {
    return { error: "You don't have permission to delete this comment" };
  }

  await prisma.issueComment.delete({
    where: { id: commentId },
  });

  revalidatePath(`/issues/${comment.issueId}`);
  return { error: null };
}
