import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, JoinColumn } from 'typeorm';
import { MaintenanceStatus } from "../constants";
// import { Reservation } from './ReservationEntity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  roomName: string;

  @Column({ nullable: true })
  roomType: string;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'enum', enum: MaintenanceStatus, default: MaintenanceStatus.CLEAN })
  maintenanceStatus: MaintenanceStatus;

  @Column()
  hotelId: number;

  @Column({ nullable: true })
  tenantId: string;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updatedAt: Date
}
