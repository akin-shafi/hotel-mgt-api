// src/services/RoomService.ts
import { AppDataSource } from '../data-source';
import { RoomType } from '../entities/RoomTypeEntity';

const roomRepository = AppDataSource.getRepository(RoomType);
export class RoomTypeService {

  static async getRoomByTenantIdAndRoomType(tenantId: string, roomType: string) {
    try {
        // Find educational details by both applicationNo and courseOfStudy
        return await roomRepository.findOne({
            where: {
              tenantId,
              roomType
            }
        });
    } catch (error) {
        throw new Error(`Error finding educational details by application number and course of study: ${error.message}`);
    }
}


static async getAllRooms() {
  const rooms = await AppDataSource.getRepository(RoomType).find();
  
  // Return an empty array if no rooms are found
  return rooms.length === 0 ? [] : rooms;
}

static async getRoomTypesByHotel(hotelId: string) {
  const roomTypes = await AppDataSource.getRepository(RoomType).find({
    where: { hotelId }, // Filter by hotelId
    select: ['roomType'], // Only select the roomType field
  });

  // Return an empty array if no room types are found
  return roomTypes.length === 0 ? [] : roomTypes.map(room => room.roomType);
}

  static async getRoomsByTenantId(tenantId: string) {
    try {
      const roomRepository = AppDataSource.getRepository(RoomType);

      // Fetch rooms by talentId
      const rooms = await roomRepository.find({
        where: { tenantId }, // Assuming "hotelId" exists in your Room entity
      });

      return rooms;
    } catch (error) {
      console.error("Error fetching rooms by hotel ID:", error);
      throw new Error("Unable to fetch rooms.");
    }
  }

  static async getAllRoomTypeDataByHotelId(hotelId: string) {
    try {
      const roomRepository = AppDataSource.getRepository(RoomType);

      // Fetch rooms by talentId
      const rooms = await roomRepository.find({
        where: { hotelId }, // Assuming "hotelId" exists in your Room entity
      });

      return rooms;
    } catch (error) {
      console.error("Error fetching rooms by hotel ID:", error);
      throw new Error("Unable to fetch rooms.");
    }
  }

  static async getRoomById(id: number) {
    return await AppDataSource.getRepository(RoomType).findOneBy({ id });
  }

  static async getRoomByType(roomType: string) {
    return await AppDataSource.getRepository(RoomType).findOneBy({ roomType });
  }


  static async createRoom(data: Partial<RoomType>): Promise<RoomType> {
    try {
        const roomData = roomRepository.create(data);
        return await roomRepository.save(roomData);
    } catch (error) {
        throw new Error(`Error creating room details: ${error.message}`);
    }
  }

  static async updateRoom(id: number, roomData: Partial<RoomType>) {
    await AppDataSource.getRepository(RoomType).update({ id }, roomData);
    return await AppDataSource.getRepository(RoomType).findOneBy({ id });
  }

  static async update(id: number, data: Partial<RoomType>): Promise<RoomType | null> {
    try {
        await roomRepository.update(id, data);
        return await roomRepository.findOneBy({ id });
    } catch (error) {
        throw new Error(`Error updating Room details: ${error.message}`);
    }
}

  static async deleteRoom(id: number) {
    const deleteResult = await AppDataSource.getRepository(RoomType).delete({ id });
    return deleteResult.affected > 0;
  }
}
