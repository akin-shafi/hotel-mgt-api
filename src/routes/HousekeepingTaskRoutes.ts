// src/routes/housekeepingTaskRoutes.ts

import { Router } from 'express';
import HousekeepingTaskController from '../controllers/HousekeepingTaskController';

const router = Router();

/**
 * @swagger
 * /housekeeping-tasks:
 *   post:
 *     summary: Create a new housekeeping task
 *     description: Adds a new task for housekeeping, including details like room number and task description.
 *     tags: [Housekeeping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: ID of the room to be cleaned.
 *                 example: 101
 *               description:
 *                 type: string
 *                 description: Description of the housekeeping task.
 *                 example: "Clean and disinfect the room."
 *               priority:
 *                 type: string
 *                 description: Priority level of the task (e.g., high, medium, low).
 *                 example: "high"
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HousekeepingTask'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post('/', HousekeepingTaskController.createTask);

/**
 * @swagger
 * /housekeeping-tasks:
 *   get:
 *     summary: Get all housekeeping tasks
 *     description: Retrieves a list of all housekeeping tasks, including status, priority, and room details.
 *     tags: [Housekeeping]
 *     responses:
 *       200:
 *         description: List of housekeeping tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HousekeepingTask'
 *       500:
 *         description: Server error.
 */
router.get('/', HousekeepingTaskController.getTasks);

/**
 * @swagger
 * /housekeeping-tasks/status:
 *   put:
 *     summary: Update the status of a housekeeping task
 *     description: Changes the status of a housekeeping task (e.g., to completed or in-progress).
 *     tags: [Housekeeping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *                 description: ID of the task to update.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: New status of the task (e.g., "in-progress", "completed").
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Task status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HousekeepingTask'
 *       400:
 *         description: Invalid task ID or status.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Server error.
 */
router.put('/status', HousekeepingTaskController.updateTaskStatus);

export default router;
