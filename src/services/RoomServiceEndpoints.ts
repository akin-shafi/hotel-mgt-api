// Room Services
import { RoomService } from './RoomService';
import { DashboardMetricsService } from './DashboardMetricsService';

export class RoomServiceEndpoints {
  static async getRoomStatus(hotelId: number, startDate: Date, endDate: Date) {
    return await DashboardMetricsService.getRoomStatus(hotelId, startDate, endDate);
  }

  static async getRoomsByStatus(hotelId: number, status: string, startDate: Date, endDate: Date) {
    return await RoomService.getRoomsByStatus(hotelId, status, startDate, endDate);
  }

  static async getAvailableRoomsByType(hotelId: number, startDate: Date, endDate: Date) {
    return await RoomService.getRoomStatusByType(hotelId, startDate, endDate);
  }
}
