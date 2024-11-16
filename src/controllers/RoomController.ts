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
      const room = await RoomService.createRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create room' });
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
