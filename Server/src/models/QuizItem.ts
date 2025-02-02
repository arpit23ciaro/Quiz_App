import mongoose, { Schema } from "mongoose";
import { OptionDocument } from "./Option.js";

export interface QuizItemDocument extends mongoose.Document {
  question: string;
  questionImgId?:string,
  questionImg?: string;
  options: OptionDocument[];
  questionType: string;
  duration: string;
}

const quizItemSchema = new Schema({
  question: {
    type: String,
    required: true, 
  },
  questionImgId:{
    type:String,
  },
  questionImg: {
    type: String,
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",  
    },
  ],
  questionType: {
    type: String,
  },
  duration: {
    type: String,
  },
});


export const QuizItem = mongoose.model<QuizItemDocument>("QuizItem", quizItemSchema);


