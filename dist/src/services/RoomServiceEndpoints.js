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
exports.RoomServiceEndpoints = void 0;
// Room Services
const RoomService_1 = require("./RoomService");
const DashboardMetricsService_1 = require("./DashboardMetricsService");
class RoomServiceEndpoints {
    static getRoomStatus(hotelId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DashboardMetricsService_1.DashboardMetricsService.getRoomStatus(hotelId, startDate, endDate);
        });
    }
    static getRoomsByStatus(hotelId, status, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoomService_1.RoomService.getRoomsByStatus(hotelId, status, startDate, endDate);
        });
    }
    static getAvailableRoomsByType(hotelId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoomService_1.RoomService.getRoomStatusByType(hotelId, startDate, endDate);
        });
    }
}
exports.RoomServiceEndpoints = RoomServiceEndpoints;
