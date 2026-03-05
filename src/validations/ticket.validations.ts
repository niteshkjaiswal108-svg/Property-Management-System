import { z } from "zod";

export const ticketCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  propertyId: z.uuid(),            // or string() depending on DB
  unit: z.string().optional(),             // apartment/unit identifier
  // if you send image URLs from FE instead of raw files:
  imageUrls: z.array(z.url()).optional(),
});

export type TicketCreateInput = z.infer<typeof ticketCreateSchema>;