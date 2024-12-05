import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Reservation } from './ReservationEntity';

// Enum for the billing status
export enum BillingStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

// Enum for the payment method
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  CASH = 'cash',
}

@Entity()
export class Billing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: BillingStatus, default: BillingStatus.UNPAID })
  status: BillingStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @ManyToOne(() => Reservation, (reservation) => reservation.billing)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  billing_address: string;

  @Column({ type: 'date', nullable: true })
  payment_date: Date;
}
