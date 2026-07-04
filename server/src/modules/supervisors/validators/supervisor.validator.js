import { body } from "express-validator";

export const createSupervisorValidator = [
  body("supervisorType")
    .isIn(["academic", "industrial"])
    .withMessage("Supervisor type must be academic or industrial"),

  body("schoolId")
    .if(body("supervisorType").equals("academic"))
    .trim()
    .notEmpty()
    .withMessage("Academic supervisors must have a school ID")
    .isMongoId()
    .withMessage("Invalid school ID"),

  body("companyId")
    .if(body("supervisorType").equals("industrial"))
    .trim()
    .notEmpty()
    .withMessage("Industrial supervisors must have a company ID")
    .isMongoId()
    .withMessage("Invalid company ID"),

  body("department")
    .optional()
    .trim(),

  body("phone")
    .optional()
    .trim(),

  body("position")
    .optional()
    .trim(),
];

export const updateSupervisorValidator = [
  body("supervisorType")
    .optional()
    .isIn(["academic", "industrial"])
    .withMessage("Supervisor type must be academic or industrial"),

  body("schoolId")
    .optional()
    .trim()
    .isMongoId()
    .withMessage("Invalid school ID"),

  body("companyId")
    .optional()
    .trim()
    .isMongoId()
    .withMessage("Invalid company ID"),

  body("department")
    .optional()
    .trim(),

  body("phone")
    .optional()
    .trim(),

  body("position")
    .optional()
    .trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
