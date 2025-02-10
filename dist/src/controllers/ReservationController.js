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
const BillingService_1 = require("../services/BillingService");
const reservationService = new ReservationService_1.ReservationService();
class ReservationController {
    static createReservation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guestDetails, reservationDetails, createdBy, role, billingDetails } = req.body;
            try {
                const reservationRepo = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
                const bookedRoomRepo = data_source_1.AppDataSource.getRepository(BookedRoomEntity_1.BookedRoom);
                const promotionRepo = data_source_1.AppDataSource.getRepository(PromotionEntity_1.Promotion);
                // Find or create the guest
                let guest = yield GuestService_1.GuestService.findGuestByEmail(guestDetails[0].email);
                if (!guest) {
                    console.log("Guest not found, creating a new guest.");
                    guest = yield GuestService_1.GuestService.createGuest(guestDetails[0]);
                    console.log("New guest created:", guest);
                }
                if (!guest || !guest.id) {
                    console.log("Failed to create or retrieve guest.");
                    return res.status(500).json({ error: "Failed to create or retrieve guest." });
                }
                // Check for existing reservation with the same guest and reservation dates
                const existingReservation = yield reservationRepo.findOne({
                    where: {
                        guest: { id: guest.id },
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
                yield data_source_1.AppDataSource.manager.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    // Create a new reservation linked to the guest
                    const newReservation = transactionalEntityManager.create(ReservationEntity_1.Reservation, Object.assign(Object.assign({}, reservationDetails), { guest,
                        createdBy,
                        role, activity: reservationDetails.reservationStatus === constants_1.ReservationStatus.CONFIRMED ? constants_1.ActivityType.CHECK_IN : constants_1.ActivityType.PENDING_ARRIVAL, totalBalance: billingDetails.balance, totalPaid: billingDetails.amountPaid, grandTotal: billingDetails.grandTotal }));
                    // Save the reservation first to ensure it has an ID for association
                    const savedReservation = yield transactionalEntityManager.save(newReservation);
                    console.log("Reservation created:", savedReservation);
                    // Create booked rooms linked to the saved reservation
                    yield Promise.all(reservationDetails.rooms.map((room) => __awaiter(this, void 0, void 0, function* () {
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
                            console.log("Booked room saved:", bookedRoom);
                        }
                    })));
                    // Determine billing status
                    const billingStatus = billingDetails.grandTotal > billingDetails.amountPaid ? constants_1.BillingStatus.PART_PAYMENT : constants_1.BillingStatus.COMPLETE_PAYMENT;
                    // Create the new billing linked to the saved reservation
                    const newBilling = transactionalEntityManager.create(BillingEntity_1.Billing, Object.assign(Object.assign({}, billingDetails), { reservation: savedReservation, status: billingStatus }));
                    // Save the billing details
                    const savedBilling = yield transactionalEntityManager.save(newBilling);
                    // Update the promotion record if a discount code is used
                    if (billingDetails.discountCode) {
                        const promotion = yield promotionRepo.findOne({ where: { code: billingDetails.discountCode } });
                        if (promotion) {
                            promotion.status = "used";
                            promotion.usedBy = guestDetails[0].email;
                            promotion.usedFor = `Reservation ID: ${savedReservation.id}`;
                            yield transactionalEntityManager.save(promotion);
                            console.log("Promotion updated:", promotion);
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
                res.status(200).json({ reservation });
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
            const data = Object.assign({}, req.body);
            try {
                const updatedReservation = yield ReservationService_1.ReservationService.updateReservation(parseInt(id), data);
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
    static addPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reservationId, amountPaid, paymentMethod } = req.body;
            try {
                yield data_source_1.AppDataSource.manager.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const reservationRepo = transactionalEntityManager.getRepository(ReservationEntity_1.Reservation);
                    // Find the reservation
                    const reservation = yield reservationRepo.findOne({
                        where: { id: reservationId },
                        relations: ["billing", "guest"], // Ensure "guest" is included
                    });
                    if (!reservation) {
                        return res.status(404).json({ error: "Reservation not found" });
                    }
                    // Convert numeric fields from string to number
                    const totalPaid = Number(reservation.totalPaid) || 0;
                    const grandTotal = Number(reservation.grandTotal) || 0;
                    const newAmountPaid = Number(amountPaid) || 0;
                    // Calculate new totalPaid and balance
                    const updatedTotalPaid = totalPaid + newAmountPaid;
                    let updatedBalance = grandTotal - updatedTotalPaid;
                    // Prevent negative balance
                    if (updatedBalance < 0) {
                        updatedBalance = 0;
                    }
                    // Update Reservation table
                    reservation.totalPaid = updatedTotalPaid;
                    reservation.totalBalance = updatedBalance;
                    // Save updated reservation
                    const savedReservation = yield reservationRepo.save(reservation);
                    console.log("Reservation Updated:", savedReservation);
                    // Ensure guest exists
                    const guestName = ((_a = reservation.guest) === null || _a === void 0 ? void 0 : _a.fullName) || "Unknown Guest";
                    // Use the BillingService to create a new billing entry
                    const newBilling = yield BillingService_1.BillingService.createBill({
                        amountPaid: newAmountPaid,
                        payment_method: paymentMethod,
                        balance: updatedBalance,
                        billTo: guestName,
                        reservation: savedReservation, // Pass the updated reservation object
                    });
                    // console.log("Billing Created:", newBilling);
                    res.status(200).json({
                        statusCode: 200,
                        message: "Payment added successfully",
                        totalPaid: updatedTotalPaid.toFixed(2),
                        totalBalance: updatedBalance.toFixed(2),
                    });
                }));
            }
            catch (error) {
                console.error("Error adding payment:", error.message);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    static exchangeRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reservationId, roomId, roomName, checkOutDate, roomPrice, grandTotal, updatedAt, } = req.body;
            try {
                yield data_source_1.AppDataSource.manager.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    const reservationRepo = transactionalEntityManager.getRepository(ReservationEntity_1.Reservation);
                    const bookedRoomRepo = transactionalEntityManager.getRepository(BookedRoomEntity_1.BookedRoom);
                    // Find the reservation
                    const reservation = yield reservationRepo.findOne({
                        where: { id: reservationId },
                        relations: ["bookedRooms"], // Ensure "bookedRooms" is included
                    });
                    if (!reservation) {
                        return res.status(404).json({ error: "Reservation not found" });
                    }
                    // Update the reservation details
                    reservation.checkOutDate = checkOutDate;
                    reservation.grandTotal = grandTotal;
                    reservation.updatedAt = new Date(updatedAt);
                    // Update the booked room details
                    const bookedRoom = reservation.bookedRooms[0];
                    bookedRoom.room = roomId;
                    bookedRoom.roomName = roomName;
                    bookedRoom.roomPrice = roomPrice;
                    // Save updated reservation and booked room
                    // console.log("reservation:", reservation);
                    // console.log("bookedRoom:", bookedRoom);
                    yield reservationRepo.save(reservation);
                    yield bookedRoomRepo.save(bookedRoom);
                    res.status(200).json({
                        statusCode: 200,
                        message: "Room exchanged successfully",
                        reservation,
                        bookedRoom,
                    });
                }));
            }
            catch (error) {
                console.error("Error exchanging room:", error.message);
                res.status(500).json({ error: "Internal Server Error" });
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
