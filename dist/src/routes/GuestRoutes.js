"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GuestController_1 = __importDefault(require("../controllers/GuestController"));
const router = (0, express_1.Router)();
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
/**
 * @swagger
 * /guests:
 *   post:
 *     summary: Create a new guest
 *     description: Add a new guest to the system.
 *     tags: [Guest Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Guest'
 *           example:
 *             fullName: "John Doe"
 *             email: "johndoe@email.com"
 *             phone: "123-456-7890"
 *             address: "123 Street, City, Country"
 *     responses:
 *       201:
 *         description: Guest created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guest'
 *       400:
 *         description: Bad request.
 */
router.post('/', GuestController_1.default.createGuest);
/**
 * @swagger
 * /guests/{id}:
 *   put:
 *     summary: Update a guest by ID
 *     description: Update the details of a specific guest by their ID.
 *     tags: [Guest Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the guest to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Guest'
 *           example:
 *             fullName: "John Doe Updated"
 *             email: "john.doe.updated@email.com"
 *             phone: "987-654-3210"
 *             address: "456 Another St, City, Country"
 *     responses:
 *       200:
 *         description: Guest updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guest'
 *       400:
 *         description: Bad request.
 *       404:
 *         description: Guest not found.
 */
router.put('/:id', GuestController_1.default.updateGuest);
/**
 * @swagger
 * /guests/{id}:
 *   delete:
 *     summary: Delete a guest by ID
 *     description: Remove a specific guest from the system by their ID.
 *     tags: [Guest Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the guest to delete.
 *     responses:
 *       200:
 *         description: Guest deleted successfully.
 *       400:
 *         description: Bad request.
 *       404:
 *         description: Guest not found.
 */
router.delete('/:id', GuestController_1.default.deleteGuest);
exports.default = router;
