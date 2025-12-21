import express from 'express';
import multer from 'multer';

const app = express();

const upload = multer({dest: "upload"});

// to fetch the file... 
app.use("/uploads", express.static("upload")); 


app.post("/upload", upload.single("file"), (req,res)=>{
  console.log("req.file ", req.file);
  console.log("file type", req.file.mimetype);

  res.send('File uploaded');
})

app.listen(8080, ()=>{
  console.log('App is running on port ', 8080)
})

