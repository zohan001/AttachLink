import { body } from "express-validator";

export const createStudentValidator = [
  body("admissionNumber")
    .trim()
    .notEmpty()
    .withMessage("Admission number is required"),

  body("course")
    .trim()
    .notEmpty()
    .withMessage("Course is required"),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required"),

  body("yearOfStudy")
    .isInt({ min: 1, max: 6 })
    .withMessage("Year of study must be between 1 and 6"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("dateOfBirth")
    .isISO8601()
    .withMessage("Valid date of birth is required"),

  body("nationalId")
    .trim()
    .notEmpty()
    .withMessage("National ID is required"),

  body("schoolId")
    .trim()
    .notEmpty()
    .withMessage("School is required"),
];

export const updateStudentValidator = [
  body("admissionNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Admission number cannot be empty"),

  body("course")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Course cannot be empty"),

  body("department")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Department cannot be empty"),

  body("yearOfStudy")
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage("Year of study must be between 1 and 6"),

  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Valid date of birth is required"),

  body("nationalId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("National ID cannot be empty"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),

  body("cvUrl")
    .optional()
    .isURL()
    .withMessage("CV URL must be a valid URL"),

  body("portfolioUrl")
    .optional()
    .isURL()
    .withMessage("Portfolio URL must be a valid URL"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "graduated", "suspended"])
    .withMessage("Invalid status"),
];
