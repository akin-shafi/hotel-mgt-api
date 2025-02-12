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
exports.CombinedService = void 0;
const ReservationService_1 = require("./ReservationService");
const RoomService_1 = require("./RoomService");
const DashboardMetricsService_1 = require("./DashboardMetricsService");
const constants_1 = require("../constants");
class CombinedService {
    static getAllMetrics(hotelId, date, year, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            // Room Services
            const roomStatus = yield DashboardMetricsService_1.DashboardMetricsService.getRoomStatus(hotelId, startDate, endDate);
            const roomsByStatus = yield RoomService_1.RoomService.getRoomsByStatus(hotelId, 'available', startDate, endDate);
            const availableRoomsByType = yield RoomService_1.RoomService.getRoomStatusByType(hotelId, startDate, endDate);
            const occupancyPercentage = yield RoomService_1.RoomService.getOccupancyPercentage(hotelId, date);
            // // Reservation Services
            const adrData = yield ReservationService_1.ReservationService.getADR(hotelId, date);
            const dueOutReservations = yield ReservationService_1.ReservationService.getDueOutReservations(hotelId, date);
            const reservationsByStatus = yield ReservationService_1.ReservationService.getReservationsByStatus(hotelId, date, constants_1.ActivityType.DUE_OUT);
            const countReservationsByStatus = yield ReservationService_1.ReservationService.countReservationsByStatus(hotelId, date);
            const totalOutstandingBalance = yield ReservationService_1.ReservationService.getTotalOutstandingBalance(hotelId, date);
            const yearlyRevenue = yield ReservationService_1.ReservationService.getYearlyRevenue(hotelId, year);
            const yearlyOccupancyAndADR = yield ReservationService_1.ReservationService.getYearlyOccupancyAndADR(hotelId, year);
            return {
                roomStatus,
                roomsByStatus,
                availableRoomsByType,
                occupancyPercentage: Math.round(occupancyPercentage),
                adrData,
                dueOutReservations,
                reservationsByStatus,
                countReservationsByStatus,
                totalOutstandingBalance,
                yearlyRevenue,
                yearlyOccupancyAndADR
            };
        });
    }
}
exports.CombinedService = CombinedService;
//   static async getAllMetrics(hotelId: number, date: Date, year: number, startDate?: Date, endDate?: Date) {
//     const roomStatus = await DashboardMetricsService.getRoomStatus(hotelId, startDate, endDate);
//     const roomsByStatus = await RoomService.getRoomsByStatus(hotelId, 'status', startDate, endDate);
//     const availableRoomsByType = await RoomService.getAvailableRoomsByType(hotelId, startDate, endDate);
//     const occupancyPercentage = await RoomService.getOccupancyPercentage(hotelId, date);
//     const adrData = await ReservationService.getADR(hotelId, date);
//     const dueOutReservations = await ReservationService.getDueOutReservations(hotelId, date);
//     const reservationsByStatus = await ReservationService.getReservationsByStatus(hotelId, date, 'status' as ActivityType);
//     const countReservationsByStatus = await ReservationService.countReservationsByStatus(hotelId, date);
//     const totalOutstandingBalance = await ReservationService.getTotalOutstandingBalance(hotelId, date);
//     const yearlyRevenue = await ReservationService.getYearlyRevenue(hotelId, year);
//     const yearlyOccupancyAndADR = await ReservationService.getYearlyOccupancyAndADR(hotelId, year);
//     return {
//       roomStatus,
//       roomsByStatus,
//       availableRoomsByType,
//       occupancyPercentage: Math.round(occupancyPercentage),
//       adrData,
//       dueOutReservations,
//       reservationsByStatus,
//       countReservationsByStatus,
//       totalOutstandingBalance,
//       yearlyRevenue,
//       yearlyOccupancyAndADR
//     };
//   }
//   static async getAllMetrics(req: Request, res: Response) {
//     const { hotelId, date, year } = req.query;
//     if (!hotelId || !date || !year) {
//       return res.status(400).json({ message: 'hotelId, date, and year are required' });
//     }
//     try {
//       const parsedHotelId = parseInt(hotelId as string, 10);
//       const parsedDate = new Date(date as string);
//       const parsedYear = parseInt(year as string, 10);
//       if (isNaN(parsedHotelId) || isNaN(parsedDate.getTime()) || isNaN(parsedYear)) {
//         return res.status(400).json({ message: 'Invalid hotelId, date, or year provided' });
//       }
//       const roomStatus = await DashboardMetricsService.getRoomStatus(parsedHotelId, parsedDate, parsedDate);
//       const roomsByStatus = await RoomService.getRoomsByStatus(parsedHotelId, 'available', parsedDate, parsedDate);
//       const availableRoomsByType = await RoomService.getAvailableRoomsByType(parsedHotelId, parsedDate, parsedDate);
//       const occupancyPercentage = Math.round(await RoomService.getOccupancyPercentage(parsedHotelId, parsedDate));
//       const adrData = await ReservationService.getADR(parsedHotelId, parsedDate);
//       const dueOutReservations = await ReservationService.getDueOutReservations(parsedHotelId, parsedDate);
//       const reservationsByStatus = await ReservationService.getReservationsByStatus(parsedHotelId, parsedDate, 'due_out');
//       const { dueOutCount, pendingArrivalCount } = await ReservationService.countReservationsByStatus(parsedHotelId, parsedDate);
//       const totalOutstandingBalance = await ReservationService.getTotalOutstandingBalance(parsedHotelId, parsedDate);
//       const yearlyRevenue = await ReservationService.getYearlyRevenue(parsedHotelId, parsedYear);
//       const { monthlyOccupancy, monthlyADR } = await ReservationService.getYearlyOccupancyAndADR(parsedHotelId, parsedYear);
//   const response = {
//     roomStatus,
//     roomsByStatus,
//     availableRoomsByType,
//     occupancyPercentage,
//     adrData,
//     dueOutReservations,
//     reservationsByStatus,
//     counts: {
//       dueOutCount,
//       pendingArrivalCount,
//     },
//     totalOutstandingBalance,
//     yearlyRevenue,
//     occupancyAndADR: {
//       monthlyOccupancy,
//       monthlyADR,
//     },
//   };
//       return res.status(200).json(response);
//     } catch (error) {
//       console.error('Error fetching all metrics:', error);
//       return res.status(500).json({ message: 'Internal Server Error', error });
//     }
//   }
