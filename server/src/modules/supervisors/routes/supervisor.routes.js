import { Router } from "express";

import supervisorController from "../controllers/supervisor.controller.js";

import {
  createSupervisorValidator,
  updateSupervisorValidator,
} from "../validators/supervisor.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

/**
 * @swagger
 * /supervisors:
 *   get:
 *     summary: Get all supervisors
 *     tags: [Supervisors]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of supervisors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/", supervisorController.getAll);

/**
 * @swagger
 * /supervisors/me:
 *   get:
 *     summary: Get current supervisor profile
 *     tags: [Supervisors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supervisor profile
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
  "/me",
  authMiddleware,
  roleMiddleware("supervisor"),
  supervisorController.getProfile
);

/**
 * @swagger
 * /supervisors/{id}:
 *   get:
 *     summary: Get supervisor by ID
 *     tags: [Supervisors]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supervisor ID
 *     responses:
 *       200:
 *         description: Supervisor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Supervisor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", supervisorController.getById);

/**
 * @swagger
 * /supervisors:
 *   post:
 *     summary: Create a new supervisor profile
 *     tags: [Supervisors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, confirmPassword]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *               phone:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Supervisor profile created successfully
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
  createSupervisorValidator,
  validate,
  supervisorController.create
);

/**
 * @swagger
 * /supervisors/{id}:
 *   put:
 *     summary: Update a supervisor
 *     tags: [Supervisors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supervisor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supervisor updated successfully
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
 *         description: Supervisor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/:id",
  authMiddleware,
  updateSupervisorValidator,
  validate,
  supervisorController.update
);

/**
 * @swagger
 * /supervisors/{id}:
 *   delete:
 *     summary: Delete a supervisor
 *     tags: [Supervisors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supervisor ID
 *     responses:
 *       200:
 *         description: Supervisor deleted successfully
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
 *         description: Supervisor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  supervisorController.delete
);

export default router;
