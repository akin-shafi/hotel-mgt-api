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
class ReservationController {
    constructor() {
        this.reservationService = new ReservationService_1.ReservationService();
    }
    createReservation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { checkInDate, checkOutDate, guestId, roomId, totalAmount } = req.body;
            try {
                const reservation = yield this.reservationService.createReservation(checkInDate, checkOutDate, guestId, roomId, totalAmount);
                res.status(201).json(reservation);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getReservations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservations = yield this.reservationService.getReservations();
                res.status(200).json(reservations);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updateReservationStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, status } = req.body;
            try {
                const reservation = yield this.reservationService.updateReservationStatus(id, status);
                res.status(200).json(reservation);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.ReservationController = ReservationController;
