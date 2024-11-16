"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSetup = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./src/config");
const isLocal = process.env.NODE_ENV === 'development'; // Check if running in development mode
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Hotel Management Application API',
            version: '1.1.0',
            description: 'API documentation for the Hotel Management Application'
        },
        servers: [
            {
                url: `${config_1.BASE_URL}`,
                description: isLocal ? 'Local server' : 'Remote server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format **Bearer <token>**'
                }
            }
        },
        tags: [
            {
                name: "Admin - Private Endpoints",
                description: "Endpoints for Admin-related operations"
            },
            {
                name: "Authentication",
                description: "Endpoints for user authentication and authorization"
            },
            {
                name: "Guest Management",
                description: "Endpoints for managing guest details and reservations"
            },
            {
                name: "Room Management",
                description: "Endpoints for managing hotel rooms and room availability"
            },
            {
                name: "Reservation Management",
                description: "Endpoints for handling reservations and booking details"
            },
            {
                name: "Billing",
                description: "Endpoints for managing billing and payments"
            },
            {
                name: "Housekeeping",
                description: "Endpoints for housekeeping and room status updates"
            },
            {
                name: "Hotels",
                description: "Endpoints for managing hotel information and settings"
            },
            {
                name: "Rooms",
                description: "Endpoints for managing the types and availability of rooms in the hotel"
            },
            {
                name: "Payment",
                description: "Endpoints for payment processing and transactions"
            },
            {
                name: "Service Requests",
                description: "Endpoints for managing customer service requests"
            },
            {
                name: "Feedback",
                description: "Endpoints for guest feedback and reviews"
            },
        ]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files with OpenAPI annotations
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
const swaggerSetup = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec));
};
exports.swaggerSetup = swaggerSetup;
