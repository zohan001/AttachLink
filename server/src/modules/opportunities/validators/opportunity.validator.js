import { body } from "express-validator";

export const createOpportunityValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title must not exceed 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("internshipType")
    .isIn([
      "Industrial Attachment",
      "Internship",
      "Graduate Trainee",
      "Apprenticeship",
    ])
    .withMessage("Invalid internship type"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("workMode")
    .isIn(["On-site", "Hybrid", "Remote"])
    .withMessage("Work mode must be On-site, Hybrid, or Remote"),

  body("vacancies")
    .isInt({ min: 1 })
    .withMessage("Vacancies must be at least 1"),

  body("applicationDeadline")
    .isISO8601()
    .withMessage("Valid application deadline is required"),

  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Duration is required"),

  body("requirements")
    .isArray({ min: 1 })
    .withMessage("At least one requirement is required"),

  body("requirements.*")
    .trim()
    .notEmpty()
    .withMessage("Requirement cannot be empty"),

  body("responsibilities")
    .optional()
    .isArray()
    .withMessage("Responsibilities must be an array"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),

  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),

  body("salary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salary must be a positive number"),

  body("currency")
    .optional()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Currency must be between 1 and 10 characters"),
];

export const updateOpportunityValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title must not exceed 200 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("internshipType")
    .optional()
    .isIn([
      "Industrial Attachment",
      "Internship",
      "Graduate Trainee",
      "Apprenticeship",
    ])
    .withMessage("Invalid internship type"),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location cannot be empty"),

  body("workMode")
    .optional()
    .isIn(["On-site", "Hybrid", "Remote"])
    .withMessage("Work mode must be On-site, Hybrid, or Remote"),

  body("vacancies")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Vacancies must be at least 1"),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Valid application deadline is required"),

  body("duration")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Duration cannot be empty"),

  body("requirements")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one requirement is required"),

  body("requirements.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Requirement cannot be empty"),

  body("responsibilities")
    .optional()
    .isArray()
    .withMessage("Responsibilities must be an array"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),

  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),

  body("salary")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Salary must be a positive number"),
];
