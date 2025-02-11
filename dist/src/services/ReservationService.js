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
exports.ReservationService = void 0;
const data_source_1 = require("../data-source"); // Your database connection
const ReservationEntity_1 = require("../entities/ReservationEntity");
const BookedRoomEntity_1 = require("../entities/BookedRoomEntity");
const BillingEntity_1 = require("../entities/BillingEntity");
const typeorm_1 = require("typeorm");
const constants_1 = require("../constants");
let reservationRepository;
class ReservationService {
    constructor() {
        reservationRepository = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
    }
    static getReservations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield reservationRepository.find();
        });
    }
    static getActivityMetrics(hotelId, createdAt, confirmedDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservationRepo = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
                // Build the where condition dynamically based on the provided filters
                const whereCondition = {
                    hotelId, // Always filter by hotelId
                };
                // Conditionally add createdAt filter
                if (createdAt) {
                    whereCondition.createdAt = createdAt;
                }
                // Conditionally add confirmedDate filter
                if (confirmedDate) {
                    whereCondition.confirmedDate = confirmedDate;
                }
                // Query reservations for totals based on activity and filters
                const activityMetrics = yield Promise.all(Object.entries(constants_1.ActivityType).map((_a) => __awaiter(this, [_a], void 0, function* ([key, label]) {
                    const activityKey = key; // Cast key to keyof Activity
                    const totalCount = yield reservationRepo.count({
                        where: Object.assign({ activity: constants_1.ActivityType[activityKey] }, whereCondition),
                    });
                    return {
                        label,
                        value: totalCount,
                        key: key.toLowerCase(), // Format key in lowercase (e.g., ARRIVAL -> arrival)
                    };
                })));
                return activityMetrics;
            }
            catch (error) {
                console.error('Error calculating activity metrics:', error);
                throw new Error('Error calculating activity metrics');
            }
        });
    }
    static getReservationsByHotelId(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch reservations by hotelId
                const reservations = yield reservationRepository.find({
                    where: { hotel: { id: hotelId } },
                    relations: ["guest", "billing", "hotel", "bookedRooms", "bookedRooms.room"], // Include related entities
                    order: { id: "DESC" } // Sort by id in descending order
                });
                const formatter = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                });
                // Map reservations to the desired structure
                const guests = reservations.map((reservation) => {
                    const checkInDate = new Date(reservation.checkInDate);
                    const checkOutDate = new Date(reservation.checkOutDate);
                    const dates = `${checkInDate.toLocaleDateString('en-US')} - ${checkOutDate.toLocaleDateString('en-US')}`;
                    const createdAt = reservation.createdAt;
                    const formattedDate = new Date(createdAt).toISOString().split('T')[0];
                    // Aggregate the details of booked rooms
                    const roomDetails = reservation.bookedRooms.map(bookedRoom => ({
                        roomName: bookedRoom.room.roomName,
                        numberOfAdults: bookedRoom.numberOfAdults,
                        numberOfChildren: bookedRoom.numberOfChildren,
                        roomPrice: bookedRoom.roomPrice,
                    }));
                    return {
                        id: reservation.id.toString(),
                        name: reservation.guest.fullName,
                        rooms: roomDetails,
                        dates: dates,
                        email: reservation.guest.email,
                        phone: reservation.guest.phone,
                        specialRequests: reservation.specialRequest ? reservation.specialRequest.join(", ") : "", // Join array as comma-separated string or default to empty string
                        notes: reservation.notes || '', // If notes are available
                        status: reservation.reservationStatus,
                        activity: reservation.activity || 'arrivals', // Default to 'arrivals' if activity is not specified
                        billing: reservation.billing,
                        totalBalance: reservation.totalBalance,
                        totalPaid: reservation.totalPaid,
                        grandTotal: reservation.grandTotal,
                        createdAt: formattedDate
                    };
                });
                // console.log("Test 1", guests);
                return guests;
            }
            catch (error) {
                console.error("Error fetching reservations by hotelId:", error.message);
                throw error;
            }
        });
    }
    static getReservationById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, relations = []) {
            try {
                const reservationRepo = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
                const reservation = yield reservationRepo.findOne({
                    where: { id },
                    relations, // Dynamically include the specified relations
                });
                if (!reservation) {
                    return null;
                }
                const formatter = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                });
                const checkInDate = new Date(reservation.checkInDate);
                const checkOutDate = new Date(reservation.checkOutDate);
                const numberOfNights = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24);
                // Aggregate the details of booked rooms
                const roomDetails = reservation.bookedRooms.map(bookedRoom => ({
                    roomName: bookedRoom.room.roomName,
                    numberOfAdults: bookedRoom.numberOfAdults,
                    numberOfChildren: bookedRoom.numberOfChildren,
                    roomPrice: bookedRoom.roomPrice,
                }));
                // console.log("roomDetails", roomDetails);
                // reservationDetails: {
                //   id: reservation.id,
                //   checkInDate: reservation.checkInDate,
                //   checkOutDate: reservation.checkOutDate,
                //   hotelId: reservation.hotelId,
                //   activity: reservation.activity,
                //   reservationType: reservation.reservationType,
                //   reservationStatus: reservation.reservationStatus,
                //   paymentStatus: reservation.paymentStatus,
                //   totalBalance: reservation.totalBalance,
                //   totalPaid: reservation.totalPaid,
                //   grandTotal: reservation.grandTotal,
                //   createdBy: reservation.createdBy,
                //   numberOfNights: reservation.numberOfNights,
                //   role: reservation.role,
                //   createdAt: reservation.createdAt,
                //   updatedAt: reservation.updatedAt,
                //   specialRequest: reservation.specialRequest,
                //   notes: reservation.notes,
                //   confirmedDate: reservation.confirmedDate,
                //   guest: reservation.guest, // Associated guest details
                //   billing: reservation.billing, // Associated billing details
                //   bookedRooms: reservation.bookedRooms.map(room => ({
                //     id: room.id,
                //     roomName: room.roomName,
                //     numberOfAdults: room.numberOfAdults,
                //     numberOfChildren: room.numberOfChildren,
                //     roomPrice: room.roomPrice
                //   }))
                // }
                const formattedReservation = {
                    id: reservation.id.toString(),
                    checkInDate: reservation.checkInDate,
                    checkOutDate: reservation.checkOutDate,
                    hotelId: reservation.hotelId,
                    activity: reservation.activity,
                    reservationType: reservation.reservationType,
                    reservationStatus: reservation.reservationStatus,
                    paymentStatus: reservation.paymentStatus,
                    totalBalance: reservation.totalBalance,
                    totalPaid: reservation.totalPaid,
                    grandTotal: reservation.grandTotal,
                    createdBy: reservation.createdBy,
                    numberOfNights: numberOfNights,
                    nightSpent: reservation.nightSpent,
                    role: reservation.role,
                    createdAt: reservation.createdAt,
                    updatedAt: reservation.updatedAt,
                    specialRequest: reservation.specialRequest,
                    notes: reservation.notes,
                    confirmedDate: reservation.confirmedDate,
                    guest: reservation.guest,
                    billing: reservation.billing,
                    bookedRooms: roomDetails,
                };
                // console.log("Test 2", formattedReservation);
                return formattedReservation;
            }
            catch (error) {
                console.error("Error fetching reservation by id:", error.message);
                throw error;
            }
        });
    }
    /**
   * Fetch multiple reservations by their IDs.
   * @param ids - An array of reservation IDs
   * @returns A promise that resolves to an array of reservations
   */
    static getReservationsByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield reservationRepository.find({
                where: { id: (0, typeorm_1.In)(ids) },
            });
        });
    }
    createReservation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newReservation = reservationRepository.create(data);
            return yield reservationRepository.save(newReservation);
        });
    }
    static updateReservation(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield reservationRepository.findOne({
                where: { id }
            });
            if (!reservation)
                return null;
            Object.assign(reservation, data);
            return yield reservationRepository.save(reservation);
        });
    }
    static deleteReservation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservationRepository = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
            const bookedRoomRepository = data_source_1.AppDataSource.getRepository(BookedRoomEntity_1.BookedRoom);
            const billingRepository = data_source_1.AppDataSource.getRepository(BillingEntity_1.Billing);
            const reservation = yield reservationRepository.findOne({ where: { id } });
            if (!reservation) {
                return false;
            }
            yield data_source_1.AppDataSource.manager.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                // Delete related booked rooms
                yield transactionalEntityManager.delete(BookedRoomEntity_1.BookedRoom, { reservation });
                // Delete related billing records
                yield transactionalEntityManager.delete(BillingEntity_1.Billing, { reservation });
                // Delete the reservation itself
                yield transactionalEntityManager.delete(ReservationEntity_1.Reservation, { id });
            }));
            return true;
        });
    }
    static determineStatus(reservation, currentDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date(currentDate);
            const checkInDate = new Date(reservation.checkInDate);
            const checkOutDate = new Date(reservation.checkOutDate);
            if (reservation.activity === constants_1.ActivityType.CANCELLED) {
                return { activity: "Cancellation", cta: ["Confirm Cancellation", "Reject Cancellation"] };
            }
            if (reservation.reservationType === constants_1.ReservationType.ONLINE_RESERVATION && reservation.reservationStatus === constants_1.ReservationStatus.CONFIRMED) {
                return { activity: "Bookings", cta: ["Confirm"] };
            }
            if (today.toDateString() === checkInDate.toDateString()) {
                return { activity: "Arrival", cta: ["Check-In"] };
            }
            if (today.toDateString() === checkOutDate.toDateString()) {
                return { activity: "Departure", cta: ["Check-Out"] };
            }
            if (today > checkInDate && today < checkOutDate) {
                return { activity: "In-House", cta: ["Manage Stay"] };
            }
            return { activity: "Unknown", cta: [] };
        });
    }
}
exports.ReservationService = ReservationService;
