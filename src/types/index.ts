import type { User, Issue, Post, Category, Label, IssueComment, PostComment } from "@prisma/client";

// User types
export type UserRole = "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN";

export type SafeUser = Omit<User, "password" | "emailVerified">;

// Issue types
export type IssueStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IssueWithRelations = Issue & {
  author: SafeUser;
  labels: Array<{ label: Label }>;
  comments: Array<IssueComment & { author: SafeUser }>;
  _count?: { comments: number };
};

export type IssueListItem = Pick<Issue, "id" | "number" | "title" | "status" | "priority" | "createdAt" | "updatedAt"> & {
  author: Pick<SafeUser, "id" | "name" | "image" | "username">;
  labels: Array<{ label: Pick<Label, "id" | "name" | "color"> }>;
  _count: { comments: number };
};

// Post types
export type PostType = "BLOG" | "DISCUSSION" | "QUESTION";
export type PostStatus = "DRAFT" | "PUBLISHED";

export type PostWithRelations = Post & {
  author: SafeUser;
  category: Category;
  comments: Array<PostComment & { author: SafeUser }>;
  _count?: { comments: number };
};

export type CategoryWithCount = Category & {
  _count: { posts: number };
};

// Comment types
export type CommentWithAuthor = (IssueComment | PostComment) & {
  author: SafeUser;
};

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  items?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
