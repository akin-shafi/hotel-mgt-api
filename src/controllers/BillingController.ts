// src/controllers/BillingController.ts
import { Request, Response } from 'express';
import { BillingService } from '../services/BillingService';
import { ReservationService } from "../services/ReservationService"; // Adjust the import path for reservation service


const billingService = new BillingService();

class BillingController {

  public async createBill(req: Request, res: Response) {
    const { reservationId, services } = req.body;
  
    if (!reservationId || !services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        message: "Invalid input. Please provide a reservationId and an array of services.",
      });
    }
  
    try {
      // Check if the reservation exists
      const reservation = await ReservationService.getReservationById(reservationId);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found." });
      }
  
      // Generate bills for each service
      const bills = await Promise.all(
        services.map((service) =>
          BillingService.createBill({
            reservationId,
            ...service, // Include service-specific data
          })
        )
      );
  
      // Return all created bills
      res.status(201).json(bills);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  

  public async payBill(req: Request, res: Response) {
    const { billId } = req.params;
    
    try {
      const bill = await billingService.payBill(parseInt(billId));
      res.status(200).json(bill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getBills(req: Request, res: Response) {
    try {
      const bills = await billingService.getBills();
      res.status(200).json(bills);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getBillById(req: Request, res: Response) {
    const { billId } = req.params;

    try {
      const bill = await billingService.getBillById(parseInt(billId));
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }
      res.status(200).json(bill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getBillByReservationId(req: Request, res: Response) {
    const { reservationId } = req.params;

    try {
      const bill = await billingService.getBillByReservationId(parseInt(reservationId));
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }
      res.status(200).json(bill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new BillingController();
