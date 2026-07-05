import { Router } from "express";

import notificationController from "../controllers/notification.controller.js";
import authMiddleware from "../../../middlewares/authMiddleware.js";

const router = Router();

router.get("/my", authMiddleware, notificationController.getMy);

router.get(
  "/unread-count",
  authMiddleware,
  notificationController.getUnreadCount
);

router.patch(
  "/:id/read",
  authMiddleware,
  notificationController.markAsRead
);

router.patch(
  "/read-all",
  authMiddleware,
  notificationController.markAllAsRead
);

export default router;
