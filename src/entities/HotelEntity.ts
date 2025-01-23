import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./UserEntity";
import { Reservation } from "./ReservationEntity"; // Correct import path for Reservation
import { Guest } from './GuestEntity';
import { Room } from './RoomEntity';

import { v4 as uuidv4 } from "uuid";

@Entity() // Added table name
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) 
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  logoUrl: string; // Renamed logoUrl to logo_url in database

  @Column({ nullable: true })
  theme: string;

  @Column({ unique: true })
  tenantId: string; // Renamed tenantId to tenant_id in database

  @OneToMany(() => User, (user) => user.hotelId)
  users: User[];

  @Column({ nullable: true })
  propertyType: string;

  @Column("json", { nullable: true })
  policies: Record<string, string> | null; // JSON object for policies

  @Column("simple-array", { nullable: true })
  amenities: string[]; // Array of strings for amenities

  @OneToMany(() => Reservation, (reservation) => reservation.hotel)
  reservations: Reservation[];

  @OneToMany(() => Guest, (guest) => guest.hotel)
  guests: Guest[];

  @OneToMany(() => Room, (room) => room.hotelId)
  rooms: Room[];

  @CreateDateColumn()
  createdAt: Date; // Database column will use `created_at`

  @UpdateDateColumn()
  updatedAt: Date; // Database column will use `updated_at`
}
