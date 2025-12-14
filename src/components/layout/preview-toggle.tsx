"use client";

import { useRoleTheme } from "@/components/providers/role-theme-provider";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function PreviewToggle() {
  const { isPreviewMode, setPreviewMode, role } = useRoleTheme();

  return (
    <button
      onClick={() => setPreviewMode(!isPreviewMode)}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
        isPreviewMode
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-900/70"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      )}
      title={isPreviewMode ? "Exit preview mode" : "Preview as regular user"}
    >
      {isPreviewMode ? (
        <>
          <EyeOff className="h-3.5 w-3.5" />
          <span>Preview</span>
        </>
      ) : (
        <>
          <Eye className="h-3.5 w-3.5" />
          <span>Preview</span>
        </>
      )}
    </button>
  );
}
