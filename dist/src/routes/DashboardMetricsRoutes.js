"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DashboardMetricsController_1 = __importDefault(require("../controllers/DashboardMetricsController"));
const router = (0, express_1.Router)();
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
router.get('/', DashboardMetricsController_1.default.getRoomStatus);
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
router.get('/rooms/status', DashboardMetricsController_1.default.getRoomsByStatus);
/**
 * @swagger
 * /api/dashboard-metrics/rooms/available-by-type:
 *   get:
 *     summary: Get available rooms by room type
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
 *         description: >
 *           Start date of the range (format: YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: >
 *           End date of the range (format: YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: integer
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
router.get('/rooms/status-by-type', DashboardMetricsController_1.default.getRoomStatusByType);
/**
 * @swagger
 * /api/dashboard-metrics/rooms/occupancy-percentage:
 *   get:
 *     summary: Get occupancy percentage
 *     tags:
 *       - Dashboard Metrics
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
 *           Date to check occupancy (format: YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 occupancyPercentage:
 *                   type: number
 *                   format: float
 *                   description: Percentage of occupancy
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
router.get('/rooms/occupancy-percentage', DashboardMetricsController_1.default.getOccupancyPercentage);
/**
 * @swagger
 * /api/dashboard-metrics/rooms/adr:
 *   get:
 *     summary: Get ADR
 *     tags: [Dashboard Metrics]
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
 *           Date for which to calculate ADR (format: YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adr:
 *                   type: number
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
router.get('/rooms/adr', DashboardMetricsController_1.default.fetchADR);
/**
 * @swagger
 * /api/dashboard-metrics/reservations/due-out:
 *   get:
 *     summary: Get reservations due out today
 *     tags: [Dashboard Metrics]
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
 *           Check-out date (format: YYYY-MM-DD)
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
 *                     type: integer
 *                   guest:
 *                     type: object
 *                   checkInDate:
 *                     type: string
 *                     format: date
 *                   checkOutDate:
 *                     type: string
 *                     format: date
 *                   bookedRooms:
 *                     type: array
 *                     items:
 *                       type: object
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
router.get('/reservations/due-out', DashboardMetricsController_1.default.getDueOutReservations);
/**
 * @swagger
 * /api/dashboard-metrics/reservations/by-status:
 *   get:
 *     summary: Get reservations by status
 *     tags: [Dashboard Metrics]
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
 *           Date to check reservations (format: YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation status (e.g., due_out, pending_arrival)
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
 *                     type: integer
 *                   guest:
 *                     type: object
 *                   checkInDate:
 *                     type: string
 *                     format: date
 *                   checkOutDate:
 *                     type: string
 *                     format: date
 *                   bookedRooms:
 *                     type: array
 *                     items:
 *                       type: object
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
router.get('/reservations/by-status', DashboardMetricsController_1.default.getReservationsByStatus);
/**
 * @swagger
 * /api/dashboard-metrics/reservations/count-by-status:
 *   get:
 *     summary: Get count of reservations by status
 *     tags: [Dashboard Metrics]
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
 *           Date to check reservations (format: YYYY-MM-DD)
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
 *                   metric:
 *                     type: string
 *                   value:
 *                     type: integer
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
router.get('/reservations/count-by-status', DashboardMetricsController_1.default.countReservationsByStatus);
/**
 * @swagger
 * /api/dashboard-metrics/reservations/total-outstanding-balance:
 *   get:
 *     summary: Get total outstanding balance for reservations
 *     tags: [Dashboard Metrics]
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
 *           Date to check reservations (format: YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOutstandingBalance:
 *                   type: number
 *                   description: Sum of all outstanding balances
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
router.get('/reservations/total-outstanding-balance', DashboardMetricsController_1.default.getTotalOutstandingBalance);
/**
 * @swagger
 * /api/dashboard-metrics/reservations/yearly-revenue:
 *   get:
 *     summary: Get yearly revenue for a hotel
 *     tags: [Dashboard Metrics]
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
 *           Year to calculate revenue (format: YYYY)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 yearlyRevenue:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: Monthly revenue for the specified year
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
router.get('/reservations/yearly-revenue', DashboardMetricsController_1.default.getYearlyRevenue);
/**
 * @swagger
 * /api/dashboard-metrics/reservations/yearly-occupancy-adr:
 *   get:
 *     summary: Get yearly occupancy rate and ADR for a hotel
 *     tags: [Dashboard Metrics]
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
 *           Year to calculate occupancy rate and ADR (format: YYYY)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 monthlyOccupancy:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: Monthly occupancy rate for the specified year
 *                 monthlyADR:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: Monthly ADR for the specified year
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
router.get('/reservations/yearly-occupancy-adr', DashboardMetricsController_1.default.getYearlyOccupancyAndADR);
exports.default = router;
