"use client";

import { useRoleTheme } from "@/components/providers/role-theme-provider";

interface ManagementButtonProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ManagementButton({ children, fallback = null }: ManagementButtonProps) {
  const { canManageContent } = useRoleTheme();

  if (!canManageContent) {
    return fallback;
  }

  return <>{children}</>;
}
