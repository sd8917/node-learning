===
## Upload file using streaming

- I optimize node.js uploads by streaming files, enforcing strict limits, offloading large uploads to s3 via presigned URLs, and using chunked upploads for reliability.

## Production checklist
1. Streaming uploads
2. File size limits
3. MIME validation
4. Direct-to-cloud for scale
5. Chunked uploads for large files
6. Image optimization
7. Rate limiting
8. Virus scanning

## Nginx & infra tuning 

`
client_max_body_size 20M;
client_body_buffer_size 128k
`

## Securit optimization

`
limits :{
    fileSize: 10*1024*1024
    files: 1
}
`

- Validate
    -   MIME tpye(don't trust extension)
    - File signature (magic bytes)
    - Virus scan (ClamAV for enterprise)


## Compress and image optimization

## Backpressure handling 

- Node streams automatically apply backpressure , but only if you pipe correctly.

## Chunk uploads for large files

1. When to use
    - Videos
    - Files > 50MB
    - Unstable networks

2. Strategy
    - Split file into chunk (client)
    - Upload chunks in parallel
    - Merge on server/cloud

## Direct-to cloud uploads
- Skip nodejs entirely for file transfer

1. Flow 
   - Backend generates pre-signed URL
   - Client uploads directly to s3/GCS
   - Backend only stores metadata

2. Benefit
   - Zero backend load
   - Better global performance
   - Lower server cost

- “For high-traffic apps, I offload uploads directly to S3 using presigned URLs.”

## Complete and simple flow

```

┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │ multipart/form-data
       │
       ▼
┌───────────────────┐
│ Express Server    │
│ POST /upload      │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│ Multer Middleware │
│ upload.single()   │
└──────┬────────────┘
       │
       ├─► fileFilter (mimetype check)
       │
       ├─► limits (10MB check)
       │
       ▼
┌───────────────────┐
│ Disk Storage      │
│ fs Write Stream   │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│ uploads/          │
│ image-123.png     │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│ Controller Logic  │
│ req.file exists   │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│ JSON Response     │
│ Upload Success    │
└───────────────────┘



```

