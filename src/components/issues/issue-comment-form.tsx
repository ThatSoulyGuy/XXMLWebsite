"use client";

import { useActionState } from "react";
import { addIssueComment } from "@/actions/issues";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

interface IssueCommentFormProps {
  issueId: string;
}

export function IssueCommentForm({ issueId }: IssueCommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string | null }, formData: FormData) => {
      const body = formData.get("body") as string;
      const result = await addIssueComment(issueId, body);
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

      <Textarea name="body" placeholder="Leave a comment..." className="min-h-[100px]" required />

      <Button type="submit" disabled={isPending} isLoading={isPending}>
        Comment
      </Button>
    </form>
  );
}
