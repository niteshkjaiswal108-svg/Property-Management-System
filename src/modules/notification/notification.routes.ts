import { Router } from "express";
import { isAuthenticated } from "../user/user.middlewares.ts";
import {
  getMyNotificationsController,
  markNotificationAsReadController,
} from "./notification.controllers.ts";

const notificationRouter: Router = Router();

// GET /api/v1/notifications – list current user's notifications
notificationRouter.get("/", isAuthenticated, getMyNotificationsController);

// PATCH /api/v1/notifications/:id/read – mark one as read
notificationRouter.patch("/:id/read", isAuthenticated, markNotificationAsReadController);

export default notificationRouter;