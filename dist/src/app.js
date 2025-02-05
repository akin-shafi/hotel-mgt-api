"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
const dotenv_1 = __importDefault(require("dotenv"));
const rateLimiter_1 = __importDefault(require("./middlewares/rateLimiter"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const UsersPrivateRoutes_1 = __importDefault(require("./routes/UsersPrivateRoutes"));
const RoomRoutes_1 = __importDefault(require("./routes/RoomRoutes"));
const RoomTypeRoutes_1 = __importDefault(require("./routes/RoomTypeRoutes"));
const HotelRoutes_1 = __importDefault(require("./routes/HotelRoutes"));
const ReservationRoutes_1 = __importDefault(require("./routes/ReservationRoutes"));
const GuestRoutes_1 = __importDefault(require("./routes/GuestRoutes"));
const HousekeepingTaskRoutes_1 = __importDefault(require("./routes/HousekeepingTaskRoutes"));
const BillingRoutes_1 = __importDefault(require("./routes/BillingRoutes"));
const promotionsRoutes_1 = __importDefault(require("./routes/promotionsRoutes"));
const usbRoutes_1 = __importDefault(require("./routes/usbRoutes"));
const express_winston_1 = __importDefault(require("express-winston"));
const logger_1 = __importDefault(require("./utils/logger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("../swagger");
dotenv_1.default.config();
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connection established successfully.');
    const app = (0, express_1.default)();
    const isLocal = process.env.NODE_ENV === 'development';
    const port = process.env.PORT || 8400;
    const url = isLocal ? process.env.LOCAL_URL : process.env.REMOTE_URL;
    // Trust the proxy
    app.set('trust proxy', 1);
    // CORS Configuration
    app.use((0, cors_1.default)({
        origin: [
            'http://localhost:3000', // React
            'http://localhost:3002', // React
            'http://localhost:8080', // Vue
            'http://localhost:4200', // Angular
            'http://localhost:5173', // Vite
            'http://localhost:5174',
            'https://inntegrate.com',
            'https://hotelflow.netlify.app',
            'https://checkinsync.com', // Deployed Frontend
        ],
        credentials: true, // Allow credentials
    }));
    // Handle OPTIONS preflight requests
    app.options('*', (0, cors_1.default)({
        origin: [
            'http://localhost:3000',
            'http://localhost:3002',
            'http://localhost:8080',
            'http://localhost:4200',
            'http://localhost:5173',
            'http://localhost:5174',
            'https://inntegrate.com',
            'https://hotelflow.netlify.app',
            'https://checkinsync.com',
        ],
        credentials: true,
    }));
    app.use(express_1.default.json());
    // Apply the rate limiter globally
    app.use(rateLimiter_1.default);
    // Request logging with Winston
    app.use(express_winston_1.default.logger({
        winstonInstance: logger_1.default,
        meta: true,
        msg: "HTTP {{req.method}} {{req.url}}",
        colorize: false,
        ignoreRoute: function (req, res) { return false; }
    }));
    // API routes
    app.use(`/users`, UserRoutes_1.default);
    app.use(`/auth/users`, UsersPrivateRoutes_1.default);
    app.use(`/rooms`, RoomRoutes_1.default);
    app.use(`/room-type`, RoomTypeRoutes_1.default);
    app.use(`/property-info`, HotelRoutes_1.default);
    app.use(`/property-details`, HotelRoutes_1.default);
    app.use('/api/reservations', ReservationRoutes_1.default);
    app.use('/guests', GuestRoutes_1.default);
    app.use('/housekeeping-tasks', HousekeepingTaskRoutes_1.default);
    app.use('/api/billing', BillingRoutes_1.default);
    app.use('/promotions', promotionsRoutes_1.default);
    app.use('/api/usb-devices', usbRoutes_1.default);
    app.use('/api/printer', usbRoutes_1.default);
    // Swagger setup
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    // Error logging with Winston
    // app.use(expressWinston.errorLogger({
    //   winstonInstance: logger
    // }));
    // Global error handler
    app.use((err, req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'https://inntegrate.com', 'https://hotelflow.netlify.app', 'https://checkinsync.com');
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
