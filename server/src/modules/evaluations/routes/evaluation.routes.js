import { Router } from "express";

import evaluationController from "../controllers/evaluation.controller.js";

import {
  createEvaluationValidator,
  updateEvaluationValidator,
} from "../validators/evaluation.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

/**
 * @swagger
 * /evaluations/my:
 *   get:
 *     summary: Get my evaluations (supervisor)
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of evaluations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("supervisor"),
  evaluationController.getMy
);

/**
 * @swagger
 * /evaluations/attachment/{id}:
 *   get:
 *     summary: Get evaluations by attachment ID
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: List of evaluations for the attachment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Attachment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/attachment/:id",
  authMiddleware,
  roleMiddleware("admin", "supervisor"),
  evaluationController.getByAttachment
);

/**
 * @swagger
 * /evaluations/{id}:
 *   get:
 *     summary: Get evaluation by ID
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Evaluation ID
 *     responses:
 *       200:
 *         description: Evaluation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Evaluation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authMiddleware, evaluationController.getById);

/**
 * @swagger
 * /evaluations:
 *   post:
 *     summary: Create a new evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [attachment, scores]
 *             properties:
 *               attachment:
 *                 type: string
 *                 description: Attachment ID
 *               scores:
 *                 type: object
 *                 description: Evaluation scores
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evaluation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("supervisor"),
  createEvaluationValidator,
  validate,
  evaluationController.create
);

/**
 * @swagger
 * /evaluations/{id}:
 *   put:
 *     summary: Update an evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Evaluation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scores:
 *                 type: object
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evaluation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Evaluation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("supervisor"),
  updateEvaluationValidator,
  validate,
  evaluationController.update
);

/**
 * @swagger
 * /evaluations/{id}/submit:
 *   patch:
 *     summary: Submit an evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Evaluation ID
 *     responses:
 *       200:
 *         description: Evaluation submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Evaluation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
  "/:id/submit",
  authMiddleware,
  roleMiddleware("supervisor"),
  evaluationController.submit
);

/**
 * @swagger
 * /evaluations/{id}:
 *   delete:
 *     summary: Delete an evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Evaluation ID
 *     responses:
 *       200:
 *         description: Evaluation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Evaluation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  evaluationController.delete
);

export default router;
