var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { config } from "dotenv";
config();
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in the environment variables.");
}
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose.connect(MONGODB_URL)
        .then(() => console.log("Database connected successfully"))
        .catch((error) => {
        console.log("DB connection failed");
        console.log(error);
    });
});
export default connect;
