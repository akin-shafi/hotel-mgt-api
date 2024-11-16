// src/entities/RoomEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from './HotelEnitity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  roomNumber: string;  

  @Column({ type: 'varchar', length: 50 })
  roomType: string; 

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight: number;  

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;  

  @Column({ type: 'varchar', length: 20, default: 'clean' })
  maintenanceStatus: string;  

  @Column({ type: 'simple-array', nullable: true })
  amenities: string[];

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  @JoinColumn({ name: 'hotelId' })  // Corrected 'tenantId' to 'hotelId'
  hotel: Hotel;

  @Column({nullable: true })
  hotelId: string;

  @Column({nullable: true })
  talentId: string;
 
}
