"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteIssue } from "@/actions/issues";

interface IssueDeleteButtonProps {
  issueId: string;
}

export function IssueDeleteButton({ issueId }: IssueDeleteButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteIssue(issueId);

    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
      return;
    }

    router.push("/issues");
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 dark:border-red-800 dark:bg-red-900/20">
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <span className="text-sm text-red-700 dark:text-red-300">Delete?</span>
        <Button
          size="sm"
          variant="outline"
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
          {isDeleting ? "Deleting..." : "Confirm"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
      onClick={() => setShowConfirm(true)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
