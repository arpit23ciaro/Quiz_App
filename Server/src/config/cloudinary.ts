import cloudinary from "cloudinary";
import {config} from 'dotenv'

config();
const  cloudinaryConnect = () =>{
    try{
        cloudinary.v2.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        })
        console.log("Cloudinary connect successfully...")
    }
    catch(error){
        console.log(error);
    }
}

export default cloudinaryConnect;