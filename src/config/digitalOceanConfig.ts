import { S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
    region: process.env.DO_SPACE_REGION || "nyc3",
    endpoint: process.env.DO_SPACE_ENDPOINT || "https://nyc3.digitaloceanspaces.com",
    credentials: {
        accessKeyId: process.env.DO_SPACE_ACCESS_KEY || "",
        secretAccessKey: process.env.DO_SPACE_SECRET_KEY || "",
    },
    forcePathStyle: true, // DigitalOcean Spaces requires path-style requests
});

export { s3 };
