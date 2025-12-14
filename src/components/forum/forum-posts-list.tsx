"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePolling } from "@/lib/use-polling";
import { formatRelativeDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Pin, Eye } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  isPinned: boolean;
  viewCount: number;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
    username: string | null;
  };
  category: {
    slug: string;
    name: string;
    color: string;
  };
  _count: {
    comments: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  _count: {
    posts: number;
  };
}

interface ForumData {
  categories: Category[];
  recentPosts: Post[];
}

interface ForumPostsListProps {
  initialCategories: Category[];
  initialPosts: Post[];
}

export function ForumPostsList({ initialCategories, initialPosts }: ForumPostsListProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [posts, setPosts] = useState(initialPosts);

  const handleUpdate = useCallback((data: ForumData) => {
    if (data && Array.isArray(data.categories)) {
      setCategories(data.categories);
    }
    if (data && Array.isArray(data.recentPosts)) {
      setPosts(data.recentPosts);
    }
  }, []);

  // Poll every 5 seconds
  usePolling<ForumData>({
    url: "/api/forum",
    interval: 5000,
    onUpdate: handleUpdate,
  });

  return (
    <>
      {/* Categories */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/forum/${category.slug}`}
              className="group rounded-lg border-l-4 border border-zinc-200 p-4 transition-all hover:shadow-md dark:border-zinc-800"
              style={{ borderLeftColor: category.color }}
            >
              <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
                  {category.description}
                </p>
              )}
              <p className="mt-2 text-sm text-zinc-500">{category._count.posts} discussions</p>
            </Link>
          ))}
          {categories.length === 0 && (
            <p className="col-span-full text-zinc-500 dark:text-zinc-300">
              No categories yet. Check back later!
            </p>
          )}
        </div>
      </section>

      {/* Recent Discussions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Recent Discussions
        </h2>
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/forum/${post.category.slug}/${post.slug}`}
                className="flex items-start gap-4 border-b border-zinc-200 p-4 transition-colors last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
              >
                <Avatar src={post.author.image} name={post.author.name || "User"} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {post.isPinned && <Pin className="h-4 w-4 text-orange-500" />}
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</h3>
                  </div>
                  {post.excerpt && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-300">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500">
                    <span>{post.author.username || post.author.name}</span>
                    <span>{formatRelativeDate(post.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post._count.comments}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-300">No discussions yet.</p>
              <Button asChild className="mt-4">
                <Link href="/forum/new">Start the first discussion</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
