// src/entities/HousekeepingTaskEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Room } from './RoomEntity';

@Entity()
export class HousekeepingTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  hotelId: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // e.g., pending, in-progress, completed

  @ManyToOne(() => Room, { onDelete: 'SET NULL' })
  room: Room;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
