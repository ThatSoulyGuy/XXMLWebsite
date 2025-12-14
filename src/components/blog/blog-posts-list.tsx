"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePolling } from "@/lib/use-polling";
import { formatDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
    username: string | null;
  };
}

interface BlogPostsListProps {
  initialPosts: Post[];
}

export function BlogPostsList({ initialPosts }: BlogPostsListProps) {
  const [posts, setPosts] = useState(initialPosts);

  const handleUpdate = useCallback((data: Post[]) => {
    if (Array.isArray(data)) {
      setPosts(data);
    }
  }, []);

  // Poll every 10 seconds
  usePolling<Post[]>({
    url: "/api/blog",
    interval: 10000,
    onUpdate: handleUpdate,
  });

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 p-12 text-center dark:border-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-300">No blog posts yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.id} className="group">
          <Link href={`/blog/${post.slug}`}>
            <time className="text-sm text-zinc-500">{formatDate(post.createdAt)}</time>
            <h2 className="mt-2 text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-2 text-zinc-500 dark:text-zinc-300">{post.excerpt}</p>
            )}
            <div className="mt-4 flex items-center gap-2">
              <Avatar src={post.author.image} name={post.author.name || "User"} size="sm" />
              <span className="text-sm text-zinc-500 dark:text-zinc-300">
                {post.author.username || post.author.name}
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
