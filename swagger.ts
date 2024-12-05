import { Express } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { BASE_URL } from './src/config';

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
        url: `${BASE_URL}`,
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
        name: "Room Type",
        description: "Endpoints for managing the types, price and numbers of rooms in the hotel"
      },

      {
        name: "Reservations",
        description: "Endpoints for handling reservations and booking details"
      },

      // {
      //   name: "Room Management",
      //   description: "Endpoints for managing hotel rooms and room availability"
      // },
      
      // {
      //   name: "Payment",
      //   description: "Endpoints for payment processing and transactions"
      // },
      // {
      //   name: "Service Requests",
      //   description: "Endpoints for managing customer service requests"
      // },
      // {
      //   name: "Feedback",
      //   description: "Endpoints for guest feedback and reviews"
      // },
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files with OpenAPI annotations
};


export const swaggerSpec = swaggerJsDoc(swaggerOptions);

export const swaggerSetup = (app: Express) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
