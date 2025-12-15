"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  requireRole,
  handleSecurityError,
  ROLES,
  validateId,
} from "@/lib/security";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const downloadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  version: z.string().min(1, "Version is required"),
  platform: z.enum(["WINDOWS", "MACOS", "LINUX", "ALL"]),
  fileUrl: z.string().url("Must be a valid URL"),
  fileSize: z.string().optional(),
  releaseDate: z.string().optional(),
  isLatest: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function getDownloads() {
  return prisma.download.findMany({
    orderBy: [
      { isFeatured: "desc" },
      { isLatest: "desc" },
      { sortOrder: "asc" },
      { releaseDate: "desc" },
    ],
  });
}

export async function getDownload(slug: string) {
  return prisma.download.findUnique({
    where: { slug },
  });
}

export async function getLatestDownloads() {
  return prisma.download.findMany({
    where: { isLatest: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getFeaturedDownloads() {
  return prisma.download.findMany({
    where: { isFeatured: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createDownload(data: {
  name: string;
  description: string;
  version: string;
  platform: "WINDOWS" | "MACOS" | "LINUX" | "ALL";
  fileUrl: string;
  fileSize?: string;
  releaseDate?: string;
  isLatest?: boolean;
  isFeatured?: boolean;
}): Promise<{ error: string | null; slug?: string }> {
  try {
    // Only developers and admins can create downloads
    await requireRole(ROLES.DEVELOPERS);

    const validated = downloadSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const { name, description, version, platform, fileUrl, fileSize, releaseDate, isLatest, isFeatured } = validated.data;

    // Generate unique slug
    let slug = slugify(`${name}-${version}-${platform.toLowerCase()}`);
    const existing = await prisma.download.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // If marking as latest, unmark others for same platform
    if (isLatest) {
      await prisma.download.updateMany({
        where: { platform, isLatest: true },
        data: { isLatest: false },
      });
    }

    await prisma.download.create({
      data: {
        name,
        slug,
        description,
        version,
        platform,
        fileUrl,
        fileSize: fileSize || null,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        isLatest: isLatest || false,
        isFeatured: isFeatured || false,
      },
    });

    revalidatePath("/downloads");
    return { error: null, slug };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function updateDownload(
  id: string,
  data: {
    name: string;
    description: string;
    version: string;
    platform: "WINDOWS" | "MACOS" | "LINUX" | "ALL";
    fileUrl: string;
    fileSize?: string;
    releaseDate?: string;
    isLatest?: boolean;
    isFeatured?: boolean;
  }
): Promise<{ error: string | null }> {
  try {
    const downloadId = validateId(id, "Download ID");

    // Only developers and admins can edit downloads
    await requireRole(ROLES.DEVELOPERS);

    const validated = downloadSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const download = await prisma.download.findUnique({ where: { id: downloadId } });
    if (!download) {
      return { error: "Download not found" };
    }

    const { name, description, version, platform, fileUrl, fileSize, releaseDate, isLatest, isFeatured } = validated.data;

    // If marking as latest, unmark others for same platform
    if (isLatest && !download.isLatest) {
      await prisma.download.updateMany({
        where: { platform, isLatest: true, id: { not: downloadId } },
        data: { isLatest: false },
      });
    }

    await prisma.download.update({
      where: { id: downloadId },
      data: {
        name,
        description,
        version,
        platform,
        fileUrl,
        fileSize: fileSize || null,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
        isLatest: isLatest || false,
        isFeatured: isFeatured || false,
      },
    });

    revalidatePath("/downloads");
    revalidatePath(`/downloads/${download.slug}`);
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}

export async function deleteDownload(id: string): Promise<{ error: string | null }> {
  try {
    const downloadId = validateId(id, "Download ID");

    // Only developers and admins can delete downloads
    await requireRole(ROLES.DEVELOPERS);

    const download = await prisma.download.findUnique({ where: { id: downloadId } });
    if (!download) {
      return { error: "Download not found" };
    }

    await prisma.download.delete({ where: { id: downloadId } });

    revalidatePath("/downloads");
    return { error: null };
  } catch (error) {
    return handleSecurityError(error);
  }
}
