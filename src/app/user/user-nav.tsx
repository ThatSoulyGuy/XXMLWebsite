"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function UserNav() {
  const pathname = usePathname();

  // Don't show nav on setup page
  if (pathname === "/user/setup") {
    return null;
  }

  return (
    <nav className="mb-8 flex gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
      <Link
        href="/user/profile"
        className={cn(
          "text-sm font-medium transition-colors",
          pathname === "/user/profile"
            ? "text-blue-600 dark:text-blue-400"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        )}
      >
        Profile
      </Link>
      <Link
        href="/user/settings"
        className={cn(
          "text-sm font-medium transition-colors",
          pathname === "/user/settings"
            ? "text-blue-600 dark:text-blue-400"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        )}
      >
        Settings
      </Link>
    </nav>
  );
}
