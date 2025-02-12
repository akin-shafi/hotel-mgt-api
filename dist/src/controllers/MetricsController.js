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
const RoomServiceEndpoints_1 = require("../services/RoomServiceEndpoints");
const DateBasedServiceEndpoints_1 = require("../services/DateBasedServiceEndpoints");
const YearBasedServiceEndpoints_1 = require("../services/YearBasedServiceEndpoints");
const constants_1 = require("../constants");
class MetricsController {
    // Endpoints that require hotelId, status, startDate, and endDate
    static getRoomMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotelId, startDate, endDate, status } = req.query;
            if (!hotelId || !startDate || !endDate || !status) {
                return res.status(400).json({ message: 'hotelId, status, startDate, and endDate are required' });
            }
            try {
                const parsedHotelId = parseInt(hotelId, 10);
                const parsedStartDate = new Date(startDate);
                const parsedEndDate = new Date(endDate);
                const roomStatus = yield RoomServiceEndpoints_1.RoomServiceEndpoints.getRoomStatus(parsedHotelId, parsedStartDate, parsedEndDate);
                const roomsByStatus = yield RoomServiceEndpoints_1.RoomServiceEndpoints.getRoomsByStatus(parsedHotelId, status, parsedStartDate, parsedEndDate);
                const availableRoomsByType = yield RoomServiceEndpoints_1.RoomServiceEndpoints.getAvailableRoomsByType(parsedHotelId, parsedStartDate, parsedEndDate);
                return res.status(200).json({ roomStatus, availableRoomsByType });
            }
            catch (error) {
                console.error('Error fetching room metrics:', error);
                return res.status(500).json({ message: 'Internal Server Error', error });
            }
        });
    }
    // Endpoints that require hotelId and date
    static getDateBasedMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotelId, date } = req.query;
            if (!hotelId || !date) {
                return res.status(400).json({ message: 'hotelId and date are required' });
            }
            try {
                const parsedHotelId = parseInt(hotelId, 10);
                const parsedDate = new Date(date);
                const occupancyPercentage = yield DateBasedServiceEndpoints_1.DateBasedServiceEndpoints.getOccupancyPercentage(parsedHotelId, parsedDate);
                const adrData = yield DateBasedServiceEndpoints_1.DateBasedServiceEndpoints.getADR(parsedHotelId, parsedDate);
                const dueOutReservations = yield DateBasedServiceEndpoints_1.DateBasedServiceEndpoints.getDueOutReservations(parsedHotelId, parsedDate);
                const reservationsByStatus = yield DateBasedServiceEndpoints_1.DateBasedServiceEndpoints.getReservationsByStatus(parsedHotelId, parsedDate, constants_1.ActivityType.DUE_OUT);
                const countReservationsByStatus = yield DateBasedServiceEndpoints_1.DateBasedServiceEndpoints.countReservationsByStatus(parsedHotelId, parsedDate);
                const totalOutstandingBalance = yield DateBasedServiceEndpoints_1.DateBasedServiceEndpoints.getTotalOutstandingBalance(parsedHotelId, parsedDate);
                return res.status(200).json({
                    occupancyPercentage: Math.round(occupancyPercentage),
                    adrData,
                    dueOutReservations,
                    reservationsByStatus,
                    countReservationsByStatus,
                    totalOutstandingBalance
                });
            }
            catch (error) {
                console.error('Error fetching date-based metrics:', error);
                return res.status(500).json({ message: 'Internal Server Error', error });
            }
        });
    }
    // Endpoints that require hotelId and year
    static getYearBasedMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotelId, year } = req.query;
            if (!hotelId || !year) {
                return res.status(400).json({ message: 'hotelId and year are required' });
            }
            try {
                const parsedHotelId = parseInt(hotelId, 10);
                const parsedYear = parseInt(year, 10);
                const yearlyRevenue = yield YearBasedServiceEndpoints_1.YearBasedServiceEndpoints.getYearlyRevenue(parsedHotelId, parsedYear);
                const yearlyOccupancyAndADR = yield YearBasedServiceEndpoints_1.YearBasedServiceEndpoints.getYearlyOccupancyAndADR(parsedHotelId, parsedYear);
                return res.status(200).json({ yearlyRevenue, yearlyOccupancyAndADR });
            }
            catch (error) {
                console.error('Error fetching year-based metrics:', error);
                return res.status(500).json({ message: 'Internal Server Error', error });
            }
        });
    }
}
exports.default = MetricsController;
