import { uploadToCloudinary } from "#utils/cloudinary.ts";
import { AppError } from "#utils/ErrorUtil.ts";
import logger from "#utils/logger.ts";
import type { TicketCreateInput } from "#validations/ticket.validations.ts";
import {
    createActivityLog,
    createTicket,
    createTicketImage,
    findTicketsByTenantId,
    findUnitByPropertyAndNumber,
} from "./ticket.repositories.ts";

export const createTicketService = async (
  userId: string,
  tenantId: string,
  data: TicketCreateInput,
  files?: Express.Multer.File[]
) => {
  try {
    if (!data.unit) {
      throw new AppError("Unit is required", 400);
    }

    const unit = await findUnitByPropertyAndNumber(data.propertyId, data.unit);
    if (!unit) {
      throw new AppError("Unit not found for this property", 404);
    }

    let priority: "LOW" | "MEDIUM" | "HIGH";
    if (!data.priority) {
      priority = "MEDIUM";
    } else if (data.priority === "URGENT") {
      priority = "HIGH";
    } else {
      priority = data.priority;
    }

    const bodyImageUrls = data.imageUrls ?? [];
    let cloudinaryImageUrls: string[] = [];

    if (files && files.length > 0) {
        cloudinaryImageUrls = await Promise.all(
          files.map(async (file: Express.Multer.File) => {
            const fileSource = file.path || file.buffer;
            const url = await uploadToCloudinary(fileSource);
            return url;
          })
        );
      }

      const allImageUrls = [...bodyImageUrls, ...cloudinaryImageUrls];

    const ticket = await createTicket({
      title: data.title,
      description: data.description,
      priority,
      tenantId,
      unitId: unit.id,
    });

    if (data.imageUrls && data.imageUrls.length > 0) {
      await Promise.all(
        data.imageUrls.map((url) => createTicketImage(ticket?.id ?? "", url))
      );
    }

        await createActivityLog({
      ticketId: ticket?.id ?? "",
      performedBy: tenantId,
      actionType: "CREATED",
        oldValue: null,
        newValue: `Ticket created with status OPEN and priority ${priority}`,
      });

    logger.info(`Ticket created id=${ticket?.id} by tenantId=${tenantId}`);
    return ticket;
  } catch (error: any) {
    logger.error(`createTicketService error: ${error.message || error}`);
    throw error;
  }
};


export const getMyTicketsService = async (tenantId: string) => {
  try {
    const tickets = await findTicketsByTenantId(tenantId);
    logger.info(`Fetched ${tickets.length} tickets for tenantId=${tenantId}`);
    return tickets;
  } catch (error: any) {
    logger.error(`getMyTicketsService error: ${error.message || error}`);
    throw error;
  }
};