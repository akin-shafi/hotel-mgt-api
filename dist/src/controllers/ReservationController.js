"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
const ReservationService_1 = require("../services/ReservationService");
const BillingEntity_1 = require("../entities/BillingEntity");
const GuestService_1 = require("../services/GuestService");
const ReservationEntity_1 = require("../entities/ReservationEntity");
const BookedRoomEntity_1 = require("../entities/BookedRoomEntity");
const data_source_1 = require("../data-source");
const constants_1 = require("../constants");
const PromotionEntity_1 = require("../entities/PromotionEntity");
const RoomEntity_1 = require("../entities/RoomEntity");
const reservationService = new ReservationService_1.ReservationService();
class ReservationController {
    static createReservation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guestDetails, reservationDetails, createdBy, role, billingDetails } = req.body;
            try {
                const reservationRepo = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
                const bookedRoomRepo = data_source_1.AppDataSource.getRepository(BookedRoomEntity_1.BookedRoom);
                const promotionRepo = data_source_1.AppDataSource.getRepository(PromotionEntity_1.Promotion);
                console.log("Guest object:", guestDetails[0].email);
                // Use the getGuestByEmail service to find an existing guest
                let guest = yield GuestService_1.GuestService.findGuestByEmail(guestDetails[0].email);
                if (!guest) {
                    // Create a new guest if no record exists
                    guest = yield GuestService_1.GuestService.createGuest(guestDetails);
                }
                // Debug: Log the guest object
                // console.log("Guest object:", guest);
                // Check for existing reservation with the same guest and reservation dates
                const existingReservation = yield reservationRepo.findOne({
                    where: {
                        guest: { id: guest.id }, // Ensure the guest ID is used
                        checkInDate: reservationDetails.checkInDate,
                        checkOutDate: reservationDetails.checkOutDate,
                    },
                });
                if (existingReservation) {
                    return res.status(400).json({ error: "Reservation already exists for the same dates." });
                }
                // Validate reservation type and status using enums
                if (!Object.values(constants_1.ReservationType).includes(reservationDetails.reservationType)) {
                    return res.status(400).json({ error: "Invalid reservation type." });
                }
                if (!Object.values(constants_1.ReservationStatus).includes(reservationDetails.reservationStatus)) {
                    return res.status(400).json({ error: "Invalid reservation status." });
                }
                // Start a transaction to ensure both reservation and billing are saved atomically
                yield data_source_1.AppDataSource.manager.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    // Create a new reservation linked to the guest
                    const newReservation = transactionalEntityManager.create(ReservationEntity_1.Reservation, Object.assign(Object.assign({}, reservationDetails), { guest, // Ensure this is a valid guest object with an `id`
                        createdBy,
                        role }));
                    // Save the reservation first to ensure it has an ID for association
                    const savedReservation = yield transactionalEntityManager.save(newReservation);
                    // Create booked rooms linked to the saved reservation
                    for (const room of reservationDetails.rooms) {
                        const roomEntity = yield transactionalEntityManager.findOne(RoomEntity_1.Room, { where: { roomName: room.roomName, hotelId: reservationDetails.hotelId } });
                        if (roomEntity) {
                            const bookedRoom = transactionalEntityManager.create(BookedRoomEntity_1.BookedRoom, {
                                reservation: savedReservation,
                                room: roomEntity,
                                numberOfAdults: room.numberOfAdults,
                                numberOfChildren: room.numberOfChildren,
                                roomPrice: room.roomPrice,
                                roomName: room.roomName,
                            });
                            yield transactionalEntityManager.save(bookedRoom);
                        }
                    }
                    // Determine billing status
                    const billingStatus = billingDetails.grandTotal > billingDetails.amountPaid
                        ? constants_1.BillingStatus.PART_PAYMENT
                        : constants_1.BillingStatus.COMPLETE_PAYMENT;
                    // Create the new billing linked to the saved reservation
                    const newBilling = transactionalEntityManager.create(BillingEntity_1.Billing, Object.assign(Object.assign({}, billingDetails), { reservation: savedReservation, status: billingStatus }));
                    // Save the billing details
                    yield transactionalEntityManager.save(newBilling);
                    // Update the promotion record if a discount code is used
                    if (billingDetails.discountCode) {
                        const promotion = yield promotionRepo.findOne({
                            where: {
                                code: billingDetails.discountCode,
                            },
                        });
                        if (promotion) {
                            promotion.status = "used";
                            promotion.usedBy = guestDetails.email;
                            promotion.usedFor = `Reservation ID: ${savedReservation.id}`;
                            yield transactionalEntityManager.save(promotion);
                        }
                    }
                    // Send response with the new reservation and billing details
                    res.status(200).json({
                        statusCode: 200,
                        reservationId: savedReservation.id,
                        message: "Reservation successful",
                    });
                }));
            }
            catch (error) {
                console.error("Error creating reservation:", error.message);
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getReservationsByHotelId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId } = req.params;
                // Validate hotelId
                if (!hotelId || isNaN(Number(hotelId))) {
                    return res.status(400).json({ message: "Invalid hotelId provided." });
                }
                const reservations = yield ReservationService_1.ReservationService.getReservationsByHotelId(Number(hotelId));
                // if (reservations.length === 0) {
                //   return res
                //     .status(404)
                //     .json({ message: `No reservations found for hotel with ID ${hotelId}.` });
                // }
                if (reservations.length === 0) {
                    return res.status(200).json([]);
                }
                res.status(200).json(reservations);
            }
            catch (error) {
                console.error("Error fetching reservations by hotelId:", error.message);
                res.status(500).json({ error: error.message });
            }
        });
    }
    // static async getReservation(req, res) {
    //   const { reservationId } = req.params;
    //   // Check if the id parameter is a valid integer
    //   if (isNaN(parseInt(reservationId))) {
    //     return res.status(400).json({ message: "Invalid reservation ID" });
    //   }
    //   try {
    //     // Fetch the reservation with guest and billing details
    //     const reservation = await ReservationService.getReservationById(parseInt(reservationId), ["guest", "billing"]);
    //     if (!reservation) {
    //       return res.status(404).json({ message: "Reservation not found" });
    //     }
    //     // Format the response to include all relevant details
    //     res.status(200).json({
    //       reservationDetails: {
    //         ...reservation, // Includes reservation data
    //         guest: reservation.guest, // Associated guest details
    //         billing: reservation.billing, // Associated billing details
    //       },
    //     });
    //   } catch (err) {
    //     console.error("Error fetching reservation:", err.message);
    //     res.status(500).json({ error: err.message });
    //   }
    // }
    static getReservation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reservationId } = req.params;
            // Check if the id parameter is a valid integer
            if (isNaN(parseInt(reservationId))) {
                return res.status(400).json({ message: "Invalid reservation ID" });
            }
            try {
                // Fetch the reservation with guest and billing details
                const reservation = yield ReservationService_1.ReservationService.getReservationById(parseInt(reservationId), ["guest", "billing", "bookedRooms", "bookedRooms.room"]);
                if (!reservation) {
                    return res.status(404).json({ message: "Reservation not found" });
                }
                // Format the response to include all relevant details
                res.status(200).json({
                    reservationDetails: {
                        id: reservation.id,
                        checkInDate: reservation.checkInDate,
                        checkOutDate: reservation.checkOutDate,
                        hotelId: reservation.hotelId,
                        activity: reservation.activity,
                        reservationType: reservation.reservationType,
                        reservationStatus: reservation.reservationStatus,
                        paymentStatus: reservation.paymentStatus,
                        createdBy: reservation.createdBy,
                        numberOfNights: reservation.numberOfNights,
                        role: reservation.role,
                        createdAt: reservation.createdAt,
                        updatedAt: reservation.updatedAt,
                        specialRequest: reservation.specialRequest,
                        notes: reservation.notes,
                        confirmedDate: reservation.confirmedDate,
                        guest: reservation.guest, // Associated guest details
                        billing: reservation.billing, // Associated billing details
                        bookedRooms: reservation.bookedRooms.map(room => ({
                            id: room.id,
                            roomName: room.roomName,
                            numberOfAdults: room.numberOfAdults,
                            numberOfChildren: room.numberOfChildren,
                            roomPrice: room.roomPrice
                        }))
                    }
                });
            }
            catch (err) {
                console.error("Error fetching reservation:", err.message);
                res.status(500).json({ error: err.message });
            }
        });
    }
    // Create
    static updateReservation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const updatedReservation = yield ReservationService_1.ReservationService.updateReservation(parseInt(id), req.body);
                if (!updatedReservation) {
                    return res.status(404).json({ message: "Reservation not found" });
                }
                res.json(updatedReservation);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
    static deleteReservation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deleted = yield ReservationService_1.ReservationService.deleteReservation(parseInt(id));
                if (!deleted) {
                    return res.status(404).json({ message: "Reservation not found" });
                }
                res.status(204).send();
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
    static getReservationStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { currentDate } = req.query;
            try {
                const reservation = yield ReservationService_1.ReservationService.getReservationById(parseInt(id));
                if (!reservation) {
                    return res.status(404).json({ message: "Reservation not found" });
                }
                const status = yield ReservationService_1.ReservationService.determineStatus(reservation, new Date(currentDate));
                res.json(status);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
    static getActivityOptions(req, res) {
        try {
            // Convert enum to an array of objects with label and value
            const ActivityOptions = Object.keys(constants_1.ActivityType).map(key => {
                return {
                    label: key.replace(/_/g, ' ').toUpperCase(), // Format the label (e.g., UNDER_MAINTENANCE -> Under Maintenance)
                    value: constants_1.ActivityType[key] // Get the enum value
                };
            });
            // Send a response with the maintenance statuses
            res.status(200).json(ActivityOptions);
        }
        catch (error) {
            // Handle any errors and send a server error response
            res.status(500).json({ message: 'Error fetching activity options' });
        }
    }
    static getActivityMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract parameters from query string or request body (assuming GET request with query params)
                const { hotelId, createdAt, confirmedDate } = req.query;
                // Ensure createdAt and confirmedDate are valid dates if provided
                const createdAtDate = createdAt ? new Date(createdAt) : undefined;
                const confirmedDateDate = confirmedDate ? new Date(confirmedDate) : undefined;
                // Call the service method with extracted parameters
                const activityMetrics = yield ReservationService_1.ReservationService.getActivityMetrics(hotelId, createdAtDate, confirmedDateDate);
                // Return the activity metrics as a JSON response
                res.status(200).json(activityMetrics);
            }
            catch (error) {
                console.error('Error fetching activity metrics:', error);
                res.status(500).json({ message: 'Error fetching activity metrics' });
            }
        });
    }
}
exports.ReservationController = ReservationController;
