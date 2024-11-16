// src/controllers/ReservationController.ts
import { Request, Response } from 'express';
import { ReservationService } from '../services/ReservationService';

export class ReservationController {
  private reservationService = new ReservationService();

  async createReservation(req: Request, res: Response) {
    const { checkInDate, checkOutDate, guestId, roomId, totalAmount } = req.body;

    try {
      const reservation = await this.reservationService.createReservation(checkInDate, checkOutDate, guestId, roomId, totalAmount);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getReservations(req: Request, res: Response) {
    try {
      const reservations = await this.reservationService.getReservations();
      res.status(200).json(reservations);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateReservationStatus(req: Request, res: Response) {
    const { id, status } = req.body;
    try {
      const reservation = await this.reservationService.updateReservationStatus(id, status);
      res.status(200).json(reservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
