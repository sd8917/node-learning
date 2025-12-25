import express from "express";
import cors from "cors";
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, BUCKET } from "./s3.js";
import { ListPartsCommand } from "@aws-sdk/client-s3";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * INIT MULTIPART
 */
app.post("/upload/init", async (req, res) => {
  
  const {fileName, contentType} = req.body;

  if (!fileName || !contentType) {
    return res.status(400).json({ error: 'Missing fileName or contentType in request body' });
  }

  const command = new CreateMultipartUploadCommand({
    Bucket: BUCKET,
    Key: fileName,
    ContentType: contentType,
  });

  const { UploadId } = await s3.send(command);

  res.json({ uploadId: UploadId });
});

/**
 * GET PRESIGNED PART URL
 */
app.post("/upload/part", async (req, res) => {
  const fileName = req.body?.fileName;
  const uploadId = req.body?.uploadId;
  const partNumber = req.body?.partNumber;

  console.log("== File /upload/part/ ===  ", fileName, uploadId, partNumber);

  if (!fileName || !uploadId || !partNumber) {
    return res.status(400).json({ error: 'Missing fileName, uploadId, or partNumber in request body' });
  }

  const command = new UploadPartCommand({
    Bucket: BUCKET,
    Key: fileName,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 900 });
  res.json({ url });
});

/**
 * COMPLETE UPLOAD
 */
app.post("/upload/complete", async (req, res) => {
  const fileName = req.body?.fileName;
  const uploadId = req.body?.uploadId;
  const parts = req.body?.parts;

  if (!fileName || !uploadId || !parts) {
    return res.status(400).json({ error: 'Missing fileName, uploadId, or parts in request body' });
  }

  // Sort parts by PartNumber as required by AWS S3
  parts.sort((a, b) => a.PartNumber - b.PartNumber);

  const command = new CompleteMultipartUploadCommand({
    Bucket: BUCKET,
    Key: fileName,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  });

  const result = await s3.send(command);
  console.log('result ', result);
  res.json({ success: true });
});

app.get("/debug/parts/:uploadId/:fileName", async (req, res) => {
  console.log('called ');
  const { uploadId, fileName } = req.params;

  const data = await s3.send(
    new ListPartsCommand({
      Bucket: BUCKET,
      Key: fileName,
      UploadId: uploadId,
    })
  );

  res.json(data.Parts || []);
});


app.listen(8000, () =>
  console.log("🚀 Backend running on http://localhost:", 8000)
);
