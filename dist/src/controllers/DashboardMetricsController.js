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
const DashboardMetricsService_1 = require("../services/DashboardMetricsService");
const RoomService_1 = require("../services/RoomService");
const ReservationService_1 = require("../services/ReservationService");
class DashboardMetricsController {
    static getRoomStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotelId, startDate, endDate } = req.query;
            if (!hotelId) {
                return res.status(400).json({ message: 'hotelId is required' });
            }
            try {
                const roomStatus = yield DashboardMetricsService_1.DashboardMetricsService.getRoomStatus(parseInt(hotelId, 10), new Date(startDate), new Date(endDate));
                return res.json(roomStatus);
            }
            catch (error) {
                return res.status(500).json({ message: 'Internal Server Error', error });
            }
        });
    }
    static getRoomsByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId, status, startDate, endDate } = req.query;
                if (!hotelId || !status || !startDate || !endDate) {
                    return res.status(400).send('Missing required parameters');
                }
                const rooms = yield RoomService_1.RoomService.getRoomsByStatus(Number(hotelId), String(status), new Date(String(startDate)), new Date(String(endDate)));
                return res.status(200).json(rooms);
            }
            catch (error) {
                console.error('Error fetching rooms by status:', error);
                return res.status(500).send('Internal Server Error');
            }
        });
    }
    static getRoomStatusByType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId, startDate, endDate } = req.query;
                if (!hotelId || !startDate || !endDate) {
                    return res.status(400).send('Missing required parameters');
                }
                const availableRooms = yield RoomService_1.RoomService.getRoomStatusByType(Number(hotelId), new Date(String(startDate)), new Date(String(endDate)));
                return res.status(200).json(availableRooms);
            }
            catch (error) {
                console.error('Error fetching available rooms by type:', error);
                return res.status(500).send('Internal Server Error');
            }
        });
    }
    static getOccupancyPercentage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId, date } = req.query;
                if (!hotelId || !date) {
                    return res.status(400).send('Missing required parameters');
                }
                const occupancyPercentage = yield RoomService_1.RoomService.getOccupancyPercentage(Number(hotelId), new Date(String(date)));
                // Round the occupancy percentage to the nearest whole number
                const roundedOccupancyPercentage = Math.round(occupancyPercentage);
                return res.status(200).json({ occupancyPercentage: roundedOccupancyPercentage });
            }
            catch (error) {
                console.error('Error fetching occupancy percentage:', error);
                return res.status(500).send('Internal Server Error');
            }
        });
    }
    static fetchADR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = parseInt(req.query.hotelId, 10);
                const date = new Date(req.query.date);
                if (isNaN(hotelId) || isNaN(date.getTime())) {
                    return res.status(400).json({ message: 'Invalid hotelId or date provided' });
                }
                const adrData = yield ReservationService_1.ReservationService.getADR(hotelId, date);
                const responseArray = {
                    'totalRevenue': adrData.totalRevenue,
                    'roomsSold': adrData.roomsSold,
                    'adr': adrData.adr,
                };
                res.status(200).json({ "statusCode": 200, "result": responseArray });
            }
            catch (error) {
                console.error('Error fetching ADR:', error);
                res.status(500).json({ message: 'Error fetching ADR' });
            }
        });
    }
    static getDueOutReservations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = parseInt(req.query.hotelId, 10);
                const checkOutDate = new Date(req.query.date);
                if (isNaN(hotelId) || isNaN(checkOutDate.getTime())) {
                    return res.status(400).json({ message: 'Invalid hotelId or date provided' });
                }
                const dueOutReservations = yield ReservationService_1.ReservationService.getDueOutReservations(hotelId, checkOutDate);
                res.status(200).json(dueOutReservations);
            }
            catch (error) {
                console.error('Error fetching due out reservations:', error);
                res.status(500).json({ message: 'Error fetching due out reservations' });
            }
        });
    }
    static getReservationsByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = parseInt(req.query.hotelId, 10);
                const date = new Date(req.query.date);
                const status = req.query.status;
                if (isNaN(hotelId) || isNaN(date.getTime()) || !status) {
                    return res.status(400).json({ message: 'Invalid hotelId, date, or status provided' });
                }
                const reservations = yield ReservationService_1.ReservationService.getReservationsByStatus(hotelId, date, status);
                res.status(200).json(reservations);
            }
            catch (error) {
                console.error('Error fetching reservations by status:', error);
                res.status(500).json({ message: 'Error fetching reservations by status' });
            }
        });
    }
    static countReservationsByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = parseInt(req.query.hotelId, 10);
                const date = new Date(req.query.date);
                if (isNaN(hotelId) || isNaN(date.getTime())) {
                    return res.status(400).json({ message: 'Invalid hotelId or date provided' });
                }
                const { dueOutCount, pendingArrivalCount } = yield ReservationService_1.ReservationService.countReservationsByStatus(hotelId, date);
                const responseArray = {
                    'dueOutCount': dueOutCount,
                    'pendingArrivalCount': pendingArrivalCount
                };
                res.status(200).json(responseArray);
            }
            catch (error) {
                console.error('Error counting reservations by status:', error);
                res.status(500).json({ message: 'Error counting reservations by status' });
            }
        });
    }
    static getTotalOutstandingBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = parseInt(req.query.hotelId, 10);
                const date = new Date(req.query.date);
                if (isNaN(hotelId) || isNaN(date.getTime())) {
                    return res.status(400).json({ message: 'Invalid hotelId or date provided' });
                }
                const totalOutstandingBalance = yield ReservationService_1.ReservationService.getTotalOutstandingBalance(hotelId, date);
                res.status(200).json({ totalOutstandingBalance });
            }
            catch (error) {
                console.error('Error fetching total outstanding balance:', error);
                res.status(500).json({ message: 'Error fetching total outstanding balance' });
            }
        });
    }
    static getYearlyRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = parseInt(req.query.hotelId, 10);
                const year = parseInt(req.query.year, 10);
                if (isNaN(hotelId) || isNaN(year)) {
                    return res.status(400).json({ message: 'Invalid hotelId or year provided' });
                }
                const yearlyRevenue = yield ReservationService_1.ReservationService.getYearlyRevenue(hotelId, year);
                res.status(200).json({ yearlyRevenue });
            }
            catch (error) {
                console.error('Error fetching yearly revenue:', error);
                res.status(500).json({ message: 'Error fetching yearly revenue' });
            }
        });
    }
    static getYearlyOccupancyAndADR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelId = parseInt(req.query.hotelId, 10);
                const year = parseInt(req.query.year, 10);
                if (isNaN(hotelId) || isNaN(year)) {
                    return res.status(400).json({ message: 'Invalid hotelId or year provided' });
                }
                const { monthlyOccupancy, monthlyADR } = yield ReservationService_1.ReservationService.getYearlyOccupancyAndADR(hotelId, year);
                res.status(200).json({ monthlyOccupancy, monthlyADR });
            }
            catch (error) {
                console.error('Error fetching yearly occupancy and ADR:', error);
                res.status(500).json({ message: 'Error fetching yearly occupancy and ADR' });
            }
        });
    }
}
exports.default = DashboardMetricsController;
