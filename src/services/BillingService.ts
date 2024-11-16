// src/services/BillingService.ts
import { AppDataSource } from '../data-source';
import { Billing } from '../entities/BillingEntity';
import { Reservation } from '../entities/ReservationEntity';

const billingRepository = AppDataSource.getRepository(Billing);
const reservationRepository = AppDataSource.getRepository(Reservation);
export class BillingService {


  async createBill(reservationId: number, amount: number, paymentMethod: string) {
    const reservation = await reservationRepository.findOne({ where: { id: reservationId } });
    if (!reservation) throw new Error('Reservation not found');
  
    const bill = billingRepository.create({
      amount,
      status: 'unpaid',
      payment_method: paymentMethod,  // Ensure the correct property name
      reservation,
    });
  
    await billingRepository.save(bill);
    return bill;
  }
  

  async payBill(billId: number) {
    const bill = await billingRepository.findOne({where: {id: billId}});
    if (!bill) throw new Error('Bill not found');

    bill.status = 'paid';
    await billingRepository.save(bill);

    // Optionally, update reservation status to "paid"
    const reservation = bill.reservation;
    reservation.status = 'completed';
    await reservationRepository.save(reservation);

    return bill;
  }

  async getBills() {
    return await billingRepository.find({ relations: ['reservation'] });
  }

  async getBillById(billId: number) {
    return await billingRepository.findOne({ where: { id: billId }, relations: ['reservation'] });
  }
  
}
