import mongoose, { Schema } from "mongoose";
import { QuizItemDocument } from "./QuizItem.js";

export interface QuizDocument extends mongoose.Document {
  title:string;
  questions?: (mongoose.Types.ObjectId |QuizItemDocument)[];
  pin?:string;
}

const quizSchema = new Schema({
  title:{
    type:String,
    require:true,
    trim:true
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizItem",
    },
  ],
  pin:{
    type:String
  }
});


export const Quiz = mongoose.model<QuizDocument>("Quiz", quizSchema);
