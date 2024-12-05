// src/routes/billingRoutes.ts

import { Router } from 'express';
import BillingController from '../controllers/BillingController';

const router = Router();

/**
 * @swagger
 * /api/billing:
 *   post:
 *     summary: Create bills for reservation services
 *     description: Generates bills for a reservation based on an array of services.
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: string
 *                 description: ID of the reservation for which bills are being created.
 *                 example: "1"
 *               services:
 *                 type: array
 *                 description: List of services to generate bills for the reservation.
 *                 items:
 *                   type: object
 *                   properties:
 *                     serviceName:
 *                       type: string
 *                       description: Name of the service.
 *                       example: "Room Cleaning"
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: Price of the service.
 *                       example: 50.00
 *     responses:
 *       201:
 *         description: Bills created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *       400:
 *         description: Invalid input. Missing or incorrect reservationId or services array.
 *       404:
 *         description: Reservation not found.
 *       500:
 *         description: Server error.
 */


router.post('/', BillingController.createBill);

/**
 * @swagger
 * /api/billing/{billId}/pay:
 *   put:
 *     summary: Pay a bill
 *     description: Updates a bill's status to paid, and records the payment details.
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: billId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bill to pay.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 description: Method used for payment (e.g., credit card, cash).
 *                 example: "credit card"
 *               paymentDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the payment.
 *                 example: "2024-11-15T10:30:00Z"
 *     responses:
 *       200:
 *         description: Bill paid successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       404:
 *         description: Bill not found.
 *       500:
 *         description: Server error.
 */
router.put('/:billId/pay', BillingController.payBill);

/**
 * @swagger
 * /api/billing:
 *   get:
 *     summary: Get all bills
 *     description: Retrieves a list of all bills with details such as amount, due date, and status.
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: List of bills.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *       500:
 *         description: Server error.
 */
router.get('/', BillingController.getBills);

/**
 * @swagger
 * /api/billing/{billId}:
 *   get:
 *     summary: Get a bill by ID
 *     description: Retrieve details of a specific bill by its ID, including payment status.
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: billId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bill to retrieve.
 *     responses:
 *       200:
 *         description: Bill details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       404:
 *         description: Bill not found.
 *       500:
 *         description: Server error.
 */
router.get('/:billId', BillingController.getBillById);

/**
 * @swagger
 * /api/billing/find-by/{reservationId}:
 *   get:
 *     summary: Get a bill by ID
 *     description: Retrieve details of a specific bill by its ID, including payment status.
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the bill to retrieve.
 *     responses:
 *       200:
 *         description: Bill details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       404:
 *         description: Bill not found.
 *       500:
 *         description: Server error.
 */
router.get('/find-by/:reservationId', BillingController.getBillByReservationId);

export default router;
