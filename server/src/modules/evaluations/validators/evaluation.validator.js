import { body } from "express-validator";

const scoreRange = (min = 1, max = 5) => ({
  isInt: { min, max },
  toInt: true,
});

export const createEvaluationValidator = [
  body("attachmentId")
    .trim()
    .notEmpty()
    .withMessage("Attachment ID is required")
    .isMongoId()
    .withMessage("Invalid attachment ID"),

  body("criteria.punctuality")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Punctuality must be 1–5"),

  body("criteria.technicalSkills")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Technical skills must be 1–5"),

  body("criteria.communication")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Communication must be 1–5"),

  body("criteria.teamwork")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Teamwork must be 1–5"),

  body("criteria.problemSolving")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Problem solving must be 1–5"),

  body("criteria.initiative")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Initiative must be 1–5"),

  body("criteria.qualityOfWork")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Quality of work must be 1–5"),

  body("criteria.attendance")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Attendance must be 1–5"),

  body("strengths")
    .optional()
    .trim(),

  body("weaknesses")
    .optional()
    .trim(),

  body("generalComments")
    .optional()
    .trim(),

  body("recommendation")
    .optional()
    .trim()
    .isIn(["Excellent", "Good", "Satisfactory", "Needs Improvement", "Poor"])
    .withMessage("Invalid recommendation"),
];

export const updateEvaluationValidator = [
  body("criteria.punctuality")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Punctuality must be 1–5"),

  body("criteria.technicalSkills")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Technical skills must be 1–5"),

  body("criteria.communication")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Communication must be 1–5"),

  body("criteria.teamwork")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Teamwork must be 1–5"),

  body("criteria.problemSolving")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Problem solving must be 1–5"),

  body("criteria.initiative")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Initiative must be 1–5"),

  body("criteria.qualityOfWork")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Quality of work must be 1–5"),

  body("criteria.attendance")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Attendance must be 1–5"),

  body("strengths")
    .optional()
    .trim(),

  body("weaknesses")
    .optional()
    .trim(),

  body("generalComments")
    .optional()
    .trim(),

  body("recommendation")
    .optional()
    .trim()
    .isIn(["Excellent", "Good", "Satisfactory", "Needs Improvement", "Poor"])
    .withMessage("Invalid recommendation"),
];
