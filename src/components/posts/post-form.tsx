"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PostFormProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  type: "BLOG" | "DISCUSSION" | "QUESTION";
}

export function PostForm({ categories, type }: PostFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string | null }, formData: FormData) => {
      formData.set("type", type);
      const result = await createPost(_prevState, formData);
      if (!result.error && result.slug) {
        const category = categories.find((c) => c.id === formData.get("categoryId"));
        router.push(`/forum/${category?.slug}/${result.slug}`);
      }
      return result;
    },
    { error: null }
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="What's on your mind?" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Content</Label>
        <Textarea
          id="body"
          name="body"
          placeholder="Share your thoughts..."
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} isLoading={isPending}>
          Post
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
