import mongoose,{ Schema} from "mongoose";
import { QuizDocument } from "./Quiz.js";

interface HostDocument {
    googleId?:string,
    email:string,
    name?:string,
    password?:string,
    token?:string,
    authType:string,
    quizes?:(mongoose.Types.ObjectId )[],
}

const HostSchema = new Schema({
    email:{
        type:String,
        require:true,
        trim:true
    },
    name:{
        type:String,
        trim:true
    },
    googleId:{
        type:String
    },
    password:{
        type:String,
        trim:true
    },
    token:{
        type:String,
    },
    previousPassword:{
        type:[String],
        default:[],
    },
    authType:{
        type:String,
        enum:["email-password","google"],
        require:true
    },
    quizes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Quiz"
    }
    ]
})

export const Host = mongoose.model<HostDocument>("Host",HostSchema)