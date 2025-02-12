import { Request, Response } from 'express';
import { RoomServiceEndpoints } from '../services/RoomServiceEndpoints';
import { DateBasedServiceEndpoints } from '../services/DateBasedServiceEndpoints';
import { YearBasedServiceEndpoints } from '../services/YearBasedServiceEndpoints';
import { ActivityType } from '../constants';

class MetricsController {
  
  // Endpoints that require hotelId, status, startDate, and endDate
  static async getRoomMetrics(req: Request, res: Response) {
    const { hotelId, startDate, endDate, status } = req.query;

    if (!hotelId || !startDate || !endDate || !status) {
      return res.status(400).json({ message: 'hotelId, status, startDate, and endDate are required' });
    }

    try {
      const parsedHotelId = parseInt(hotelId as string, 10);
      const parsedStartDate = new Date(startDate as string);
      const parsedEndDate = new Date(endDate as string);

      const roomStatus = await RoomServiceEndpoints.getRoomStatus(parsedHotelId, parsedStartDate, parsedEndDate);
      const roomsByStatus = await RoomServiceEndpoints.getRoomsByStatus(parsedHotelId, status as string, parsedStartDate, parsedEndDate);
      const availableRoomsByType = await RoomServiceEndpoints.getAvailableRoomsByType(parsedHotelId, parsedStartDate, parsedEndDate);
      
      return res.status(200).json({ roomStatus,  availableRoomsByType });
    } catch (error) {
      console.error('Error fetching room metrics:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Endpoints that require hotelId and date
  static async getDateBasedMetrics(req: Request, res: Response) {
    const { hotelId, date } = req.query;

    if (!hotelId || !date) {
      return res.status(400).json({ message: 'hotelId and date are required' });
    }

    try {
      const parsedHotelId = parseInt(hotelId as string, 10);
      const parsedDate = new Date(date as string);

      const occupancyPercentage = await DateBasedServiceEndpoints.getOccupancyPercentage(parsedHotelId, parsedDate);
      const adrData = await DateBasedServiceEndpoints.getADR(parsedHotelId, parsedDate);
      const dueOutReservations = await DateBasedServiceEndpoints.getDueOutReservations(parsedHotelId, parsedDate);
      const reservationsByStatus = await DateBasedServiceEndpoints.getReservationsByStatus(parsedHotelId, parsedDate, ActivityType.DUE_OUT);
      const countReservationsByStatus = await DateBasedServiceEndpoints.countReservationsByStatus(parsedHotelId, parsedDate);
      const totalOutstandingBalance = await DateBasedServiceEndpoints.getTotalOutstandingBalance(parsedHotelId, parsedDate);

      return res.status(200).json({
        occupancyPercentage: Math.round(occupancyPercentage),
        adrData,
        dueOutReservations,
        reservationsByStatus,
        countReservationsByStatus,
        totalOutstandingBalance
      });
    } catch (error) {
      console.error('Error fetching date-based metrics:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Endpoints that require hotelId and year
  static async getYearBasedMetrics(req: Request, res: Response) {
    const { hotelId, year } = req.query;

    if (!hotelId || !year) {
      return res.status(400).json({ message: 'hotelId and year are required' });
    }

    try {
      const parsedHotelId = parseInt(hotelId as string, 10);
      const parsedYear = parseInt(year as string, 10);

      const yearlyRevenue = await YearBasedServiceEndpoints.getYearlyRevenue(parsedHotelId, parsedYear);
      const yearlyOccupancyAndADR = await YearBasedServiceEndpoints.getYearlyOccupancyAndADR(parsedHotelId, parsedYear);

      return res.status(200).json({ yearlyRevenue, yearlyOccupancyAndADR });
    } catch (error) {
      console.error('Error fetching year-based metrics:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}

export default MetricsController;
