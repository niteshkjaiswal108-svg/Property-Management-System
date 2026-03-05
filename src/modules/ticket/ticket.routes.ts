import { Router } from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../user/user.middlewares.ts";
import { createTicketController, getMyTicketsController } from "./ticket.controllers.ts";
import { uploadTicketImages } from "#utils/upload.ts";

const ticketRouter = Router();

ticketRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles("TENANT"),
  uploadTicketImages,
  createTicketController
);

ticketRouter.get(
  "/my",
  isAuthenticated,
  authorizeRoles("TENANT"),
  getMyTicketsController
);

export default ticketRouter;