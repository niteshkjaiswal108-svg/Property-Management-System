import { AppError } from "#utils/ErrorUtil.ts";
import logger from "#utils/logger.ts";
import {
  findNotificationsByUserId,
  findNotificationById,
  markNotificationAsRead,
} from "./notification.repositories.ts";

// "Get my notifications" – just load them for this user
export const getMyNotificationsService = async (userId: string) => {
  const list = await findNotificationsByUserId(userId);
  logger.info(`Fetched ${list.length} notifications for userId=${userId}`);
  return list;
};