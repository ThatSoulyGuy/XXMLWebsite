"use client";

import { RoleThemeProvider, useRoleTheme } from "@/components/providers/role-theme-provider";

type UserRole = "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN";

interface RoleThemeWrapperProps {
  children: React.ReactNode;
  role: UserRole;
}

function ThemeClassApplier({ children }: { children: React.ReactNode }) {
  const { themeClass } = useRoleTheme();

  return <div className={themeClass}>{children}</div>;
}

export function RoleThemeWrapper({ children, role }: RoleThemeWrapperProps) {
  return (
    <RoleThemeProvider role={role}>
      <ThemeClassApplier>{children}</ThemeClassApplier>
    </RoleThemeProvider>
  );
}
