import { Router } from "express";
import uploadController from "../controllers/upload.controller.js";
import authMiddleware from "../../../middlewares/authMiddleware.js";
import { uploadFile } from "../../../middlewares/upload.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  uploadFile,
  uploadController.upload
);

router.delete(
  "/",
  authMiddleware,
  uploadController.delete
);

export default router;
