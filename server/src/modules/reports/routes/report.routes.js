import { Router } from "express";

import reportController from "../controllers/report.controller.js";
import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";

const router = Router();

router.get(
  "/students/:id",
  authMiddleware,
  roleMiddleware("admin", "school", "supervisor"),
  reportController.studentReport
);

router.get(
  "/attachments/:id",
  authMiddleware,
  roleMiddleware("admin", "school", "supervisor", "company"),
  reportController.attachmentReport
);

router.get(
  "/companies/:id",
  authMiddleware,
  roleMiddleware("admin"),
  reportController.companyReport
);

export default router;
