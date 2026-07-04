import { Router } from "express";

import evaluationController from "../controllers/evaluation.controller.js";

import {
  createEvaluationValidator,
  updateEvaluationValidator,
} from "../validators/evaluation.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("supervisor"),
  evaluationController.getMy
);

router.get(
  "/attachment/:id",
  authMiddleware,
  roleMiddleware("admin", "supervisor"),
  evaluationController.getByAttachment
);

router.get("/:id", authMiddleware, evaluationController.getById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("supervisor"),
  createEvaluationValidator,
  validate,
  evaluationController.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("supervisor"),
  updateEvaluationValidator,
  validate,
  evaluationController.update
);

router.patch(
  "/:id/submit",
  authMiddleware,
  roleMiddleware("supervisor"),
  evaluationController.submit
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  evaluationController.delete
);

export default router;
