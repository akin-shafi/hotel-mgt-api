"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// hotelRoutes.ts
const express_1 = require("express");
const HotelController_1 = __importDefault(require("../controllers/HotelController"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /property-info:
 *   post:
 *     summary: Create a new property
 *     description: Adds a new hotel to the database with details such as name, address, city, country, phone, email, logo URL, theme, and amenities.
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the hotel.
 *                 example: "Standford"
 *               address:
 *                 type: string
 *                 description: Address of the hotel.
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 description: City where the hotel is located.
 *                 example: "New York"
 *               country:
 *                 type: string
 *                 description: Country where the hotel is located.
 *                 example: "USA"
 *               phone:
 *                 type: string
 *                 description: Phone number for the hotel.
 *                 example: "+1 234 567 890"
 *               email:
 *                 type: string
 *                 description: Email address for the hotel.
 *                 example: "contact@standfordhotel.com"
 *     responses:
 *       201:
 *         description: Hotel created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post('/', HotelController_1.default.createOrUpdateHotel);
/**
 * @swagger
 * /property-details:
 *   post:
 *     summary: Create a new hotel
 *     description: Adds a new hotel to the database with details such as name, address, city, country, phone, email, logo URL, theme, and amenities.
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the hotel.
 *                 example: "Standford"
 *               address:
 *                 type: string
 *                 description: Address of the hotel.
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 description: City where the hotel is located.
 *                 example: "New York"
 *               country:
 *                 type: string
 *                 description: Country where the hotel is located.
 *                 example: "USA"
 *               phone:
 *                 type: string
 *                 description: Phone number for the hotel.
 *                 example: "+1 234 567 890"
 *               email:
 *                 type: string
 *                 description: Email address for the hotel.
 *                 example: "contact@standfordhotel.com"
 *               logoUrl:
 *                 type: string
 *                 description: URL for the hotel logo.
 *                 example: "http://example.com/logo.png"
 *               theme:
 *                 type: string
 *                 description: Theme of the hotel.
 *                 example: "Modern"
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of amenities available at the hotel.
 *                 example: ["Free Wi-Fi", "Pool", "Gym"]
 *               policies:
 *                 type: object
 *                 description: Policies for the hotel (e.g., cancellation, pets, check-in times).
 *                 example: { "cancellation": "24 hours", "pets": "allowed" }
 *     responses:
 *       201:
 *         description: Hotel created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post('/', HotelController_1.default.createOrUpdateHotel);
/**
 * @swagger
 * /property-details:
 *   get:
 *     summary: Get all hotels
 *     description: Retrieves a list of all hotels.
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: List of hotels.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 *       500:
 *         description: Server error.
 */
router.get('/', HotelController_1.default.getAllHotels);
/**
 * @swagger
 * /property-details/{id}:
 *   get:
 *     summary: Get a hotel by ID
 *     description: Retrieve details of a specific hotel by its ID.
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the hotel.
 *     responses:
 *       200:
 *         description: Hotels.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', HotelController_1.default.getHotelById);
/**
 *
 *
 * @swagger
 * /property-details/tenant/{tenantId}:
 *   get:
 *     summary: Get a hotel by tenantId
 *     description: Retrieve details of a specific hotel by its tenantId.
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *         description: Tenant ID of the hotel.
 *     responses:
 *       200:
 *         description: Hotels.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel not found.
 *       500:
 *         description: Server error.
 */
router.get('/tenant/:tenantId', HotelController_1.default.getHotelByTenantId);
/**
 * @swagger
 * /property-details/{id}:
 *   put:
 *     summary: Update a hotel
 *     description: Updates a hotel's details by ID.
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the hotel to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the hotel.
 *                 example: "Updated Hotel Name"
 *               logoUrl:
 *                 type: string
 *                 description: Updated logo URL.
 *                 example: "http://example.com/new-logo.png"
 *               theme:
 *                 type: string
 *                 description: New theme for the hotel.
 *                 example: "Classic"
 *     responses:
 *       200:
 *         description: Hotel updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel not found.
 *       500:
 *         description: Server error.
 */
router.put('/:id', HotelController_1.default.updateHotel);
/**
 * @swagger
 * /property-details/{id}:
 *   delete:
 *     summary: Delete a hotel
 *     description: Deletes a hotel by its ID.
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the hotel to delete.
 *     responses:
 *       200:
 *         description: Hotel deleted successfully.
 *       404:
 *         description: Hotel not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', HotelController_1.default.deleteHotel);
exports.default = router;
// router.post('/property-details', HotelController.createHotel);
// router.get('/property-details', HotelController.getAllHotels);
// router.get('/property-details/:id', HotelController.getHotelById);
// router.get('/property-details/tenant/:tenantId', HotelController.getHotelByTenantId);
// router.put('/property-details/:id', HotelController.updateHotel);
// router.delete('/property-details/:id', HotelController.deleteHotel);
// export default router;
