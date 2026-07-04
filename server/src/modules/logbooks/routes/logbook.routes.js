import { Router } from "express";

import logbookController from "../controllers/logbook.controller.js";

import {
  createLogbookValidator,
  updateLogbookValidator,
  rejectLogbookValidator,
  commentLogbookValidator,
} from "../validators/logbook.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("student"),
  logbookController.getMy
);

router.get(
  "/attachment/:id",
  authMiddleware,
  roleMiddleware("admin", "supervisor"),
  logbookController.getByAttachment
);

router.get("/:id", authMiddleware, logbookController.getById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  createLogbookValidator,
  validate,
  logbookController.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("student"),
  updateLogbookValidator,
  validate,
  logbookController.update
);

router.patch(
  "/:id/submit",
  authMiddleware,
  roleMiddleware("student"),
  logbookController.submit
);

router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("supervisor"),
  logbookController.approve
);

router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("supervisor"),
  rejectLogbookValidator,
  validate,
  logbookController.reject
);

router.patch(
  "/:id/comment",
  authMiddleware,
  roleMiddleware("supervisor"),
  commentLogbookValidator,
  validate,
  logbookController.comment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  logbookController.delete
);

export default router;
