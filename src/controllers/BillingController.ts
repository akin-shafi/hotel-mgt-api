// src/controllers/BillingController.ts
import { Request, Response } from 'express';
import { BillingService } from '../services/BillingService';

const billingService = new BillingService();

class BillingController {

  public async createBill(req: Request, res: Response) {
    const { reservationId, amount, paymentMethod } = req.body;

    try {
      const bill = await billingService.createBill(reservationId, amount, paymentMethod);
      res.status(201).json(bill);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
}

export default new BillingController();
