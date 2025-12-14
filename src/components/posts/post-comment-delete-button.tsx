"use client";

import { useState } from "react";
import { deletePostComment } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PostCommentDeleteButtonProps {
  commentId: string;
}

export function PostCommentDeleteButton({ commentId }: PostCommentDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePostComment(commentId);
    if (result.error) {
      alert(result.error);
    }
    setIsDeleting(false);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">Delete?</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          isLoading={isDeleting}
        >
          Yes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowConfirm(true)}
      className="text-zinc-400 hover:text-red-600"
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  );
}
