import { AppError } from "#utils/ErrorUtil.ts";
import logger from "#utils/logger.ts";
import type { Request, Response } from "express";
import {
  getMyNotificationsService,
  markAsReadService,
} from "./notification.services.ts";
export const getMyNotificationsController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user?.userId) {
      throw new AppError("Unauthorized", 401);
    }
    const notifications = await getMyNotificationsService(user.userId);
    res.status(200).json({ notifications });
  } catch (error: any) {
    logger.error(`getMyNotificationsController error: ${error.message || error}`);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};