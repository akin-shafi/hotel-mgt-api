import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn 
  } from "typeorm";
  import { User } from "./UserEntity"; // Assuming a User entity exists
  import { Hotel } from "./HotelEntity"; // Assuming a Hotel entity exists
  
  @Entity()
  export class Promotion {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    code: string;
  
    @Column()
    type: string;

    @Column({nullable: true})
    amount: number;
  
    @Column({ default: "active" })
    status: string;
  
    @Column()
    createdBy: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @Column({ nullable: true })
    usedBy: string;
  
    @Column({ nullable: true })
    usedFor: string;
  
    @Column()
    hotelId: string;
  }
  