"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  getSecurityContext,
  requireAuth,
  validateId,
} from "@/lib/security";

export async function getUnreadNotifications() {
  const ctx = await getSecurityContext();
  if (!ctx.user) {
    return [];
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: ctx.user.id,
      read: false,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return notifications;
}

export async function markNotificationAsRead(notificationId: string) {
  const user = await requireAuth();
  const id = validateId(notificationId, "Notification ID");

  await prisma.notification.update({
    where: {
      id,
      userId: user.id,
    },
    data: { read: true },
  });

  revalidatePath("/");
}

export async function markAllNotificationsAsRead() {
  const user = await requireAuth();

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      read: false,
    },
    data: { read: true },
  });

  revalidatePath("/");
}

export async function deleteNotification(notificationId: string) {
  const user = await requireAuth();
  const id = validateId(notificationId, "Notification ID");

  await prisma.notification.delete({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/");
}
