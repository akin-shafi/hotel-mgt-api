// src/entities/RoomEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { Hotel } from './HotelEntity';
import { MaintenanceStatus } from "../constants"; // Assuming MaintenanceStatus is an enum in your constants file
import { Reservation } from './ReservationEntity';
@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  roomName: string; // Matches the frontend field `roomName`

  @Column({ nullable: true })
  roomType: string; // Matches the frontend field `roomType`

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean; // Default is true for new rooms

  @Column({ type: 'enum', enum: MaintenanceStatus, default: MaintenanceStatus.CLEAN })
  maintenanceStatus: MaintenanceStatus;

  // @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  // @JoinColumn({ name: 'hotelId' })
  // hotel: Hotel;

  @Column()
  hotelId: number; // Foreign key to the hotel (changed to `number` to match the primary key type of `Hotel`)

  @Column({ nullable: true })
  tenantId: string; // Foreign key to the tenant (optional depending on your model)

}
