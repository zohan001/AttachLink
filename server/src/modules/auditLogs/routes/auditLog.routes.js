import { Router } from "express";
import auditLogController from "../controllers/auditLog.controller.js";
import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  auditLogController.getAll
);

export default router;
