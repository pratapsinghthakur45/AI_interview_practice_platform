import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MongoDBURL = process.env.MongoDB_URL_Local;

mongoose.connect(MongoDBURL);

//default connetion
const db = mongoose.connection;

//event listners
db.on('connected',()=>{
    console.log('✅ Connected to MongoDB server');
});

db.on('error',()=>{
    console.error('❌ MongoDB connection error:', err);
});

db.on('disconnected',()=>{
    console.log('⚠️ MongoDB disconnected');
});

export default db;