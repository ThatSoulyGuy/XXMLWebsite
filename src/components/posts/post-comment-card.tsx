"use client";

import { useState } from "react";
import { editPostComment, deletePostComment } from "@/actions/posts";
import { formatRelativeDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, X, Check, History } from "lucide-react";

interface PostCommentRevision {
  id: string;
  body: string;
  createdAt: Date;
  editor: {
    name: string | null;
    username: string | null;
  };
}

interface PostCommentCardProps {
  comment: {
    id: string;
    body: string;
    createdAt: Date;
    authorId: string;
    author: {
      name: string | null;
      image: string | null;
      username: string | null;
    };
    revisions: PostCommentRevision[];
  };
  canEdit: boolean;
  canDelete: boolean;
}

export function PostCommentCard({ comment, canEdit, canDelete }: PostCommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(comment.body);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasBeenEdited = comment.revisions.length > 0;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    const result = await editPostComment(comment.id, editedBody);
    if (result.error) {
      setError(result.error);
    } else {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePostComment(comment.id);
    if (result.error) {
      alert(result.error);
    }
    setIsDeleting(false);
    setShowConfirmDelete(false);
  };

  const handleCancel = () => {
    setEditedBody(comment.body);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Avatar src={comment.author.image} name={comment.author.name || "User"} size="sm" />
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {comment.author.username || comment.author.name}
          </span>
          <span className="text-zinc-500">{formatRelativeDate(comment.createdAt)}</span>
          {hasBeenEdited && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              title="View edit history"
            >
              <History className="h-3 w-3" />
              edited
            </button>
          )}
        </div>
        {!isEditing && (canEdit || canDelete) && (
          <div className="flex items-center gap-1">
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-zinc-400 hover:text-blue-600"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
            {canDelete && !showConfirmDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmDelete(true)}
                className="text-zinc-400 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
            {showConfirmDelete && (
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
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                >
                  No
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit History */}
      {showHistory && comment.revisions.length > 0 && (
        <div className="mt-3 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
          <h4 className="mb-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">Edit History</h4>
          <div className="space-y-2">
            {comment.revisions.map((revision, index) => (
              <div key={revision.id} className="text-xs">
                <div className="flex items-center gap-2 text-zinc-500">
                  <span>Version {comment.revisions.length - index}</span>
                  <span>&middot;</span>
                  <span>{formatRelativeDate(revision.createdAt)}</span>
                  <span>&middot;</span>
                  <span>by {revision.editor.username || revision.editor.name}</span>
                </div>
                <div className="mt-1 whitespace-pre-wrap rounded bg-white p-2 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {revision.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comment Body */}
      {isEditing ? (
        <div className="mt-3 space-y-3">
          {error && (
            <div className="rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}
          <Textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} disabled={isSaving} isLoading={isSaving} size="sm">
              <Check className="mr-1 h-3 w-3" /> Save
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isSaving} size="sm">
              <X className="mr-1 h-3 w-3" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 text-zinc-700 dark:text-zinc-300">
          {comment.body.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
