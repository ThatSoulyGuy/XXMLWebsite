"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { pinPost } from "@/actions/posts";
import { Pin, Loader2 } from "lucide-react";

interface PinPostButtonProps {
  postId: string;
  isPinned: boolean;
}

export function PinPostButton({ postId, isPinned }: PinPostButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePin() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await pinPost(postId, !isPinned);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Failed to update pin status");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePin}
      disabled={isLoading}
      className={isPinned ? "text-orange-600 hover:text-orange-700" : ""}
      title={isPinned ? "Unpin post" : "Pin post"}
    >
      {isLoading ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <Pin className="mr-1 h-3 w-3" />
      )}
      {isPinned ? "Unpin" : "Pin"}
    </Button>
  );
}
