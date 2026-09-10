import express from 'express';
import dotenv from 'dotenv';
import db from './db.js';
import cors from 'cors';

//this is config function call for use of .env file
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());


import userRoutes from './routes/userRoutes.js';
//resume api
import resumeRoutes from './routes/resumeRoutes.js';

//user routes import

app.get('/',(req,res) =>{
    res.send("AI Interview");
})

app.use('/user',userRoutes);
app.use('/user',resumeRoutes,express.static("uploads"));




const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>{
    console.log("server is running on http://localhost:3000");
});


