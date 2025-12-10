import express from 'express';
import { rateLimiter } from './middleware.js';


const app = express();


app.use(rateLimiter);

app.get("/profile", (req,res)=>{
    return res.json({
        success: true,
        message: "Profile fetched successful"
    })
})

const PORT = 8080;

app.listen(PORT,(Eerr)=>{
    if(Eerr){
        console.log('Something went wrong in runnign app');
    }
    console.log('App is running on PORT ', PORT)
})