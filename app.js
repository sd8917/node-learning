import express from 'express';
import {Worker } from 'worker_threads'

const worker = new Worker("./worker.js")

const app = express();


app.get("/",(req, res)=>{
  res.json({
    success: true,
    data: [
      {"user": "sudhanshu",
        "email":"sudhanshuraj89@gmail.com",
        "contact" : 9123145982,
      },

      {"user": "Shristi",
        "email":"rishis@gmail.com",
        "contact" : 91231453442,
      },
      {"user": "Raju vaj",
        "email":"raj123@gmail.com",
        "contact" : 34563145982,
      },
    ],
  })
})

app.get("/heavy", (req,res)=>{
  const start = Date.now();

  console.log('Start heavy task..');
  worker.postMessage(15_000); // 15 seconds
  
  worker.once("message", (result) => {
    res.json({
      success: true,
      data: [],
      message: result.message,
    });
  });

  worker.once("error", (err) => {
    res.status(500).json({ success: false, error: err.message });
  });

})


const PORT = 8080;
app.listen(PORT, ()=>{
  console.log('App is running on port', PORT);
})