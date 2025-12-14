"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const DEVELOPER_ROLES = ["DEVELOPER", "MODERATOR", "ADMIN"];

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

async function checkDeveloperRole(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user ? DEVELOPER_ROLES.includes(user.role) : false;
}

export async function createBlogPost(data: {
  title: string;
  body: string;
  excerpt?: string;
}): Promise<{ error: string | null; slug?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const isDeveloper = await checkDeveloperRole(session.user.id);
  if (!isDeveloper) {
    return { error: "Only developers and admins can create blog posts" };
  }

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
      authorId: session.user.id,
    },
  });

  revalidatePath("/blog");
  return { error: null, slug };
}

export async function updateBlogPost(
  postId: string,
  data: { title: string; body: string; excerpt?: string }
): Promise<{ error: string | null; slug?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const isDeveloper = await checkDeveloperRole(session.user.id);
  if (!isDeveloper) {
    return { error: "Only developers and admins can edit blog posts" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
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
    where: { id: postId },
    data: {
      title,
      body,
      excerpt: excerpt || (body.length > 200 ? body.substring(0, 200) + "..." : body),
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return { error: null, slug: post.slug };
}

export async function deleteBlogPost(postId: string): Promise<{ error: string | null }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const isDeveloper = await checkDeveloperRole(session.user.id);
  if (!isDeveloper) {
    return { error: "Only developers and admins can delete blog posts" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { type: true },
  });

  if (!post) {
    return { error: "Post not found" };
  }

  if (post.type !== "BLOG") {
    return { error: "This is not a blog post" };
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/blog");
  return { error: null };
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
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to create a post" };
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

  // Blog posts require developer role
  if (type === "BLOG") {
    const isDeveloper = await checkDeveloperRole(session.user.id);
    if (!isDeveloper) {
      return { error: "Only developers and admins can create blog posts" };
    }
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
      authorId: session.user.id,
    },
  });

  revalidatePath("/forum");
  if (type === "BLOG") {
    revalidatePath("/blog");
  }
  return { error: null, slug };
}

export async function addPostComment(postId: string, body: string, parentId?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!body || body.trim().length < 1) {
    return { error: "Comment cannot be empty" };
  }

  await prisma.postComment.create({
    data: {
      body: body.trim(),
      postId,
      authorId: session.user.id,
      parentId,
    },
  });

  revalidatePath(`/forum`);
  return { error: null };
}

export async function incrementViewCount(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  });
}

// Forum post management for developers/moderators/admins

export async function updateForumPost(
  postId: string,
  data: { title: string; body: string }
): Promise<{ error: string | null; slug?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true, type: true, authorId: true, category: true },
  });

  if (!post) {
    return { error: "Post not found" };
  }

  // Check permissions: author can edit their own, or developers can edit any
  const isDeveloper = await checkDeveloperRole(session.user.id);
  const isAuthor = post.authorId === session.user.id;

  if (!isAuthor && !isDeveloper) {
    return { error: "You don't have permission to edit this post" };
  }

  if (!data.title || data.title.length < 5) {
    return { error: "Title must be at least 5 characters" };
  }

  if (!data.body || data.body.length < 20) {
    return { error: "Content must be at least 20 characters" };
  }

  const excerpt = data.body.length > 200 ? data.body.substring(0, 200) + "..." : data.body;

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: data.title,
      body: data.body,
      excerpt,
    },
  });

  revalidatePath("/forum");
  revalidatePath(`/forum/${post.category?.slug || "general"}/${post.slug}`);
  return { error: null, slug: post.slug };
}

export async function deleteForumPost(postId: string): Promise<{ error: string | null }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { type: true, authorId: true },
  });

  if (!post) {
    return { error: "Post not found" };
  }

  // Check permissions: author can delete their own, or developers can delete any
  const isDeveloper = await checkDeveloperRole(session.user.id);
  const isAuthor = post.authorId === session.user.id;

  if (!isAuthor && !isDeveloper) {
    return { error: "You don't have permission to delete this post" };
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/forum");
  if (post.type === "BLOG") {
    revalidatePath("/blog");
  }
  return { error: null };
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
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const isDeveloper = await checkDeveloperRole(session.user.id);
  if (!isDeveloper) {
    return { error: "Only moderators and admins can pin posts" };
  }

  await prisma.post.update({
    where: { id: postId },
    data: { isPinned },
  });

  revalidatePath("/forum");
  return { error: null };
}

export async function editPostComment(commentId: string, newBody: string): Promise<{ error: string | null }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  if (!newBody || newBody.trim().length < 1) {
    return { error: "Comment cannot be empty" };
  }

  const comment = await prisma.postComment.findUnique({
    where: { id: commentId },
    select: {
      authorId: true,
      body: true,
      post: { select: { slug: true, category: { select: { slug: true } } } }
    },
  });

  if (!comment) {
    return { error: "Comment not found" };
  }

  // Check if user is author or has manager role
  const isAuthor = comment.authorId === session.user.id;
  const isManager = await checkDeveloperRole(session.user.id);

  if (!isAuthor && !isManager) {
    return { error: "You don't have permission to edit this comment" };
  }

  // Check if content actually changed
  if (newBody.trim() !== comment.body) {
    // Save current version as a revision before updating
    await prisma.postCommentRevision.create({
      data: {
        body: comment.body,
        commentId,
        editorId: session.user.id,
      },
    });
  }

  await prisma.postComment.update({
    where: { id: commentId },
    data: { body: newBody.trim() },
  });

  revalidatePath("/forum");
  if (comment.post?.category?.slug && comment.post?.slug) {
    revalidatePath(`/forum/${comment.post.category.slug}/${comment.post.slug}`);
  }
  return { error: null };
}

export async function deletePostComment(commentId: string): Promise<{ error: string | null }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const comment = await prisma.postComment.findUnique({
    where: { id: commentId },
    select: { authorId: true, post: { select: { slug: true, category: { select: { slug: true } } } } },
  });

  if (!comment) {
    return { error: "Comment not found" };
  }

  // Check if user is author or has manager role
  const isAuthor = comment.authorId === session.user.id;
  const isManager = await checkDeveloperRole(session.user.id);

  if (!isAuthor && !isManager) {
    return { error: "You don't have permission to delete this comment" };
  }

  await prisma.postComment.delete({
    where: { id: commentId },
  });

  revalidatePath("/forum");
  if (comment.post?.category?.slug && comment.post?.slug) {
    revalidatePath(`/forum/${comment.post.category.slug}/${comment.post.slug}`);
  }
  return { error: null };
}
