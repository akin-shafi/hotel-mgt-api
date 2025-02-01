"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Import all entities
const UserEntity_1 = require("./entities/UserEntity");
const GuestEntity_1 = require("./entities/GuestEntity");
const HotelEntity_1 = require("./entities/HotelEntity"); // Add the Hotel entity here
const RoomEntity_1 = require("./entities/RoomEntity");
const RoomTypeEntity_1 = require("./entities/RoomTypeEntity");
const ReservationEntity_1 = require("./entities/ReservationEntity");
const HousekeepingTaskEntity_1 = require("./entities/HousekeepingTaskEntity");
const BillingEntity_1 = require("./entities/BillingEntity");
const PromotionEntity_1 = require("./entities/PromotionEntity");
const BookedRoomEntity_1 = require("./entities/BookedRoomEntity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres', // PostgreSQL database type
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'hotel_mgt_db',
    entities: [
        HotelEntity_1.Hotel,
        UserEntity_1.User,
        GuestEntity_1.Guest,
        RoomEntity_1.Room,
        RoomTypeEntity_1.RoomType,
        ReservationEntity_1.Reservation, // Make sure this is included
        HousekeepingTaskEntity_1.HousekeepingTask,
        BillingEntity_1.Billing,
        PromotionEntity_1.Promotion,
        BookedRoomEntity_1.BookedRoom
    ],
    synchronize: false, // Set to true in development, false in production
    logging: false,
    migrations: [],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false, // Necessary if you don't have the SSL certificate; set to true if you have it.
    },
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log('Database connection established successfully.');
})
    .catch((error) => {
    console.error('Error connecting to the database', error);
});
