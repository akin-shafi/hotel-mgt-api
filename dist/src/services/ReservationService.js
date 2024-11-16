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
// src/services/ReservationService.ts
const data_source_1 = require("../data-source");
const ReservationEntity_1 = require("../entities/ReservationEntity");
const GuestEntity_1 = require("../entities/GuestEntity");
const RoomEntity_1 = require("../entities/RoomEntity");
class ReservationService {
    constructor() {
        this.reservationRepository = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
        this.guestRepository = data_source_1.AppDataSource.getRepository(GuestEntity_1.Guest);
        this.roomRepository = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room);
    }
    createReservation(checkInDate, checkOutDate, guestId, roomId, totalAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const guest = yield this.guestRepository.findOne({ where: { id: guestId } });
            const room = yield this.roomRepository.findOne({ where: { id: roomId } });
            if (!guest)
                throw new Error('Guest not found');
            if (!room || !room.isAvailable)
                throw new Error('Room is not available');
            const reservation = this.reservationRepository.create({
                checkInDate,
                checkOutDate,
                guest,
                room,
                totalAmount,
                status: 'pending',
            });
            yield this.reservationRepository.save(reservation);
            room.isAvailable = false; // Mark the room as unavailable
            yield this.roomRepository.save(room);
            return reservation;
        });
    }
    getReservations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reservationRepository.find({ relations: ['guest', 'room'] });
        });
    }
    updateReservationStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield this.reservationRepository.findOne({ where: { id } });
            if (!reservation)
                throw new Error('Reservation not found');
            reservation.status = status;
            yield this.reservationRepository.save(reservation);
            return reservation;
        });
    }
}
exports.ReservationService = ReservationService;
