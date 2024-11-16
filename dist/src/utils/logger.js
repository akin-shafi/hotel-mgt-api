"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
// src/utils/logger.ts
const winston_1 = require("winston");
// Custom format to include stack traces for errors and additional context
const customFormat = winston_1.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
        // Log stack trace for error levels
        return `${timestamp} [${level}]: ${message}\nStack trace:\n${stack}`;
    }
    return `${timestamp} [${level}]: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.errors({ stack: true }), // Capture stack trace
    winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Custom timestamp format
    winston_1.format.colorize(), // Apply color to console outputs
    customFormat // Use custom format for structured logs
    ),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), // Colorize only for console output
            customFormat // Include custom format for better readability
            ),
        }),
        new winston_1.transports.File({ filename: "error.log", level: "error" }),
        new winston_1.transports.File({ filename: "combined.log" }),
    ],
    exceptionHandlers: [
        new winston_1.transports.File({ filename: "exceptions.log" }), // Capture uncaught exceptions
    ],
    rejectionHandlers: [
        new winston_1.transports.File({ filename: "rejections.log" }), // Capture unhandled promise rejections
    ],
});
// Function to log errors with context
const logError = (message, error, context) => {
    logger.error(`${message}${context ? ` | Context: ${context}` : ""}${error ? ` | Error: ${error.message}` : ""}`);
    if (error === null || error === void 0 ? void 0 : error.stack) {
        logger.error(`Stack trace:\n${error.stack}`);
    }
};
exports.logError = logError;
exports.default = logger;
