import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notification } from "@/lib/db/schema/notifications";

export type CreateNotificationInput = {
  userId: string;
  title: string;
  body: string;
};

export async function createNotification(input: CreateNotificationInput) {
  const [created] = await db.insert(notification).values(input).returning();
  return created;
}

export async function getUserNotifications(userId: string) {
  return db
    .select()
    .from(notification)
    .where(eq(notification.userId, userId))
    .orderBy(desc(notification.createdAt));
}

export async function markNotificationRead(id: string, userId: string) {
  await db
    .update(notification)
    .set({ read: true })
    .where(and(eq(notification.id, id), eq(notification.userId, userId)));
}
