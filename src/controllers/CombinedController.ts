import { Request, Response } from 'express';
import { CombinedService } from '../services/CombineService';


class CombinedController {
  static async getAllMetrics(req: Request, res: Response) {
    const { hotelId, date, year, startDate, endDate } = req.query;

    if (!hotelId || !date || !year) {
      return res.status(400).json({ message: 'hotelId, date, and year are required' });
    }

    try {
      const parsedHotelId = parseInt(hotelId as string, 10);
      const parsedDate = new Date(date as string);
      const parsedYear = parseInt(year as string, 10);
      const parsedStartDate = date ? new Date(date as string) : undefined;
      const parsedEndDate = date ? new Date(date as string) : undefined;

      // console.log("parsedStartDate", parsedStartDate)

      if (isNaN(parsedHotelId) || isNaN(parsedDate.getTime()) || isNaN(parsedYear) || 
         (parsedStartDate && isNaN(parsedStartDate.getTime())) || 
         (parsedEndDate && isNaN(parsedEndDate.getTime()))) {
        return res.status(400).json({ message: 'Invalid hotelId, date, year, or date range provided' });
      }

      const metrics = await CombinedService.getAllMetrics(parsedHotelId, parsedDate, parsedYear, parsedStartDate, parsedEndDate);

      return res.status(200).json(metrics);
    } catch (error) {
      console.error('Error fetching all metrics:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}

export default CombinedController;
