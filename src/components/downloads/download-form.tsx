"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDownload, updateDownload, deleteDownload } from "@/actions/downloads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";

interface DownloadFormProps {
  download?: {
    id: string;
    name: string;
    description: string;
    version: string;
    platform: string;
    fileUrl: string;
    fileSize: string | null;
    releaseDate: Date;
    isLatest: boolean;
    isFeatured: boolean;
  };
}

export function DownloadForm({ download }: DownloadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(download?.name || "");
  const [description, setDescription] = useState(download?.description || "");
  const [version, setVersion] = useState(download?.version || "");
  const [platform, setPlatform] = useState(download?.platform || "ALL");
  const [fileUrl, setFileUrl] = useState(download?.fileUrl || "");
  const [fileSize, setFileSize] = useState(download?.fileSize || "");
  const [releaseDate, setReleaseDate] = useState(
    download?.releaseDate
      ? new Date(download.releaseDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [isLatest, setIsLatest] = useState(download?.isLatest || false);
  const [isFeatured, setIsFeatured] = useState(download?.isFeatured || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const data = {
      name,
      description,
      version,
      platform: platform as "WINDOWS" | "MACOS" | "LINUX" | "ALL",
      fileUrl,
      fileSize: fileSize || undefined,
      releaseDate,
      isLatest,
      isFeatured,
    };

    let result;
    if (download) {
      result = await updateDownload(download.id, data);
    } else {
      result = await createDownload(data);
    }

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/downloads");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!download) return;
    if (!confirm("Are you sure you want to delete this download?")) return;

    setIsDeleting(true);
    const result = await deleteDownload(download.id);

    if (result.error) {
      setError(result.error);
      setIsDeleting(false);
    } else {
      router.push("/downloads");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="XXML Compiler"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this download contains..."
          rows={3}
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            required
          >
            <option value="ALL">All Platforms</option>
            <option value="WINDOWS">Windows</option>
            <option value="MACOS">macOS</option>
            <option value="LINUX">Linux</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="releaseDate">Release Date</Label>
          <Input
            id="releaseDate"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fileUrl">Download URL</Label>
        <Input
          id="fileUrl"
          type="url"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="https://github.com/xxml/releases/download/v1.0.0/xxml-1.0.0.zip"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fileSize">File Size (optional)</Label>
        <Input
          id="fileSize"
          value={fileSize}
          onChange={(e) => setFileSize(e.target.value)}
          placeholder="15.2 MB"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isLatest}
            onChange={(e) => setIsLatest(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-cyan-600 focus:ring-cyan-500"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Mark as latest version
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-cyan-600 focus:ring-cyan-500"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Featured download
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-700">
        <div>
          {download && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting || isDeleting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isDeleting} isLoading={isSubmitting}>
            {download ? "Save Changes" : "Create Download"}
          </Button>
        </div>
      </div>
    </form>
  );
}
