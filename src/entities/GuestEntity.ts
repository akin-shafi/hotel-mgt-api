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

  @Column({ nullable: true })
  idProof: string; // New field for ID proof

  @Column({ nullable: true })
  identityType: string; // New field for identity type

  @Column({ nullable: true })
  identityNumber: string; // New field for identity number

  @Column({ nullable: true })
  nationality: string; // New field for nationality

  @Column({ nullable: true })
  gender: string; // New field for gender

  // @OneToMany(() => Reservation, (reservation) => reservation.guest)
  // reservations: Reservation[];

  @OneToMany(() => Reservation, (reservation) => reservation.guest, {
    cascade: ['soft-remove'],  // 👈 Ensures only reservations are soft-deleted
  })
  reservations: Reservation[];
  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
