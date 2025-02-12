// Reservation Services for Yearly Data
import { ReservationService } from './ReservationService';

export class YearBasedServiceEndpoints {
  static async getYearlyRevenue(hotelId: number, year: number) {
    return await ReservationService.getYearlyRevenue(hotelId, year);
  }

  static async getYearlyOccupancyAndADR(hotelId: number, year: number) {
    return await ReservationService.getYearlyOccupancyAndADR(hotelId, year);
  }
}
