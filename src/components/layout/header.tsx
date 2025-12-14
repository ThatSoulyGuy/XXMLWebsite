"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/user-menu";
import { RoleBadge } from "@/components/layout/role-badge";
import { PreviewToggle } from "@/components/layout/preview-toggle";
import { NotificationBell } from "@/components/layout/notification-bell";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type UserRole = "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN";

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}

interface HeaderProps {
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  role?: UserRole;
  notifications?: Notification[];
}

const navigation = [
  { name: "Docs", href: "/docs" },
  { name: "Issues", href: "/issues" },
  { name: "Forum", href: "/forum" },
  { name: "Blog", href: "/blog" },
];

const SPECIAL_ROLES: UserRole[] = ["DEVELOPER", "MODERATOR", "ADMIN"];

export function Header({ user, role = "USER", notifications = [] }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isSpecialRole = SPECIAL_ROLES.includes(role);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-cyan-500/10 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2">
            <div className={cn(
              "logo-gradient flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br transition-shadow group-hover:shadow-[0_0_15px_rgba(0,212,255,0.5)]",
              role === "ADMIN" ? "from-red-500 to-red-700" :
              role === "MODERATOR" ? "from-purple-500 to-purple-700" :
              role === "DEVELOPER" ? "from-green-500 to-green-700" :
              "from-cyan-500 to-blue-600"
            )}>
              <span className="text-sm font-bold text-white">X</span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">XXML</span>
          </Link>
          {isSpecialRole && <RoleBadge role={role} />}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold transition-all hover:text-cyan-500",
                pathname.startsWith(item.href)
                  ? "text-cyan-500"
                  : "text-slate-600 dark:text-slate-300"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {isSpecialRole && <PreviewToggle />}
          {user ? (
            <>
              <NotificationBell initialNotifications={notifications} />
              <UserMenu user={user} role={role} />
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="text-slate-500 transition-colors hover:text-cyan-500 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-cyan-500/10 md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-base font-semibold",
                  pathname.startsWith(item.href)
                    ? "bg-cyan-500/10 text-cyan-500"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              {user ? (
                <UserMenu user={user} role={role} />
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
