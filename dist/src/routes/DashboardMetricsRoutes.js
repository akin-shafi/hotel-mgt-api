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
exports.default = router;
