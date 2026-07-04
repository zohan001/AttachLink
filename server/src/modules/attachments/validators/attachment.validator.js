import { body } from "express-validator";

export const createAttachmentValidator = [
  body("applicationId")
    .trim()
    .notEmpty()
    .withMessage("Application ID is required")
    .isMongoId()
    .withMessage("Invalid application ID"),

  body("startDate")
    .trim()
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  body("endDate")
    .trim()
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  body("academicSupervisorId")
    .optional()
    .trim()
    .isMongoId()
    .withMessage("Invalid academic supervisor ID"),

  body("industrialSupervisorId")
    .optional()
    .trim()
    .isMongoId()
    .withMessage("Invalid industrial supervisor ID"),

  body("terms")
    .optional()
    .trim(),

  body("notes")
    .optional()
    .trim(),
];

export const updateAttachmentValidator = [
  body("startDate")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  body("endDate")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  body("status")
    .optional()
    .trim()
    .isIn(["Active", "Completed", "Terminated"])
    .withMessage("Status must be Active, Completed, or Terminated"),

  body("terms")
    .optional()
    .trim(),

  body("notes")
    .optional()
    .trim(),
];
