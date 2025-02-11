// src/services/RoomService.ts
import { AppDataSource } from '../data-source';
import { Room } from '../entities/RoomEntity';
import { MaintenanceStatus } from "../constants";
import { Between } from 'typeorm';

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

// static async getRoomsByStatus(hotelId: number, status: string, startDate: Date, endDate: Date) {
//   const roomRepository = AppDataSource.getRepository(Room);

//   // Define status conditions based on the status input
//   let statusCondition = {};
//   if (status === 'available') {
//     statusCondition = { isAvailable: true, maintenanceStatus: MaintenanceStatus.CLEAN };
//   } else if (status === 'occupied') {
//     statusCondition = { isAvailable: true, maintenanceStatus: MaintenanceStatus.OCCUPIED };
//   } else if (status === 'outOfOrder') {
//     statusCondition = { maintenanceStatus: MaintenanceStatus.OUT_OF_ORDER };
//   } else {
//     throw new Error('Invalid status');
//   }

//   console.log(`Status Condition: ${JSON.stringify(statusCondition)}`);

//   // Query the room repository with the defined conditions and date range
//   const rooms = await roomRepository.find({
//     where: { hotelId, ...statusCondition, updatedAt: Between(startDate, endDate) },
//     order: { roomName: 'ASC' },
//   });

//   console.log(`Query Result: ${JSON.stringify(rooms)}`);

//   return rooms;
// }

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
