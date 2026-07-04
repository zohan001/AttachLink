import { Router } from "express";

import applicationController from "../controllers/application.controller.js";

import {
  createApplicationValidator,
  updateStatusValidator,
} from "../validators/application.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  applicationController.getAll
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  createApplicationValidator,
  validate,
  applicationController.apply
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("student"),
  applicationController.getMy
);

router.patch(
  "/:id/withdraw",
  authMiddleware,
  roleMiddleware("student"),
  applicationController.withdraw
);

router.get(
  "/company",
  authMiddleware,
  roleMiddleware("company"),
  applicationController.getCompanyApplications
);

router.get(
  "/company/:opportunityId",
  authMiddleware,
  roleMiddleware("company"),
  applicationController.getCompanyApplicationsByOpportunity
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("company"),
  updateStatusValidator,
  validate,
  applicationController.updateStatus
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  applicationController.delete
);

export default router;
