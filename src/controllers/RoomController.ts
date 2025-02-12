// src/controllers/RoomController.ts
import { Request, Response } from 'express';
import { RoomService } from '../services/RoomService';
import {MaintenanceStatus} from "../constants"
import {RoomTypeService} from "../services/RoomTypeService";

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

  static async getRoomsByhotelId(req: Request, res: Response): Promise<Response> {
    try {
      const { hotelId } = req.params;
      const rooms = await RoomService.getRoomsByhotelId(parseInt(hotelId));
      return rooms ? res.status(200).json(rooms) : res.status(200).json([]);
    } catch (error) {
      console.error('Error retrieving hotel by tenantId:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getRoomAndPriceByHotelId(req: Request, res: Response): Promise<Response> {
    try {
      const { hotelId } = req.params;

      // Fetch rooms by hotel ID
      const rooms = await RoomService.getRoomsByhotelId(parseInt(hotelId));

      if (!rooms || rooms.length === 0) {
        return res.status(200).json([]);
      }

      // Enrich rooms with prices from RoomTypeService
      const enrichedRooms = await Promise.all(
        rooms.map(async (room) => {
          const roomType = await RoomTypeService.getRoomByType(room.roomType);
          return {
            ...room,
            capacity: roomType ? roomType.capacity : null,
            price: roomType ? roomType.pricePerNight : null, // Include price if roomType exists
          };
        })
      );

      return res.status(200).json(enrichedRooms);
    } catch (error) {
      console.error("Error retrieving rooms by hotelId:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  



  static async createRoom(req: Request, res: Response) {
    try {
      const { tenantId, hotelId, roomData } = req.body;

      console.log("RoomData", Array.isArray(roomData));

      // Validate tenantId
      if (!tenantId) {
        return res.status(400).json({ statusCode: 400, message: 'Tenant Id is required' });
      }

      // Validate roomData is an array
      if (!Array.isArray(roomData)) {
        return res.status(400).json({ statusCode: 400, message: 'Room data should be an array' });
      }

      // Check if the tenant exists by tenantId
      const existingTenant = await RoomService.getRoomsByhotelId(hotelId);
      if (!existingTenant) {
        return res.status(404).json({ statusCode: 404, message: 'Tenant not found' });
      }

      // Arrays to keep track of updated and new rooms
      const updatedRooms: any[] = [];
      const newRooms: any[] = [];

      // Process each room in roomData
      for (const [index, room] of roomData.entries()) {
        if (room && typeof room === 'object') {
          const {
            roomName,
            isAvailable = true,
            maintenanceStatus = 'clean',
            ...restOfRoom
          } = room;

          // Validate required room fields
          if (!roomName) {
            return res.status(400).json({
              statusCode: 400,
              message: `At Row ${index + 1}: Room name is required`,
            });
          }

         
          // Check if the room already exists for this tenant and roomName
          const existingRoom = await RoomService.getRoomByHotelIdAndRoomName(hotelId, roomName);

          if (existingRoom) {
            // Update the existing room
            await RoomService.update(existingRoom.id, {
              tenantId,
              hotelId,
              roomName,
              isAvailable,
              maintenanceStatus,
              ...restOfRoom,
            });
            updatedRooms.push({ ...existingRoom, ...restOfRoom });
          } else {
            // Create a new room
            const newRoom = await RoomService.createRoom({
              tenantId,
              hotelId,
              roomName,
              isAvailable,
              maintenanceStatus,
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
      return res.status(500).json({
        statusCode: 500,
        message: 'Failed to create room',
        error: error.message,
      });
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

  static getMaintenanceStatus(req: Request, res: Response): void {
    try {
      // Convert enum to an array of objects with label and value
      const maintenanceStatuses = Object.keys(MaintenanceStatus).map(key => {
        return {
          label: key.replace(/_/g, ' ').toUpperCase(), // Format the label (e.g., UNDER_MAINTENANCE -> Under Maintenance)
          value: MaintenanceStatus[key as keyof typeof MaintenanceStatus]  // Get the enum value
        };
      });

      // Send a response with the maintenance statuses
      res.status(200).json(maintenanceStatuses);

    } catch (error) {
      // Handle any errors and send a server error response
      res.status(500).json({ message: 'Error fetching maintenance statuses' });
    }
  }
}
