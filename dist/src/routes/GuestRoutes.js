"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/guestRoutes.ts
const express_1 = require("express");
const GuestController_1 = __importDefault(require("../controllers/GuestController"));
const router = (0, express_1.Router)();
// const guestController = new GuestController();
/**
 * @swagger
 * /guests:
 *   post:
 *     summary: Create a new guest
 *     description: Adds a new guest to the database with details like name and contact information.
 *     tags: [Guest Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the guest.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: Email address of the guest.
 *                 example: "johndoe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the guest.
 *                 example: "+123456789"
 *     responses:
 *       201:
 *         description: Guest created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guest'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post('/', GuestController_1.default.createGuest);
/**
 * @swagger
 * /guests:
 *   get:
 *     summary: Get all guests
 *     description: Retrieves a list of all guests.
 *     tags: [Guest Management]
 *     responses:
 *       200:
 *         description: List of guests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Guest'
 *       500:
 *         description: Server error.
 */
router.get('/', GuestController_1.default.getGuests);
/**
 * @swagger
 * /guests/{id}:
 *   get:
 *     summary: Get a guest by ID
 *     description: Retrieve details of a specific guest by their ID.
 *     tags: [Guest Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the guest.
 *     responses:
 *       200:
 *         description: Guest details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guest'
 *       404:
 *         description: Guest not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', GuestController_1.default.getGuestById);
exports.default = router;
