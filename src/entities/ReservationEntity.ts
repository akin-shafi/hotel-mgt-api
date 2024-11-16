// src/entities/ReservationEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Guest } from './GuestEntity';
import { Room } from './RoomEntity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @ManyToOne(() => Guest, (guest) => guest.reservations, { onDelete: 'CASCADE' })
  guest: Guest;

  @ManyToOne(() => Room, { onDelete: 'SET NULL' })
  room: Room;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
