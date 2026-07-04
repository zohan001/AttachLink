import { Router } from "express";

import studentController from "../controllers/student.controller.js";

import {
  createStudentValidator,
  updateStudentValidator,
} from "../validators/student.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("student"),
  createStudentValidator,
  validate,
  studentController.create
);

router.get(
  "/",
  roleMiddleware("admin", "school", "company"),
  studentController.getAll
);

router.get(
  "/me",
  roleMiddleware("student"),
  studentController.getProfile
);

router.get(
  "/:id",
  roleMiddleware("student", "admin", "school", "supervisor"),
  studentController.getById
);

router.put(
  "/:id",
  updateStudentValidator,
  validate,
  studentController.update
);

router.delete(
  "/:id",
  roleMiddleware("admin"),
  studentController.delete
);

export default router;
