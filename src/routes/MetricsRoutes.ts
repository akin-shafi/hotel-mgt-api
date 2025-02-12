import { Router } from 'express';
import CombinedController from '../controllers/CombinedController';
import MetricsController from '../controllers/MetricsController'
const router = Router();

/**
 * @swagger
 * /api/metrics/all:
 *   get:
 *     summary: Get all metrics for the dashboard
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Hotel ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: > 
 *           Date for daily metrics (format: YYYY-MM-DD)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: >
 *           Year for yearly metrics (format: YYYY)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomStatus:
 *                   type: object
 *                 roomsByStatus:
 *                   type: object
 *                 availableRoomsByType:
 *                   type: object
 *                 occupancyPercentage:
 *                   type: number
 *                 adrData:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                     roomsSold:
 *                       type: number
 *                     adr:
 *                       type: number
 *                 dueOutReservations:
 *                   type: array
 *                   items:
 *                     type: object
 *                 reservationsByStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                 counts:
 *                   type: object
 *                   properties:
 *                     dueOutCount:
 *                       type: number
 *                     pendingArrivalCount:
 *                       type: number
 *                 totalOutstandingBalance:
 *                   type: number
 *                 yearlyRevenue:
 *                   type: array
 *                   items:
 *                     type: number
 *                 occupancyAndADR:
 *                   type: object
 *                   properties:
 *                     monthlyOccupancy:
 *                       type: array
 *                       items:
 *                         type: number
 *                     monthlyADR:
 *                       type: array
 *                       items:
 *                         type: number
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

router.get('/metrics/all', CombinedController.getAllMetrics);

/**
 * @swagger
 * /api/metrics/room-metrics:
 *   get:
 *     summary: Get room metrics
 *     tags: [Metrics]
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
 *         description: Start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: Room status
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomStatus:
 *                   type: object
 *                   description: Room status for the specified date range
 *                 roomsByStatus:
 *                   type: object
 *                   description: Rooms by status for the specified date range
 *                 availableRoomsByType:
 *                   type: object
 *                   description: Available rooms by type for the specified date range
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
router.get('/metrics/room-metrics', MetricsController.getRoomMetrics);

/**
 * @swagger
 * /api/metrics/date-based-metrics:
 *   get:
 *     summary: Get date-based metrics
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Hotel ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Specific date
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 occupancyPercentage:
 *                   type: integer
 *                   description: Occupancy percentage for the specified date
 *                 adrData:
 *                   type: object
 *                   description: ADR data for the specified date
 *                 dueOutReservations:
 *                   type: object
 *                   description: Due out reservations for the specified date
 *                 reservationsByStatus:
 *                   type: object
 *                   description: Reservations by status for the specified date
 *                 countReservationsByStatus:
 *                   type: object
 *                   description: Count of reservations by status for the specified date
 *                 totalOutstandingBalance:
 *                   type: object
 *                   description: Total outstanding balance for the specified date
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
router.get('/metrics/date-based-metrics', MetricsController.getDateBasedMetrics);


/**
 * @swagger
 * /api/metrics/year-based-metrics:
 *   get:
 *     summary: Get year-based metrics
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Hotel ID
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: >
 *           Year to calculate metrics (format: YYYY)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 yearlyRevenue:
 *                   type: object
 *                   description: Yearly revenue for the specified year
 *                 yearlyOccupancyAndADR:
 *                   type: object
 *                   description: Yearly occupancy and ADR for the specified year
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
router.get('/metrics/year-based-metrics', MetricsController.getYearBasedMetrics);


export default router;


