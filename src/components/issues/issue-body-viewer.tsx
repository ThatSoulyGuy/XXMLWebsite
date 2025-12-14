"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { History, Eye, EyeOff, RotateCcw, AlertTriangle, Pencil, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleShowOriginal, revertToOriginal, updateIssue } from "@/actions/issues";
import { formatRelativeDate } from "@/lib/utils";

interface IssueRevision {
  id: string;
  title: string;
  body: string;
  priority: string;
  createdAt: Date;
}

interface IssueBodyViewerProps {
  issue: {
    id: string;
    title: string;
    body: string;
    priority: string;
    showOriginal: boolean;
  };
  originalRevision: IssueRevision | null;
  isManager: boolean;
  hasBeenEdited: boolean;
  canEdit: boolean;
}

export function IssueBodyViewer({
  issue,
  originalRevision,
  isManager,
  hasBeenEdited,
  canEdit,
}: IssueBodyViewerProps) {
  const router = useRouter();
  const [showingOriginal, setShowingOriginal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(issue.title);
  const [editBody, setEditBody] = useState(issue.body);
  const [editPriority, setEditPriority] = useState(issue.priority);
  const [editError, setEditError] = useState<string | null>(null);

  // Determine what content to show
  const displayOriginal = issue.showOriginal || showingOriginal;
  const displayContent = displayOriginal && originalRevision
    ? originalRevision
    : issue;

  async function handleToggleShowOriginal() {
    setIsLoading(true);
    await toggleShowOriginal(issue.id, !issue.showOriginal);
    router.refresh();
    setIsLoading(false);
  }

  async function handleRevert() {
    setIsLoading(true);
    const result = await revertToOriginal(issue.id);
    if (result.error) {
      alert(result.error);
    }
    setShowRevertConfirm(false);
    router.refresh();
    setIsLoading(false);
  }

  async function handleSubmitEdit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setEditError(null);

    const result = await updateIssue(issue.id, {
      title: editTitle,
      body: editBody,
      priority: editPriority,
    });

    if (result.error) {
      setEditError(result.error);
      setIsLoading(false);
      return;
    }

    setIsEditing(false);
    setIsLoading(false);
    router.refresh();
  }

  function handleCancelEdit() {
    setEditTitle(issue.title);
    setEditBody(issue.body);
    setEditPriority(issue.priority);
    setEditError(null);
    setIsEditing(false);
  }

  return (
    <div className="space-y-3">
      {/* Edit indicator and controls */}
      {hasBeenEdited && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
            <History className="h-4 w-4" />
            <span>This issue has been edited</span>
            {originalRevision && (
              <span className="text-amber-600 dark:text-amber-400">
                (original from {formatRelativeDate(originalRevision.createdAt)})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Anyone can toggle viewing original locally */}
            {!issue.showOriginal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowingOriginal(!showingOriginal)}
                className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
              >
                {showingOriginal ? (
                  <>
                    <EyeOff className="mr-1 h-3 w-3" />
                    Show Current
                  </>
                ) : (
                  <>
                    <Eye className="mr-1 h-3 w-3" />
                    View Original
                  </>
                )}
              </Button>
            )}

            {/* Manager controls */}
            {isManager && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleShowOriginal}
                  disabled={isLoading}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
                  title={issue.showOriginal ? "Everyone sees original" : "Everyone sees current"}
                >
                  {issue.showOriginal ? (
                    <>
                      <EyeOff className="mr-1 h-3 w-3" />
                      Hide Original for All
                    </>
                  ) : (
                    <>
                      <Eye className="mr-1 h-3 w-3" />
                      Show Original for All
                    </>
                  )}
                </Button>

                {!showRevertConfirm ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRevertConfirm(true)}
                    disabled={isLoading}
                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Revert
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 rounded border border-red-300 bg-red-50 px-2 py-1 dark:border-red-700 dark:bg-red-900/30">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-xs text-red-700 dark:text-red-300">Revert to original?</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowRevertConfirm(false)}
                      disabled={isLoading}
                      className="h-6 px-2 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRevert}
                      disabled={isLoading}
                      className="h-6 bg-red-600 px-2 text-xs hover:bg-red-700"
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Showing original indicator */}
      {displayOriginal && originalRevision && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          Showing original version
        </div>
      )}

      {/* Issue body */}
      {isEditing ? (
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          {editError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {editError}
            </div>
          )}

          <div className="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-800 dark:bg-zinc-900">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  required
                  minLength={5}
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Priority
                </label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={8}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  required
                  minLength={20}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-1 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="relative">
          {canEdit && !displayOriginal && (
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          )}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {displayContent.body.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
