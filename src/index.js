// require('dotenv').config({path: './.env'});
 import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";



dotenv.config({path: './.env'});

// 2nd approach

connectDB()




// /Fisrt approach




/*import express from "express";

const app = express();

(async()=>{
  try{ await
mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
app.on("error",(err)=> { 
    console.log ("error:",err)
throw err
})

app.listen(process.env.PORT,()=>{
    console.log(`app is listening on port ${process.env.PORT}`)
})


  }catch(error){
console.log("error:",error)
  }
})()*/