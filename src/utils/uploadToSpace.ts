// uploadToSpace.ts
import { S3Client, ObjectCannedACL } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";
import path from 'path'; // Make sure to import path
import { s3 } from '../config/digitalOceanConfig';
// Create a new S3 client instance (adjust configuration as needed)

// Function to upload a document to DigitalOcean Spaces
export const uploadDocumentToSpace = async (file: Express.Multer.File): Promise<string> => {
    const uniqueId = uuidv4().slice(0, 8);
    const fileKey = `${uniqueId}-${file.originalname}`;

    const params = {
        Bucket: process.env.DO_SPACE_NAME,
        Key: fileKey,
        Body: Readable.from(file.buffer), // Buffer converted to stream
        ACL: "public-read" as ObjectCannedACL,
        ContentType: file.mimetype,
    };

    const upload = new Upload({
        client: s3,
        params: params,
    });

    await upload.done();

    const fileUrl = `${process.env.DO_SPACE_ENDPOINT}/certificates/${fileKey}`;
    return fileUrl;
};

// Function to handle file upload and check for supported formats
export const handleFileUpload = async (file: Express.Multer.File): Promise<string> => {
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Check for supported document formats
    if (['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'].includes(fileExtension)) {
        return await uploadDocumentToSpace(file); // Upload to DigitalOcean Spaces
    } else {
        throw new Error('Unsupported file format. Upload any of this format jpg, jpeg, png, .pdf, .doc, .docx');
    }
};
