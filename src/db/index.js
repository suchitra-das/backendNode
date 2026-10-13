import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env");
        }

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// console.log(connectionInstance, "connectionInstance")
    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

    }catch(error){
        console.error("mongodb connection failed:", error.message)
        console.error("Check Atlas Network Access, database credentials, and MONGODB_URI.")
        process.exit(1)
    }
}

export default connectDB
