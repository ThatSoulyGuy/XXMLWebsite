"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteModule, deleteClass } from "@/actions/docs";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  type: "module" | "class";
  id: string;
  name: string;
}

export function DeleteButton({ type, id, name }: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = type === "module"
        ? await deleteModule(id)
        : await deleteClass(id);

      if (!result.error) {
        router.refresh();
      }
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="rounded px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-50"
        >
          {isPending ? "..." : "Delete"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="rounded p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
      title={`Delete ${type}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
