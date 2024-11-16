import { UserRole } from '../constants';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AccountStatus } from '../constants';
import { Hotel } from './HotelEnitity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  tenantId: string; // Identify which tenant this user belongs to

  @ManyToOne(() => Hotel, hotel => hotel.users)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'boolean', default: false })
  resetPassword: boolean;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;

  @Column({ type: 'varchar', nullable: true })
  twoFactorToken: string;

  @Column({ type: 'timestamp', nullable: true })
  twoFactorExpires: Date;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.FrontDesk })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.Active,
  })
  accountStatus: AccountStatus;

  @Column({default: 0})
  onboardingStep: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({default: 'admin', nullable: true})
  createdBy: string; // Admin ID or reference

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string;

  @Column({nullable: true })
  employeeId: string; // Unique ID for internal employee tracking

  @Column({ type: 'boolean', default: false })
  isOnDuty: boolean; // Tracks if the user is currently working or logged in

  @Column({ nullable: true, default: false })
  attemptedLoginFail: boolean;
}
