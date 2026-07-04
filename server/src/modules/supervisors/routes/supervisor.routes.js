import { Router } from "express";

import supervisorController from "../controllers/supervisor.controller.js";

import {
  createSupervisorValidator,
  updateSupervisorValidator,
} from "../validators/supervisor.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

router.get("/", supervisorController.getAll);

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("supervisor"),
  supervisorController.getProfile
);

router.get("/:id", supervisorController.getById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("supervisor"),
  createSupervisorValidator,
  validate,
  supervisorController.create
);

router.put(
  "/:id",
  authMiddleware,
  updateSupervisorValidator,
  validate,
  supervisorController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  supervisorController.delete
);

export default router;
