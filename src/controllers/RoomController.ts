// src/controllers/RoomController.ts
import { Request, Response } from 'express';
import { RoomService } from '../services/RoomService';

const roomService = new RoomService();

export class RoomController {
  static async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await RoomService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve rooms' });
    }
  }

  static async getRoomById(req: Request, res: Response) {
    try {
      const room = await RoomService.getRoomById(Number(req.params.id));
      room ? res.json(room) : res.status(404).json({ error: 'Room not found' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve room' });
    }
  }

  static async getRoomsByTenantId(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.params;
      const rooms = await RoomService.getRoomsByTenantId(tenantId);
      return rooms ? res.status(200).json(rooms) : res.status(200).json([]);
    } catch (error) {
      console.error('Error retrieving hotel by tenantId:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }


  static async createRoom(req: Request, res: Response) {
      try {
          const { tenantId, hotelId, roomData } = req.body;

          // console.log("RoomData", req.body)

          // Validate tenantId
          if (!tenantId) {
              return res.status(400).json({ statusCode: 400, message: 'Tenant Id is required' });
          }

          // Validate roomData is an array
          if (!Array.isArray(roomData)) {
              return res.status(400).json({ statusCode: 400, message: 'Room data should be an array' });
          }

          // Check if the tenant exists by tenantId
          const existingTenant = await RoomService.getRoomsByTenantId(tenantId);
          if (!existingTenant) {
              return res.status(404).json({ statusCode: 404, message: 'Tenant not found' });
          }

          // Arrays to keep track of updated and new rooms
          const updatedRooms: any[] = [];
          const newRooms: any[] = [];

          // Process each room in roomData
          for (const [index, room] of roomData.entries()) {
              if (room && typeof room === 'object') {
                  const { roomType, numRooms, currency, pricePerNight, ...restOfRoom } = room;

                  // Validate required room fields
                  if (!roomType) {
                      return res.status(400).json({ statusCode: 400, message: `At Row ${index + 1}: Room type is required` });
                  }
                  if (typeof numRooms !== 'number' || numRooms <= 0) {
                      return res.status(400).json({
                          statusCode: 400,
                          message: `At Row ${index + 1}: Number of rooms must be a positive integer`
                      });
                  }
                  if (!currency) {
                      return res.status(400).json({ statusCode: 400, message: `At Row ${index + 1}: Currency is required` });
                  }
                  if (typeof pricePerNight !== 'number' || pricePerNight <= 0) {
                      return res.status(400).json({
                          statusCode: 400,
                          message: `At Row ${index + 1}: Price per night must be a positive number`
                      });
                  }

                  // Check if the room already exists for this tenant and room type
                  const existingRoom = await RoomService.getRoomByTenantIdAndRoomType(tenantId, roomType);

                  if (existingRoom) {
                      // Update the existing room
                      await RoomService.update(existingRoom.id, {
                          tenantId,
                          hotelId,
                          roomType,
                          numRooms,
                          currency,
                          pricePerNight,
                          ...restOfRoom,
                      });
                      updatedRooms.push({ ...existingRoom, ...restOfRoom });
                  } else {
                      // Create a new room
                      const newRoom = await RoomService.createRoom({
                          tenantId,
                          hotelId,
                          roomType,
                          numRooms,
                          currency,
                          pricePerNight,
                          ...restOfRoom,
                      });
                      newRooms.push(newRoom);
                  }
              }
          }

          return res.status(201).json({
              message: 'Rooms processed successfully',
              data: { updatedRooms, newRooms },
          });
      } catch (error) {
          console.error('Error creating room:', error);
          return res.status(500).json({ statusCode: 500, message: 'Failed to create room', error: error.message });
      }
  }


  static async updateRoom(req: Request, res: Response) {
    try {
      const room = await RoomService.updateRoom(Number(req.params.id), req.body);
      room ? res.json(room) : res.status(404).json({ error: 'Room not found' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update room' });
    }
  }

  static async deleteRoom(req: Request, res: Response) {
    try {
      const success = await RoomService.deleteRoom(Number(req.params.id));
      success ? res.status(204).end() : res.status(404).json({ error: 'Room not found' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete room' });
    }
  }
}
