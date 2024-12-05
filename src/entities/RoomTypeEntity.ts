// src/entities/RoomEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Hotel } from './HotelEntity';

@Entity()
export class RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomType: string; 

  @Column()
  capacity: string; 

  @Column()
  numRooms: number;
  
  @Column()
  currency: string;

  @Column()
  pricePerNight: number;  

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
