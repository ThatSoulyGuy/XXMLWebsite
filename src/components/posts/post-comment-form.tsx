"use client";

import { useActionState } from "react";
import { addPostComment } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

interface PostCommentFormProps {
  postId: string;
}

export function PostCommentForm({ postId }: PostCommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string | null }, formData: FormData) => {
      const body = formData.get("body") as string;
      const result = await addPostComment(postId, body);
      if (!result.error) {
        formRef.current?.reset();
      }
      return result;
    },
    { error: null }
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {state.error}
        </div>
      )}

      <Textarea name="body" placeholder="Write a reply..." className="min-h-[100px]" required />

      <Button type="submit" disabled={isPending} isLoading={isPending}>
        Reply
      </Button>
    </form>
  );
}
