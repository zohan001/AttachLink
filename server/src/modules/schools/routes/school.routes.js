import { Router } from "express";

import schoolController from "../controllers/school.controller.js";

import {
  createSchoolValidator,
  updateSchoolValidator,
} from "../validators/school.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

router.get("/", schoolController.getAll);

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("school"),
  schoolController.getProfile
);

router.get("/:id", schoolController.getById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("school"),
  createSchoolValidator,
  validate,
  schoolController.create
);

router.put(
  "/:id",
  authMiddleware,
  updateSchoolValidator,
  validate,
  schoolController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  schoolController.delete
);

export default router;
