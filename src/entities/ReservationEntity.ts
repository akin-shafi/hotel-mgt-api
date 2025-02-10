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
import { Billing } from './BillingEntity';
import { Hotel } from './HotelEntity';
import { Guest } from './GuestEntity';
import { BookedRoom } from './BookedRoomEntity';
import { ReservationType, ActivityType, ReservationStatus } from '../constants';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Guest, (guest) => guest.reservations, { 
    nullable: false, 
    eager: true, 
    onDelete: 'NO ACTION' 
  })
  @JoinColumn({ name: 'guestId' })
  guest: Guest;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @OneToMany(() => BookedRoom, (bookedRoom) => bookedRoom.reservation, { eager: true })
  bookedRooms: BookedRoom[];

  @ManyToOne(() => Hotel, (hotel) => hotel.reservations, { nullable: false })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @Column()
  hotelId: number;

  @Column({ type: 'enum', enum: ActivityType, nullable: true })
  activity: ActivityType;

  @Column({ nullable: true })
  reservationType: string;

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
  reservationStatus: ReservationStatus;


  @Column({nullable: true,  default: 0 })
  nightSpent: number;

  @Column({nullable: true})
  refund: number;
  
  
  @Column({ type: 'boolean', default: false })
  paymentStatus: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  totalBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  totalPaid: number; // New field for total price before tax

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  grandTotal: number; // New field for total price after tax

  @OneToMany(() => Billing, (billing) => billing.reservation, { cascade: ['remove'] })
  billing: Billing[];

  @Column({ nullable: true })
  createdBy: number;
  
  @Column({ nullable: true })
  numberOfNights: number;

  @Column({ nullable: true })
  role: string;

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
