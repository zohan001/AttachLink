import { body } from "express-validator";

export const createCompanyValidator = [
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("industry")
    .trim()
    .notEmpty()
    .withMessage("Industry is required"),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("registrationNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Registration number cannot be empty"),

  body("address")
    .optional()
    .trim(),

  body("city")
    .optional()
    .trim(),

  body("county")
    .optional()
    .trim(),

  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),

  body("description")
    .optional()
    .trim(),
];

export const updateCompanyValidator = [
  body("companyName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("industry")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Industry cannot be empty"),

  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty"),

  body("registrationNumber")
    .optional()
    .trim(),

  body("address")
    .optional()
    .trim(),

  body("city")
    .optional()
    .trim(),

  body("county")
    .optional()
    .trim(),

  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),

  body("description")
    .optional()
    .trim(),

  body("logo")
    .optional()
    .isURL()
    .withMessage("Logo must be a valid URL"),
];
