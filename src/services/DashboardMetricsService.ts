import { AppDataSource } from '../data-source';
import { MaintenanceStatus } from "../constants";
import { Room } from '../entities/RoomEntity';
import { BookedRoom } from '../entities/BookedRoomEntity';

export class DashboardMetricsService {

  
  // static async getRoomStatus(hotelId: number, startDate: Date, endDate: Date) {
  //   const roomRepository = AppDataSource.getRepository(Room);
  //   const bookedRoomRepository = AppDataSource.getRepository(BookedRoom);

  //   // Fetch all rooms for the hotel
  //   const rooms = await roomRepository.find({ where: { hotelId } });

  //   // Fetch booked rooms within the date range
  //   const bookedRooms = await bookedRoomRepository.createQueryBuilder('booked_rooms')
  //     .innerJoinAndSelect('booked_rooms.room', 'room')
  //     .where('room.hotelId = :hotelId', { hotelId })
  //     .andWhere('booked_rooms.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
  //     .getMany();

  //   const roomStatus = {
  //     available: rooms.filter(room => room.isAvailable && room.maintenanceStatus === MaintenanceStatus.CLEAN).length,
  //     occupied: bookedRooms.length,
  //     outOfOrder: rooms.filter(room => room.maintenanceStatus !== MaintenanceStatus.CLEAN).length,
  //   };

  //   return roomStatus;
  // }


  static async getRoomStatus(hotelId: number, startDate?: Date, endDate?: Date) {
    const roomRepository = AppDataSource.getRepository(Room);
    const bookedRoomRepository = AppDataSource.getRepository(BookedRoom);

    const rooms = await roomRepository.find({ where: { hotelId } });

    let bookedRooms = [];
    if (startDate && endDate) {
      bookedRooms = await bookedRoomRepository.createQueryBuilder('booked_rooms')
        .innerJoinAndSelect('booked_rooms.room', 'room')
        .where('room.hotelId = :hotelId', { hotelId })
        .andWhere('booked_rooms.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        .getMany();
    }

    const roomStatus = {
      available: rooms.filter(room => room.isAvailable && room.maintenanceStatus === MaintenanceStatus.CLEAN).length,
      // occupied: bookedRooms.length,
      occupied: rooms.filter(room => room.maintenanceStatus === MaintenanceStatus.OCCUPIED).length,
      outOfOrder: rooms.filter(room => room.maintenanceStatus === MaintenanceStatus.OUT_OF_ORDER).length,
    };

    return roomStatus;
  }
  
}
