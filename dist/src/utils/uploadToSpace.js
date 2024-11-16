"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileUpload = exports.uploadDocumentToSpace = void 0;
const lib_storage_1 = require("@aws-sdk/lib-storage");
const uuid_1 = require("uuid");
const stream_1 = require("stream");
const path_1 = __importDefault(require("path")); // Make sure to import path
const digitalOceanConfig_1 = require("../config/digitalOceanConfig");
// Create a new S3 client instance (adjust configuration as needed)
// Function to upload a document to DigitalOcean Spaces
const uploadDocumentToSpace = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueId = (0, uuid_1.v4)().slice(0, 8);
    const fileKey = `${uniqueId}-${file.originalname}`;
    const params = {
        Bucket: process.env.DO_SPACE_NAME,
        Key: fileKey,
        Body: stream_1.Readable.from(file.buffer), // Buffer converted to stream
        ACL: "public-read",
        ContentType: file.mimetype,
    };
    const upload = new lib_storage_1.Upload({
        client: digitalOceanConfig_1.s3,
        params: params,
    });
    yield upload.done();
    const fileUrl = `${process.env.DO_SPACE_ENDPOINT}/certificates/${fileKey}`;
    return fileUrl;
});
exports.uploadDocumentToSpace = uploadDocumentToSpace;
// Function to handle file upload and check for supported formats
const handleFileUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
    // Check for supported document formats
    if (['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'].includes(fileExtension)) {
        return yield (0, exports.uploadDocumentToSpace)(file); // Upload to DigitalOcean Spaces
    }
    else {
        throw new Error('Unsupported file format. Upload any of this format jpg, jpeg, png, .pdf, .doc, .docx');
    }
});
exports.handleFileUpload = handleFileUpload;
