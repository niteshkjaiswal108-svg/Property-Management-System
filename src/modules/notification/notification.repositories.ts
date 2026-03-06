import { db } from "#db/db.ts";
import { eq, and, desc } from "drizzle-orm";
import { notifications } from "./notification.models.ts";
// "Find all notifications for this user" – like asking the DB for a list
export const findNotificationsByUserId = async (userId: string) => {
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
  return rows;
};

// "Find one notification by id" – so we can check it exists and belongs to the user
export const findNotificationById = async (id: string) => {
    const [row] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1);
    return row ?? null;
  };