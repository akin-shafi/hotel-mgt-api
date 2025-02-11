import { Request, Response } from 'express';
import DashboardMetricsService from '../services/DashboardMetricsService';

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
}

export default new DashboardMetricsController();
