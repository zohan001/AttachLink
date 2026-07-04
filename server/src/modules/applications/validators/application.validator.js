import { body } from "express-validator";

export const createApplicationValidator = [
  body("opportunityId")
    .trim()
    .notEmpty()
    .withMessage("Opportunity ID is required")
    .isMongoId()
    .withMessage("Invalid opportunity ID"),

  body("coverLetter")
    .trim()
    .notEmpty()
    .withMessage("Cover letter is required")
    .isLength({ min: 50 })
    .withMessage("Cover letter must be at least 50 characters"),

  body("cvUrl")
    .optional()
    .isURL()
    .withMessage("CV URL must be a valid URL"),
];

export const updateStatusValidator = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "Under Review",
      "Shortlisted",
      "Interview Scheduled",
      "Accepted",
      "Rejected",
    ])
    .withMessage("Invalid status"),

  body("feedback")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Feedback cannot be empty"),
];
