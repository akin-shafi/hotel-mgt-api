import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Reservation } from './ReservationEntity';
import {BillingStatus, PaymentMethod} from '../constants';


@Entity()
export class Billing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  amountPaid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  excess: number; // New field for excess payment

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  totalPrice: number; // New field for total price before tax

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  grandTotal: number; // New field for total price after tax

  @Column({ type: 'boolean', default: false, nullable: true })
  isAddTax: boolean; // New field for tax status

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxValue: number; // New field for tax value

  @Column({ type: 'enum', enum: BillingStatus, default: BillingStatus.PART_PAYMENT, nullable: false })
  status: BillingStatus;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: false })
  payment_method: PaymentMethod;

  @Column({nullable: true})
  billTo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  discountCode: string; // New field for discount code

  @Column({ type: 'varchar', length: 255, nullable: true })
  promotionType: string; // New field for promotion type

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  promotionAmount: number; // New field for promotion amount

  @ManyToOne(() => Reservation, (reservation) => reservation.billing, { nullable: false })
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation; // Changed from reservationId to reservation

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
