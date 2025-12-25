import fs from 'fs';
import express from 'express';
// multer → middleware for handling multipart/form-data
import multer from 'multer';
import path from 'path';

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  // fileFilter: (req, file, cb) => {
  //   // Allow only image files
  //   // if (file.mimetype.startsWith('pdf/')) {
  //   //   cb(null, true);
  //   // } else {
  //   //   cb(new Error('Only image files are allowed!'), false);
  //   // }
  // }
});

// Optimized upload endpoint with streaming
app.post('/upload', upload.single('file'), (req, res) => {

  console.log("check ", req.file)
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
    else if(error.code == "MISSING_FIELD_NAME"){
       return res.status(400).json({ error: error.message });
    }
  }
  console.log("errr ", error)
  res.status(500).json({ error: error.message });
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log('App is running on port', PORT);
});
