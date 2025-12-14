"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUnreadNotifications() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
      read: false,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return notifications;
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await prisma.notification.update({
    where: {
      id: notificationId,
      userId: session.user.id,
    },
    data: { read: true },
  });

  revalidatePath("/");
}

export async function markAllNotificationsAsRead() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      read: false,
    },
    data: { read: true },
  });

  revalidatePath("/");
}

export async function deleteNotification(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await prisma.notification.delete({
    where: {
      id: notificationId,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
}
