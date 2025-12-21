import express from 'express';
import {Worker} from 'worker_threads';

const worker = new Worker("./worker.js", {
      workerData: { number: 45 }
});

const app = express();


app.get("/", (req, res) => {

  try {
    return res.json({
      success: true,
      data: []
    })
  } catch (error) {
    console.log("error", error);
    return res.json({
      success: true,
      data: []
    })
  }

})


app.get("/calculate", (req, res) => {;

  worker.on("message", result => {
    res.json({
      success: true,
      data: result
    })
  });

  worker.on("error", err => {
    res.status(500).send(err.message);
  });

});


const PORT = 5050;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})