import multer from 'multer';

// Define memory storage configuration to store files in memory as buffers
const storage = multer.memoryStorage();

// Allowed MIME types for documents and images
const allowedFileTypes = [
    "application/pdf",        // PDF
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  // DOCX
    "application/msword",      // DOC
    "image/jpeg",              // JPEG images
    "image/png"                // PNG images
];

// Multer upload configuration for both documents and images
export const uploadDocumentsAndImages = multer({
    storage: storage, // Use memory storage to save the files as buffers
    limits: {
        fileSize: 10 * 1024 * 1024 // Set file size limit to 10 MB
    },
    fileFilter: (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file, no error
        } else {
            cb(null, false); 
            console.error('Invalid file type. Only specific document and image files are allowed.');
        }
    }
});

export default uploadDocumentsAndImages;
