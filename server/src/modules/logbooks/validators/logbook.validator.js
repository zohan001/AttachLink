import { body } from "express-validator";

export const createLogbookValidator = [
  body("attachmentId")
    .trim()
    .notEmpty()
    .withMessage("Attachment ID is required")
    .isMongoId()
    .withMessage("Invalid attachment ID"),

  body("date")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),

  body("activities")
    .trim()
    .notEmpty()
    .withMessage("Activities are required"),

  body("hoursWorked")
    .notEmpty()
    .withMessage("Hours worked is required")
    .isFloat({ min: 0.5, max: 24 })
    .withMessage("Hours must be between 0.5 and 24"),

  body("skillsLearned")
    .optional()
    .trim(),

  body("challenges")
    .optional()
    .trim(),

  body("solutions")
    .optional()
    .trim(),
];

export const updateLogbookValidator = [
  body("date")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),

  body("activities")
    .optional()
    .trim(),

  body("hoursWorked")
    .optional()
    .isFloat({ min: 0.5, max: 24 })
    .withMessage("Hours must be between 0.5 and 24"),

  body("skillsLearned")
    .optional()
    .trim(),

  body("challenges")
    .optional()
    .trim(),

  body("solutions")
    .optional()
    .trim(),
];

export const rejectLogbookValidator = [
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("A rejection comment is required"),
];

export const commentLogbookValidator = [
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required"),
];
