"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSetup = exports.swaggerSpec = void 0;
var swagger_jsdoc_1 = require("swagger-jsdoc");
var swagger_ui_express_1 = require("swagger-ui-express");
var config_1 = require("./src/config");
var isLocal = process.env.NODE_ENV === 'development'; // Check if running in development mode
var swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: 'API documentation for the E-Commerce'
        },
        servers: [
            {
                url: "".concat(config_1.BASE_URL),
                description: isLocal ? 'Local server' : 'Remote server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format **Bearer &lt;token>**'
                }
            }
        },
        // security: [
        //   {
        //     bearerAuth: []
        //   }
        // ],
        tags: [
            {
                name: "Users - Private Endpoints",
                description: "Endpoints related to Admin"
            },
            {
                name: "Authentication",
                description: "Endpoints related to Users"
            },
            {
                name: "Products",
                description: "Products related endpoints"
            },
            {
                name: "ProductImages",
                description: "Product Images related endpoints"
            },
            {
                name: "Country",
                description: "Country related endpoints"
            },
            {
                name: "Category",
                description: "Category related endpoints"
            },
            {
                name: "Search",
                description: "Search related endpoints"
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files with OpenAPI annotations
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
var swaggerSetup = function (app) {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec));
};
exports.swaggerSetup = swaggerSetup;
// export const swaggerSetup = (app: Express) => {
//   app.get('/swagger.json', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(swaggerSpec);
//   });
// };
