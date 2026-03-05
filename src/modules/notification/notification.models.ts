import {
    pgTable,
    uuid,
    text,
    timestamp,
    pgEnum,
    boolean,
    integer
  } from "drizzle-orm/pg-core";
import { users } from "../user/user.models.ts";
import { tickets } from "../ticket/ticket.models.ts";

export const notifications = pgTable("notifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => tickets.id),
    createdAt: timestamp("created_at").defaultNow(),
  });