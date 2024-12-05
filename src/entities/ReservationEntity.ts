import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Billing } from './BillingEntity'; // Import Billing entity
import { Hotel } from './HotelEntity'; // Import Hotel entity
import { Guest } from './GuestEntity'; // Import Guest entity
import { Room } from './RoomEntity'; // Import Room entity
import { ReservationType, Activity, ReservationStatus } from "../constants"



@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Guest, (guest) => guest.reservations, { nullable: false, eager: true })
  @JoinColumn({ name: 'guestId' })
  guest: Guest;

  @Column({ nullable: true })
  adults: number;

  @Column({ nullable: true })
  children: number;

  @Column({ nullable: true })
  roomName: string;

  @Column({ nullable: true })
  beds: string;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @Column({ type: 'enum', enum: ReservationType })
  reservationType: ReservationType;

  @Column({ type: 'enum', enum: ReservationStatus })
  status: ReservationStatus;

  @Column({ type: 'enum', enum: Activity })
  // @Column({ nullable: true })
  activity: Activity;

  @Column({ type: 'boolean', default: false })
  paymentStatus: boolean;

  @Column({ type: 'boolean', default: false })
  confirmed: boolean;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  role: string;

  @OneToMany(() => Billing, (billing) => billing.reservation)
  billing: Billing[];

  @ManyToOne(() => Hotel, (hotel) => hotel.reservations, { nullable: false })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @Column({ nullable: true })
  hotelId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text', { array: true, nullable: true })
  specialRequest: string[];

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'date', nullable: true })
  confirmedDate: Date;
}
