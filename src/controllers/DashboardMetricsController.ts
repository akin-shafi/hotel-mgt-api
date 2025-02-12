import { Request, Response } from 'express';
import {DashboardMetricsService} from '../services/DashboardMetricsService';
import {RoomService} from '../services/RoomService';
import { ReservationService } from '../services/ReservationService';
import { ActivityType } from '../constants';
import { CombinedService } from '../services/CombineService';

class DashboardMetricsController {
  
  static async getRoomStatus(req: Request, res: Response) {
    const { hotelId, startDate, endDate } = req.query;

    if (!hotelId) {
      return res.status(400).json({ message: 'hotelId is required' });
    }

    try {
      const roomStatus = await DashboardMetricsService.getRoomStatus(
        parseInt(hotelId as string, 10),
        new Date(startDate as string),
        new Date(endDate as string)
      );

      return res.json(roomStatus);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  static async getRoomsByStatus(req: Request, res: Response) {
    try {
      const { hotelId, status, startDate, endDate } = req.query;

      if (!hotelId || !status || !startDate || !endDate) {
        return res.status(400).send('Missing required parameters');
      }

      const rooms = await RoomService.getRoomsByStatus(
        Number(hotelId),
        String(status),
        new Date(String(startDate)),
        new Date(String(endDate))
      );

      return res.status(200).json(rooms);
    } catch (error) {
      console.error('Error fetching rooms by status:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  static async getRoomStatusByType(req: Request, res: Response) {
    try {
      const { hotelId, startDate, endDate } = req.query;
  
      if (!hotelId || !startDate || !endDate) {
        return res.status(400).send('Missing required parameters');
      }
  
      const availableRooms = await RoomService.getRoomStatusByType(
        Number(hotelId),
        new Date(String(startDate)),
        new Date(String(endDate))
      );
  
      return res.status(200).json(availableRooms);
    } catch (error) {
      console.error('Error fetching available rooms by type:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  static async getOccupancyPercentage(req: Request, res: Response) {
    try {
      const { hotelId, date } = req.query;

      if (!hotelId || !date) {
        return res.status(400).send('Missing required parameters');
      }

      const occupancyPercentage = await RoomService.getOccupancyPercentage(
        Number(hotelId),
        new Date(String(date))
      );

      // Round the occupancy percentage to the nearest whole number
      const roundedOccupancyPercentage = Math.round(occupancyPercentage);

      return res.status(200).json({ occupancyPercentage: roundedOccupancyPercentage });
    } catch (error) {
      console.error('Error fetching occupancy percentage:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  static async fetchADR(req: Request, res: Response) {
    try {
      const hotelId = parseInt(req.query.hotelId as string, 10);
      const date = new Date(req.query.date as string);

      if (isNaN(hotelId) || isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid hotelId or date provided' });
      }

      const adrData = await ReservationService.getADR(hotelId, date);

      const responseArray = { 
          'totalRevenue': adrData.totalRevenue,
          'roomsSold': adrData.roomsSold,
          'adr': adrData.adr,
      };

      res.status(200).json({"statusCode": 200, "result": responseArray});
    } catch (error) {
      console.error('Error fetching ADR:', error);
      res.status(500).json({ message: 'Error fetching ADR' });
    }
  }

  static async getDueOutReservations(req: Request, res: Response) {
    try {
      const hotelId = parseInt(req.query.hotelId as string, 10);
      const checkOutDate = new Date(req.query.date as string);

      if (isNaN(hotelId) || isNaN(checkOutDate.getTime())) {
        return res.status(400).json({ message: 'Invalid hotelId or date provided' });
      }

      const dueOutReservations = await ReservationService.getDueOutReservations(hotelId, checkOutDate);

      res.status(200).json(dueOutReservations);
    } catch (error) {
      console.error('Error fetching due out reservations:', error);
      res.status(500).json({ message: 'Error fetching due out reservations' });
    }
  }

  static async getReservationsByStatus(req: Request, res: Response) {
    try {
      const hotelId = parseInt(req.query.hotelId as string, 10);
      const date = new Date(req.query.date as string);
      const status = req.query.status as ActivityType;

      if (isNaN(hotelId) || isNaN(date.getTime()) || !status) {
        return res.status(400).json({ message: 'Invalid hotelId, date, or status provided' });
      }

      const reservations = await ReservationService.getReservationsByStatus(hotelId, date, status);

      res.status(200).json(reservations);
    } catch (error) {
      console.error('Error fetching reservations by status:', error);
      res.status(500).json({ message: 'Error fetching reservations by status' });
    }
  }

  static async countReservationsByStatus(req: Request, res: Response) {
    try {
      const hotelId = parseInt(req.query.hotelId as string, 10);
      const date = new Date(req.query.date as string);

      if (isNaN(hotelId) || isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid hotelId or date provided' });
      }

      const { dueOutCount, pendingArrivalCount } = await ReservationService.countReservationsByStatus(hotelId, date);

      const responseArray = 
        {
          'dueOutCount': dueOutCount, 
          'pendingArrivalCount': pendingArrivalCount 
        };

      res.status(200).json(responseArray);
    } catch (error) {
      console.error('Error counting reservations by status:', error);
      res.status(500).json({ message: 'Error counting reservations by status' });
    }
  }

  static async getTotalOutstandingBalance(req: Request, res: Response) {
    try {
      const hotelId = parseInt(req.query.hotelId as string, 10);
      const date = new Date(req.query.date as string);

      if (isNaN(hotelId) || isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid hotelId or date provided' });
      }

      const totalOutstandingBalance = await ReservationService.getTotalOutstandingBalance(hotelId, date);

      res.status(200).json({ totalOutstandingBalance });
    } catch (error) {
      console.error('Error fetching total outstanding balance:', error);
      res.status(500).json({ message: 'Error fetching total outstanding balance' });
    }
  }

  static async getYearlyRevenue(req: Request, res: Response) {
    try {
      const hotelId = parseInt(req.query.hotelId as string, 10);
      const year = parseInt(req.query.year as string, 10);

      if (isNaN(hotelId) || isNaN(year)) {
        return res.status(400).json({ message: 'Invalid hotelId or year provided' });
      }

      const yearlyRevenue = await ReservationService.getYearlyRevenue(hotelId, year);

      res.status(200).json({ yearlyRevenue });
    } catch (error) {
      console.error('Error fetching yearly revenue:', error);
      res.status(500).json({ message: 'Error fetching yearly revenue' });
    }
  }

  static async getYearlyOccupancyAndADR(req: Request, res: Response) {
    try {
      const hotelId = parseInt(req.query.hotelId as string, 10);
      const year = parseInt(req.query.year as string, 10);

      if (isNaN(hotelId) || isNaN(year)) {
        return res.status(400).json({ message: 'Invalid hotelId or year provided' });
      }

      const { monthlyOccupancy, monthlyADR } = await ReservationService.getYearlyOccupancyAndADR(hotelId, year);

      res.status(200).json({ monthlyOccupancy, monthlyADR });
    } catch (error) {
      console.error('Error fetching yearly occupancy and ADR:', error);
      res.status(500).json({ message: 'Error fetching yearly occupancy and ADR' });
    }
  }


}

export default DashboardMetricsController;
