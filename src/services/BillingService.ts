// src/services/BillingService.ts
import { AppDataSource } from '../data-source';
import { Billing, BillingStatus } from '../entities/BillingEntity';
import { Reservation } from '../entities/ReservationEntity';
import {ReservationStatus} from "../constants";

const billingRepository = AppDataSource.getRepository(Billing);
const reservationRepository = AppDataSource.getRepository(Reservation);

export class BillingService {


  // BillingService
  async createBill(billDetails: Partial<Billing>): Promise<Billing> {
    const user = billingRepository.create(billDetails);
    return billingRepository.save(user);
  }

  async payBill(billId: number) {
    const bill = await billingRepository.findOne({ where: { id: billId } });
    if (!bill) throw new Error('Bill not found');
  
    // Assign the enum value for "paid"
    bill.status = BillingStatus.PAID;
    await billingRepository.save(bill);
  
    // Optionally, update reservation status to "completed"
    const reservation = bill.reservation;
    reservation.status = ReservationStatus.CONFIRMED; // Ensure 'completed' is valid in the Reservation entity
    await reservationRepository.save(reservation);
  
    return bill;
  }

  async getBills() {
    return await billingRepository.find({ relations: ['reservation'] });
  }

  async getBillById(billId: number) {
    return await billingRepository.findOne({ where: { id: billId }, relations: ['reservation'] });
  }


  async getBillByReservationId(reservationId: number) {
    return await billingRepository.findOne({
      where: { reservation: { id: reservationId } }, // Adjusted to query by `reservation.id`
      relations: ["reservation"], // Ensure the relation is loaded
    });
  }
  

  
  
}
