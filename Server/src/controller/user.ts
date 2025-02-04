import { AssertionError } from "assert";
import { Quiz } from "../models/Quiz.js";
import  assert  from "assert";
import { QuizItem } from "../models/QuizItem.js";
import { OptionDocument } from "../models/Option.js";
import mongoose, { mongo } from "mongoose";





const checkValidPin = async (pin:string) =>{
    try{
        const quizData = await Quiz.findOne({pin:pin});

        assert(quizData,"pin not found");

        return {
            success:true,
            message:"pin data fetched successfully",
            quizId:quizData?._id
        }
    }
    catch(error){
        console.log(error);
           if (error instanceof AssertionError)
             return {
               success: false,
               message: error.message,
             };
           return {
             success: false,
             message: "Error",
           };
    }
}

const userScore = async (questionId:string,time:string,selectedIds:string[] ) =>{
  try{

      const question = await QuizItem.findById(questionId).populate({path:"options"});

      assert(question,"pin not found");


      const correctIds =  (question.options as OptionDocument[])
      .filter(option => option?.isSelect === "true")
      .map((option) => option._id instanceof mongoose.Types.ObjectId ? option._id.toHexString() : option._id);
      const maxScore = 100; 
      const timeLeft = parseInt(time); 
      

      const matchedCount = selectedIds.filter(id => correctIds.includes(id)).length;
      const totalCorrect = correctIds.length;

  
      let score = 0;
      if (matchedCount === totalCorrect && matchedCount === selectedIds.length) {
          score = Math.floor((timeLeft / 10) * maxScore); 
        }

      return {
          success:true,
          message:"score data fetched successfully",
          score:score
      }
  }
  catch(error){
      console.log(error);
         if (error instanceof AssertionError)
           return {
             success: false,
             message: error.message,
           };
         return {
           success: false,
           message: "Error",
         };
  }
}

export {
    checkValidPin,
    userScore
}