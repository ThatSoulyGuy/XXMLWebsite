"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteBlogPost, deleteForumPost } from "@/actions/posts";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeletePostButtonProps {
  postId: string;
  postType: "blog" | "forum";
  redirectTo?: string;
}

export function DeletePostButton({ postId, postType, redirectTo }: DeletePostButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const result = postType === "blog"
        ? await deleteBlogPost(postId)
        : await deleteForumPost(postId);

      if (result.error) {
        setError(result.error);
        setIsDeleting(false);
        return;
      }

      router.push(redirectTo || (postType === "blog" ? "/blog" : "/forum"));
      router.refresh();
    } catch {
      setError("Failed to delete post");
      setIsDeleting(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" />
          <span>Delete?</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Confirm"
          )}
        </Button>
        {error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
      onClick={() => setShowConfirm(true)}
    >
      <Trash2 className="mr-1 h-3 w-3" /> Delete
    </Button>
  );
}
