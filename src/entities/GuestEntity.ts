import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from './ReservationEntity';
import { Hotel } from './HotelEntity';

@Entity()
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Hotel, (hotel) => hotel.guests)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Reservation, (reservation) => reservation.guest)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
