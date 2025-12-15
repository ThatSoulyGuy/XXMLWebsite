"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  getSecurityContext,
  requireAuth,
  requireOwnerOrRole,
  requireRole,
  handleSecurityError,
  ROLES,
  validateId,
} from "@/lib/security";
import { checkRateLimit, RateLimiters, handleRateLimitError } from "@/lib/rate-limit";
import { z } from "zod";

const issueSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  body: z.string().min(20, "Description must be at least 20 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

export async function createIssue(prevState: { error: string | null }, formData: FormData) {
  try {
    const user = await requireAuth();

    // Rate limiting per user
    const rateLimitResult = checkRateLimit(user.id, RateLimiters.createIssue);
    if (!rateLimitResult.success) {
      return { error: `Too many issues created. Try again in ${rateLimitResult.retryAfterSeconds} seconds.` };
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
        authorId: user.id,
        labels: labelIds.length
          ? { create: labelIds.map((labelId) => ({ labelId })) }
          : undefined,
      },
    });

    revalidatePath("/issues");
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function updateIssueStatus(issueId: string, status: string) {
  try {
    const id = validateId(issueId, "Issue ID");

    const issue = await prisma.issue.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!issue) {
      return { error: "Issue not found" };
    }

    // Verify permission: owner or developer/admin
    await requireOwnerOrRole(issue.authorId, ROLES.DEVELOPERS);

    await prisma.issue.update({
      where: { id },
      data: {
        status,
        closedAt: status === "CLOSED" ? new Date() : null,
      },
    });

    revalidatePath("/issues");
    revalidatePath(`/issues/${id}`);
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function updateIssue(
  issueId: string,
  data: { title?: string; body?: string; priority?: string }
) {
  try {
    const id = validateId(issueId, "Issue ID");

    const issue = await prisma.issue.findUnique({
      where: { id },
      select: { authorId: true, title: true, body: true, priority: true },
    });

    if (!issue) {
      return { error: "Issue not found" };
    }

    // Verify permission: owner or developer/admin
    const user = await requireOwnerOrRole(issue.authorId, ROLES.DEVELOPERS);

    // Check if content actually changed
    const hasChanges =
      (data.title && data.title !== issue.title) ||
      (data.body && data.body !== issue.body) ||
      (data.priority && data.priority !== issue.priority);

    if (hasChanges) {
      // Save current version as a revision before updating
      await prisma.issueRevision.create({
        data: {
          issueId: id,
          title: issue.title,
          body: issue.body,
          priority: issue.priority,
          editorId: user.id,
        },
      });
    }

    await prisma.issue.update({
      where: { id },
      data,
    });

    revalidatePath("/issues");
    revalidatePath(`/issues/${id}`);
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function toggleShowOriginal(issueId: string, showOriginal: boolean) {
  try {
    const id = validateId(issueId, "Issue ID");

    // Only developers/admins can toggle this
    await requireRole(ROLES.DEVELOPERS);

    await prisma.issue.update({
      where: { id },
      data: { showOriginal },
    });

    revalidatePath("/issues");
    revalidatePath(`/issues/${id}`);
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function revertToOriginal(issueId: string) {
  try {
    const id = validateId(issueId, "Issue ID");

    // Only developers/admins can revert
    await requireRole(ROLES.DEVELOPERS);

    // Get the oldest revision (the original)
    const originalRevision = await prisma.issueRevision.findFirst({
      where: { issueId: id },
      orderBy: { createdAt: "asc" },
    });

    if (!originalRevision) {
      return { error: "No original version found" };
    }

    // Revert to original
    await prisma.issue.update({
      where: { id },
      data: {
        title: originalRevision.title,
        body: originalRevision.body,
        priority: originalRevision.priority,
        showOriginal: false,
      },
    });

    // Delete all revisions since we've reverted
    await prisma.issueRevision.deleteMany({
      where: { issueId: id },
    });

    revalidatePath("/issues");
    revalidatePath(`/issues/${id}`);
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function deleteIssue(issueId: string) {
  try {
    const id = validateId(issueId, "Issue ID");

    // Only developers/admins can delete issues
    await requireRole(ROLES.DEVELOPERS);

    await prisma.issue.delete({
      where: { id },
    });

    revalidatePath("/issues");
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function addIssueComment(issueId: string, body: string) {
  try {
    const id = validateId(issueId, "Issue ID");
    const user = await requireAuth();

    // Rate limiting per user
    const rateLimitResult = checkRateLimit(user.id, RateLimiters.createComment);
    if (!rateLimitResult.success) {
      return { error: `Too many comments. Try again in ${rateLimitResult.retryAfterSeconds} seconds.` };
    }

    if (!body || body.trim().length < 1) {
      return { error: "Comment cannot be empty" };
    }

    // Verify issue exists
    const issue = await prisma.issue.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!issue) {
      return { error: "Issue not found" };
    }

    await prisma.issueComment.create({
      data: {
        body: body.trim(),
        issueId: id,
        authorId: user.id,
      },
    });

    revalidatePath(`/issues/${id}`);
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function editIssueComment(commentId: string, newBody: string) {
  try {
    const id = validateId(commentId, "Comment ID");

    if (!newBody || newBody.trim().length < 1) {
      return { error: "Comment cannot be empty" };
    }

    const comment = await prisma.issueComment.findUnique({
      where: { id },
      select: { authorId: true, issueId: true, body: true },
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    // Verify permission: owner or content managers
    const user = await requireOwnerOrRole(comment.authorId, ROLES.CONTENT_MANAGERS);

    // Check if content actually changed
    if (newBody.trim() !== comment.body) {
      // Save current version as a revision before updating
      await prisma.issueCommentRevision.create({
        data: {
          body: comment.body,
          commentId: id,
          editorId: user.id,
        },
      });
    }

    await prisma.issueComment.update({
      where: { id },
      data: { body: newBody.trim() },
    });

    revalidatePath(`/issues/${comment.issueId}`);
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function deleteIssueComment(commentId: string) {
  try {
    const id = validateId(commentId, "Comment ID");

    const comment = await prisma.issueComment.findUnique({
      where: { id },
      select: { authorId: true, issueId: true },
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    // Verify permission: owner or content managers
    await requireOwnerOrRole(comment.authorId, ROLES.CONTENT_MANAGERS);

    await prisma.issueComment.delete({
      where: { id },
    });

    revalidatePath(`/issues/${comment.issueId}`);
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}
