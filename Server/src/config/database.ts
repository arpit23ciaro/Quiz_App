import mongoose from "mongoose";
import { config } from "dotenv";
config();
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is not defined in the environment variables.");
}

const connect = async() => {
  mongoose.connect(MONGODB_URL)
  .then(()=>console.log("Database connected successfully"))
  .catch((error) => {
    console.log("DB connection failed");
    console.log(error)
  })
};

export default connect; 

