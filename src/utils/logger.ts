// src/utils/logger.ts
import { createLogger, format, transports } from "winston";

// Custom format to include stack traces for errors and additional context
const customFormat = format.printf(({ timestamp, level, message, stack }) => {
  if (stack) {
    // Log stack trace for error levels
    return `${timestamp} [${level}]: ${message}\nStack trace:\n${stack}`;
  }
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.errors({ stack: true }), // Capture stack trace
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Custom timestamp format
    format.colorize(), // Apply color to console outputs
    customFormat // Use custom format for structured logs
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize only for console output
        customFormat // Include custom format for better readability
      ),
    }),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: "exceptions.log" }), // Capture uncaught exceptions
  ],
  rejectionHandlers: [
    new transports.File({ filename: "rejections.log" }), // Capture unhandled promise rejections
  ],
});

// Function to log errors with context
export const logError = (message: string, error?: Error, context?: string) => {
  logger.error(`${message}${context ? ` | Context: ${context}` : ""}${error ? ` | Error: ${error.message}` : ""}`);
  if (error?.stack) {
    logger.error(`Stack trace:\n${error.stack}`);
  }
};

export default logger;
