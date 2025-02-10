import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController";

const router = Router();


/**
 * @swagger
 * /api/reservations/by-hotel/{hotelId}:
 *   get:
 *     summary: Retrieve reservations by hotel ID
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         description: ID of the hotel to retrieve reservations for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: List of reservations for the specified hotel
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get("/by-hotel/:hotelId", ReservationController.getReservationsByHotelId);


/**
 * @swagger
 * /api/reservations/activity-options:
 *   get:
 *     summary: Retrieve available activity options
 *     tags:
 *       - Reservations
 *     description: Fetch a list of available options for room activity or maintenance statuses.
 *     responses:
 *       200:
 *         description: A list of activity or maintenance status options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   label:
 *                     type: string
 *                     description: The display label for the activity option.
 *                   value:
 *                     type: string
 *                     description: The corresponding value for the activity option.
 */
router.get('/activity-options', ReservationController.getActivityOptions);

/**
 * @swagger
 * /api/reservations/activity-metrics:
 *   get:
 *     summary: Retrieve activity metrics
 *     tags:
 *       - Reservations
 *     description: Fetch metrics related to reservation activities or statuses, optionally filtered by hotelId, createdAt, and confirmedDate.
 *     parameters:
 *       - in: query
 *         name: hotelId
 *         required: false
 *         schema:
 *           type: string
 *         description: The ID of the hotel to filter activity metrics.
 *       - in: query
 *         name: createdAt
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date to filter activity metrics by creation date.
 *       - in: query
 *         name: confirmedDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date to filter activity metrics by confirmation date.
 *     responses:
 *       200:
 *         description: A list of activity metrics with associated labels and values
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   label:
 *                     type: string
 *                     description: The display label for the metric.
 *                   value:
 *                     type: number
 *                     description: The corresponding value for the metric.
 */
router.get('/activity-metrics', ReservationController.getActivityMetrics);


/**
 * @swagger
 * /api/reservations/add-payment:
 *   post:
 *     summary: Add a payment to a reservation
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 example: 1
 *               amountPaid:
 *                 type: number
 *                 example: 5000.00
 *               paymentMethod:
 *                 type: string
 *                 example: "cash"
 *     responses:
 *       200:
 *         description: Payment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Payment added successfully"
 *                 totalPaid:
 *                   type: number
 *                   example: 15000.00
 *                 totalBalance:
 *                   type: number
 *                   example: 35000.00
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Reservation not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/add-payment", ReservationController.addPayment);



/**
 * @swagger
 * /api/reservations/exchange-room:
 *   post:
 *     summary: Exchange a room in a reservation
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: integer
 *                 example: 1
 *               roomName:
 *                 type: string
 *                 example: "Deluxe Suite"
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-10"
 *               roomPrice:
 *                 type: number
 *                 example: 200.00
 *               grandTotal:
 *                 type: number
 *                 example: 4000.00
 *     responses:
 *       200:
 *         description: Room exchanged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Room exchanged successfully"
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     checkOutDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-02-10"
 *                     grandTotal:
 *                       type: number
 *                       example: 4000.00
 *                 bookedRoom:
 *                   type: object
 *                   properties:
 *                     roomName:
 *                       type: string
 *                       example: "Deluxe Suite"
 *                     roomPrice:
 *                       type: number
 *                       example: 200.00
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Reservation not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.post("/exchange-room", ReservationController.exchangeRoom);


/**
 * @swagger
 * /api/reservations/by-id/{reservationId}:
 *   get:
 *     summary: Retrieve a reservation by ID
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         description: ID of the reservation
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the reservation
 */
router.get("/by-id/:reservationId", ReservationController.getReservation);


/**
 * @swagger
 * /api/reservations/by-id/{reservationId}/status:
 *   get:
 *     summary: Get the current status of a reservation
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         description: ID of the reservation
 *         schema:
 *           type: string
 *       - in: query
 *         name: currentDate
 *         required: true
 *         description: Current date to determine reservation status
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved the status of the reservation
 */
router.get("/by-id/:reservationId/status", ReservationController.getReservationStatus);


/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestDetails:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   idProof:
 *                     type: string
 *                     nullable: true
 *                   identityType:
 *                     type: string
 *                     nullable: true
 *                   identityNumber:
 *                     type: string
 *                     nullable: true
 *                   nationality:
 *                     type: string
 *                     nullable: true
 *                   gender:
 *                     type: string
 *                     nullable: true
 *               reservationDetails:
 *                 type: object
 *                 properties:
 *                   checkInDate:
 *                     type: string
 *                     format: date
 *                   checkOutDate:
 *                     type: string
 *                     format: date
 *                   reservationType:
 *                     type: string
 *                     enum:
 *                       - Walk-In
 *                       - Booked-Online
 *                   status:
 *                     type: string
 *                     enum:
 *                       - pending
 *                       - completed
 *                       - cancelled
 *                   activity:
 *                     type: string
 *                     enum:
 *                       - Arrival
 *                       - In-House
 *                       - Departure
 *                       - Bookings
 *                       - Cancellation
 *                   paymentStatus:
 *                     type: boolean
 *                   confirmedDate:
 *                     type: string
 *                     format: date
 *                     description: Date when the reservation was confirmed (if applicable).
 *                   specialRequest:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Optional special requests made by the guest.
 *                   notes:
 *                     type: string
 *                     nullable: true
 *               billingDetails:
 *                 type: object
 *                 properties:
 *                   amountPaid:
 *                     type: number
 *                     format: float
 *                   balance:
 *                     type: number
 *                     format: float
 *                   excess:
 *                     type: number
 *                     format: float
 *                     nullable: true
 *                   totalPrice:
 *                     type: number
 *                     format: float
 *                   grandTotal:
 *                     type: number
 *                     format: float
 *                   isAddTax:
 *                     type: boolean
 *                     default: false
 *                   taxValue:
 *                     type: number
 *                     format: float
 *                     nullable: true
 *                   status:
 *                     type: string
 *                     enum:
 *                       - complete_payment
 *                       - part_payment
 *                       - request_refund
 *                       - refunded
 *                   payment_method:
 *                     type: string
 *                     enum:
 *                       - credit_card
 *                       - paypal
 *                       - cash
 *                   discountCode:
 *                     type: string
 *                     nullable: true
 *                   promotionType:
 *                     type: string
 *                     nullable: true
 *                   promotionAmount:
 *                     type: number
 *                     format: float
 *                     nullable: true
 *                   due_date:
 *                     type: string
 *                     format: date
 *                     nullable: true
 *                   billing_address:
 *                     type: string
 *                     nullable: true
 *                   payment_date:
 *                     type: string
 *                     format: date
 *                     nullable: true
 *               createdBy:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error creating reservation"
 */
router.post("/", ReservationController.createReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update an existing reservation by ID
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the reservation to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       200:
 *         description: Successfully updated the reservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 */
router.put("/:id", ReservationController.updateReservation);


/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the reservation to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successfully deleted the reservation
 *       404:
 *         description: Reservation not found
 */
router.delete("/:id", ReservationController.deleteReservation);





export default router;
