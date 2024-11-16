// src/services/RoomService.ts
import { AppDataSource } from '../data-source';
import { Room } from '../entities/RoomEntity';

export class RoomService {
  static async getAllRooms() {
    return await AppDataSource.getRepository(Room).find();
  }

  static async getRoomsByTenantId(talentId: string) {
    try {
      const roomRepository = AppDataSource.getRepository(Room);

      // Fetch rooms by talentId
      const rooms = await roomRepository.find({
        where: { talentId }, // Assuming "hotelId" exists in your Room entity
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

  static async createRoom(roomData: Partial<Room>) {
    const room = AppDataSource.getRepository(Room).create(roomData);
    return await AppDataSource.getRepository(Room).save(room);
  }

  static async updateRoom(id: number, roomData: Partial<Room>) {
    await AppDataSource.getRepository(Room).update({ id }, roomData);
    return await AppDataSource.getRepository(Room).findOneBy({ id });
  }

  static async deleteRoom(id: number) {
    const deleteResult = await AppDataSource.getRepository(Room).delete({ id });
    return deleteResult.affected > 0;
  }
}
