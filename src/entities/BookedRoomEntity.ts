import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Reservation } from './ReservationEntity';
import { Room } from './RoomEntity';

@Entity('booked_rooms')
export class BookedRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.bookedRooms, { nullable: false })
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @ManyToOne(() => Room, { nullable: false })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({ nullable: true })
  roomName: string;

  @Column({ type: 'int', default: 1 })
  numberOfAdults: number;

  @Column({ type: 'int', default: 0 })
  numberOfChildren: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  roomPrice: number;

  @CreateDateColumn()
  createdAt: Date;


}
