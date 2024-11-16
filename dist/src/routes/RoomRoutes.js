"use strict";
// src/routes/RoomRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoomController_1 = require("../controllers/RoomController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     description: Retrieves a list of all rooms with details such as room type, status, and price.
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         description: Server error.
 */
router.get('/', RoomController_1.RoomController.getAllRooms);
/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     description: Retrieves details of a specific room by its ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the room to retrieve.
 *     responses:
 *       200:
 *         description: Room details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', RoomController_1.RoomController.getRoomById);
/**
 * @swagger
 * /rooms/hotels/{tenantId}:
 *   get:
 *     summary: Get rooms by hotel ID
 *     description: Retrieves all rooms associated with a specific hotel by its ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hotel to retrieve rooms for.
 *     responses:
 *       200:
 *         description: List of rooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *       404:
 *         description: Hotel not found.
 *       500:
 *         description: Server error.
 */
router.get('/hotels/:tenantId', RoomController_1.RoomController.getRoomsByTenantId);
/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     description: Adds a new room with details such as room type, availability, price, and amenities.
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenantId:
 *                 type: string
 *                 description: The tenantId (e.g., "standford_09").
 *                 example: "standford_09"
 *               roomNumber:
 *                 type: string
 *                 description: The room number or identifier (e.g., "101", "202").
 *                 example: "101"
 *               roomType:
 *                 type: string
 *                 description: Type of the room (e.g., suite, single, double).
 *                 example: "suite"
 *               description:
 *                 type: string
 *                 description: A brief description of the room.
 *                 example: "A spacious suite with a sea view."
 *               pricePerNight:
 *                 type: number
 *                 description: Price per night for the room.
 *                 example: 150.00
 *               isAvailable:
 *                 type: boolean
 *                 description: Availability status of the room (true for available, false for unavailable).
 *                 example: true
 *               maintenanceStatus:
 *                 type: string
 *                 description: The current maintenance status of the room (e.g., "clean", "under maintenance").
 *                 example: "clean"
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of amenities available in the room.
 *                 example: ["WiFi", "TV", "Minibar"]
 *     responses:
 *       201:
 *         description: Room created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post('/', RoomController_1.RoomController.createRoom);
/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Update room details
 *     description: Updates details of an existing room by its ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the room to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomType:
 *                 type: string
 *                 description: Type of the room.
 *                 example: "suite"
 *               status:
 *                 type: string
 *                 description: Updated status of the room.
 *                 example: "occupied"
 *               price:
 *                 type: number
 *                 description: Updated price per night for the room.
 *                 example: 180.00
 *     responses:
 *       200:
 *         description: Room updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid input or room not found.
 *       404:
 *         description: Room not found.
 *       500:
 *         description: Server error.
 */
router.put('/:id', RoomController_1.RoomController.updateRoom);
/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     description: Removes a room from the system by its ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the room to delete.
 *     responses:
 *       204:
 *         description: Room deleted successfully.
 *       404:
 *         description: Room not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', RoomController_1.RoomController.deleteRoom);
exports.default = router;
