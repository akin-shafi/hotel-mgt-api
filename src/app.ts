import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
import rateLimiter from './middlewares/rateLimiter';
import userRoutes from './routes/UserRoutes';
import userPrivateRoutes from './routes/UsersPrivateRoutes';
import roomRoutes from './routes/RoomRoutes';
import roomTypeRoutes from './routes/RoomTypeRoutes';
import hotelRoutes from './routes/HotelRoutes';
import reservationRoutes from './routes/ReservationRoutes';
import guestRoutes from './routes/GuestRoutes';
import housekeepingTaskRoutes from './routes/HousekeepingTaskRoutes';
import billingRoutes from './routes/BillingRoutes';

import expressWinston from 'express-winston';
import logger from './utils/logger';
import swaggerUI from 'swagger-ui-express';
import { swaggerSpec } from '../swagger';

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established successfully.');

    const app = express();
    const isLocal = process.env.NODE_ENV === 'development';
    const port = process.env.PORT || 8400;
    const url = isLocal ? process.env.LOCAL_URL : process.env.REMOTE_URL;

    // Trust the proxy
    app.set('trust proxy', 1);

    // CORS Configuration
    app.use(cors({
      origin: [
        'http://localhost:3000', // React
        'http://localhost:3002', // React
        'http://localhost:8080', // Vue
        'http://localhost:4200', // Angular
        'http://localhost:5173',  // Vite
        'http://localhost:5174',
        'https://inntegrate.com',
        'https://checkinsync.com', // Deployed Frontend
      ],
      credentials: true, // Allow credentials
    }));

    // Handle OPTIONS preflight requests
    app.options('*', cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:8080',
        'http://localhost:4200',
        'http://localhost:5173',
        'http://localhost:5174',
        'https://inntegrate.com',
        'https://checkinsync.com',
      ],
      credentials: true,
    }));

    app.use(express.json());

    // Apply the rate limiter globally
    app.use(rateLimiter);

    // Request logging with Winston
    app.use(expressWinston.logger({
      winstonInstance: logger,
      meta: true,
      msg: "HTTP {{req.method}} {{req.url}}",
      colorize: false,
      ignoreRoute: function (req, res) { return false; }
    }));

    // API routes
    app.use(`/users`, userRoutes);
    app.use(`/auth/users`, userPrivateRoutes);
    app.use(`/rooms`, roomRoutes);
    app.use(`/room-type`, roomTypeRoutes);
    app.use(`/property-info`, hotelRoutes);
    app.use(`/property-details`, hotelRoutes);
    app.use('/api/reservations', reservationRoutes);
    app.use('/guests', guestRoutes);
    app.use('/housekeeping-tasks', housekeepingTaskRoutes);
    app.use('/api/billing', billingRoutes);
    // Swagger setup
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    // Error logging with Winston
    // app.use(expressWinston.errorLogger({
    //   winstonInstance: logger
    // }));

    // Global error handler
    app.use((err, req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'https://inntegrate.com')
      'https://checkinsync.com';
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

    app.listen(port, () => {
      console.log(`Server is running at ${url}`);
      console.log(`Swagger UI is available at ${url}/api-docs`);
    });
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
