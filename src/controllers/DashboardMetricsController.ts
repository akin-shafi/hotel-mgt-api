import { Request, Response } from 'express';
import DashboardMetricsService from '../services/DashboardMetricsService';
import {RoomService} from '../services/RoomService';

class DashboardMetricsController {
  async getRoomStatus(req: Request, res: Response) {
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

  async getRoomsByStatus(req: Request, res: Response) {
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
 
}

export default new DashboardMetricsController();
