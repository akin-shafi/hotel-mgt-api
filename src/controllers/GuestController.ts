// src/controllers/GuestController.ts
import { Request, Response } from 'express';
import { GuestService } from '../services/GuestService';

const guestService = new GuestService();

class GuestController {

  public async createGuest(req: Request, res: Response) {
    const { fullName, email, phone, address } = req.body;

    try {
      const guest = await GuestService.createGuest(req.body);
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
      // Fetch guest along with reservations and billing details
      const guest = await guestService.getGuestById(parseInt(id), ["reservations", "reservations.billing"]);
  
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
  
      // Remove redundant guest details inside reservations
      const formattedReservations = guest.reservations.map((reservation) => {
        const { guest: _, ...reservationWithoutGuest } = reservation; // Exclude the guest field
        return reservationWithoutGuest;
      });
  
      // Return a cleaned and structured response
      res.status(200).json({
        guestDetails: {
          ...guest,
          reservations: formattedReservations,
        },
      });
    } catch (error) {
      console.error("Error fetching guest by ID:", error.message);
      res.status(400).json({ message: error.message });
    }
  }
  

  public async getGuestByEmail(req: Request, res: Response) {
    const { email } = req.query; // Use query parameter for email
    try {
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Email is required and must be a valid string" });
      }
  
      const guest = await GuestService.findGuestByEmail(email);
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
  
      res.status(200).json(guest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  public async updateGuest(req: Request, res: Response) {
    const { id } = req.params;
    const { fullName, email, phone, address } = req.body;

    try {
      const updatedGuest = await GuestService.updateGuest(Number(id), req.body);
      res.status(200).json(updatedGuest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
}


  public async deleteGuest(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await GuestService.deleteGuest(Number(id));
      res.status(200).json({ message: 'Guest deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  
}

export default new GuestController();


