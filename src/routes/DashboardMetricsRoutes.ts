import { Router } from 'express';
import DashboardMetricsController from '../controllers/DashboardMetricsController';

const router = Router();

/**
 * @swagger
 * /api/dashboard-metrics:
 *   get:
 *     summary: Get room status metrics
 *     tags: [Dashboard Metrics]
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Hotel ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.get('/', DashboardMetricsController.getRoomStatus);

/**
 * @swagger
 * /api/dashboard-metrics/rooms/status:
 *   get:
 *     summary: Get rooms by status
 *     tags: [Dashboard Metrics]
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Hotel ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, occupied, outOfOrder]
 *         required: true
 *         description: Room status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Start date of the range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: End date of the range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   roomName:
 *                     type: string
 *                   roomType:
 *                     type: string
 *                   isAvailable:
 *                     type: boolean
 *                   maintenanceStatus:
 *                     type: string
 *                     enum: [CLEAN, OCCUPIED, OUT_OF_ORDER]
 *                   hotelId:
 *                     type: number
 *                   tenantId:
 *                     type: string
 *                     nullable: true
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

router.get('/rooms/status', DashboardMetricsController.getRoomsByStatus);

export default router;
