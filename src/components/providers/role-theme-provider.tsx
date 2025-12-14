"use client";

import { createContext, useContext, useState, useEffect } from "react";

type UserRole = "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN";

const SPECIAL_ROLES: UserRole[] = ["DEVELOPER", "MODERATOR", "ADMIN"];

interface RoleThemeContextType {
  role: UserRole;
  isPreviewMode: boolean;
  setPreviewMode: (preview: boolean) => void;
  effectiveRole: UserRole; // Role after considering preview mode
  themeClass: string;
  accentColor: string;
  canManageContent: boolean; // Whether to show management UI (false in preview mode)
  isSpecialRole: boolean; // Whether user has elevated privileges
}

const RoleThemeContext = createContext<RoleThemeContextType>({
  role: "USER",
  isPreviewMode: false,
  setPreviewMode: () => {},
  effectiveRole: "USER",
  themeClass: "",
  accentColor: "blue",
  canManageContent: false,
  isSpecialRole: false,
});

export function useRoleTheme() {
  return useContext(RoleThemeContext);
}

interface RoleThemeProviderProps {
  children: React.ReactNode;
  role: UserRole;
}

export function RoleThemeProvider({ children, role }: RoleThemeProviderProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Load preview mode preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("previewMode");
    if (saved === "true" && (role === "ADMIN" || role === "DEVELOPER" || role === "MODERATOR")) {
      setIsPreviewMode(true);
    }
  }, [role]);

  const setPreviewMode = (preview: boolean) => {
    setIsPreviewMode(preview);
    localStorage.setItem("previewMode", String(preview));
  };

  const effectiveRole = isPreviewMode ? "USER" : role;
  const isSpecialRole = SPECIAL_ROLES.includes(role);
  // Can manage content only if special role AND not in preview mode
  const canManageContent = isSpecialRole && !isPreviewMode;

  const getThemeClass = () => {
    if (isPreviewMode) return "";
    switch (role) {
      case "ADMIN":
        return "theme-admin";
      case "DEVELOPER":
        return "theme-developer";
      case "MODERATOR":
        return "theme-moderator";
      default:
        return "";
    }
  };

  const getAccentColor = () => {
    if (isPreviewMode) return "blue";
    switch (role) {
      case "ADMIN":
        return "red";
      case "DEVELOPER":
        return "green";
      case "MODERATOR":
        return "purple";
      default:
        return "blue";
    }
  };

  return (
    <RoleThemeContext.Provider
      value={{
        role,
        isPreviewMode,
        setPreviewMode,
        effectiveRole,
        themeClass: getThemeClass(),
        accentColor: getAccentColor(),
        canManageContent,
        isSpecialRole,
      }}
    >
      {children}
    </RoleThemeContext.Provider>
  );
}
