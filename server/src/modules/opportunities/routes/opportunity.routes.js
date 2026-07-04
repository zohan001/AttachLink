import { Router } from "express";

import opportunityController from "../controllers/opportunity.controller.js";

import {
  createOpportunityValidator,
  updateOpportunityValidator,
} from "../validators/opportunity.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

router.get("/", opportunityController.getAll);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("company"),
  opportunityController.getMy
);

router.get("/:id", opportunityController.getById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("company"),
  createOpportunityValidator,
  validate,
  opportunityController.create
);

router.put(
  "/:id",
  authMiddleware,
  updateOpportunityValidator,
  validate,
  opportunityController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  opportunityController.delete
);

router.patch(
  "/:id/publish",
  authMiddleware,
  opportunityController.publish
);

router.patch(
  "/:id/close",
  authMiddleware,
  opportunityController.close
);

export default router;
