// require('dotenv').config({path: './.env'});
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";



dotenv.config({path: './.env'});

// 2nd approach

connectDB()
.then(()=>{
 app.listen(process.env.PORT || 8000 ,()=>{
    console.log(`app is listening on port ${process.env.PORT || 8000}`)
 })
}).catch((err)=>{
 console.log("mongodb connection failed:",err)
})







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
