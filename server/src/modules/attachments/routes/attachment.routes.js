import { Router } from "express";

import attachmentController from "../controllers/attachment.controller.js";

import {
  createAttachmentValidator,
  updateAttachmentValidator,
} from "../validators/attachment.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  attachmentController.getAll
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("student"),
  attachmentController.getMy
);

router.get("/:id", authMiddleware, attachmentController.getById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createAttachmentValidator,
  validate,
  attachmentController.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateAttachmentValidator,
  validate,
  attachmentController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  attachmentController.delete
);

router.patch(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("admin"),
  attachmentController.complete
);

router.patch(
  "/:id/terminate",
  authMiddleware,
  roleMiddleware("admin"),
  attachmentController.terminate
);

router.patch(
  "/:id/assign-supervisor/:supervisorField",
  authMiddleware,
  roleMiddleware("admin"),
  attachmentController.assignSupervisor
);

export default router;
