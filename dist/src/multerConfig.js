"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocumentsAndImages = void 0;
const multer_1 = __importDefault(require("multer"));
// Define memory storage configuration to store files in memory as buffers
const storage = multer_1.default.memoryStorage();
// Allowed MIME types for documents and images
const allowedFileTypes = [
    "application/pdf", // PDF
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/msword", // DOC
    "image/jpeg", // JPEG images
    "image/png" // PNG images
];
// Multer upload configuration for both documents and images
exports.uploadDocumentsAndImages = (0, multer_1.default)({
    storage: storage, // Use memory storage to save the files as buffers
    limits: {
        fileSize: 10 * 1024 * 1024 // Set file size limit to 10 MB
    },
    fileFilter: (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file, no error
        }
        else {
            cb(null, false);
            console.error('Invalid file type. Only specific document and image files are allowed.');
        }
    }
});
exports.default = exports.uploadDocumentsAndImages;
