// src/services/RoomService.ts
import { AppDataSource } from '../data-source';
import { Room } from '../entities/RoomEntity';
import { MaintenanceStatus } from "../constants";
import { Between } from 'typeorm';
import { Reservation } from '../entities/ReservationEntity';

const roomRepository = AppDataSource.getRepository(Room);
export class RoomService {

  static async getRoomByHotelIdAndRoomName(hotelId: number, roomName: string) {
    try {
        // Find educational details by both applicationNo and courseOfStudy
        return await roomRepository.findOne({
            where: {
              hotelId,
              roomName
            }
        });
    } catch (error) {
        throw new Error(`Error finding educational details by application number and course of study: ${error.message}`);
    }
  }

  static async getAllRooms() {
    return await AppDataSource.getRepository(Room).find({
      order: { id: 'ASC' },
    });
  }

  static async getRoomsByStatus(hotelId: number, status: string, startDate: Date, endDate: Date) {
    const roomRepository = AppDataSource.getRepository(Room);

    // Define status conditions based on the status input
    let statusCondition = {};
    if (status === 'available') {
      statusCondition = { isAvailable: true, maintenanceStatus: MaintenanceStatus.CLEAN };
    } else if (status === 'occupied') {
      statusCondition = { isAvailable: true, maintenanceStatus: MaintenanceStatus.OCCUPIED };
    } else if (status === 'outOfOrder') {
      statusCondition = { maintenanceStatus: MaintenanceStatus.OUT_OF_ORDER };
    } else {
      throw new Error('Invalid status');
    }

    console.log(`Status Condition: ${JSON.stringify(statusCondition)}`);

    // Ensure the query focuses on the date only
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Query the room repository with the defined conditions and date range
    const rooms = await roomRepository.find({
      where: { hotelId, ...statusCondition, updatedAt: Between(startOfDay, endOfDay) },
      order: { roomName: 'ASC' },
    });

    console.log(`Query Result: ${JSON.stringify(rooms)}`);

    return rooms;
  }

  // static async getAvailableRoomsByType(hotelId: number, startDate: Date, endDate: Date) {
  //   const roomRepository = AppDataSource.getRepository(Room);

  //   // Ensure the query focuses on the date only
  //   const startOfDay = new Date(startDate);
  //   startOfDay.setHours(0, 0, 0, 0);
  //   const endOfDay = new Date(endDate);
  //   endOfDay.setHours(23, 59, 59, 999);

  //   // Query the room repository to get available rooms within the date range
  //   const rooms = await roomRepository.find({
  //     where: {
  //       hotelId,
  //       isAvailable: true,
  //       maintenanceStatus: MaintenanceStatus.CLEAN,
  //       updatedAt: Between(startOfDay, endOfDay)
  //     },
  //     order: { roomType: 'ASC' },
  //   });

  //   // Group the rooms by room type and count the available rooms
  //   const availableRoomsByType = rooms.reduce((acc, room) => {
  //     if (!acc[room.roomType]) {
  //       acc[room.roomType] = 0;
  //     }
  //     acc[room.roomType]++;
  //     return acc;
  //   }, {});

  //   console.log(`Available Rooms by Type: ${JSON.stringify(availableRoomsByType)}`);

  //   return availableRoomsByType;
  // }


  static async getRoomStatusByType(hotelId: number, startDate: Date, endDate: Date) {
    const roomRepository = AppDataSource.getRepository(Room);
    
    // Ensure the query focuses on the date only
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Query the room repository to get all rooms within the date range
    const rooms = await roomRepository.find({
        where: { hotelId, updatedAt: Between(startOfDay, endOfDay) },
        order: { roomType: 'ASC' }
    });

    // Initialize the result object
    const result = {
        available: {} as Record<string, number>,
        occupied: {} as Record<string, number>
    };

    // Populate the result object
    rooms.forEach(room => {
        const roomType = room.roomType;

        if (room.isAvailable && room.maintenanceStatus === MaintenanceStatus.CLEAN) {
            if (!result.available[roomType]) {
                result.available[roomType] = 0;
            }
            result.available[roomType]++;
        } else {
            if (!result.occupied[roomType]) {
                result.occupied[roomType] = 0;
            }
            result.occupied[roomType]++;
        }
    });

    // Calculate total available and occupied rooms
    result.available["Total Available"] = Object.values(result.available).reduce((acc: number, value) => acc + value, 0);
    result.occupied["Total Occupied"] = Object.values(result.occupied).reduce((acc: number, value) => acc + value, 0);

    console.log(`Room Status by Type: ${JSON.stringify(result)}`);

    return result;
  }


  static async getOccupancyPercentage(hotelId: number, date: Date) {
    const roomRepository = AppDataSource.getRepository(Room);
    const reservationRepository = AppDataSource.getRepository(Reservation);
  
    // Ensure the query focuses on the date only
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
  
    // Get all rooms for the hotel
    const totalRooms = await roomRepository.count({ where: { hotelId } });
  
    // Get all reservations for the hotel on the given date
    const reservations = await reservationRepository.find({
      where: {
        hotelId,
        updatedAt: Between(startOfDay, endOfDay),
      },
      relations: ['bookedRooms'],
    });
  
    // Count occupied rooms
    const occupiedRooms = reservations.reduce((acc, reservation) => {
      return acc + reservation.bookedRooms.length;
    }, 0);
  
    // Calculate occupancy percentage
    const occupancyPercentage = (occupiedRooms / totalRooms) * 100;
  
    console.log(`Occupancy Percentage: ${occupancyPercentage}`);
  
    return occupancyPercentage;
  }
  
  static async getRoomsByhotelId(hotelId: number) {
    try {
      const roomRepository = AppDataSource.getRepository(Room);

      // Fetch rooms by hotelId and order by roomName in ascending order
      const rooms = await roomRepository.find({
        where: { hotelId },
        order: { roomName: 'ASC' },
      });

      return rooms;
    } catch (error) {
      console.error("Error fetching rooms by hotel ID:", error);
      throw new Error("Unable to fetch rooms.");
    }
  }

  static async getRoomById(id: number) {
    return await AppDataSource.getRepository(Room).findOneBy({ id });
  }

  static async createRoom(data: Partial<Room>): Promise<Room> {
    try {
        const roomData = roomRepository.create(data);
        return await roomRepository.save(roomData);
    } catch (error) {
        throw new Error(`Error creating room details: ${error.message}`);
    }
  }

  static async updateRoom(id: number, roomData: Partial<Room>) {
    await AppDataSource.getRepository(Room).update({ id }, roomData);
    return await AppDataSource.getRepository(Room).findOneBy({ id });
  }

  static async update(id: number, data: Partial<Room>): Promise<Room | null> {
    try {
        await roomRepository.update(id, data);
        return await roomRepository.findOneBy({ id });
    } catch (error) {
        throw new Error(`Error updating Room details: ${error.message}`);
    }
}

  static async deleteRoom(id: number) {
    const deleteResult = await AppDataSource.getRepository(Room).delete({ id });
    return deleteResult.affected > 0;
  }
}
