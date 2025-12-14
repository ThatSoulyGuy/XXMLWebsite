"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createIssue } from "@/actions/issues";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface IssueFormProps {
  labels: Array<{ id: string; name: string; color: string }>;
}

export function IssueForm({ labels }: IssueFormProps) {
  const router = useRouter();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string | null }, formData: FormData) => {
      selectedLabels.forEach((id) => formData.append("labelIds", id));
      const result = await createIssue(_prevState, formData);
      if (!result.error) {
        router.push("/issues");
      }
      return result;
    },
    { error: null }
  );

  const toggleLabel = (id: string) => {
    setSelectedLabels((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Brief description of the issue"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Description</Label>
        <Textarea
          id="body"
          name="body"
          placeholder="Describe the issue in detail..."
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <select
          id="priority"
          name="priority"
          className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          defaultValue="MEDIUM"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Labels</Label>
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <button
              key={label.id}
              type="button"
              onClick={() => toggleLabel(label.id)}
              className={`transition-opacity ${selectedLabels.includes(label.id) ? "" : "opacity-50"}`}
            >
              <Badge color={label.color}>{label.name}</Badge>
            </button>
          ))}
        </div>
        {labels.length === 0 && (
          <p className="text-sm text-zinc-500">No labels available</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} isLoading={isPending}>
          Create Issue
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
