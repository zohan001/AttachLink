import { Router } from "express";

import opportunityController from "../controllers/opportunity.controller.js";

import {
  createOpportunityValidator,
  updateOpportunityValidator,
} from "../validators/opportunity.validator.js";

import authMiddleware from "../../../middlewares/authMiddleware.js";
import roleMiddleware from "../../../middlewares/roleMiddleware.js";
import validate from "../../../middlewares/validateRequest.js";

const router = Router();

/**
 * @swagger
 * /opportunities:
 *   get:
 *     summary: Get all opportunities
 *     tags: [Opportunities]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by attachment type
 *     responses:
 *       200:
 *         description: List of opportunities
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/", opportunityController.getAll);

/**
 * @swagger
 * /opportunities/my:
 *   get:
 *     summary: Get my company's opportunities
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of company opportunities
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
  roleMiddleware("company"),
  opportunityController.getMy
);

/**
 * @swagger
 * /opportunities/{id}:
 *   get:
 *     summary: Get opportunity by ID
 *     tags: [Opportunities]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Opportunity ID
 *     responses:
 *       200:
 *         description: Opportunity details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Opportunity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", opportunityController.getById);

/**
 * @swagger
 * /opportunities:
 *   post:
 *     summary: Create a new opportunity
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, type, locations, duration]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [industrial, teaching, research, community]
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: string
 *               requirements:
 *                 type: string
 *               stipend:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Opportunity created successfully
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
  roleMiddleware("company"),
  createOpportunityValidator,
  validate,
  opportunityController.create
);

/**
 * @swagger
 * /opportunities/{id}:
 *   put:
 *     summary: Update an opportunity
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Opportunity ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [industrial, teaching, research, community]
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: string
 *               requirements:
 *                 type: string
 *               stipend:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Opportunity updated successfully
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
 *         description: Opportunity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/:id",
  authMiddleware,
  updateOpportunityValidator,
  validate,
  opportunityController.update
);

/**
 * @swagger
 * /opportunities/{id}:
 *   delete:
 *     summary: Delete an opportunity
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Opportunity ID
 *     responses:
 *       200:
 *         description: Opportunity deleted successfully
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
 *         description: Opportunity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "company"),
  opportunityController.delete
);

/**
 * @swagger
 * /opportunities/{id}/publish:
 *   patch:
 *     summary: Publish an opportunity
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Opportunity ID
 *     responses:
 *       200:
 *         description: Opportunity published successfully
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
 *         description: Opportunity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
  "/:id/publish",
  authMiddleware,
  opportunityController.publish
);

/**
 * @swagger
 * /opportunities/{id}/close:
 *   patch:
 *     summary: Close an opportunity
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Opportunity ID
 *     responses:
 *       200:
 *         description: Opportunity closed successfully
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
 *         description: Opportunity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
  "/:id/close",
  authMiddleware,
  opportunityController.close
);

export default router;
