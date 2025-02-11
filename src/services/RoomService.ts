// src/services/RoomService.ts
import { AppDataSource } from '../data-source';
import { Room } from '../entities/RoomEntity';

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
