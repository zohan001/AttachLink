import { Router } from "express";

import companyController from "../controllers/company.controller.js";

import {
  createCompanyValidator,
  updateCompanyValidator,
} from "../validators/company.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

router.get("/", companyController.getAll);

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("company"),
  companyController.getProfile
);

router.get("/:id", companyController.getById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("company"),
  createCompanyValidator,
  validate,
  companyController.create
);

router.put(
  "/:id",
  authMiddleware,
  updateCompanyValidator,
  validate,
  companyController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  companyController.delete
);

export default router;
