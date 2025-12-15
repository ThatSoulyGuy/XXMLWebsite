"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSecurityContext, requireAuth } from "@/lib/security";

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

const onboardingSchema = z.object({
  username: usernameSchema,
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  birthdate: z.string().optional(),
});

export async function setupUsername(username: string) {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
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

  if (existing && existing.id !== ctx.user.id) {
    return { error: "Username is already taken" };
  }

  try {
    await prisma.user.update({
      where: { id: ctx.user.id },
      data: { username: validation.data },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to set username:", error);
    return { error: "Failed to set username" };
  }
}

export async function completeOnboarding(data: {
  username: string;
  bio?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  birthdate?: string;
}) {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
    return { error: "Not authenticated" };
  }

  const validation = onboardingSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Parse and validate birthdate if provided
  let birthdateValue: Date | null = null;
  if (validation.data.birthdate) {
    const parsed = new Date(validation.data.birthdate);
    if (!isNaN(parsed.getTime())) {
      // Check age requirement
      const today = new Date();
      let age = today.getFullYear() - parsed.getFullYear();
      const monthDiff = today.getMonth() - parsed.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsed.getDate())) {
        age--;
      }
      if (age < 13) {
        return { error: "You must be at least 13 years old to use XXML" };
      }
      birthdateValue = parsed;
    }
  }

  // Check if username is already taken
  const existing = await prisma.user.findUnique({
    where: { username: validation.data.username },
  });

  if (existing && existing.id !== ctx.user.id) {
    return { error: "Username is already taken" };
  }

  try {
    await prisma.user.update({
      where: { id: ctx.user.id },
      data: {
        username: validation.data.username,
        bio: validation.data.bio || null,
        gender: validation.data.gender || null,
        ...(birthdateValue && { birthdate: birthdateValue }),
      },
    });

    revalidatePath("/user");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
    return { error: "Failed to complete setup" };
  }
}

export async function getOnboardingData() {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: ctx.user.id },
    select: {
      name: true,
      username: true,
      bio: true,
      gender: true,
      birthdate: true,
      image: true,
    },
  });

  return user;
}

export async function checkUsernameAvailable(username: string) {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
    return { available: false };
  }

  const validation = usernameSchema.safeParse(username);
  if (!validation.success) {
    return { available: false, error: validation.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({
    where: { username: validation.data },
  });

  return { available: !existing || existing.id === ctx.user.id };
}

export async function getProfile() {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: ctx.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      bio: true,
      image: true,
      role: true,
      gender: true,
      birthdate: true,
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
  const ctx = await getSecurityContext();
  if (!ctx.user) {
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

  if (existing && existing.id !== ctx.user.id) {
    return { error: "Username is already taken" };
  }

  try {
    await prisma.user.update({
      where: { id: ctx.user.id },
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
