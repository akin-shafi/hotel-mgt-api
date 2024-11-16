// src/controllers/GuestController.ts
import { Request, Response } from 'express';
import { GuestService } from '../services/GuestService';

const guestService = new GuestService();

class GuestController {

  public async createGuest(req: Request, res: Response) {
    const { fullName, email, phone, address } = req.body;

    try {
      const guest = await guestService.createGuest(fullName, email, phone, address);
      res.status(201).json(guest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getGuests(req: Request, res: Response) {
    try {
      const guests = await guestService.getGuests();
      res.status(200).json(guests);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getGuestById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const guest = await guestService.getGuestById(parseInt(id));
      if (!guest) {
        return res.status(404).json({ message: 'Guest not found' });
      }
      res.status(200).json(guest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new GuestController();
