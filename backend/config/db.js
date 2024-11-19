import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
export const connectDB= async ()=>{
    await mongoose.connect("mongodb+srv://subjectpreferencemrcetet:subjectpreferencemrcetetmdb@cluster0.psqus.mongodb.net/subjectpreference").then(()=>console.log('DB Connected'));
}