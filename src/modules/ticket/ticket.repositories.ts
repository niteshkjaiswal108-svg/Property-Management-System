import { db } from "#db/db.ts";
import { desc } from "drizzle-orm";
import { tickets } from "./ticket.models.ts";
import { ticketImages } from "./ticket.models.ts";
import { activityLogs } from "../activity/activity.models.ts";
import { actionTypeEnum } from "../activity/activity.models.ts";
import { eq, and } from "drizzle-orm";
import { units } from "../unit/unit.models.ts";

type CreateTicketRepoInput = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  tenantId: string;
  unitId: string;
};

export const findUnitByPropertyAndNumber = async (
    propertyId: string,
    unitNumber: string
  ) => {
    const [unit] = await db
      .select()
      .from(units)
      .where(
        and(eq(units.propertyId, propertyId), eq(units.unitNumber, unitNumber))
      )
      .limit(1);
  
    return unit || null;
  };

  export const createTicket = async (data: CreateTicketRepoInput) => {
    const [ticket] = await db
      .insert(tickets)
      .values({
        title: data.title,
        description: data.description,
        priority: data.priority,
        tenantId: data.tenantId,
        unitId: data.unitId,
      })
      .returning();
  
    return ticket;
  };

  export const createTicketImage = async (
    ticketId: string,
    imageUrl: string
  ) => {
    const [image] = await db
      .insert(ticketImages)
      .values({
        ticketId,
        imageUrl,
      })
      .returning();
  
    return image;
  }

  type CreateActivityLogInput = {
    ticketId: string;
    performedBy: string;
    actionType: (typeof actionTypeEnum.enumValues)[number];
    oldValue?: string | null;
    newValue?: string | null;
  };

  export const createActivityLog = async (data: CreateActivityLogInput) => {
    const [log] = await db
      .insert(activityLogs)
      .values({
        ticketId: data.ticketId,
        performedBy: data.performedBy,
        actionType: data.actionType,
        oldValue: data.oldValue ?? null,
        newValue: data.newValue ?? null,
      })
      .returning();
  
    return log;
  };

export const findTicketsByTenantId = async (tenantId: string) => {
  const results = await db
    .select()
    .from(tickets)
    .where(eq(tickets.tenantId, tenantId))
    .orderBy(desc(tickets.createdAt));

  return results;
};