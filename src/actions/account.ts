"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores, and hyphens"
  );

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  username: usernameSchema,
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

export async function setupUsername(username: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const validation = usernameSchema.safeParse(username);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Check if username is already taken
  const existing = await prisma.user.findUnique({
    where: { username: validation.data },
  });

  if (existing && existing.id !== session.user.id) {
    return { error: "Username is already taken" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { username: validation.data },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to set username:", error);
    return { error: "Failed to set username" };
  }
}

export async function checkUsernameAvailable(username: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { available: false };
  }

  const validation = usernameSchema.safeParse(username);
  if (!validation.success) {
    return { available: false, error: validation.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({
    where: { username: validation.data },
  });

  return { available: !existing || existing.id === session.user.id };
}

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      bio: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function updateProfile(data: {
  name: string;
  username: string;
  bio?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const validation = profileSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Check if username is already taken
  const existing = await prisma.user.findUnique({
    where: { username: validation.data.username },
  });

  if (existing && existing.id !== session.user.id) {
    return { error: "Username is already taken" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validation.data.name,
        username: validation.data.username,
        bio: validation.data.bio || null,
      },
    });

    revalidatePath("/user");
    revalidatePath("/user/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile" };
  }
}
