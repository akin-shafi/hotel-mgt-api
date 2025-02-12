// Reservation Services
import { ReservationService } from './ReservationService';
import { ActivityType } from '../constants';
import { RoomService } from './RoomService';

export class DateBasedServiceEndpoints {
  static async getOccupancyPercentage(hotelId: number, date: Date) {
    return await RoomService.getOccupancyPercentage(hotelId, date);
  }

  static async getADR(hotelId: number, date: Date) {
    return await ReservationService.getADR(hotelId, date);
  }

  static async getDueOutReservations(hotelId: number, date: Date) {
    return await ReservationService.getDueOutReservations(hotelId, date);
  }

  static async getReservationsByStatus(hotelId: number, date: Date, status: ActivityType) {
    return await ReservationService.getReservationsByStatus(hotelId, date, status);
  }

  static async countReservationsByStatus(hotelId: number, date: Date) {
    return await ReservationService.countReservationsByStatus(hotelId, date);
  }

  static async getTotalOutstandingBalance(hotelId: number, date: Date) {
    return await ReservationService.getTotalOutstandingBalance(hotelId, date);
  }
}
