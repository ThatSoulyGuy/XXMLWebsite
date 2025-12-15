"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireOwnerOrRole,
  handleSecurityError,
  getSecurityContext,
  ROLES,
  validateId,
} from "@/lib/security";
import { checkRateLimit, RateLimiters } from "@/lib/rate-limit";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  body: z.string().min(20, "Content must be at least 20 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  type: z.enum(["BLOG", "DISCUSSION", "QUESTION"]).default("DISCUSSION"),
});

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  body: z.string().min(20, "Content must be at least 20 characters"),
  excerpt: z.string().max(500).optional(),
});

export async function createBlogPost(data: {
  title: string;
  body: string;
  excerpt?: string;
}): Promise<{ error: string | null; slug?: string }> {
  try {
    // Only content managers can create blog posts
    const user = await requireRole(ROLES.CONTENT_MANAGERS);

    const validated = blogPostSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { title, body, excerpt } = validated.data;

    // Generate unique slug
    let slug = slugify(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // Get or create blog category
    let blogCategory = await prisma.category.findFirst({
      where: { slug: "blog" },
    });
    if (!blogCategory) {
      blogCategory = await prisma.category.create({
        data: {
          name: "Blog",
          slug: "blog",
          description: "Official blog posts",
        },
      });
    }

    await prisma.post.create({
      data: {
        title,
        slug,
        body,
        excerpt: excerpt || (body.length > 200 ? body.substring(0, 200) + "..." : body),
        type: "BLOG",
        categoryId: blogCategory.id,
        authorId: user.id,
      },
    });

    revalidatePath("/blog");
    return { error: null, slug };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function updateBlogPost(
  postId: string,
  data: { title: string; body: string; excerpt?: string }
): Promise<{ error: string | null; slug?: string }> {
  try {
    const id = validateId(postId, "Post ID");

    // Only content managers can edit blog posts
    await requireRole(ROLES.CONTENT_MANAGERS);

    const post = await prisma.post.findUnique({
      where: { id },
      select: { slug: true, type: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    if (post.type !== "BLOG") {
      return { error: "This is not a blog post" };
    }

    const validated = blogPostSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { title, body, excerpt } = validated.data;

    await prisma.post.update({
      where: { id },
      data: {
        title,
        body,
        excerpt: excerpt || (body.length > 200 ? body.substring(0, 200) + "..." : body),
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { error: null, slug: post.slug };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function deleteBlogPost(postId: string): Promise<{ error: string | null }> {
  try {
    const id = validateId(postId, "Post ID");

    // Only content managers can delete blog posts
    await requireRole(ROLES.CONTENT_MANAGERS);

    const post = await prisma.post.findUnique({
      where: { id },
      select: { type: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    if (post.type !== "BLOG") {
      return { error: "This is not a blog post" };
    }

    await prisma.post.delete({ where: { id } });

    revalidatePath("/blog");
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function getBlogPost(slug: string) {
  return prisma.post.findFirst({
    where: { slug, type: "BLOG" },
    include: {
      author: { select: { id: true, name: true, image: true, username: true } },
    },
  });
}

export async function createPost(
  prevState: { error: string | null; slug?: string },
  formData: FormData
): Promise<{ error: string | null; slug?: string }> {
  try {
    const user = await requireAuth();

    // Rate limiting per user
    const rateLimitResult = checkRateLimit(user.id, RateLimiters.createPost);
    if (!rateLimitResult.success) {
      return { error: `Too many posts created. Try again in ${rateLimitResult.retryAfterSeconds} seconds.` };
    }

    const validated = postSchema.safeParse({
      title: formData.get("title"),
      body: formData.get("body"),
      categoryId: formData.get("categoryId"),
      type: formData.get("type"),
    });

    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { title, body, categoryId, type } = validated.data;

    // Blog posts require content manager role
    if (type === "BLOG") {
      const ctx = await getSecurityContext();
      if (!ctx.hasRole(ROLES.CONTENT_MANAGERS)) {
        return { error: "Only developers and admins can create blog posts" };
      }
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      return { error: "Invalid category" };
    }

    // Generate unique slug
    let slug = slugify(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create excerpt from body
    const excerpt = body.length > 200 ? body.substring(0, 200) + "..." : body;

    await prisma.post.create({
      data: {
        title,
        slug,
        body,
        excerpt,
        type,
        categoryId,
        authorId: user.id,
      },
    });

    revalidatePath("/forum");
    if (type === "BLOG") {
      revalidatePath("/blog");
    }
    return { error: null, slug };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function addPostComment(postId: string, body: string, parentId?: string) {
  try {
    const id = validateId(postId, "Post ID");
    const user = await requireAuth();

    // Rate limiting per user
    const rateLimitResult = checkRateLimit(user.id, RateLimiters.createComment);
    if (!rateLimitResult.success) {
      return { error: `Too many comments. Try again in ${rateLimitResult.retryAfterSeconds} seconds.` };
    }

    if (!body || body.trim().length < 1) {
      return { error: "Comment cannot be empty" };
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    // Validate parentId if provided
    if (parentId) {
      const parentComment = await prisma.postComment.findUnique({
        where: { id: parentId },
        select: { postId: true },
      });
      if (!parentComment || parentComment.postId !== id) {
        return { error: "Invalid parent comment" };
      }
    }

    await prisma.postComment.create({
      data: {
        body: body.trim(),
        postId: id,
        authorId: user.id,
        parentId,
      },
    });

    revalidatePath(`/forum`);
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function incrementViewCount(postId: string) {
  try {
    const id = validateId(postId, "Post ID");
    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // Silently fail for view count increment
  }
}

// Forum post management

export async function updateForumPost(
  postId: string,
  data: { title: string; body: string }
): Promise<{ error: string | null; slug?: string }> {
  try {
    const id = validateId(postId, "Post ID");

    const post = await prisma.post.findUnique({
      where: { id },
      select: { slug: true, type: true, authorId: true, category: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    // Verify permission: owner or content managers
    await requireOwnerOrRole(post.authorId, ROLES.CONTENT_MANAGERS);

    if (!data.title || data.title.length < 5) {
      return { error: "Title must be at least 5 characters" };
    }

    if (!data.body || data.body.length < 20) {
      return { error: "Content must be at least 20 characters" };
    }

    const excerpt = data.body.length > 200 ? data.body.substring(0, 200) + "..." : data.body;

    await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        body: data.body,
        excerpt,
      },
    });

    revalidatePath("/forum");
    revalidatePath(`/forum/${post.category?.slug || "general"}/${post.slug}`);
    return { error: null, slug: post.slug };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function deleteForumPost(postId: string): Promise<{ error: string | null }> {
  try {
    const id = validateId(postId, "Post ID");

    const post = await prisma.post.findUnique({
      where: { id },
      select: { type: true, authorId: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    // Verify permission: owner or content managers
    await requireOwnerOrRole(post.authorId, ROLES.CONTENT_MANAGERS);

    await prisma.post.delete({ where: { id } });

    revalidatePath("/forum");
    if (post.type === "BLOG") {
      revalidatePath("/blog");
    }
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function getForumPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true, username: true } },
      category: true,
    },
  });
}

export async function pinPost(postId: string, isPinned: boolean): Promise<{ error: string | null }> {
  try {
    const id = validateId(postId, "Post ID");

    // Only content managers can pin posts
    await requireRole(ROLES.CONTENT_MANAGERS);

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    await prisma.post.update({
      where: { id },
      data: { isPinned },
    });

    revalidatePath("/forum");
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function editPostComment(commentId: string, newBody: string): Promise<{ error: string | null }> {
  try {
    const id = validateId(commentId, "Comment ID");

    if (!newBody || newBody.trim().length < 1) {
      return { error: "Comment cannot be empty" };
    }

    const comment = await prisma.postComment.findUnique({
      where: { id },
      select: {
        authorId: true,
        body: true,
        post: { select: { slug: true, category: { select: { slug: true } } } }
      },
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    // Verify permission: owner or content managers
    const user = await requireOwnerOrRole(comment.authorId, ROLES.CONTENT_MANAGERS);

    // Check if content actually changed
    if (newBody.trim() !== comment.body) {
      // Save current version as a revision before updating
      await prisma.postCommentRevision.create({
        data: {
          body: comment.body,
          commentId: id,
          editorId: user.id,
        },
      });
    }

    await prisma.postComment.update({
      where: { id },
      data: { body: newBody.trim() },
    });

    revalidatePath("/forum");
    if (comment.post?.category?.slug && comment.post?.slug) {
      revalidatePath(`/forum/${comment.post.category.slug}/${comment.post.slug}`);
    }
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function deletePostComment(commentId: string): Promise<{ error: string | null }> {
  try {
    const id = validateId(commentId, "Comment ID");

    const comment = await prisma.postComment.findUnique({
      where: { id },
      select: { authorId: true, post: { select: { slug: true, category: { select: { slug: true } } } } },
    });

    if (!comment) {
      return { error: "Comment not found" };
    }

    // Verify permission: owner or content managers
    await requireOwnerOrRole(comment.authorId, ROLES.CONTENT_MANAGERS);

    await prisma.postComment.delete({
      where: { id },
    });

    revalidatePath("/forum");
    if (comment.post?.category?.slug && comment.post?.slug) {
      revalidatePath(`/forum/${comment.post.category.slug}/${comment.post.slug}`);
    }
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}
