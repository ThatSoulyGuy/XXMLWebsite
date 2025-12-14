"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { logout } from "@/actions/auth";
import { User, Settings, LogOut, Shield } from "lucide-react";

type UserRole = "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN";

interface UserMenuProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  role?: UserRole;
}

export function UserMenu({ user, role = "USER" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        <Avatar src={user.image} name={user.name || user.email} size="sm" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user.name || "User"}
            </p>
            <p className="truncate text-sm text-zinc-500">{user.email}</p>
          </div>

          <Link
            href="/user/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>

          <Link
            href="/user/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>
          )}

          <div className="border-t border-zinc-200 dark:border-zinc-700">
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
