"use client";

import { cn } from "@/lib/utils";
import { Shield, Code, Users } from "lucide-react";
import { useRoleTheme } from "@/components/providers/role-theme-provider";

type UserRole = "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN";

interface RoleBadgeProps {
  role: UserRole;
}

const roleConfig: Record<UserRole, { label: string; icon: typeof Shield; className: string }> = {
  ADMIN: {
    label: "Admin",
    icon: Shield,
    className: "bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  },
  MODERATOR: {
    label: "Mod",
    icon: Users,
    className: "bg-purple-500/10 text-purple-500 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
  },
  DEVELOPER: {
    label: "Dev",
    icon: Code,
    className: "bg-green-500/10 text-green-500 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
  },
  USER: {
    label: "User",
    icon: Users,
    className: "bg-slate-500/10 text-slate-500 border border-slate-500/30",
  },
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const { isPreviewMode, effectiveRole } = useRoleTheme();
  const displayRole = isPreviewMode ? effectiveRole : role;
  const config = roleConfig[displayRole];
  const Icon = config.icon;

  if (displayRole === "USER") return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </div>
  );
}
