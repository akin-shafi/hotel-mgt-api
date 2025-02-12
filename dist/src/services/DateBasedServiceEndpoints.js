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
exports.DateBasedServiceEndpoints = void 0;
// Reservation Services
const ReservationService_1 = require("./ReservationService");
const RoomService_1 = require("./RoomService");
class DateBasedServiceEndpoints {
    static getOccupancyPercentage(hotelId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoomService_1.RoomService.getOccupancyPercentage(hotelId, date);
        });
    }
    static getADR(hotelId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ReservationService_1.ReservationService.getADR(hotelId, date);
        });
    }
    static getDueOutReservations(hotelId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ReservationService_1.ReservationService.getDueOutReservations(hotelId, date);
        });
    }
    static getReservationsByStatus(hotelId, date, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ReservationService_1.ReservationService.getReservationsByStatus(hotelId, date, status);
        });
    }
    static countReservationsByStatus(hotelId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ReservationService_1.ReservationService.countReservationsByStatus(hotelId, date);
        });
    }
    static getTotalOutstandingBalance(hotelId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ReservationService_1.ReservationService.getTotalOutstandingBalance(hotelId, date);
        });
    }
}
exports.DateBasedServiceEndpoints = DateBasedServiceEndpoints;
