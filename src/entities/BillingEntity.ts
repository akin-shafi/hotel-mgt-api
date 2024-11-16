import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Reservation } from './ReservationEntity';

@Entity()
export class Billing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 20 })
  status: string; // e.g., paid, unpaid, refunded

  @Column()
  payment_method: string;

  @ManyToOne(() => Reservation, { onDelete: 'CASCADE' })
  reservation: Reservation;

  @CreateDateColumn()
  created_at: Date; // Changed createdAt to created_at

  @UpdateDateColumn()
  updated_at: Date; // Changed updatedAt to updated_at
}
