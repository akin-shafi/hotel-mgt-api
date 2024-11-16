import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './UserEntity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
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
  logoUrl: string;  // Changed logoUrl to logo_url

  @Column({ nullable: true })
  theme: string;

  @Column({ unique: true }) 
  tenantId: string;  // Changed tenantId to tenant_id

  @OneToMany(() => User, user => user.hotel)
  users: User[];

  @Column({ nullable: true })
  propertyType: string;

  @Column("json", { nullable: true })
  policies: Record<string, string> | null;  // or use any other suitable type for the object

  @Column('simple-array', { nullable: true })
  amenities: string[];  // Assuming amenities is an array, no change needed for snake case.

  @Column('simple-array', { nullable: true })
  rooms: string[];  // Assuming rooms is a JSON object, no change needed for snake case.

  @CreateDateColumn()
  createdAt: Date;  // Changed createdAt to created_at

  @UpdateDateColumn()
  updatedAt: Date;  // Changed updatedAt to updated_at
}
