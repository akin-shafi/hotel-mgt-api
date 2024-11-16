"use strict";
// src/routes/billingRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BillingController_1 = __importDefault(require("../controllers/BillingController"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /billing:
 *   post:
 *     summary: Create a new bill
 *     description: Generates a new bill with details such as amount, due date, and related guest.
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestId:
 *                 type: integer
 *                 description: ID of the guest being billed.
 *                 example: 1
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Amount due for the bill.
 *                 example: 150.75
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Due date for the bill.
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: Bill created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post('/', BillingController_1.default.createBill);
/**
 * @swagger
 * /billing/{billId}/pay:
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
router.put('/:billId/pay', BillingController_1.default.payBill);
/**
 * @swagger
 * /billing:
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
router.get('/', BillingController_1.default.getBills);
/**
 * @swagger
 * /billing/{billId}:
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
router.get('/:billId', BillingController_1.default.getBillById);
exports.default = router;
