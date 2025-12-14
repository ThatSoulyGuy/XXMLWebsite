"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

type UserRole = "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    throw new Error("Not authorized - Admin only");
  }

  return session.user.id;
}

export async function getAllUsers() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      role: true,
      password: true, // We'll only check if it exists
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          posts: true,
          issues: true,
          issueComments: true,
          postComments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((user) => ({
    ...user,
    hasPassword: !!user.password,
    password: undefined, // Never expose the hash
  }));
}

export async function getUserById(userId: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      role: true,
      password: true,
      createdAt: true,
      updatedAt: true,
      accounts: {
        select: {
          provider: true,
        },
      },
      _count: {
        select: {
          posts: true,
          issues: true,
          issueComments: true,
          postComments: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    ...user,
    hasPassword: !!user.password,
    password: undefined,
  };
}

export async function updateUser(
  userId: string,
  data: {
    name?: string;
    username?: string;
    bio?: string;
    role?: UserRole;
  },
  options?: {
    notifyUser?: boolean;
  }
) {
  const adminId = await requireAdmin();

  // Prevent admin from demoting themselves
  if (userId === adminId && data.role && data.role !== "ADMIN") {
    throw new Error("Cannot change your own admin role");
  }

  // Get current user data for comparison
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, username: true, bio: true, role: true },
  });

  // Check if username is taken
  if (data.username) {
    const existing = await prisma.user.findFirst({
      where: {
        username: data.username,
        NOT: { id: userId },
      },
    });

    if (existing) {
      throw new Error("Username is already taken");
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      username: data.username,
      bio: data.bio,
      role: data.role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      bio: true,
      role: true,
    },
  });

  // Create notification if requested
  if (options?.notifyUser && currentUser) {
    const changes: string[] = [];
    if (data.name !== undefined && data.name !== currentUser.name) {
      changes.push("name");
    }
    if (data.username !== undefined && data.username !== currentUser.username) {
      changes.push("username");
    }
    if (data.bio !== undefined && data.bio !== currentUser.bio) {
      changes.push("bio");
    }
    if (data.role !== undefined && data.role !== currentUser.role) {
      changes.push(`role to ${data.role}`);
    }

    if (changes.length > 0) {
      await prisma.notification.create({
        data: {
          userId,
          message: `An administrator has updated your account: ${changes.join(", ")}`,
          type: "info",
        },
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return updated;
}

export async function setUserPassword(
  userId: string,
  newPassword: string,
  options?: {
    notifyUser?: boolean;
  }
) {
  await requireAdmin();

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Create notification if requested
  if (options?.notifyUser) {
    await prisma.notification.create({
      data: {
        userId,
        message: "An administrator has reset your password",
        type: "info",
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");

  return { success: true };
}

export async function deleteUser(userId: string) {
  const adminId = await requireAdmin();

  if (userId === adminId) {
    throw new Error("Cannot delete your own account");
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Delete user (cascades to related data)
  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");

  return { success: true };
}

export async function getAdminStats() {
  await requireAdmin();

  const [
    userCount,
    postCount,
    issueCount,
    commentCount,
    roleDistribution,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.issue.count(),
    prisma.postComment.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: true,
    }),
  ]);

  return {
    userCount,
    postCount,
    issueCount,
    commentCount,
    roleDistribution: roleDistribution.reduce(
      (acc, item) => {
        acc[item.role] = item._count;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
}
