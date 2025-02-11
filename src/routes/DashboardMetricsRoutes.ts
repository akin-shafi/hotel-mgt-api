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

export default router;
