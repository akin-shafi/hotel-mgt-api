// src/entities/RoomEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from './HotelEnitity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomType: string; 

  @Column()
  numRooms: number;
  
  @Column()
  currency: string;

  @Column()
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

  @Column()
  hotelId: string;

  @Column()
  tenantId: string;
 
}
