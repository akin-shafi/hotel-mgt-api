import { ReservationService } from './ReservationService';
import { RoomService } from './RoomService';
import { DashboardMetricsService } from './DashboardMetricsService';
import { ActivityType } from '../constants';

export class CombinedService {

    static async getAllMetrics(hotelId: number, date: Date, year: number, startDate?: Date, endDate?: Date) {
        // Room Services
        const roomStatus = await DashboardMetricsService.getRoomStatus(hotelId, startDate, endDate);
        const roomsByStatus = await RoomService.getRoomsByStatus(hotelId, 'available', startDate, endDate);
        const availableRoomsByType = await RoomService.getAvailableRoomsByType(hotelId, startDate, endDate);
        const occupancyPercentage = await RoomService.getOccupancyPercentage(hotelId, date);
    
        // // Reservation Services
        const adrData = await ReservationService.getADR(hotelId, date);
        const dueOutReservations = await ReservationService.getDueOutReservations(hotelId, date);
        const reservationsByStatus = await ReservationService.getReservationsByStatus(hotelId, date, ActivityType.DUE_OUT);
        const countReservationsByStatus = await ReservationService.countReservationsByStatus(hotelId, date);
        const totalOutstandingBalance = await ReservationService.getTotalOutstandingBalance(hotelId, date);
        const yearlyRevenue = await ReservationService.getYearlyRevenue(hotelId, year);
        const yearlyOccupancyAndADR = await ReservationService.getYearlyOccupancyAndADR(hotelId, year);
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
      }
    }
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




