import { Router } from "express";

import authController from "../controllers/auth.controller.js";

import {
  registerValidator,
} from "../validators/auth.validator.js";

import validate from "../../../middlewares/validateRequest.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  registerValidator,
  validate,
  authController.register
);

export default router;