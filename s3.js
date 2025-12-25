import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "xxx",
  credentials: {
    accessKeyId: "xxxx", //process.env.AWS_ACCESS_KEY,
    secretAccessKey: "xxxx", // process.env.AWS_SECRET_KEY,
  },
});

export const BUCKET = "xxxxx";
