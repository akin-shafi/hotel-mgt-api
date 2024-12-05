"use strict";
// src/routes/reservationRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReservationController_1 = require("../controllers/ReservationController");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const router = (0, express_1.Router)();
const reservationController = new ReservationController_1.ReservationController();
/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     description: Creates a new reservation with guest details, room type, check-in/check-out dates, etc.
 *     tags: [Reservation Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestId:
 *                 type: integer
 *                 description: ID of the guest making the reservation.
 *                 example: 123
 *               roomType:
 *                 type: string
 *                 description: Type of room being reserved.
 *                 example: "suite"
 *               checkInDate:
 *                 type: string
 *                 format: date
 *                 description: Check-in date for the reservation.
 *                 example: "2024-11-15"
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *                 description: Check-out date for the reservation.
 *                 example: "2024-11-20"
 *               status:
 *                 type: string
 *                 description: Initial status of the reservation.
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Reservation created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post('/', AuthMiddleware_1.validateCreateReservation, reservationController.createReservation);
/**
 * @swagger
 * /reservations/status:
 *   put:
 *     summary: Update reservation status
 *     description: Updates the status of an existing reservation, such as marking it as "confirmed" or "cancelled."
 *     tags: [Reservation Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 description: ID of the reservation to update.
 *                 example: 456
 *               status:
 *                 type: string
 *                 description: New status for the reservation.
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Reservation status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid reservation ID or status.
 *       404:
 *         description: Reservation not found.
 *       500:
 *         description: Server error.
 */
router.put('/status', AuthMiddleware_1.validateUpdateReservationStatus, reservationController.updateReservationStatus);
/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     description: Retrieves a list of all reservations, including guest and room details.
 *     tags: [Reservation Management]
 *     responses:
 *       200:
 *         description: List of reservations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Server error.
 */
router.get('/', reservationController.getReservations);
exports.default = router;
