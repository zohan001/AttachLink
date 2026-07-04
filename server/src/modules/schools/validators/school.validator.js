import { body } from "express-validator";

export const createSchoolValidator = [
  body("schoolName")
    .trim()
    .notEmpty()
    .withMessage("School name is required"),

  body("abbreviation")
    .optional()
    .trim(),

  body("institutionType")
    .isIn(["University", "TVET", "College", "High School", "Training Institute"])
    .withMessage("Invalid institution type"),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),

  body("address")
    .optional()
    .trim(),

  body("city")
    .optional()
    .trim(),

  body("county")
    .optional()
    .trim(),

  body("description")
    .optional()
    .trim(),
];

export const updateSchoolValidator = [
  body("schoolName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("School name cannot be empty"),

  body("abbreviation")
    .optional()
    .trim(),

  body("institutionType")
    .optional()
    .isIn(["University", "TVET", "College", "High School", "Training Institute"])
    .withMessage("Invalid institution type"),

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

  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),

  body("address")
    .optional()
    .trim(),

  body("city")
    .optional()
    .trim(),

  body("county")
    .optional()
    .trim(),

  body("logo")
    .optional()
    .isURL()
    .withMessage("Logo must be a valid URL"),

  body("description")
    .optional()
    .trim(),
];
