import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import all entities
import { User } from './entities/UserEntity';
import { Guest } from './entities/GuestEntity';
import { Hotel } from './entities/HotelEnitity'; // Add the Hotel entity here
import { Room } from './entities/RoomEntity';
import { Reservation } from './entities/ReservationEntity';
import { HousekeepingTask } from './entities/HousekeepingTaskEntity';
import { Billing } from './entities/BillingEntity';

export const AppDataSource = new DataSource({
  type: 'postgres', // PostgreSQL database type
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_DATABASE || 'hotel_mgt_db',
  entities: [
    User,
    Guest,
    Hotel,
    Room,
    Reservation,  // Make sure this is included
    HousekeepingTask,
    Billing
  ],
  synchronize: false, // Set to true in development, false in production
  logging: false,
  migrations: [],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false, // Necessary if you don't have the SSL certificate; set to true if you have it.
  },
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });
