import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type UserRole = "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN";

// Role hierarchy - higher index = more permissions
const ROLE_HIERARCHY: UserRole[] = ["USER", "DEVELOPER", "MODERATOR", "ADMIN"];

// Role groups for common permission checks
export const ROLES = {
  ADMIN_ONLY: ["ADMIN"] as UserRole[],
  MODERATORS: ["MODERATOR", "ADMIN"] as UserRole[],
  DEVELOPERS: ["DEVELOPER", "ADMIN"] as UserRole[],
  CONTENT_MANAGERS: ["DEVELOPER", "MODERATOR", "ADMIN"] as UserRole[],
  ALL_STAFF: ["DEVELOPER", "MODERATOR", "ADMIN"] as UserRole[],
} as const;

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  username: string | null;
}

export interface SecurityContext {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasMinRole: (minRole: UserRole) => boolean;
  isOwner: (resourceOwnerId: string) => boolean;
  canManage: (resourceOwnerId: string, allowedRoles: UserRole[]) => boolean;
}

/**
 * Get the current user's security context with fresh data from the database.
 * IMPORTANT: This always fetches from DB to prevent JWT spoofing attacks.
 */
export async function getSecurityContext(): Promise<SecurityContext> {
  const session = await auth();

  let user: AuthenticatedUser | null = null;

  if (session?.user?.id) {
    // Always fetch fresh user data from database - never trust JWT role
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        username: true,
      },
    });

    if (dbUser) {
      user = {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role as UserRole,
        username: dbUser.username,
      };
    }
  }

  return {
    user,
    isAuthenticated: user !== null,

    hasRole: (roles: UserRole | UserRole[]) => {
      if (!user) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },

    hasMinRole: (minRole: UserRole) => {
      if (!user) return false;
      const userIndex = ROLE_HIERARCHY.indexOf(user.role);
      const minIndex = ROLE_HIERARCHY.indexOf(minRole);
      return userIndex >= minIndex;
    },

    isOwner: (resourceOwnerId: string) => {
      return user?.id === resourceOwnerId;
    },

    canManage: (resourceOwnerId: string, allowedRoles: UserRole[]) => {
      if (!user) return false;
      return user.id === resourceOwnerId || allowedRoles.includes(user.role);
    },
  };
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
    throw new SecurityError("Authentication required", "UNAUTHENTICATED");
  }
  return ctx.user;
}

/**
 * Require specific role(s) - throws if not authorized
 */
export async function requireRole(roles: UserRole | UserRole[]): Promise<AuthenticatedUser> {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
    throw new SecurityError("Authentication required", "UNAUTHENTICATED");
  }
  if (!ctx.hasRole(roles)) {
    throw new SecurityError("Insufficient permissions", "FORBIDDEN");
  }
  return ctx.user;
}

/**
 * Require minimum role level - throws if not authorized
 */
export async function requireMinRole(minRole: UserRole): Promise<AuthenticatedUser> {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
    throw new SecurityError("Authentication required", "UNAUTHENTICATED");
  }
  if (!ctx.hasMinRole(minRole)) {
    throw new SecurityError("Insufficient permissions", "FORBIDDEN");
  }
  return ctx.user;
}

/**
 * Require ownership or specific role - throws if not authorized
 */
export async function requireOwnerOrRole(
  resourceOwnerId: string,
  allowedRoles: UserRole[]
): Promise<AuthenticatedUser> {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
    throw new SecurityError("Authentication required", "UNAUTHENTICATED");
  }
  if (!ctx.canManage(resourceOwnerId, allowedRoles)) {
    throw new SecurityError("You don't have permission to access this resource", "FORBIDDEN");
  }
  return ctx.user;
}

/**
 * Custom security error with error codes
 */
export class SecurityError extends Error {
  code: "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" | "INVALID_INPUT";

  constructor(
    message: string,
    code: "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" | "INVALID_INPUT" = "FORBIDDEN"
  ) {
    super(message);
    this.name = "SecurityError";
    this.code = code;
  }
}

/**
 * Handle security errors and return appropriate response
 */
export function handleSecurityError(error: unknown): { error: string; code?: string } {
  if (error instanceof SecurityError) {
    return { error: error.message, code: error.code };
  }
  console.error("Unexpected error:", error);
  return { error: "An unexpected error occurred" };
}

/**
 * Verify that an ID parameter is valid (non-empty string)
 */
export function validateId(id: unknown, fieldName = "ID"): string {
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new SecurityError(`Invalid ${fieldName}`, "INVALID_INPUT");
  }
  return id.trim();
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Check if a user can perform an action on their own resource or has elevated permissions
 */
export async function checkResourceAccess(
  resourceOwnerId: string,
  allowedRoles: UserRole[] = ROLES.CONTENT_MANAGERS
): Promise<{ allowed: boolean; user: AuthenticatedUser | null; isOwner: boolean }> {
  const ctx = await getSecurityContext();

  if (!ctx.user) {
    return { allowed: false, user: null, isOwner: false };
  }

  const isOwner = ctx.isOwner(resourceOwnerId);
  const hasRole = ctx.hasRole(allowedRoles);

  return {
    allowed: isOwner || hasRole,
    user: ctx.user,
    isOwner,
  };
}
