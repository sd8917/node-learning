## 1️⃣ What is File Uploading?
- File uploading means sending a file
 from client(browser/app) to a server over HTTP, usually using:

 `
 content-Type: multiple/form-data
 `

 ## What is a Buffer ?
 - A buffer is a temporary chunk of memory where binary data is stored before being processed.
 - In Node.js, buffere are instances of Buffer class.

```
 const buf = Buffer.from("Hello World");
console.log(buf); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>

```
For file uploads, buffers temporarily hold pieces of the file as they are read from the network or disk.

- Buffers are appended/streamed to WriteStream, avoiding full file memory load.

## 3️⃣ Multer / Memory Storage

- Multer can store file chunks in memory buffer before saving:

```
const upload = multer({ storage: multer.memoryStorage() });
req.file.buffer → Node.js buffer

```
⚠️ Only use for small files; large files → memory spike.


```
const fs = require("fs");
const readStream = fs.createReadStream("bigfile.mp4");
const writeStream = fs.createWriteStream("uploads/bigfile.mp4");

readStream.on("data", (chunk) => {
  console.log("Chunk size:", chunk.length); // chunk = buffer
});
readStream.pipe(writeStream);
```

```
[Network / Disk] → [Buffer 64KB chunks] → [WriteStream / Storage]
```

- Buffer size is usually 64KB by default (can be configured)
- Node.js reads one buffer at a time → writes → frees memory → next buffer
- This is why streaming is memory-efficient vs readFileSync


 ### Basic flow
 1. User select a file in UI
 2. Browser sends a file via POST request
 3. Node.js server receive the file
 4. Server stores it(disk/cloud/DB)
 5. Server returns success response.

 ### 3. Client side (HTML)
```
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="file" />
  <button type="submit">Upload</button>
</form>


```

### 4. Server (node+express)
- Node.js cannot parse file by default

Note: - 
Nodejs + Express can parse text-based request bodies (JSON, URL-encoded data)
using middleware like express.josn() and express.urlencoded()

But file upload are different
- Files are send using multipart/form-data
- This format contains:
   - Binary data (images, PDFs, videos)
   - Stream , not plain text

- Express does not include a multipart parser by default to keep the core lightweight.

- So node.js doesnt know how to read file stream or boundaries on its own.

✅ Fix
## Why use multer ??

- Parse multiple request boundaries
- Extract file streams
- Handles binary data safely
- Temporarily stores files in 
   - memory (ram)
   - disk

```
import multer from "multer";

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);   // file info
  console.log(req.body);   // other form data
  res.send("File uploaded");
});


```

## Simple multer setupp
1. Install package
```
npm i multer
``` and then import it
2. create middle with local folder name or some storage, limit and other options config

```

const upload = multer({dest: "upload"});


```
and pass middleware to route on which needed like

```
app.post("/upload", upload.single("file"), (req,res)=>{

```

3. Read the `req.file`

## What multer give you

```
{
  originalname,
  mimetype,
  size,
  filename,
  path
}


```

## File Validation (Interview Important)

```
const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only images allowed"));
    }
    cb(null, true);
  }
});


```

## Where Files Are Stored

1. 📁 Local disk (uploads/)
2. ☁️ Cloud (AWS S3, Cloudinary)
3. 🧠 Memory (buffer, for processing)

## to read or serve file 
```
// to fetch the file... 
app.use("/uploads", express.static("upload")); 

```

Problems here

### Problems without optimization:

- Large files → memory crash
- Slow uploads → poor UX
- Network failures → restart from 0
- Security risks → malicious files

## 🔥 File upload optimization

2️⃣ Stream Instead of Buffer (Most Important)
❌ Bad (loads whole file in memory)

3️⃣ File Size & Type Validation

4️⃣ Direct Upload to Cloud (Best Practice)

Client → Server → S3


5️⃣ Use Presigned URLs (AWS S3)

Flow:

Client requests upload URL

Server returns presigned URL

Client uploads directly to S3

Server saves metadata

✔ Common in production systems


6️⃣ Chunked Upload (Large Files)

7️⃣ Compression Before Upload

8️⃣ Parallel Uploads

- Upload multiple chunks simultaneously:

- 9️⃣ Background Processing

```
Upload → Queue → Process

```
   - Example:

        - Upload image
        - Return response
        - Resize in background

🔟 Security Best Practices (Interview Gold)

- ✅ Auth before upload
- ✅ File extension + MIME check
- ✅ Rename files (UUID)
- ✅ Virus scan (ClamAV)
- ✅ Store outside public folder


## Chunk upload steps

🔹 How This Works Step-by-Step

1️⃣ Frontend splits large file into small chunks (1–10MB).
2️⃣ Each chunk is uploaded via POST request (FormData).
3️⃣ Backend pipes the chunk directly to storage (disk or S3) using streams.
4️⃣ Backend updates chunk status in Redis/DB → supports resume if upload fails.
5️⃣ Backend responds with success per chunk → frontend shows progress.
6️⃣ Repeat until all chunks are uploaded.
7️⃣ Frontend sends “complete” signal → backend verifies all chunks and merges/stores final file.
8️⃣ If network fails, frontend resumes missing chunks → backend checks Redis/DB for missing chunks.




## Backpressure + highWaterMark in File Uploads
- Backpressure is a mechanism that prevents a fast source from overwhelming a slow destination when streaming data.

Example:

- Client sends file chunks faster than server can write to disk.
- Without control → memory fills → crash.
- Node.js streams signal the source to slow down when the writable stream is busy.

## How Node.js Handles Backpressure

- Every Writable stream has a return value from write():

```
const writable = fs.createWriteStream("uploads/file.mp4");

const ok = writable.write(chunk);
if (!ok) {
  // Backpressure: pause reading until 'drain'
  readable.pause();
  writable.once("drain", () => readable.resume());
}

```
## What is highWaterMark?

- highWaterMark sets the maximum buffer size (in bytes or objects) for a stream before it signals backpressure.
